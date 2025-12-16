import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCertificateSchema,
  insertAnnouncementSchema,
  insertGalleryItemSchema,
  insertBranchSchema,
  insertContactSubmissionSchema,
  insertSeminarSchema,
  insertUserSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId: string;
    username: string;
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage_multer,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  //   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  //   const mimetype = allowedTypes.test(file.mimetype);
  //   if (extname && mimetype) {
  //     return cb(null, true);
  //   }
  //   cb(new Error("Only images and PDFs are allowed"));
  // },
});

const SALT_ROUNDS = 10;

// Middleware to check if user is authenticated (staff only)
// In offline/demo mode, skip auth for testing
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const isDemoMode = !process.env.DATABASE_URL;
  if (!isDemoMode && !req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  // In demo mode, set a default user for the session
  if (isDemoMode && !req.session?.userId) {
    req.session.userId = "1";
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // For offline/mock mode: accept any password for demo users
      // For production with real DB: compare password with bcrypt
      const isValidPassword = process.env.DATABASE_URL 
        ? await bcrypt.compare(password, user.password)
        : (username === "admin" || username === "staff") && password === "admin123";
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Save session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        
        res.json({ 
          id: user.id, 
          username: user.username, 
          fullName: user.fullName,
          role: user.role 
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });
  
  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      res.json({ 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName,
        role: user.role 
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });
  
  // Register (for initial setup - could be disabled later)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      
      const existingUser = await storage.getUserByUsername(parsed.data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(parsed.data.password, SALT_ROUNDS);
      const user = await storage.createUser({
        ...parsed.data,
        password: hashedPassword,
      });
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        fullName: user.fullName,
        role: user.role 
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
  
  // ==================== CERTIFICATE ROUTES ====================
  
  // Public: Verify certificate by number
  app.get("/api/certificates/verify/:number", async (req, res) => {
    try {
      const certificate = await storage.getCertificateByNumber(req.params.number);
      
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }
      
      res.json(certificate);
    } catch (error) {
      console.error("Certificate verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });
  
  // Staff: Get all certificates
  app.get("/api/certificates", requireAuth, async (req, res) => {
    try {
      const allCertificates = await storage.getAllCertificates();
      res.json(allCertificates);
    } catch (error) {
      console.error("Get certificates error:", error);
      res.status(500).json({ error: "Failed to get certificates" });
    }
  });
  
  app.post("/api/certificates", requireAuth, upload.single("file"), async (req, res) => {
    try {
      const parsed = insertCertificateSchema.safeParse({
        ...req.body,
        createdBy: req.session.userId,
        filePath: req.file ? `/uploads/${req.file.filename}` : null,
      });
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      
      // Check for duplicate certificate number
      const existing = await storage.getCertificateByNumber(parsed.data.certificateNumber);
      if (existing) {
        return res.status(400).json({ error: "Certificate number already exists" });
      }
      
      const certificate = await storage.createCertificate(parsed.data);
      res.status(201).json(certificate);
    } catch (error) {
      console.error("Create certificate error:", error);
      res.status(500).json({ error: "Failed to create certificate" });
    }
  });
  
  // Staff: Delete certificate
  app.delete("/api/certificates/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCertificate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete certificate error:", error);
      res.status(500).json({ error: "Failed to delete certificate" });
    }
  // Staff: Clear all certificates
  app.delete("/api/certificates", requireAuth, async (req, res) => {
    try {
      await storage.clearAllCertificates();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear certificates error:", error);
      res.status(500).json({ error: "Failed to clear certificates" });
    }
  });
  
  // ==================== ANNOUNCEMENT ROUTES ====================
  
  // Public: Get published announcements
  app.get("/api/announcements/public", async (req, res) => {
    try {
      const publishedAnnouncements = await storage.getPublishedAnnouncements();
      res.json(publishedAnnouncements);
    } catch (error) {
      console.error("Get announcements error:", error);
      res.status(500).json({ error: "Failed to get announcements" });
    }
  });
  
  // Staff: Get all announcements
  app.get("/api/announcements", requireAuth, async (req, res) => {
    try {
      const allAnnouncements = await storage.getAllAnnouncements();
      res.json(allAnnouncements);
    } catch (error) {
      console.error("Get announcements error:", error);
      res.status(500).json({ error: "Failed to get announcements" });
    }
  });
  
  // Staff: Create announcement (accepts optional file upload)
  app.post("/api/announcements", requireAuth, upload.single("file"), async (req, res) => {
    try {
      const parsed = insertAnnouncementSchema.safeParse({
        ...req.body,
        createdBy: req.session.userId,
        filePath: req.file ? `/uploads/${req.file.filename}` : null,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }

      const announcement = await storage.createAnnouncement(parsed.data);
      res.status(201).json(announcement);
    } catch (error) {
      console.error("Create announcement error:", error);
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });
  
  // Staff: Update announcement
  app.patch("/api/announcements/:id", requireAuth, async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(req.params.id, req.body);
      if (!announcement) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json(announcement);
    } catch (error) {
      console.error("Update announcement error:", error);
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });
  
  // Staff: Delete announcement
  app.delete("/api/announcements/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteAnnouncement(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete announcement error:", error);
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });
  
  // ==================== GALLERY ROUTES ====================
  
  // Public: Get all gallery items
  app.get("/api/gallery/public", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const items = await storage.getGalleryItemsByCategory(category);
        return res.json(items);
      }
      
      const allItems = await storage.getAllGalleryItems();
      res.json(allItems);
    } catch (error) {
      console.error("Get gallery error:", error);
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  });
  
  // Staff: Get all gallery items
  app.get("/api/gallery", requireAuth, async (req, res) => {
    try {
      const allItems = await storage.getAllGalleryItems();
      res.json(allItems);
    } catch (error) {
      console.error("Get gallery error:", error);
      res.status(500).json({ error: "Failed to get gallery items" });
    }
  });
  
  // Staff: Create gallery item (accepts image upload)
  app.post("/api/gallery", requireAuth, upload.single("image"), async (req, res) => {
    try {
      const parsed = insertGalleryItemSchema.safeParse({
        ...req.body,
        createdBy: req.session.userId,
        imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      });

      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }

      const item = await storage.createGalleryItem(parsed.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Create gallery item error:", error);
      res.status(500).json({ error: "Failed to create gallery item" });
    }
  });
  
  // Staff: Delete gallery item
  app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteGalleryItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete gallery item error:", error);
      res.status(500).json({ error: "Failed to delete gallery item" });
    }
  });
  
  // ==================== BRANCH ROUTES ====================
  
  // Public: Get all branches
  app.get("/api/branches/public", async (req, res) => {
    try {
      const allBranches = await storage.getAllBranches();
      res.json(allBranches);
    } catch (error) {
      console.error("Get branches error:", error);
      res.status(500).json({ error: "Failed to get branches" });
    }
  });
  
  // Staff: Get all branches
  app.get("/api/branches", requireAuth, async (req, res) => {
    try {
      const allBranches = await storage.getAllBranches();
      res.json(allBranches);
    } catch (error) {
      console.error("Get branches error:", error);
      res.status(500).json({ error: "Failed to get branches" });
    }
  });
  
  // Staff: Create branch
  app.post("/api/branches", requireAuth, async (req, res) => {
    try {
      const parsed = insertBranchSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      
      const branch = await storage.createBranch(parsed.data);
      res.status(201).json(branch);
    } catch (error) {
      console.error("Create branch error:", error);
      res.status(500).json({ error: "Failed to create branch" });
    }
  });
  
  // Staff: Update branch
  app.patch("/api/branches/:id", requireAuth, async (req, res) => {
    try {
      const branch = await storage.updateBranch(req.params.id, req.body);
      if (!branch) {
        return res.status(404).json({ error: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      console.error("Update branch error:", error);
      res.status(500).json({ error: "Failed to update branch" });
    }
  });
  
  // Staff: Delete branch
  app.delete("/api/branches/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteBranch(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete branch error:", error);
      res.status(500).json({ error: "Failed to delete branch" });
    }
  });
  
  // ==================== CONTACT ROUTES ====================
  
  // Public: Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSubmissionSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      
      const submission = await storage.createContactSubmission(parsed.data);
      res.status(201).json({ success: true, id: submission.id });
    } catch (error) {
      console.error("Contact submission error:", error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });
  
  // Staff: Get all contact submissions
  app.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Get contact submissions error:", error);
      res.status(500).json({ error: "Failed to get submissions" });
    }
  });
  
  // Staff: Mark contact as read
  app.patch("/api/contact/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markContactAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Mark contact read error:", error);
      res.status(500).json({ error: "Failed to mark as read" });
    }
  });
  
  // ==================== SEMINAR ROUTES ====================
  
  // Public: Get all seminars
  app.get("/api/seminars/public", async (req, res) => {
    try {
      const allSeminars = await storage.getAllSeminars();
      res.json(allSeminars);
    } catch (error) {
      console.error("Get seminars error:", error);
      res.status(500).json({ error: "Failed to get seminars" });
    }
  });
  
  // Staff: Get all seminars
  app.get("/api/seminars", requireAuth, async (req, res) => {
    try {
      const allSeminars = await storage.getAllSeminars();
      res.json(allSeminars);
    } catch (error) {
      console.error("Get seminars error:", error);
      res.status(500).json({ error: "Failed to get seminars" });
    }
  });
  
  // Staff: Create seminar
  app.post("/api/seminars", requireAuth, async (req, res) => {
    try {
      const parsed = insertSeminarSchema.safeParse({
        ...req.body,
        createdBy: req.session.userId,
      });
      
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues });
      }
      
      const seminar = await storage.createSeminar(parsed.data);
      res.status(201).json(seminar);
    } catch (error) {
      console.error("Create seminar error:", error);
      res.status(500).json({ error: "Failed to create seminar" });
    }
  });
  
  // Staff: Update seminar
  app.patch("/api/seminars/:id", requireAuth, async (req, res) => {
    try {
      const seminar = await storage.updateSeminar(req.params.id, req.body);
      if (!seminar) {
        return res.status(404).json({ error: "Seminar not found" });
      }
      res.json(seminar);
    } catch (error) {
      console.error("Update seminar error:", error);
      res.status(500).json({ error: "Failed to update seminar" });
    }
  });
  
  // Staff: Delete seminar
  app.delete("/api/seminars/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteSeminar(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete seminar error:", error);
      res.status(500).json({ error: "Failed to delete seminar" });
    }
  });

  // ==================== STATIC FILE SERVING ====================
  
  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  return httpServer;
}
