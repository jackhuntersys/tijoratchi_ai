import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const RandomForestTool = ({ connectedItems, onDataUpdate }: ToolProps) => {
  const [nEstimators, setNEstimators] = useState(100);
  const [maxDepth, setMaxDepth] = useState<number | null>(null);
  const [minSamplesSplit, setMinSamplesSplit] = useState(2);
  const [minSamplesLeaf, setMinSamplesLeaf] = useState(1);
  const [maxFeatures, setMaxFeatures] = useState("auto");
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const trainModel = async () => {
    setTraining(true);
    setProgress(10);

    try {
      const response = await fetch("http://localhost:5000/randomforest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n_estimators: nEstimators,
          max_depth: maxDepth,
          min_samples_split: minSamplesSplit,
          min_samples_leaf: minSamplesLeaf,
          max_features: maxFeatures,
        }),
      });

      if (!response.ok) throw new Error("Training failed");

      const data = await response.json();
      setProgress(100);
      setResults(data);
      onDataUpdate?.(data);

      toast({
        title: "Model Trained Successfully",
        description:
          data.task === "classification"
            ? `Accuracy: ${data.accuracy}`
            : `R² Score: ${data.r2Score}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to train Random Forest model.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Parameters */}
      <div className="space-y-2">
        <Label htmlFor="n-estimators">Number of Trees (estimators)</Label>
        <Input
          id="n-estimators"
          type="number"
          value={nEstimators}
          onChange={(e) => setNEstimators(parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-depth">Max depth of each tree</Label>
        <Input
          id="max-depth"
          type="number"
          value={maxDepth ?? ""}
          onChange={(e) =>
            setMaxDepth(e.target.value ? parseInt(e.target.value) : null)
          }
          placeholder="None"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="min_samples_split">Min samples to split a node</Label>
        <Input
          id="min_samples_split"
          type="number"
          value={minSamplesSplit}
          onChange={(e) => setMinSamplesSplit(parseInt(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="min_samples_leaf">Min samples at a leaf</Label>
        <Input
          id="min_samples_leaf"
          type="number"
          value={minSamplesLeaf}
          onChange={(e) => setMinSamplesLeaf(parseInt(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-features">Max Features</Label>
        <select
          className="w-full p-2 border rounded-md bg-background"
          value={maxFeatures}
          onChange={(e) => setMaxFeatures(e.target.value)}
        >
          <option value="auto">Auto</option>
          <option value="sqrt">Sqrt</option>
          <option value="log2">Log2</option>
        </select>
      </div>

      {/* Train button */}
      <Button className="w-full" onClick={trainModel} disabled={training}>
        {training ? "Training..." : "Train Model"}
      </Button>

      {training && <Progress value={progress} />}

      {/* Results */}
      {results && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Accuracy</p>
              <p className="text-lg font-bold">
                {results.task === "classification" ? results.accuracy : "-"}
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">R² Score</p>
              <p className="text-lg font-bold">
                {results.task === "regression" ? results.r2Score : "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
