import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib';
import { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow ${featured ? 'md:flex' : ''}`}>
        {/* Image */}
        {post.featured_image && (
          <div className={`relative overflow-hidden bg-gray-200 ${featured ? 'md:w-1/2 aspect-[4/3] md:aspect-auto' : 'aspect-[16/9]'}`}>
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '100vw'}
            />
          </div>
        )}

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:w-1/2 md:p-8 flex flex-col justify-center' : ''}`}>
          {/* Category */}
          {post.category && (
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors mt-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="mt-3 text-gray-600 dark:text-gray-400 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {post.published_at && (
              <span>{formatDate(post.published_at, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}