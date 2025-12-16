import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Staff users for admin portal
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("staff"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Certificates for verification system
export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  certificateNumber: text("certificate_number").notNull().unique(),
  stoneType: text("stone_type").notNull(),
  carat: text("carat").notNull(),
  grossWeight: text("gross_weight"),
  color: text("color").notNull(),
  clarity: text("clarity").notNull(),
  cut: text("cut").notNull(),
  notes: text("notes"),
  filePath: text("file_path"),
  issuedDate: timestamp("issued_date").defaultNow(),
  createdBy: varchar("created_by"),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedDate: true,
});

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

// Announcements and research updates
export const announcements = pgTable("announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'Announcement', 'Research', 'Seminar'
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  filePath: text("file_path"),
  publishedDate: timestamp("published_date").defaultNow(),
  isPublished: boolean("is_published").default(true),
  createdBy: varchar("created_by"),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({
  id: true,
  publishedDate: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

// Gallery items
export const galleryItems = pgTable("gallery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(), // 'Labs', 'Equipment', 'Seminars', 'Research'
  title: text("title").notNull(),
  description: text("description"),
  imagePath: text("image_path").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: varchar("created_by"),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true,
});

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = typeof galleryItems.$inferSelect;

// Branch locations
export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  hours: text("hours").notNull(),
  isHeadOffice: boolean("is_head_office").default(false),
});

export const insertBranchSchema = createInsertSchema(branches).omit({
  id: true,
});

export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;

// Contact form submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  branch: text("branch"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  isRead: boolean("is_read").default(false),
  respondedAt: timestamp("responded_at"),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
  isRead: true,
  respondedAt: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Seminars/courses for education section
export const seminars = pgTable("seminars", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  duration: text("duration").notNull(),
  location: text("location").notNull(),
  status: text("status").notNull().default("Open"), // 'Open', 'Coming Soon', 'Closed'
  createdBy: varchar("created_by"),
});

export const insertSeminarSchema = createInsertSchema(seminars).omit({
  id: true,
});

export type InsertSeminar = z.infer<typeof insertSeminarSchema>;
export type Seminar = typeof seminars.$inferSelect;
