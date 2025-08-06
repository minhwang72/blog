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
  postId: int('post_id').notNull(),
  authorId: int('author_id').notNull(),
  parentId: int('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  postIdx: index('idx_post_id').on(table.postId),
  authorIdx: index('idx_author_id').on(table.authorId),
  parentIdx: index('idx_parent_id').on(table.parentId),
  postCreatedIdx: index('idx_post_created').on(table.postId, table.createdAt),
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

// Guestbook entries table
export const guestbook = mysqlTable('guestbook', {
  id: int('id').autoincrement().primaryKey(),
  content: text('content').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  createdAtIdx: index('idx_created_at').on(table.createdAt),
  nameIdx: index('idx_name').on(table.name),
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

export type GuestbookEntry = typeof guestbook.$inferSelect;
export type NewGuestbookEntry = typeof guestbook.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  guestbookEntries: many(guestbook),
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

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
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