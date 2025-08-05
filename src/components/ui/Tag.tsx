import Link from 'next/link';

interface TagProps {
  name: string;
  slug: string;
}

export default function Tag({ name, slug }: TagProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      #{name}
    </Link>
  );
} 