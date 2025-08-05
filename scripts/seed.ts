import { config } from 'dotenv';
config();

import { db } from '@/lib/db';
import { categories, posts } from '@/lib/db/schema';

async function seed() {
  try {
    // 카테고리 생성
    const categoryData = [
      { name: '개발', slug: 'development', description: '개발 관련 포스트' },
      { name: '일상', slug: 'daily', description: '일상 이야기' },
      { name: '리뷰', slug: 'review', description: '제품 및 서비스 리뷰' },
    ];

    for (const category of categoryData) {
      await db.insert(categories).values(category);
    }

    console.log('카테고리가 생성되었습니다.');

    // 게시물 생성
    const postData = [
      {
        title: '블로그를 시작하며',
        content: '안녕하세요! 은밍의 블로그에 오신 것을 환영합니다...',
        excerpt: '블로그 시작 인사글입니다.',
        slug: 'welcome',
        published: true,
        authorId: 1,
        categoryId: 2,
      },
      {
        title: 'Next.js 14로 블로그 만들기',
        content: 'Next.js 14와 React 18을 사용하여 블로그를 만들어보았습니다...',
        excerpt: 'Next.js 14 블로그 개발기',
        slug: 'nextjs-14-blog',
        published: true,
        authorId: 1,
        categoryId: 1,
      },
      {
        title: '새로운 키보드 구매 후기',
        content: '새로운 기계식 키보드를 구매했습니다...',
        excerpt: '기계식 키보드 리뷰',
        slug: 'keyboard-review',
        published: true,
        authorId: 1,
        categoryId: 3,
      },
    ];

    for (const post of postData) {
      await db.insert(posts).values(post);
    }

    console.log('게시물이 생성되었습니다.');
  } catch (error) {
    console.error('데이터 생성 중 오류가 발생했습니다:', error);
  }

  process.exit();
}

seed(); 