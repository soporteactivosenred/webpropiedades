'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import type { Database } from '@/types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    featured_image: '',
    fb_image_url: '',
    ig_image_url: '',
    social_caption: '',
    publish_to_fb: false,
    publish_to_ig: false,
  });
  const [creating, setCreating] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleUploadFile = async (file: File, fieldName: 'featured_image' | 'fb_image_url' | 'ig_image_url') => {
    setUploadingField(fieldName);
    const supabase = createAdminBrowserClient() as any;
    const fileExt = file.name.split('.').pop();
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    try {
      const { data, error: uploadErr } = await supabase.storage
        .from('properties') // Re-use public bucket
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      if (publicUrl) {
        setNewPost(prev => ({ ...prev, [fieldName]: publicUrl }));
      }
    } catch (err: any) {
      alert(`Error al subir imagen: ${err.message || err}`);
    } finally {
      setUploadingField(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setPosts(data || []);
    } catch (err) {
      setError('Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const supabase = createAdminBrowserClient() as any;
      const slug = newPost.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      const { error: createError } = await supabase
        .from('blog_posts')
        .insert([{
          title: newPost.title,
          slug,
          content: newPost.content,
          excerpt: newPost.excerpt,
          category: newPost.category || null,
          featured_image: newPost.featured_image || null,
          fb_image_url: newPost.fb_image_url || null,
          ig_image_url: newPost.ig_image_url || null,
          social_caption: newPost.social_caption || null,
          publish_to_fb: newPost.publish_to_fb,
          publish_to_ig: newPost.publish_to_ig,
          published: false,
          published_at: null,
        }]);

      if (createError) {
        alert('Error al crear: ' + createError.message);
        return;
      }

      setNewPost({ 
        title: '', 
        content: '', 
        excerpt: '', 
        category: '', 
        featured_image: '', 
        fb_image_url: '', 
        ig_image_url: '', 
        social_caption: '', 
        publish_to_fb: false, 
        publish_to_ig: false 
      });
      setShowNewForm(false);
      fetchPosts();
    } catch (err) {
      alert('Error al crear el artículo');
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const supabase = createAdminBrowserClient() as any;
      const newPublished = !post.published;
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          published: newPublished,
          published_at: newPublished ? new Date().toISOString() : null,
        })
        .eq('id', post.id);

      if (updateError) {
        alert('Error al actualizar: ' + updateError.message);
        return;
      }

      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, published: newPublished, published_at: newPublished ? new Date().toISOString() : null } : p
      ));

      // Trigger social media publishing if active
      if (newPublished && (post.publish_to_fb || post.publish_to_ig)) {
        try {
          const res = await fetch('/api/admin/blog/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.id }),
          });
          const pubData = await res.json();
          if (pubData.success && pubData.results) {
            const fbMsg = pubData.results.facebook?.success ? 'Publicado en Facebook. ' : (pubData.results.facebook ? `Error Facebook: ${pubData.results.facebook.error}. ` : '');
            const igMsg = pubData.results.instagram?.success ? 'Publicado en Instagram. ' : (pubData.results.instagram ? `Error Instagram: ${pubData.results.instagram.error}. ` : '');
            if (fbMsg || igMsg) {
              alert(`Artículo publicado en el blog.\n${fbMsg}${igMsg}`);
            }
          } else if (pubData.error) {
            alert(`Artículo publicado en el blog, pero falló la publicación en redes sociales: ${pubData.error}`);
          }
          fetchPosts();
        } catch (publishErr: any) {
          alert(`Artículo publicado en el blog, pero falló la conexión para publicar en redes sociales: ${publishErr.message || publishErr}`);
        }
      }
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) {
      return;
    }

    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        alert('Error al eliminar: ' + deleteError.message);
        return;
      }

      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Gestiona los artículos del blog</p>
        </div>
        <Button onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? 'Cancelar' : '➕ Nuevo Artículo'}
        </Button>
      </div>

      {/* New Post Form */}
      {showNewForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Crear Nuevo Artículo</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <Input
              label="Título"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              placeholder="Título del artículo"
              required
            />
            <Input
              label="Categoría"
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              placeholder="Ej: Noticias, Consejos, etc."
            />
            {/* Imagen Principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal / Cabecera</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file, 'featured_image');
                }}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              {uploadingField === 'featured_image' && <p className="text-xs text-gray-500 mt-1">Subiendo...</p>}
              {newPost.featured_image && (
                <img src={newPost.featured_image} className="mt-2 h-20 rounded object-cover" alt="Cabecera" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extracto</label>
              <textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Breve descripción del artículo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Contenido del artículo..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={8}
                required
              />
            </div>

            {/* Sección Redes Sociales */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Autopublicación en Redes Sociales</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={newPost.publish_to_fb}
                    onChange={(e) => setNewPost({ ...newPost, publish_to_fb: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                  />
                  Publicar en Facebook
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={newPost.publish_to_ig}
                    onChange={(e) => setNewPost({ ...newPost, publish_to_ig: e.target.checked })}
                    className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                  />
                  Publicar en Instagram
                </label>
              </div>

              {/* Copia de Redes Sociales */}
              {(newPost.publish_to_fb || newPost.publish_to_ig) && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-750 mb-1">Texto / Pie de foto para Redes Sociales</label>
                    <textarea
                      value={newPost.social_caption}
                      onChange={(e) => setNewPost({ ...newPost, social_caption: e.target.value })}
                      placeholder="Escribe el texto que acompañará tu post en Facebook/Instagram con hashtags..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newPost.publish_to_fb && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-750 mb-1">Imagen para Facebook (Horizontal, 1200x630px)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(file, 'fb_image_url');
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                        />
                        {uploadingField === 'fb_image_url' && <p className="text-xs text-gray-500 mt-1">Subiendo...</p>}
                        {newPost.fb_image_url && (
                          <img src={newPost.fb_image_url} className="mt-2 h-16 w-32 rounded object-cover" alt="Facebook" />
                        )}
                      </div>
                    )}

                    {newPost.publish_to_ig && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-750 mb-1">Imagen para Instagram (Cuadrada, 1080x1080px)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(file, 'ig_image_url');
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                        />
                        {uploadingField === 'ig_image_url' && <p className="text-xs text-gray-500 mt-1">Subiendo...</p>}
                        {newPost.ig_image_url && (
                          <img src={newPost.ig_image_url} className="mt-2 h-16 w-16 rounded object-cover" alt="Instagram" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowNewForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" isLoading={creating}>
                Crear Artículo
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <Input
          label=""
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar artículos..."
        />
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay artículos que mostrar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {post.category || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {post.published ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`px-3 py-1 text-sm rounded ${
                            post.published 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {post.published ? 'Despublicar' : 'Publicar'}
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}