import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BulkUploadDialogProps {
  onBulkUpload: (readings: any[]) => void;
}

export const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({ onBulkUpload }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    // Simulate file processing
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate processing results
          setUploadResults({
            total: 150,
            successful: 142,
            failed: 8,
            errors: [
              "Row 15: Invalid meter ID format",
              "Row 23: Customer not found",
              "Row 45: Reading lower than previous",
              "Row 67: Missing required field",
              "Row 89: Duplicate entry",
              "Row 102: Invalid date format",
              "Row 134: Reading too high (possible error)",
              "Row 147: Zone mismatch"
            ]
          });
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadTemplate = () => {
    // In a real app, this would download a CSV template
    const csvContent = `Customer ID,Meter ID,Current Reading,Reading Date,Collector,Notes
C001,M001234,1275,2025-06-15,Data Collector 1,Normal reading
C002,M001235,1015,2025-06-14,Data Collector 2,High consumption`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meter_readings_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleConfirmUpload = () => {
    if (uploadResults) {
      // In a real app, this would process the successful readings
      onBulkUpload([]);
      setOpen(false);
      setFile(null);
      setUploadResults(null);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk Upload Meter Readings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!uploadResults && (
            <>
              <div className="space-y-2">
                <Label>Upload CSV File</Label>
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <div className="text-xs text-muted-foreground">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </div>
              </div>

              <Button variant="outline" onClick={downloadTemplate} className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Download Template
              </Button>

              {file && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </>
          )}

          {uploadResults && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{uploadResults.total}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">{uploadResults.successful}</div>
                  <div className="text-xs text-muted-foreground">Successful</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{uploadResults.failed}</div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
              </div>

              {uploadResults.errors.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-destructive">Errors:</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {uploadResults.errors.map((error, index) => (
                      <div key={index} className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm text-success">
                  {uploadResults.successful} readings uploaded successfully
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1"
              disabled={uploading}
            >
              Cancel
            </Button>
            {!uploadResults ? (
              <Button 
                onClick={handleUpload} 
                disabled={!file || uploading}
                className="flex-1 bg-gradient-primary"
              >
                {uploading ? "Processing..." : "Upload"}
              </Button>
            ) : (
              <Button 
                onClick={handleConfirmUpload}
                className="flex-1 bg-gradient-primary"
              >
                Confirm Upload
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};