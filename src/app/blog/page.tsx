import { Suspense } from 'react';
import { BlogCard } from '@/components/blog';
import { createServerClient } from '@/lib/supabase/server';
import { getBlogPosts, getFeaturedBlogPost } from '@/lib/supabase';

export const metadata = {
  title: 'Blog',
  description: 'Noticias, consejos y tendencias del mercado inmobiliario chileno.',
};

export default async function BlogPage() {
  const supabase = await createServerClient();
  
  const [featuredPostResult, postsResult] = await Promise.all([
    getFeaturedBlogPost(supabase),
    getBlogPosts(supabase, { limit: 9 }),
  ]);

  const { data: featuredPost } = featuredPostResult;
  const { data: posts } = postsResult;
  
  // Filter out featured post from regular posts
  const filteredPosts = posts?.filter(p => p.id !== featuredPost?.id) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <section className="bg-primary-700 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Blog inmobiliario
          </h1>
          <p className="mt-2 text-primary-100 text-lg">
            Noticias, consejos y tendencias del mercado
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Artículo destacado
            </h2>
            <Suspense fallback={<div className="h-96 bg-gray-200 rounded-xl animate-pulse" />}>
              <BlogCard post={featuredPost} featured />
            </Suspense>
          </div>
        )}

        {/* All Posts */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Últimos artículos
          </h2>
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          }>
            {filteredPosts && filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Próximamente publicaremos artículos interesantes.
                </p>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
}