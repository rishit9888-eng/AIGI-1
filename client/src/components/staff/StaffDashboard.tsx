import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Diamond,
  FileCheck,
  Upload,
  Bell,
  Users,
  MapPin,
  Image,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Home,
  Settings,
  ChevronRight,
} from "lucide-react";

// todo: remove mock functionality
const stats = [
  { label: "Certificates Issued", value: "1,234", change: "+12 this week" },
  { label: "Pending Verifications", value: "28", change: "5 urgent" },
  { label: "New Inquiries", value: "15", change: "+3 today" },
  { label: "Gallery Items", value: "156", change: "8 pending" },
];

const recentActivity = [
  { action: "Certificate issued", details: "AIGI-2024-001245 - Diamond 1.5ct", time: "2 hours ago" },
  { action: "Announcement posted", details: "Holiday Hours Update", time: "4 hours ago" },
  { action: "New inquiry", details: "From: Jewel Arts Pvt Ltd", time: "5 hours ago" },
  { action: "Gallery updated", details: "3 new lab images added", time: "1 day ago" },
  { action: "Branch info updated", details: "Kerala - New contact number", time: "2 days ago" },
];

interface StatItem {
  label: string;
  value: string;
  change?: string;
}

interface StaffDashboardProps {
  username?: string;
  user?: any;
  onLogout?: () => void;
  onUploadCertificate?: () => void;
  onViewPublic?: () => void;
  stats?: StatItem[];
}

