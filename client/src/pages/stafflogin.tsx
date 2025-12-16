import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import StaffLogin from "@/components/staff/StaffLogin";
import ThemeToggle from "@/components/ThemeToggle";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string | null;
  role: string | null;
}

export default function StaffLoginPage() {
  const navigate = useNavigate();
  
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const handleLogin = () => {
    // Refetch user data to ensure we have the latest auth state
    setTimeout(() => {
      navigate("/staff/dashboard");
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    navigate("/staff/dashboard");
    return null;
  }

  return (
    <div className="relative" data-testid="page-staff-login">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <StaffLogin onLogin={handleLogin} />
    </div>
  );
}
