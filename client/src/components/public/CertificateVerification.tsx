import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { Certificate } from "@shared/schema";

export default function CertificateVerification() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async () => {
    if (!certificateNumber.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    setNotFound(false);

    try {
      const response = await fetch(`/api/certificates/verify/${encodeURIComponent(certificateNumber.trim())}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Certificate result:", data);
        setResult(data);
      } else if (response.status === 404) {
        setNotFound(true);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="py-20 bg-background" data-testid="section-verify">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-verify-title">
            Verify Certificate
          </h2>
          <p className="text-muted-foreground" data-testid="text-verify-description">
            Enter your AIGI certificate number to verify its authenticity.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Input
                placeholder="Enter Lab Report number"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="flex-1"
                data-testid="input-certificate-number"
              />
              <Button onClick={handleVerify} disabled={isLoading} data-testid="button-verify">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">Verify</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20" data-testid="card-result-success">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle className="text-green-700 dark:text-green-400">Certificate Verified</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Certificate Number</p>
                  <p className="font-medium">{result.certificateNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stone Type</p>
                  <p className="font-medium">{result.stoneType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carat Weight</p>
                  <p className="font-medium">{result.carat} ct</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Weight</p>
                  <p className="font-medium">{result.grossWeight || 'N/A'} g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Color</p>
                  <p className="font-medium">{result.color}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clarity</p>
                  <p className="font-medium">{result.clarity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cut</p>
                  <p className="font-medium">{result.cut}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued Date</p>
                  <p className="font-medium">{formatDate(result.issuedDate)}</p>
                </div>
              </div>
              {result.filePath && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Certificate Image</p>
                  <img src={`${result.filePath}?t=${Date.now()}`} alt="Certificate" className="max-w-full h-auto rounded-lg border shadow-sm" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {notFound && (
          <Card className="border-destructive/50 bg-red-50/50 dark:bg-red-950/20" data-testid="card-result-notfound">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-destructive" />
                <div>
                  <p className="font-medium text-destructive">Certificate Not Found</p>
                  <p className="text-sm text-muted-foreground">
                    Please check the certificate number and try again, or contact us for assistance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