export default function StaffDashboard({ username = "Admin", user, onLogout, onUploadCertificate, onViewPublic, stats: propsStats }: StaffDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [editingCert, setEditingCert] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    certificateNumber: "",
    stoneType: "",
    carat: "",
    grossWeight: "",
    color: "",
    clarity: "",
    cut: "",
    notes: "",
  });
  const [userForm, setUserForm] = useState({
    username: "",
    password: "",
    fullName: "",
    role: "staff",
  });
  const [settingsForm, setSettingsForm] = useState({
    selectedUserId: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    fullName: "",
    role: "staff",
    password: "",
  });
  const [certificateSearch, setCertificateSearch] = useState("");
  const stats = propsStats || [
    { label: "Certificates Issued", value: "1,234", change: "+12 this week" },
    { label: "Pending Verifications", value: "28", change: "5 urgent" },
    { label: "New Inquiries", value: "15", change: "+3 today" },
    { label: "Gallery Items", value: "156", change: "8 pending" },
  ];
  const queryClient = useQueryClient();

  const { data: certificates = [] } = useQuery<any[]>({ queryKey: ["/api/certificates"], queryFn: getQueryFn({ on401: "throw" }) });
  const { data: contacts = [] } = useQuery<any[]>({ queryKey: ["/api/contact"], queryFn: getQueryFn({ on401: "throw" }) });
  const { data: announcements = [] } = useQuery<any[]>({ queryKey: ["/api/announcements"], queryFn: getQueryFn({ on401: "throw" }) });
  const { data: gallery = [] } = useQuery<any[]>({ queryKey: ["/api/gallery"], queryFn: getQueryFn({ on401: "throw" }) });
  const { data: branches = [] } = useQuery<any[]>({ queryKey: ["/api/branches"], queryFn: getQueryFn({ on401: "throw" }) });
  const { data: users = [] } = useQuery<any[]>({ queryKey: ["/api/users"], queryFn: getQueryFn({ on401: "throw" }) });

  const filteredCertificates = certificates.filter((cert: any) =>
    certificateSearch === "" ||
    cert.certificateNumber.toLowerCase().includes(certificateSearch.toLowerCase()) ||
    cert.stoneType.toLowerCase().includes(certificateSearch.toLowerCase()) ||
    cert.carat.toLowerCase().includes(certificateSearch.toLowerCase()) ||
    cert.color?.toLowerCase().includes(certificateSearch.toLowerCase()) ||
    cert.clarity?.toLowerCase().includes(certificateSearch.toLowerCase())
  );

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: FileCheck, label: "Certificates", count: filteredCertificates.length },
    { icon: Bell, label: "Announcements" },
    { icon: Image, label: "Gallery" },
    { icon: MapPin, label: "Branches" },
    { icon: MessageSquare, label: "Inquiries", count: contacts.length },
    ...(user?.role === 'admin' ? [
      { icon: Users, label: "Staff Management", count: users.length },
      { icon: Settings, label: "Settings" },
    ] : []),
  ];

  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/certificates"] }),
  });

  const updateCertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v && typeof v === 'string') form.append(k, v); });
      await apiRequest("PATCH", `/api/certificates/${id}`, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      setEditingCert(null);
      toast({ title: "Certificate Updated", description: "Certificate updated successfully." });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message || "Failed to update", variant: "destructive" }),
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User Created", description: "Staff user created successfully." });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message || "Failed to create user", variant: "destructive" }),
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "User Updated", description: "Staff user updated successfully." });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message || "Failed to update user", variant: "destructive" }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/users/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/users"] }),
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      await apiRequest("PATCH", `/api/users/${id}/password`, { password });
    },
    onSuccess: () => {
      toast({ title: "Password Updated", description: "User password updated successfully." });
      setSettingsForm({ selectedUserId: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message || "Failed to update password", variant: "destructive" }),
  });

  const handleEditCert = (cert: any) => {
    setEditingCert(cert);
    setEditForm({
      certificateNumber: cert.certificateNumber,
      stoneType: cert.stoneType,
      carat: cert.carat,
      grossWeight: cert.grossWeight || "",
      color: cert.color,
      clarity: cert.clarity,
      cut: cert.cut,
      notes: cert.notes || "",
    });
  };

  const handleUpdateCert = () => {
    if (!editingCert) return;
    updateCertMutation.mutate({ id: editingCert.id, data: editForm });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserForm({
      username: user.username,
      fullName: user.fullName || "",
      role: user.role || "staff",
      password: "",
    });
  };

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/contact/${id}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/contact"] }),
  });

  // Announcement form state
  const { toast } = useToast();

  const [annForm, setAnnForm] = useState({ title: "", excerpt: "", content: "" });
  const [annFile, setAnnFile] = useState<File | null>(null);
  const createAnnouncement = async () => {
    if (!annForm.title.trim() || !annForm.excerpt.trim()) {
      toast({ title: "Error", description: "Title and excerpt are required", variant: "destructive" });
      return;
    }
    
    const fd = new FormData();
    fd.append("title", annForm.title);
    fd.append("excerpt", annForm.excerpt);
    fd.append("content", annForm.content || "");
    fd.append("isPublished", "true");
    if (annFile) fd.append("file", annFile);

    try {
      const res = await fetch("/api/announcements", { method: "POST", body: fd, credentials: "include" });
      if (res.ok) {
        setAnnForm({ title: "", excerpt: "", content: "" });
        setAnnFile(null);
        queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
        toast({ title: "Success", description: "Announcement published successfully" });
      } else {
        const error = await res.text();
        toast({ title: "Error", description: `Failed: ${error}`, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    }
  };

  // Gallery upload state
  const [galleryForm, setGalleryForm] = useState({ title: "", category: "", description: "" });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const createGalleryItem = async () => {
    if (!galleryForm.title.trim() || !galleryForm.category.trim()) {
      toast({ title: "Error", description: "Title and category are required", variant: "destructive" });
      return;
    }

    const fd = new FormData();
    fd.append("title", galleryForm.title);
    fd.append("category", galleryForm.category);
    fd.append("description", galleryForm.description || "");
    if (galleryFile) fd.append("image", galleryFile);

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: fd, credentials: "include" });
      if (res.ok) {
        setGalleryForm({ title: "", category: "", description: "" });
        setGalleryFile(null);
        queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
        toast({ title: "Success", description: "Gallery item uploaded successfully" });
      } else {
        const error = await res.text();
        toast({ title: "Error", description: `Failed: ${error}`, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="page-staff-dashboard">
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-shrink-0 overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <Diamond className="h-8 w-8 text-primary flex-shrink-0" />
            {sidebarOpen && <span className="font-serif text-lg font-semibold">AIGI Staff</span>}
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  activeMenu === item.label ? "bg-sidebar-accent" : ""
                }`}
                onClick={() => setActiveMenu(item.label)}
                data-testid={`button-menu-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.count && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.count}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
            onClick={onLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-toggle-sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
            <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {username}</span>
            <Button variant="outline" size="sm" data-testid="button-view-public" onClick={() => onViewPublic ? onViewPublic() : window.location.assign('/') }>
              View Public Site
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Overview of your gemological institute operations</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} data-testid={`card-stat-${index}`}>
                  <CardContent className="pt-6">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm font-medium">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button className="h-auto py-4 flex-col gap-2" onClick={onUploadCertificate} data-testid="button-upload-certificate">
                    <FileCheck className="h-5 w-5" />
                    <span className="text-xs">Upload Certificate</span>
                  </Button>
                  <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveMenu("Announcements")} data-testid="button-new-announcement">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">New Announcement</span>
                  </Button>
                  <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveMenu("Gallery")} data-testid="button-add-gallery">
                    <Image className="h-5 w-5" />
                    <span className="text-xs">Add to Gallery</span>
                  </Button>
                  <Button variant="secondary" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveMenu("Inquiries")} data-testid="button-view-inquiries">
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-xs">View Inquiries</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{activeMenu}</CardTitle>
                </CardHeader>
                <CardContent>
                  {activeMenu === "Dashboard" && (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3" data-testid={`activity-${index}`}>
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground truncate">{activity.details}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeMenu === "Certificates" && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search certificates by number, stone type, or carat..."
                          value={certificateSearch}
                          onChange={(e) => setCertificateSearch(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      {filteredCertificates.length === 0 && certificates.length > 0 && (
                        <p className="text-sm text-muted-foreground">No certificates match your search.</p>
                      )}
                      {certificates.length === 0 && <p className="text-sm text-muted-foreground">No certificates found.</p>}
                      {filteredCertificates.map((c: any) => (
                        <div key={c.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{c.certificateNumber}</p>
                            <p className="text-sm text-muted-foreground">{c.stoneType} • {c.carat} ct • {new Date(c.issuedDate).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => handleEditCert(c)}>
                              Edit
                            </Button>
                            <Button variant="ghost" onClick={() => deleteCertMutation.mutate(c.id)} data-testid={`delete-cert-${c.id}`}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Dialog open={!!editingCert} onOpenChange={() => setEditingCert(null)}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Certificate</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Certificate Number</Label>
                            <Input
                              value={editForm.certificateNumber}
                              onChange={(e) => setEditForm({ ...editForm, certificateNumber: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Stone Type</Label>
                            <Select value={editForm.stoneType} onValueChange={(value) => setEditForm({ ...editForm, stoneType: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Natural Diamond">Natural Diamond</SelectItem>
                                <SelectItem value="Lab-Grown Diamond">Lab-Grown Diamond</SelectItem>
                                <SelectItem value="Natural Ruby">Natural Ruby</SelectItem>
                                <SelectItem value="Natural Sapphire">Natural Sapphire</SelectItem>
                                <SelectItem value="Natural Emerald">Natural Emerald</SelectItem>
                                <SelectItem value="Other Gemstone">Other Gemstone</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Carat</Label>
                            <Input
                              value={editForm.carat}
                              onChange={(e) => setEditForm({ ...editForm, carat: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gross Weight</Label>
                            <Input
                              value={editForm.grossWeight}
                              onChange={(e) => setEditForm({ ...editForm, grossWeight: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Color</Label>
                            <Input
                              value={editForm.color}
                              onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Clarity</Label>
                            <Input
                              value={editForm.clarity}
                              onChange={(e) => setEditForm({ ...editForm, clarity: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Cut</Label>
                            <Input
                              value={editForm.cut}
                              onChange={(e) => setEditForm({ ...editForm, cut: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={editForm.notes}
                            onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setEditingCert(null)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateCert} disabled={updateCertMutation.isPending} className="flex-1">
                            {updateCertMutation.isPending ? "Updating..." : "Update Certificate"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Staff User</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input
                            value={editUserForm.username}
                            onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input
                            value={editUserForm.fullName}
                            onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select value={editUserForm.role} onValueChange={(value) => setEditUserForm({ ...editUserForm, role: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>New Password (leave empty to keep current)</Label>
                          <Input
                            type="password"
                            value={editUserForm.password}
                            onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                            Cancel
                          </Button>
                          <Button onClick={() => { updateUserMutation.mutate({ id: editingUser.id, data: editUserForm }); setEditingUser(null); }} className="flex-1">
                            Update User
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {activeMenu === "Inquiries" && (
                    <div className="space-y-3">
                      {contacts.length === 0 && <p className="text-sm text-muted-foreground">No inquiries.</p>}
                      {contacts.map((m: any) => (
                        <div key={m.id} className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium">{m.name} — <span className="text-xs text-muted-foreground">{m.email}</span></p>
                            <p className="text-sm text-muted-foreground">{m.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-muted-foreground">{m.isRead ? 'Read' : 'Unread'}</span>
                            {!m.isRead && (
                              <Button size="sm" onClick={() => markReadMutation.mutate(m.id)} data-testid={`mark-read-${m.id}`}>
                                Mark Read
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeMenu === "Announcements" && (
                    <div className="space-y-3">
                      <div className="p-4 border rounded-md space-y-2">
                        <Input 
                          value={annForm.title} 
                          onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })} 
                          placeholder="Title" 
                        />
                        <Input 
                          value={annForm.excerpt} 
                          onChange={(e) => setAnnForm({ ...annForm, excerpt: e.target.value })} 
                          placeholder="Excerpt" 
                        />
                        <Textarea 
                          value={annForm.content} 
                          onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })} 
                          placeholder="Content" 
                        />
                        <Input 
                          type="file" 
                          onChange={(e) => setAnnFile(e.target.files?.[0] ?? null)} 
                        />
                        <div className="flex gap-2">
                          <Button onClick={createAnnouncement}>Publish Announcement</Button>
                        </div>
                      </div>
                      {announcements.length === 0 && <p className="text-sm text-muted-foreground">No announcements.</p>}
                      {announcements.map((a: any) => (
                        <div key={a.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{a.title}</p>
                            <p className="text-sm text-muted-foreground">{a.excerpt}</p>
                          </div>
                          <div>
                            <Button variant="ghost" onClick={async () => { await apiRequest('DELETE', `/api/announcements/${a.id}`); queryClient.invalidateQueries({ queryKey: ['/api/announcements'] }); }}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeMenu === "Gallery" && (
                    <div className="space-y-3">
                      <div className="p-4 border rounded-md space-y-2">
                        <Input 
                          value={galleryForm.title} 
                          onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} 
                          placeholder="Title" 
                        />
                        <Input 
                          value={galleryForm.category} 
                          onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })} 
                          placeholder="Category" 
                        />
                        <Textarea 
                          value={galleryForm.description} 
                          onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} 
                          placeholder="Description" 
                        />
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setGalleryFile(e.target.files?.[0] ?? null)} 
                        />
                        <div className="flex gap-2">
                          <Button onClick={createGalleryItem}>Upload to Gallery</Button>
                        </div>
                      </div>
                      {gallery.length === 0 && <p className="text-sm text-muted-foreground">No gallery items.</p>}
                      {gallery.map((g: any) => (
                        <div key={g.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {g.imagePath && <img src={`${g.imagePath}?t=${Date.now()}`} alt={g.title} className="w-12 h-12 object-cover rounded" />}
                            <div>
                              <p className="font-medium">{g.title}</p>
                              <p className="text-sm text-muted-foreground">{g.category}</p>
                            </div>
                          </div>
                          <div>
                            <Button variant="ghost" onClick={async () => { await apiRequest('DELETE', `/api/gallery/${g.id}`); queryClient.invalidateQueries({ queryKey: ['/api/gallery'] }); }}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeMenu === "Staff Management" && (
                    <div className="space-y-3">
                      <div className="p-4 border rounded-md space-y-2">
                        <Input 
                          value={userForm.username} 
                          onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} 
                          placeholder="Username" 
                        />
                        <Input 
                          type="password"
                          value={userForm.password} 
                          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                          placeholder="Password" 
                        />
                        <Input 
                          value={userForm.fullName} 
                          onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })} 
                          placeholder="Full Name" 
                        />
                        <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="staff">Staff</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button onClick={() => { createUserMutation.mutate(userForm); setUserForm({ username: "", password: "", fullName: "", role: "staff" }); }}>Add Staff</Button>
                        </div>
                      </div>
                      {users.length === 0 && <p className="text-sm text-muted-foreground">No staff users.</p>}
                      {users.map((u: any) => (
                        <div key={u.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{u.username} ({u.role})</p>
                            <p className="text-sm text-muted-foreground">{u.fullName}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" onClick={() => handleEditUser(u)}>Edit</Button>
                            <Button variant="ghost" onClick={() => deleteUserMutation.mutate(u.id)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeMenu === "Settings" && (
                    <div className="space-y-3">
                      <div className="p-4 border rounded-md space-y-2">
                        <h3 className="font-medium">Change User Password</h3>
                        <Select value={settingsForm.selectedUserId} onValueChange={(value) => setSettingsForm(prev => ({ ...prev, selectedUserId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select User" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((u: any) => (
                              <SelectItem key={u.id} value={u.id}>{u.username}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="password"
                          placeholder="New Password"
                          value={settingsForm.newPassword}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          value={settingsForm.confirmPassword}
                          onChange={(e) => setSettingsForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        />
                        <Button
                          onClick={() => {
                            if (!settingsForm.selectedUserId || !settingsForm.newPassword || settingsForm.newPassword !== settingsForm.confirmPassword) {
                              toast({ title: "Error", description: "Please fill all fields and ensure passwords match", variant: "destructive" });
                              return;
                            }
                            updatePasswordMutation.mutate({ id: settingsForm.selectedUserId, password: settingsForm.newPassword });
                          }}
                          disabled={updatePasswordMutation.isPending}
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeMenu === "Branches" && (
                    <div className="space-y-3">
                      {branches.length === 0 && <p className="text-sm text-muted-foreground">No branches.</p>}
                      {branches.map((b: any) => (
                        <div key={b.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{b.name}</p>
                            <p className="text-sm text-muted-foreground">{b.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
