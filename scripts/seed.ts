import { db } from '../src/lib/db';
import { users, categories } from '../src/lib/db/schema';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
      name: '황민',
      email: 'admin@eungming.com',
      password: hashedPassword,
      role: 'admin',
      bio: '블로그 관리자입니다.',
    });

    console.log('✅ Admin user created');

    // Create default categories
    const defaultCategories = [
      { name: '개발', slug: 'development', description: '프로그래밍과 개발 관련 포스트' },
      { name: '일상', slug: 'daily', description: '일상 생활과 개인적인 이야기' },
      { name: '학습', slug: 'learning', description: '새로운 것을 배우는 과정' },
      { name: '리뷰', slug: 'review', description: '책, 영화, 제품 리뷰' },
      { name: '생각', slug: 'thoughts', description: '개인적인 생각과 철학' },
    ];

    for (const category of defaultCategories) {
      await db.insert(categories).values(category);
    }

    console.log('✅ Default categories created');
    console.log('🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seed(); 