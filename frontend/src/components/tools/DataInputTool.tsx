import { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Papa from "papaparse"; // CSV parsing
import * as XLSX from "xlsx"; // Excel parsing 

import api from "@/api"; // add this import at the top


interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const DataInputTool = ({ itemData, onDataUpdate }: ToolProps) => {
  const [dataSource, setDataSource] = useState(itemData?.dataSource || "");
  const [format, setFormat] = useState(itemData?.format || "csv");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null); 

  

const handleFile = async (file: File) => {
  if (!file) return;

  setFileName(file.name);
  setLoading(true);

  try {
    // ✅ Send file to backend
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ Backend returns metadata: rows, columns, features
    const payload = {
      dataSource: file.name,
      format: res.data.format,
      rows: res.data.rows,
      columns: res.data.columns,
      features: res.data.features,
      loaded: true,
    };

    onDataUpdate?.(payload);

    toast({
      title: "File Uploaded",
      description: `${res.data.rows} rows, ${res.data.columns} columns`,
    });
  } catch (err: any) {
    toast({
      title: "Upload Error",
      description: err.message || "Could not upload file",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // ---------- Input change ----------
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ---------- Load from URL / path ----------
  const loadData = async () => {
    if (!dataSource) {
      toast({
        title: "Missing Data Source",
        description: "Enter a file path, URL, or upload a file",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const mockData = {
      dataSource,
      format,
      rows: 1000,
      columns: 8,
      loaded: true,
      features: ["Feature A", "Feature B", "Feature C", "Feature D", "Target"],
    };

    onDataUpdate?.(mockData);
    setLoading(false);
    toast({
      title: "Data Loaded (mock)",
      description: `${mockData.rows} rows and ${mockData.columns} columns`,
    });
  };

  return (
    <div className="space-y-5">
      {/* ==== File Upload Zone ==== */}
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          loading ? "opacity-50" : "hover:border-primary"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.json,.xlsx,.xls"
          className="hidden"
          onChange={onFileChange}
          disabled={loading}
        />
        <p className="text-sm text-muted-foreground">
          {fileName
            ? `Selected: ${fileName}`
            : "Drag & drop a file here, or click to select"}
        </p>
        <Button
          variant="outline"
          className="mt-3"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          Choose File
        </Button>
      </div>

      {/* ==== URL / Path Input ==== */}
      <div className="space-y-2">
        <Label htmlFor="data-source">or enter URL / Path</Label>
        <Input
          id="data-source"
          placeholder="https://example.com/data.csv or ./data/file.csv"
          value={dataSource}
          onChange={(e) => setDataSource(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* ==== Format selector (auto-detected when file uploaded) ==== */}
      <div className="space-y-2">
        <Label htmlFor="data-format">Format</Label>
        <select
          id="data-format"
          className="w-full p-2 border rounded-md bg-background"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          disabled={loading}
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
          <option value="excel">Excel (xlsx/xls)</option>
        </select>
      </div>

      {/* ==== Load button ==== */}
      <Button
        className="w-full"
        onClick={loadData}
        disabled={loading || !!fileName}
      >
        {loading ? "Loading..." : "Load Data"}
      </Button>

      {/* ==== Data Summary ==== */}
      {itemData?.loaded && (
        <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">Data Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Rows:</span>
              <span className="ml-2 font-semibold">{itemData.rows}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Columns:</span>
              <span className="ml-2 font-semibold">{itemData.columns}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Features: {itemData.features?.join(", ")}
          </div>
        </div>
      )}

      {/* ==== Preview Table (only for uploaded files) ==== */}
      {preview.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">Preview (first 5 rows)</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead className="bg-muted">
                <tr>
                  {Object.keys(preview[0]).map((k) => (
                    <th key={k} className="px-2 py-1 text-left text-xs">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t">
                    {Object.values(row).map((v: any, j) => (
                      <td key={j} className="px-2 py-1 text-xs">
                        {String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


// import { useState, useRef, useCallback } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { toast } from "@/hooks/use-toast";
// import  api  from "@/api"; // Axios instance

// interface DataInputModalProps {
//   onUploadSuccess?: (data: any) => void;
// }

// export const DataInputModal = ({ onUploadSuccess }: DataInputModalProps) => {
//   const [loading, setLoading] = useState(false);
//   const [fileName, setFileName] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dropZoneRef = useRef<HTMLDivElement>(null);

//   // ---- Upload file to backend ----
//   const handleFileUpload = async (file: File) => {
//     if (!file) return;

//     setFileName(file.name);
//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("file", file);

//       const res = await api.post("/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       toast({
//         title: "File Uploaded",
//         description: res.data.message || `${file.name} uploaded successfully.`,
//       });

//       onUploadSuccess?.(res.data);
//     } catch (err: any) {
//       toast({
//         title: "Upload Failed",
//         description: err.message || "Could not upload the file.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- Drag & Drop ----
//   const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     handleFileUpload(file);
//   }, []);

//   const onDragOver = (e: React.DragEvent) => e.preventDefault();

//   // ---- File Input ----
//   const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) handleFileUpload(file);
//   };

//   return (
//     <div className="space-y-5">
//       {/* ==== File Upload Zone ==== */}
//       <div
//         ref={dropZoneRef}
//         className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//           loading ? "opacity-50" : "hover:border-primary"
//         }`}
//         onDrop={onDrop}
//         onDragOver={onDragOver}
//       >
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept=".csv,.json,.xlsx,.xls"
//           className="hidden"
//           onChange={onFileChange}
//           disabled={loading}
//         />
//         <p className="text-sm text-muted-foreground">
//           {fileName
//             ? `Selected: ${fileName}`
//             : "Drag & drop a file here, or click to select"}
//         </p>
//         <Button
//           variant="outline"
//           className="mt-3"
//           onClick={() => fileInputRef.current?.click()}
//           disabled={loading}
//         >
//           {loading ? "Uploading..." : "Choose File"}
//         </Button>
//       </div>

//       {/* Optional: file name summary */}
//       {fileName && (
//         <div className="text-sm text-muted-foreground text-center">
//           Uploaded file: <span className="font-semibold">{fileName}</span>
//         </div>
//       )}
//     </div>
//   );
// };
