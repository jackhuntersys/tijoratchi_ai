// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";

// interface ToolProps {
//   itemId?: string;
//   itemData?: any;
//   connectedItems?: any[];
//   onDataUpdate?: (data: any) => void;
// }

// export const DataPlotTool = ({}: ToolProps) => {
//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label>Plot Type</Label>
//         <select className="w-full p-2 border rounded-md bg-background">
//           <option value="scatter">Scatter Plot</option>
//           <option value="line">Line Chart</option>
//           <option value="bar">Bar Chart</option>
//           <option value="histogram">Histogram</option>
//         </select>
//       </div>
//       <Button className="w-full">Generate Plot</Button>
//     </div>
//   );
// };



import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const DataPlotTool = ({ itemData, onDataUpdate }: ToolProps) => {
  const [plotType, setPlotType] = useState("histogram");
  const [xFeature, setXFeature] = useState("");
  const [yFeature, setYFeature] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generatePlot = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plotType, x: xFeature, y: yFeature }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.statusText}`);

      const blob = await res.blob();
      const imageObjectUrl = URL.createObjectURL(blob);
      setImageUrl(imageObjectUrl);

      toast({
        title: "Plot Generated",
        description: `Plot type: ${plotType}`,
      });

      onDataUpdate?.({ plotType, imageUrl: imageObjectUrl, generated: true });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Plot Type</Label>
        <select
          value={plotType}
          onChange={(e) => setPlotType(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="histogram">Histogram</option>
          <option value="scatter">Scatter</option>
          <option value="box">Box Plot</option>
          <option value="heatmap">Heatmap</option>
        </select>
      </div>

      {plotType === "scatter" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>X Axis</Label>
            <input
              value={xFeature}
              onChange={(e) => setXFeature(e.target.value)}
              placeholder="e.g. sepal_length"
              className="w-full border p-1 rounded-md"
            />
          </div>
          <div>
            <Label>Y Axis</Label>
            <input
              value={yFeature}
              onChange={(e) => setYFeature(e.target.value)}
              placeholder="e.g. sepal_width"
              className="w-full border p-1 rounded-md"
            />
          </div>
        </div>
      )}

      <Button className="w-full" onClick={generatePlot} disabled={loading}>
        {loading ? "Generating..." : "Generate Plot"}
      </Button>

      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Generated Plot"
            className="w-full rounded-lg border shadow"
          />
        </div>
      )}
    </div>
  );
};
