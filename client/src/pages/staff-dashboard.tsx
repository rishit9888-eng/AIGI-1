import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import StaffDashboard from "@/components/staff/StaffDashboard";
import CertificateUpload from "@/components/staff/CertificateUpload";
import ThemeToggle from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string | null;
  role: string | null;
}

export default function StaffDashboardPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);

  // Fetch counts for dashboard stats
  const { data: certificates } = useQuery<any[]>({ queryKey: ["/api/certificates"], queryFn: getQueryFn({ on401: "returnNull" }), enabled: !showUpload });
  const { data: announcements } = useQuery<any[]>({ queryKey: ["/api/announcements"], queryFn: getQueryFn({ on401: "returnNull" }), enabled: !showUpload });
  const { data: gallery } = useQuery<any[]>({ queryKey: ["/api/gallery/public"], queryFn: getQueryFn({ on401: "throw" }), enabled: !showUpload });
  const { data: branches } = useQuery<any[]>({ queryKey: ["/api/branches"], queryFn: getQueryFn({ on401: "throw" }), enabled: !showUpload });
  const { data: contacts } = useQuery<any[]>({ queryKey: ["/api/contact"], queryFn: getQueryFn({ on401: "returnNull" }), enabled: !showUpload });

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // In demo/offline mode, allow access even without user authentication
  const isDemo = !user; // If we can't get a user, we're in demo mode
  const displayUser = user || { id: "demo", username: "Admin", fullName: "Demo User", role: "admin" };

  return (
    <div className="relative" data-testid="page-staff-dashboard">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {showUpload ? (
        <CertificateUpload onClose={() => setShowUpload(false)} />
      ) : (
        <StaffDashboard 
          username={displayUser.fullName || displayUser.username}           user={user}          onLogout={handleLogout}
          onUploadCertificate={() => setShowUpload(true)}
          onViewPublic={() => setLocation('/')}
          stats={[
            { label: 'Certificates Issued', value: (certificates?.length ?? 0).toString(), change: '' },
            { label: 'Pending Verifications', value: '—', change: '' },
            { label: 'New Inquiries', value: (contacts?.length ?? 0).toString(), change: '' },
            { label: 'Gallery Items', value: (gallery?.length ?? 0).toString(), change: '' },
          ]}
        />
      )}
    </div>
  );
}
