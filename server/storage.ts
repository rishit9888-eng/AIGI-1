import {
  type User,
  type InsertUser,
  type Certificate,
  type InsertCertificate,
  type Announcement,
  type InsertAnnouncement,
  type GalleryItem,
  type InsertGalleryItem,
  type Branch,
  type InsertBranch,
  type ContactSubmission,
  type InsertContactSubmission,
  type Seminar,
  type InsertSeminar,
  users,
  certificates,
  announcements,
  galleryItems,
  branches,
  contactSubmissions,
  seminars,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Certificates
  getCertificate(id: string): Promise<Certificate | undefined>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  getAllCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  updateCertificate(id: string, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined>;
  deleteCertificate(id: string): Promise<void>;
  clearAllCertificates(): Promise<void>;

  // Announcements
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  getAllAnnouncements(): Promise<Announcement[]>;
  getPublishedAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<void>;

  // Gallery
  getGalleryItem(id: string): Promise<GalleryItem | undefined>;
  getAllGalleryItems(): Promise<GalleryItem[]>;
  getGalleryItemsByCategory(category: string): Promise<GalleryItem[]>;
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: string): Promise<void>;

  // Branches
  getBranch(id: string): Promise<Branch | undefined>;
  getAllBranches(): Promise<Branch[]>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  updateBranch(id: string, branch: Partial<InsertBranch>): Promise<Branch | undefined>;
  deleteBranch(id: string): Promise<void>;

  // Contact Submissions
  getContactSubmission(id: string): Promise<ContactSubmission | undefined>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  markContactAsRead(id: string): Promise<void>;

  // Seminars
  getSeminar(id: string): Promise<Seminar | undefined>;
  getAllSeminars(): Promise<Seminar[]>;
  createSeminar(seminar: InsertSeminar): Promise<Seminar>;
  updateSeminar(id: string, seminar: Partial<InsertSeminar>): Promise<Seminar | undefined>;
  deleteSeminar(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Certificates
  async getCertificate(id: string): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates).where(eq(certificates.id, id));
    return result[0];
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    const result = await db.select().from(certificates).where(eq(certificates.certificateNumber, certificateNumber));
    return result[0];
  }

  async getAllCertificates(): Promise<Certificate[]> {
    return await db.select().from(certificates);
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const result = await db.insert(certificates).values(certificate).returning();
    return result[0];
  }

  async updateCertificate(id: string, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const result = await db.update(certificates).set(certificate).where(eq(certificates.id, id)).returning();
    return result[0];
  }

  async deleteCertificate(id: string): Promise<void> {
    await db.delete(certificates).where(eq(certificates.id, id));
  }

  async clearAllCertificates(): Promise<void> {
    await db.delete(certificates);
  }

  // Announcements
  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    const result = await db.select().from(announcements).where(eq(announcements.id, id));
    return result[0];
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements);
  }

  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return await db.select().from(announcements).where(eq(announcements.isPublished, true));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const result = await db.insert(announcements).values(announcement).returning();
    return result[0];
  }

  async updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const result = await db.update(announcements).set(announcement).where(eq(announcements.id, id)).returning();
    return result[0];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await db.delete(announcements).where(eq(announcements.id, id));
  }

  // Gallery
  async getGalleryItem(id: string): Promise<GalleryItem | undefined> {
    const result = await db.select().from(galleryItems).where(eq(galleryItems.id, id));
    return result[0];
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems);
  }

  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    return await db.select().from(galleryItems).where(eq(galleryItems.category, category));
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const result = await db.insert(galleryItems).values(item).returning();
    return result[0];
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  // Branches
  async getBranch(id: string): Promise<Branch | undefined> {
    const result = await db.select().from(branches).where(eq(branches.id, id));
    return result[0];
  }

  async getAllBranches(): Promise<Branch[]> {
    return await db.select().from(branches);
  }

  async createBranch(branch: InsertBranch): Promise<Branch> {
    const result = await db.insert(branches).values(branch).returning();
    return result[0];
  }

  async updateBranch(id: string, branch: Partial<InsertBranch>): Promise<Branch | undefined> {
    const result = await db.update(branches).set(branch).where(eq(branches.id, id)).returning();
    return result[0];
  }

  async deleteBranch(id: string): Promise<void> {
    await db.delete(branches).where(eq(branches.id, id));
  }

  // Contact Submissions
  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id));
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions);
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async markContactAsRead(id: string): Promise<void> {
    await db.update(contactSubmissions).set({ isRead: true }).where(eq(contactSubmissions.id, id));
  }

  // Seminars
  async getSeminar(id: string): Promise<Seminar | undefined> {
    const result = await db.select().from(seminars).where(eq(seminars.id, id));
    return result[0];
  }

  async getAllSeminars(): Promise<Seminar[]> {
    return await db.select().from(seminars);
  }

  async createSeminar(seminar: InsertSeminar): Promise<Seminar> {
    const result = await db.insert(seminars).values(seminar).returning();
    return result[0];
  }

  async updateSeminar(id: string, seminar: Partial<InsertSeminar>): Promise<Seminar | undefined> {
    const result = await db.update(seminars).set(seminar).where(eq(seminars.id, id)).returning();
    return result[0];
  }

  async deleteSeminar(id: string): Promise<void> {
    await db.delete(seminars).where(eq(seminars.id, id));
  }
}

