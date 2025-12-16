import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileCheck, Loader2, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import Tesseract from 'tesseract.js';

const stoneTypes = [
  "Natural Diamond",
  "Lab-Grown Diamond",
  "Natural Ruby",
  "Natural Sapphire",
  "Natural Emerald",
  "Other Gemstone",
];

interface CertificateData {
  labReportNo: string;
  description: string;
  grossWeight: string;
  totalEstWeight: string;
  shapeCut: string;
  color: string;
  clarity: string;
  comments: string;
}

export default function CertificateUpload({ onClose }: { onClose?: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [uploadMode, setUploadMode] = useState<"manual" | "excel">("manual");
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [certificatesFromExcel, setCertificatesFromExcel] = useState<CertificateData[]>([]);
  const [imagesMap, setImagesMap] = useState<Map<string, File[]>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    certificateNumber: "",
    stoneType: "",
    carat: "",
    grossWeight: "",
    color: "",
    clarity: "",
    cut: "",
    notes: "",
  });

  // Manual create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v) form.append(k, v); });
      if (uploadedFile) form.append("file", uploadedFile);
      const res = await fetch("/api/certificates", { method: "POST", body: form, credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certificates"] });
      toast({ title: "Certificate Published", description: `Certificate ${formData.certificateNumber} published.` });
      setStep(4);
    },
    onError: (err: Error) => toast({ title: "Error", description: err.message || "Failed" , variant: "destructive" }),
  });

  // Bulk create mutation
  const bulkCreateMutation = useMutation({
    mutationFn: async (certificates: CertificateData[]) => {
      // Clear all previous certificates
      await fetch("/api/certificates", { method: "DELETE", credentials: "include" });

      const results: any[] = [];
      for (const cert of certificates) {
        const certNumber = cert.labReportNo && String(cert.labReportNo).trim() !== "" ? String(cert.labReportNo).trim() : null;
        if (!certNumber) {
          throw new Error(`Missing Lab Report No. for row: ${cert.description || "Unknown"}`);
        }

        const fd = new FormData();
        fd.append("certificateNumber", certNumber);
        fd.append("stoneType", cert.description || "Gemstone");
        fd.append("carat", cert.totalEstWeight || cert.grossWeight || "0");
        fd.append("grossWeight", cert.grossWeight || "");
        fd.append("color", cert.color || "Unknown");
        fd.append("clarity", cert.clarity || "Unknown");
        fd.append("cut", cert.shapeCut || "Unknown");
        fd.append("notes", `Lab Report: ${cert.labReportNo}\nGross Weight: ${cert.grossWeight || ""}\n${cert.comments || ""}`);

        const images = imagesMap.get(cert.labReportNo);
        if (images && images.length > 0) fd.append("file", images[0]);

        const res = await fetch("/api/certificates", { method: "POST", body: fd, credentials: "include" });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`${certNumber}: ${errText || res.statusText}`);
        }
        results.push(await res.json());
      }
      return results;
    },
    onSuccess: (r) => { queryClient.invalidateQueries({ queryKey: ["/api/certificates"] }); toast({ title: "Bulk Upload Complete", description: `Created ${r.length} certificates.` }); setStep(4); },
    onError: (err: Error) => { toast({ title: "Bulk upload failed", description: err.message || "Please try again.", variant: "destructive" }); },
  });

  const parseExcelFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        toast({
          title: "No Data",
          description: "Excel file appears to be empty or has no valid rows.",
          variant: "destructive",
        });
        return;
      }

      // Find column keys dynamically
      const sampleRow = data[0] as any;
      const keys = Object.keys(sampleRow);
      console.log("Excel column keys:", keys);

      const possibleLabReportNoKeys = ['labReportNo', 'lab report no', 'lab_report_no', 'reportNo', 'report no', 'report_no', 'labNo', 'lab no', 'lab_no', 'certificateNo', 'certificate no', 'certificate_no', 'Lab report no.', 'Lab Report No', 'Lab Report Number'];
      const labReportNoKey = keys.find(key => possibleLabReportNoKeys.some(possible => key.toLowerCase().includes(possible.toLowerCase().replace(/\s+/g, '')))) || keys.find(key => key.toLowerCase().includes('lab') && key.toLowerCase().includes('report'));

      if (!labReportNoKey) {
        toast({
          title: "Column Not Found",
          description: "Could not find a column for Lab Report No. Please ensure the Excel file has a column header containing 'lab report', 'report no', or similar.",
          variant: "destructive",
        });
        return;
      }

      const possibleDescriptionKeys = ['description', 'stone type', 'stoneType', 'type'];
      const descriptionKey = keys.find(key => possibleDescriptionKeys.some(possible => key.toLowerCase().includes(possible.toLowerCase().replace(/\s+/g, '')))) || keys.find(key => key.toLowerCase().includes('desc'));

      const possibleGrossWeightKeys = ['gross weight', 'grossWeight', 'weight'];
      const grossWeightKey = keys.find(key => possibleGrossWeightKeys.some(possible => key.toLowerCase().includes(possible.toLowerCase().replace(/\s+/g, '')))) || keys.find(key => key.toLowerCase().includes('gross'));

      const possibleTotalEstWeightKeys = ['total est weight', 'totalEstWeight', 'est weight', 'estimated weight'];
      const totalEstWeightKey = keys.find(key => possibleTotalEstWeightKeys.some(possible => key.toLowerCase().includes(possible.toLowerCase().replace(/\s+/g, '')))) || keys.find(key => key.toLowerCase().includes('est'));

      const possibleShapeCutKeys = ['shape/cut', 'shapeCut', 'cut'];
      const shapeCutKey = keys.find(key => possibleShapeCutKeys.some(possible => key.toLowerCase().includes(possible.toLowerCase().replace(/\s+/g, '')))) || keys.find(key => key.toLowerCase().includes('cut'));

      const colorKey = keys.find(key => key.toLowerCase().includes('color'));
      const clarityKey = keys.find(key => key.toLowerCase().includes('clarity'));
      const commentsKey = keys.find(key => key.toLowerCase().includes('comment') || key.toLowerCase().includes('note'));

      const certificates: CertificateData[] = data.map((row: any) => ({
        labReportNo: labReportNoKey ? (row[labReportNoKey]?.toString().trim() || '') : '',
        description: descriptionKey ? (row[descriptionKey]?.toString().trim() || '') : '',
        grossWeight: grossWeightKey ? (row[grossWeightKey]?.toString().trim() || '') : '',
        totalEstWeight: totalEstWeightKey ? (row[totalEstWeightKey]?.toString().trim() || '') : '',
        shapeCut: shapeCutKey ? (row[shapeCutKey]?.toString().trim() || '') : '',
        color: colorKey ? (row[colorKey]?.toString().trim() || '') : '',
        clarity: clarityKey ? (row[clarityKey]?.toString().trim() || '') : '',
        comments: commentsKey ? (row[commentsKey]?.toString().trim() || '') : '',
      }));

      setCertificatesFromExcel(certificates);
      toast({
        title: "Excel Parsed",
        description: `Found ${certificates.length} certificates in the Excel file.`,
      });
      setStep(3);
    } catch (error) {
      toast({
        title: "Failed to parse Excel",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExcelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
    }
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setIsProcessing(true);
      const newImagesMap = new Map(imagesMap);

      if (files[0].type === "application/zip" || files[0].name.endsWith(".zip")) {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(files[0]);
        
        const imageFiles = Object.entries(zipContent.files).filter(([path, file]) => 
          !file.dir && path.match(/\.(jpg|jpeg|png|gif)$/i)
        );

        for (const [filePath, file] of imageFiles) {
          const blob = await file.async("blob");
          const imageFile = new File([blob], filePath.split("/").pop() || filePath, { type: "image/*" });

          // Run OCR to extract lab report number
          const { data: { text } } = await Tesseract.recognize(blob, 'eng');
          const labReportMatch = text.match(/Lab Report No[.:]?\s*(\d+)/i) || text.match(/Report No[.:]?\s*(\d+)/i) || text.match(/Lab No[.:]?\s*(\d+)/i);
          const labReportNo = labReportMatch ? labReportMatch[1] : null;

          if (labReportNo) {
            if (!newImagesMap.has(labReportNo)) {
              newImagesMap.set(labReportNo, []);
            }
            newImagesMap.get(labReportNo)!.push(imageFile);
          } else {
            console.warn(`Could not extract lab report number from ${filePath}`);
          }
        }
        toast({
          title: "Zip Processed with OCR",
          description: "Images organized by extracted lab report numbers.",
        });
      } else {
        const imageFiles = Array.from(files).filter(file => file.type.startsWith("image/"));
        for (const file of imageFiles) {
          // Run OCR to extract lab report number
          const { data: { text } } = await Tesseract.recognize(file, 'eng');
          const labReportMatch = text.match(/Lab Report No[.:]?\s*(\d+)/i) || text.match(/Report No[.:]?\s*(\d+)/i) || text.match(/Lab No[.:]?\s*(\d+)/i);
          const labReportNo = labReportMatch ? labReportMatch[1] : null;

          if (labReportNo) {
            if (!newImagesMap.has(labReportNo)) {
              newImagesMap.set(labReportNo, []);
            }
            newImagesMap.get(labReportNo)!.push(file);
          } else {
            console.warn(`Could not extract lab report number from ${file.name}`);
          }
        }
        toast({
          title: "Images Processed with OCR",
          description: `Processed ${imageFiles.length} images.`,
        });
      }

      setImagesMap(newImagesMap);
    } catch (error) {
      toast({
        title: "Failed to process images",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitExcel = () => {
    if (certificatesFromExcel.length === 0) {
      toast({
        title: "Error",
        description: "No certificates found in Excel file.",
        variant: "destructive",
      });
      return;
    }
    bulkCreateMutation.mutate(certificatesFromExcel);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.certificateNumber || !formData.stoneType) {
      toast({
        title: "Error",
        description: "Certificate number and stone type are required.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const generateCertNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    setFormData({ ...formData, certificateNumber: `AIGI-${year}-${random}` });
  };

  const resetForm = () => {
    setStep(1);
    setUploadMode("manual");
    setExcelFile(null);
    setCertificatesFromExcel([]);
    setImagesMap(new Map());
    setUploadedFile(null);
    setFormData({
      certificateNumber: "",
      stoneType: "",
      carat: "",
      grossWeight: "",
      color: "",
      clarity: "",
      cut: "",
      notes: "",
    });
  };

  // Step 1: Choose upload mode
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={onClose} className="mb-4">
            ← Back
          </Button>
          
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Certificate Upload</CardTitle>
              <CardDescription>Choose how you want to upload certificates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer border-2 transition-all p-6 text-center ${
                    uploadMode === "manual" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setUploadMode("manual")}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Manual Entry</h3>
                  <p className="text-sm text-muted-foreground mt-2">Create certificates one by one</p>
                </Card>

                <Card
                  className={`cursor-pointer border-2 transition-all p-6 text-center ${
                    uploadMode === "excel" ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                  }`}
                  onClick={() => setUploadMode("excel")}
                >
                  <FileCheck className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Bulk from Excel</h3>
                  <p className="text-sm text-muted-foreground mt-2">Upload multiple certificates at once</p>
                </Card>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setStep(uploadMode === "excel" ? 2 : 3)} className="flex-1">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Excel file upload
  if (uploadMode === "excel" && step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setStep(1)} className="mb-4">
            ← Back
          </Button>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Excel File</CardTitle>
              <CardDescription>
                Excel should have columns: Lab report no., Description, Gross weight, total EST weight, Shape/Cut, color, clarity, comments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelFileChange}
                  disabled={isProcessing}
                  className="hidden"
                  id="excel-input"
                />
                <Label htmlFor="excel-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  {excelFile ? (
                    <div>
                      <p className="font-semibold text-green-600">{excelFile.name}</p>
                      <p className="text-sm text-muted-foreground">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Click to upload Excel file</p>
                      <p className="text-sm text-muted-foreground">or drag and drop</p>
                    </div>
                  )}
                </Label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1" disabled={isProcessing}>
                  Back
                </Button>
                <Button
                  onClick={() => excelFile && parseExcelFile(excelFile)}
                  disabled={!excelFile || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Parse Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 3: Images upload or manual form
  if (step === 3) {
    if (uploadMode === "excel") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setStep(2)} className="mb-4">
              ← Back
            </Button>

            <Card className="border-2 mb-4">
              <CardHeader>
                <CardTitle>Upload Images (Optional)</CardTitle>
                <CardDescription>
                  Upload images or ZIP folder. Lab report numbers will be extracted from the image text using OCR.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.zip"
                    onChange={handleImagesUpload}
                    disabled={isProcessing}
                    className="hidden"
                    id="images-input"
                  />
                  <Label htmlFor="images-input" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="font-semibold">Click to upload images or ZIP folder</p>
                    <p className="text-sm text-muted-foreground">Lab report numbers extracted via OCR</p>
                  </Label>
                </div>

                {imagesMap.size > 0 && (
                  <div className="space-y-4">
                    <p className="font-semibold text-sm">Images by Lab Report:</p>
                    {Array.from(imagesMap.entries()).map(([labNo, images]) => (
                      <div key={labNo} className="border rounded-lg p-3">
                        <p className="font-medium text-sm mb-2">{labNo}: {images.length} image(s)</p>
                        <div className="flex gap-2 flex-wrap">
                          {images.slice(0, 3).map((img, idx) => (
                            <img
                              key={idx}
                              src={URL.createObjectURL(img)}
                              alt={`Preview ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))}
                          {images.length > 3 && (
                            <div className="w-16 h-16 bg-muted rounded border flex items-center justify-center text-xs text-muted-foreground">
                              +{images.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1" disabled={isProcessing}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitExcel}
                    disabled={certificatesFromExcel.length === 0 || bulkCreateMutation.isPending}
                    className="flex-1"
                  >
                    {bulkCreateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create {certificatesFromExcel.length} Certificates
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Certificates Preview:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {certificatesFromExcel.map((cert, idx) => (
                    <div key={idx} className="text-sm p-2 bg-slate-50 rounded border">
                      <p><strong>Lab:</strong> {cert.labReportNo}</p>
                      <p><strong>Desc:</strong> {cert.description}</p>
                      <p><strong>Color/Clarity:</strong> {cert.color} / {cert.clarity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Manual entry mode
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => setStep(1)} className="mb-4">
            ← Back
          </Button>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Certificate</CardTitle>
              <CardDescription>Provide certificate details and optional image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Certificate Number</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.certificateNumber}
                    onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                    placeholder="AIGI-2024-XXXXXX"
                  />
                  <Button variant="outline" onClick={generateCertNumber}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stone Type</Label>
                <Select value={formData.stoneType} onValueChange={(value) => setFormData({ ...formData, stoneType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stone type" />
                  </SelectTrigger>
                  <SelectContent>
                    {stoneTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Carat Weight</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.carat}
                    onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gross Weight</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.grossWeight}
                    onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="E, D, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Clarity</Label>
                  <Input
                    value={formData.clarity}
                    onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                    placeholder="VS1, IF, etc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cut</Label>
                <Input
                  value={formData.cut}
                  onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                  placeholder="Excellent, Good, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Image (Optional)</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} />
                {uploadedFile && <p className="text-sm text-green-600">✓ {uploadedFile.name}</p>}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={createMutation.isPending} className="flex-1">
                  {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Publish Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 4: Success
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <Card className="border-2 max-w-md text-center">
          <CardContent className="pt-6 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Success!</h2>
            <p className="text-muted-foreground">
              {uploadMode === "excel"
                ? `All ${certificatesFromExcel.length} certificates have been published successfully.`
                : `Certificate ${formData.certificateNumber} has been published successfully.`}
            </p>
            <div className="flex gap-3">
              <Button onClick={resetForm} className="flex-1">
                Upload More
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
