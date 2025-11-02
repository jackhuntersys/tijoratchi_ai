import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const CorrelationMatrixTool = ({
  itemData,
  connectedItems,
  onDataUpdate,
}: ToolProps) => {
  const [method, setMethod] = useState(itemData?.method || "pearson");
  const [plotType, setPlotType] = useState(itemData?.plotType || "heatmap");
  const [loading, setLoading] = useState(false);
  const [matrixData, setMatrixData] = useState<any | null>(itemData || null);

  const generateMatrix = async () => {
    // Ensure there is uploaded data first
    const inputData = connectedItems?.find((item) => item.type === "data-input")?.data;
    if (!inputData) {
      toast({
        title: "No Input Data",
        description: "Please upload a dataset first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:5000/correlation", {
        params: { method },
      });

      const corr = res.data.correlation;
      const features = Object.keys(corr);
      const matrix = features.map((r) => features.map((c) => corr[r][c]?.toFixed(2)));

      const results = {
        method,
        plotType,
        features,
        matrix,
        file: res.data.file,
        generated: true,
      };

      setMatrixData(results);
      onDataUpdate?.(results);

      toast({
        title: "Correlation Matrix Generated",
        description: `File: ${res.data.file} (${method})`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to fetch correlation data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ====== Method Selector ====== */}
      <div className="space-y-2">
        <Label>Correlation Method</Label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value="pearson">Pearson</option>
          <option value="spearman">Spearman</option>
          <option value="kendall">Kendall</option>
        </select>
      </div>

      {/* ====== Plot Type Selector ====== */}
      <div className="space-y-2">
        <Label>Plot Type</Label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={plotType}
          onChange={(e) => setPlotType(e.target.value)}
        >
          <option value="heatmap">Heatmap</option>
          <option value="scatter">Scatter Matrix</option>
          <option value="network">Network Graph</option>
        </select>
      </div>

      {/* ====== Generate Button ====== */}
      <Button className="w-full" onClick={generateMatrix} disabled={loading}>
        {loading ? "Generating..." : "Generate Matrix"}
      </Button>

      {/* ====== Display Correlation Table ====== */}
      {matrixData?.generated && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-sm">
            Correlation Matrix ({matrixData.method})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2"></th>
                  {matrixData.features.map((f: string, i: number) => (
                    <th key={i} className="border p-2">
                      {f}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.features.map((f: string, i: number) => (
                  <tr key={i}>
                    <td className="border p-2 font-semibold bg-muted">{f}</td>
                    {matrixData.matrix[i].map((val: string, j: number) => {
                      const numVal = parseFloat(val);
                      const color =
                        numVal > 0.7
                          ? "bg-green-200"
                          : numVal < -0.7
                          ? "bg-red-200"
                          : "bg-white";
                      return (
                        <td
                          key={j}
                          className={`border p-2 text-center ${color}`}
                        >
                          {val}
                        </td>
                      );
                    })}
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