// Mock storage for offline development
export class MockStorage implements IStorage {
  private mockUsers: User[] = [
    {
      id: "1",
      username: "admin",
      password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG6", // bcrypt hash of "admin123"
      fullName: "Admin User",
      role: "admin",
    },
    {
      id: "2",
      username: "staff",
      password: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG6", // bcrypt hash of "admin123"
      fullName: "Staff Member",
      role: "staff",
    },
  ];

  private mockCertificates: Certificate[] = [
    {
      id: "cert-1",
      certificateNumber: "AIGI-2024-001001",
      stoneType: "Natural Diamond",
      carat: "1.5",
      grossWeight: "1.52",
      color: "E",
      clarity: "VS1",
      cut: "Excellent",
      notes: "Sample certificate for demonstration",
      filePath: null,
      issuedDate: new Date(),
      createdBy: "1",
    },
  ];
  private mockAnnouncements: Announcement[] = [
    {
      id: "ann-1",
      type: "Announcement",
      title: "Holiday Schedule",
      excerpt: "Our offices will be closed on December 25-26",
      content: "Our offices will be closed on December 25-26 for the holidays. We will resume normal operations on December 27.",
      filePath: null,
      publishedDate: new Date(),
      isPublished: true,
      createdBy: "1",
    },
  ];
  private mockGalleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      category: "Labs",
      title: "Main Laboratory",
      description: "Our state-of-the-art laboratory",
      imagePath: "/placeholder.jpg",
      createdAt: new Date(),
      createdBy: "1",
    },
  ];
  private mockBranches: Branch[] = [
    {
      id: "branch-1",
      name: "Head Office",
      address: "123 Diamond Street, Mumbai",
      phone: "+91-22-1234-5678",
      email: "mumbai@aigi.com",
      hours: "9:00 AM - 6:00 PM",
      isHeadOffice: true,
    },
  ];
  private mockContactSubmissions: ContactSubmission[] = [];
  private mockSeminars: Seminar[] = [
    {
      id: "sem-1",
      title: "Gemstone Certification Basics",
      description: "Learn the basics of gemstone certification",
      date: "2024-12-20",
      duration: "3 hours",
      location: "Mumbai Head Office",
      status: "Open",
      createdBy: "1",
    },
  ];

  async getUser(id: string): Promise<User | undefined> {
    return this.mockUsers.find((u) => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.mockUsers.find((u) => u.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      fullName: user.fullName || null,
      role: user.role || "staff",
    };
    this.mockUsers.push(newUser);
    return newUser;
  }

  async getCertificate(id: string): Promise<Certificate | undefined> {
    return this.mockCertificates.find((c) => c.id === id);
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    return this.mockCertificates.find((c) => c.certificateNumber === certificateNumber);
  }

  async getAllCertificates(): Promise<Certificate[]> {
    return this.mockCertificates;
  }

  async createCertificate(certificate: InsertCertificate): Promise<Certificate> {
    const newCert: Certificate = {
      ...certificate,
      id: Math.random().toString(36).substr(2, 9),
      issuedDate: new Date(),
      createdBy: certificate.createdBy || null,
      notes: certificate.notes || null,
      filePath: certificate.filePath || null,
      grossWeight: certificate.grossWeight || null,
    };
    this.mockCertificates.push(newCert);
    return newCert;
  }

  async deleteCertificate(id: string): Promise<void> {
    this.mockCertificates = this.mockCertificates.filter((c) => c.id !== id);
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.mockAnnouncements.find((a) => a.id === id);
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return this.mockAnnouncements;
  }

  async getPublishedAnnouncements(): Promise<Announcement[]> {
    return this.mockAnnouncements.filter((a) => a.isPublished);
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const newAnn: Announcement = {
      ...announcement,
      id: Math.random().toString(36).substr(2, 9),
      publishedDate: new Date(),
      createdBy: announcement.createdBy || null,
      filePath: announcement.filePath || null,
      content: announcement.content || null,
      isPublished: announcement.isPublished ?? true,
    };
    this.mockAnnouncements.push(newAnn);
    return newAnn;
  }

  async updateAnnouncement(id: string, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const idx = this.mockAnnouncements.findIndex((a) => a.id === id);
    if (idx === -1) return undefined;
    this.mockAnnouncements[idx] = { ...this.mockAnnouncements[idx], ...announcement };
    return this.mockAnnouncements[idx];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    this.mockAnnouncements = this.mockAnnouncements.filter((a) => a.id !== id);
  }

  async getGalleryItem(id: string): Promise<GalleryItem | undefined> {
    return this.mockGalleryItems.find((g) => g.id === id);
  }

  async getAllGalleryItems(): Promise<GalleryItem[]> {
    return this.mockGalleryItems;
  }

  async getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
    return this.mockGalleryItems.filter((g) => g.category === category);
  }

  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const newItem: GalleryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      description: item.description || null,
      createdBy: item.createdBy || null,
    };
    this.mockGalleryItems.push(newItem);
    return newItem;
  }

  async deleteGalleryItem(id: string): Promise<void> {
    this.mockGalleryItems = this.mockGalleryItems.filter((g) => g.id !== id);
  }

  async getBranch(id: string): Promise<Branch | undefined> {
    return this.mockBranches.find((b) => b.id === id);
  }

  async getAllBranches(): Promise<Branch[]> {
    return this.mockBranches;
  }

  async createBranch(branch: InsertBranch): Promise<Branch> {
    const newBranch: Branch = {
      ...branch,
      id: Math.random().toString(36).substr(2, 9),
      isHeadOffice: branch.isHeadOffice ?? false,
    };
    this.mockBranches.push(newBranch);
    return newBranch;
  }

  async updateBranch(id: string, branch: Partial<InsertBranch>): Promise<Branch | undefined> {
    const idx = this.mockBranches.findIndex((b) => b.id === id);
    if (idx === -1) return undefined;
    this.mockBranches[idx] = { ...this.mockBranches[idx], ...branch };
    return this.mockBranches[idx];
  }

  async deleteBranch(id: string): Promise<void> {
    this.mockBranches = this.mockBranches.filter((b) => b.id !== id);
  }

  async getContactSubmission(id: string): Promise<ContactSubmission | undefined> {
    return this.mockContactSubmissions.find((c) => c.id === id);
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return this.mockContactSubmissions;
  }

  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Math.random().toString(36).substr(2, 9),
      isRead: false,
      submittedAt: new Date(),
      respondedAt: null,
      branch: submission.branch || null,
      phone: submission.phone || null,
    };
    this.mockContactSubmissions.push(newSubmission);
    return newSubmission;
  }

  async markContactAsRead(id: string): Promise<void> {
    const idx = this.mockContactSubmissions.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.mockContactSubmissions[idx].isRead = true;
    }
  }

  async getSeminar(id: string): Promise<Seminar | undefined> {
    return this.mockSeminars.find((s) => s.id === id);
  }

  async getAllSeminars(): Promise<Seminar[]> {
    return this.mockSeminars;
  }

  async createSeminar(seminar: InsertSeminar): Promise<Seminar> {
    const newSeminar: Seminar = {
      ...seminar,
      id: Math.random().toString(36).substr(2, 9),
      status: seminar.status || "Open",
      createdBy: seminar.createdBy || null,
    };
    this.mockSeminars.push(newSeminar);
    return newSeminar;
  }

  async updateSeminar(id: string, seminar: Partial<InsertSeminar>): Promise<Seminar | undefined> {
    const idx = this.mockSeminars.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;
    this.mockSeminars[idx] = { ...this.mockSeminars[idx], ...seminar };
    return this.mockSeminars[idx];
  }

  async deleteSeminar(id: string): Promise<void> {
    this.mockSeminars = this.mockSeminars.filter((s) => s.id !== id);
  }

  // Missing methods for IStorage interface
  async getAllUsers(): Promise<User[]> {
    return this.mockUsers;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const idx = this.mockUsers.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    this.mockUsers[idx] = { ...this.mockUsers[idx], ...user };
    return this.mockUsers[idx];
  }

  async deleteUser(id: string): Promise<void> {
    this.mockUsers = this.mockUsers.filter((u) => u.id !== id);
  }

  async updateCertificate(id: string, certificate: Partial<InsertCertificate>): Promise<Certificate | undefined> {
    const idx = this.mockCertificates.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    this.mockCertificates[idx] = { ...this.mockCertificates[idx], ...certificate };
    return this.mockCertificates[idx];
  }

  async clearAllCertificates(): Promise<void> {
    this.mockCertificates = [];
  }
}

export const storage = !process.env.DATABASE_URL ? new MockStorage() : new DatabaseStorage();
