import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const PredictionTool = ({ itemData, connectedItems, onDataUpdate }: ToolProps) => {
  const [predicting, setPredicting] = useState(false);

  const runPrediction = async () => {
    // Find trained model from connected tools
    const trainedModel = connectedItems?.find(item => 
      (item.type === "xgboost" || item.type === "random-forest" || item.type === "svm" || item.type === "neural-network") 
      && item.data?.trained
    );

    if (!trainedModel) {
      toast({
        title: "No Trained Model",
        description: "Please connect and train a model first",
        variant: "destructive",
      });
      return;
    }

    setPredicting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const results = {
      modelType: trainedModel.type,
      accuracy: trainedModel.data.accuracy || trainedModel.data.trainAccuracy,
      r2Score: trainedModel.data.r2Score || trainedModel.data.valAccuracy,
      predictions: trainedModel.data.predictions || Array.from({ length: 15 }, () => ({
        input: Array.from({ length: 4 }, () => (Math.random() * 10).toFixed(2)),
        predicted: (Math.random() * 100).toFixed(2),
        confidence: (0.7 + Math.random() * 0.3).toFixed(3),
      })),
      completed: true,
    };

    onDataUpdate?.(results);
    setPredicting(false);

    toast({
      title: "Predictions Generated",
      description: `Using ${trainedModel.label} model`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Connected Model</Label>
        <Input 
          value={connectedItems?.find(item => item.data?.trained)?.label || "No model connected"}
          disabled
          className="bg-muted"
        />
      </div>

      <Button className="w-full" onClick={runPrediction} disabled={predicting}>
        {predicting ? "Running Predictions..." : "Run Predictions"}
      </Button>

      {itemData?.completed && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-sm">Model Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Accuracy Score</p>
              <p className="text-2xl font-bold text-green-600">{itemData.accuracy}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">R² Score</p>
              <p className="text-2xl font-bold text-blue-600">{itemData.r2Score}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Prediction Results (First 10)</h4>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-xs border">
                <thead className="sticky top-0 bg-background">
                  <tr className="bg-muted">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Predicted Value</th>
                    <th className="border p-2">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {itemData.predictions.slice(0, 10).map((pred: any, i: number) => (
                    <tr key={i}>
                      <td className="border p-2 text-center">{i + 1}</td>
                      <td className="border p-2 text-center font-semibold">
                        {pred.predicted || pred.actual}
                      </td>
                      <td className="border p-2 text-center">
                        <span className={`inline-block px-2 py-1 rounded ${
                          parseFloat(pred.confidence || "0.8") > 0.85 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {((parseFloat(pred.confidence || "0.8") * 100).toFixed(1))}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
