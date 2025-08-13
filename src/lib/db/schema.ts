import { relations } from 'drizzle-orm';
import {
  mysqlTable,
  int,
  text,
  longtext,
  timestamp,
  varchar,
  boolean,
  mysqlEnum,
  primaryKey,
  index,
  foreignKey,
} from 'drizzle-orm/mysql-core';

// 관리자 계정 테이블
export const admins = mysqlTable('admins', {
  id: int('id').autoincrement().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(), // bcrypt 해시 저장
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  usernameIdx: index('idx_admin_username').on(table.username),
}));

// 관리자 세션 테이블
export const adminSessions = mysqlTable('admin_sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  adminId: int('admin_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  adminIdIdx: index('idx_admin_session_admin_id').on(table.adminId),
  expiresAtIdx: index('idx_admin_session_expires_at').on(table.expiresAt),
}));

// 광고 설정 테이블
export const adSettings = mysqlTable('ad_settings', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 100 }).notNull(), // 광고 설정 이름
  position: mysqlEnum('position', ['top', 'middle', 'bottom', 'sidebar', 'inline']).notNull(),
  adCode: longtext('ad_code').notNull(), // 구글 애드센스 코드
  enabled: boolean('enabled').default(true).notNull(),
  postTypes: varchar('post_types', { length: 255 }).default('all'), // 'all', 'specific' 등
  displayRules: longtext('display_rules'), // JSON 형태의 표시 규칙
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
  updatedBy: int('updated_by').notNull(),
}, (table) => ({
  nameIdx: index('idx_ad_name').on(table.name),
  positionIdx: index('idx_ad_position').on(table.position),
  enabledIdx: index('idx_ad_enabled').on(table.enabled),
}));

// Users table
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['user', 'admin']).default('user').notNull(),
  avatar: varchar('avatar', { length: 255 }),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_email').on(table.email),
  roleIdx: index('idx_role').on(table.role),
  createdAtIdx: index('idx_created_at').on(table.createdAt),
}));

// Categories table
export const categories = mysqlTable('categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  slugIdx: index('idx_slug').on(table.slug),
  nameIdx: index('idx_name').on(table.name),
}));

// Posts table
export const posts = mysqlTable('posts', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: longtext('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: varchar('featured_image', { length: 500 }), // 썸네일 이미지 URL
  published: boolean('published').default(false).notNull(),
  authorId: int('author_id').notNull(),
  categoryId: int('category_id'),
  viewCount: int('view_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_slug').on(table.slug),
  publishedIdx: index('idx_published').on(table.published),
  authorIdx: index('idx_author_id').on(table.authorId),
  categoryIdx: index('idx_category_id').on(table.categoryId),
  createdAtIdx: index('idx_created_at').on(table.createdAt),
  publishedCreatedIdx: index('idx_published_created').on(table.published, table.createdAt),
}));

// Comments table
export const comments = mysqlTable('comments', {
  id: int('id').autoincrement().primaryKey(),
  content: text('content').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  postId: int('post_id').notNull(),
  parentId: int('parent_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  postIdx: index('idx_post_id').on(table.postId),
  parentIdx: index('idx_parent_id').on(table.parentId),
  postCreatedIdx: index('idx_post_created').on(table.postId, table.createdAt),
  nameIdx: index('idx_name').on(table.name),
}));

// Tags table
export const tags = mysqlTable('tags', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  slugIdx: index('idx_slug').on(table.slug),
  nameIdx: index('idx_name').on(table.name),
}));

// Posts to Tags relation table
export const postsToTags = mysqlTable('posts_to_tags', {
  postId: int('post_id').notNull(),
  tagId: int('tag_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.postId, table.tagId] }),
  tagIdx: index('idx_tag_id').on(table.tagId),
  postIdx: index('idx_post_id').on(table.postId),
}));



// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;



// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  comments: many(comments),
  tags: many(postsToTags),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  posts: many(postsToTags),
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
  post: one(posts, {
    fields: [postsToTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postsToTags.tagId],
    references: [tags.id],
  }),
})); 