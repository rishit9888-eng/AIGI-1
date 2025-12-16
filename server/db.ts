import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

import * as schema from "@shared/schema";
import { certificates, users, branches, announcements, galleryItems, contactSubmissions, seminars } from "@shared/schema";

let db: any = null;

if (process.env.DATABASE_URL) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  db = drizzle(pool, { schema });
} else {
  // Mock database for development without Postgres
  console.warn("DATABASE_URL not set. Running in offline mode with mock data.");
  let mockCertificates: any[] = [];
  let mockUsers: any[] = [];
  let mockBranches: any[] = [
    {
      id: "1",
      name: "Head Office",
      address: "A -1, BHAI LAL BHAI PARK, SUSSEN - TARSALI ROAD, VADODARA, GUJARAT. 390 010.",
      phone: "+91-98725-95709",
      email: "aigilabdelhi@gmail.com",
      hours: "10:00 AM - 6:00 PM",
      isHeadOffice: true,
    }
  ];
  let mockAnnouncements: any[] = [];
  let mockGallery: any[] = [];
  let mockContacts: any[] = [];
  let mockSeminars: any[] = [];
  db = {
    select: () => ({
      from: (table: any) => {
        const baseQuery = {
          where: (condition: any) => {
            if (table === certificates) {
              // For certificates, filter by condition
              if (condition && condition.right) {
                return Promise.resolve(mockCertificates.filter(c => c.certificateNumber === condition.right));
              }
              return Promise.resolve(mockCertificates);
            }
            if (table === branches) {
              return Promise.resolve(mockBranches);
            }
            if (table === users) {
              if (condition && condition.right) {
                return Promise.resolve(mockUsers.filter(u => u.username === condition.right));
              }
              return Promise.resolve(mockUsers);
            }
            return Promise.resolve([]);
          }
        };
        
        // For queries without where clause, make the baseQuery itself then-able
        const queryWithPromise = Object.assign(baseQuery, {
          then: (resolve: any, reject: any) => {
            if (table === users) {
              return Promise.resolve(mockUsers).then(resolve, reject);
            }
            if (table === certificates) {
              return Promise.resolve(mockCertificates).then(resolve, reject);
            }
            if (table === branches) {
              return Promise.resolve(mockBranches).then(resolve, reject);
            }
            if (table === announcements) {
              return Promise.resolve(mockAnnouncements).then(resolve, reject);
            }
            if (table === galleryItems) {
              return Promise.resolve(mockGallery).then(resolve, reject);
            }
            if (table === contactSubmissions) {
              return Promise.resolve(mockContacts).then(resolve, reject);
            }
            if (table === seminars) {
              return Promise.resolve(mockSeminars).then(resolve, reject);
            }
            return Promise.resolve([]).then(resolve, reject);
          }
        });
        
        return queryWithPromise;
      }
    }),
    insert: (table: any) => ({
      values: (data: any) => ({
        returning: () => {
          if (table === certificates) {
            mockCertificates.push(data);
          } else if (table === users) {
            mockUsers.push(data);
          } else if (table === branches) {
            mockBranches.push(data);
          } else if (table === announcements) {
            mockAnnouncements.push(data);
          } else if (table === galleryItems) {
            mockGallery.push(data);
          } else if (table === contactSubmissions) {
            mockContacts.push(data);
          } else if (table === seminars) {
            mockSeminars.push(data);
          }
          return Promise.resolve([data]);
        }
      })
    }),
    update: (table: any) => ({
      set: (data: any) => ({
        where: (condition: any) => ({
          returning: () => {
            if (table === users) {
              const index = mockUsers.findIndex(u => u.id === condition.right);
              if (index !== -1) {
                mockUsers[index] = { ...mockUsers[index], ...data };
                return Promise.resolve([mockUsers[index]]);
              }
            }
            return Promise.resolve([]);
          }
        })
      })
    }),
    delete: (table: any) => ({
      where: (condition: any) => {
        if (table === users) {
          const index = mockUsers.findIndex(u => u.id === condition.right);
          if (index !== -1) {
            mockUsers.splice(index, 1);
          }
        }
        return Promise.resolve();
      }
    }),
  };
}

export { db };
