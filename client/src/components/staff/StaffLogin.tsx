import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Diamond, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface StaffLoginProps {
  onLogin?: (username: string) => void;
}

interface LoginResponse {
  id: string;
  username: string;
  fullName: string | null;
  role: string | null;
}

export default function StaffLogin({ onLogin }: StaffLoginProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData): Promise<LoginResponse> => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Login Successful",
        description: "Welcome to the AIGI Staff Portal",
      });
      onLogin?.(data.username);
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleDemoLogin = () => {
    setFormData({ username: "admin", password: "admin123" });
    loginMutation.mutate({ username: "admin", password: "admin123" });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="page-staff-login">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Diamond className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-semibold">AIGI</span>
          </div>
          <CardTitle className="text-2xl">Staff Portal</CardTitle>
          <CardDescription>Sign in to access the administration dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                data-testid="input-staff-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="input-staff-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-staff-login">
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={handleDemoLogin} disabled={loginMutation.isPending} data-testid="button-demo-login">
              Demo Login (admin)
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Contact administrator for access credentials
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
