// import { useState } from "react";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { toast } from "@/hooks/use-toast";

// interface ToolProps {
//   itemId?: string;
//   itemData?: any;
//   connectedItems?: any[];
//   onDataUpdate?: (data: any) => void;
// }

// export const XGBoostTool = ({ itemData, connectedItems, onDataUpdate }: ToolProps) => {
//   const [learningRate, setLearningRate] = useState(itemData?.learningRate || 0.1);
//   const [maxDepth, setMaxDepth] = useState(itemData?.maxDepth || 6);
//   const [nEstimators, setNEstimators] = useState(itemData?.nEstimators || 100);
//   const [training, setTraining] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const trainModel = async () => {
//   const inputData = connectedItems?.find(item => item.type === "data-input")?.data;

//   if (!inputData) {
//     toast({
//       title: "No Input Data",
//       description: "Please connect a Data Input tool first",
//       variant: "destructive",
//     });
//     return;
//   }

//   setTraining(true);
//   setProgress(0);

//   try {
//     // Step 1: Show progress animation
//     for (let i = 0; i <= 90; i += 10) {
//       await new Promise(resolve => setTimeout(resolve, 150));
//       setProgress(i);
//     }

//     // Step 2: Send request to backend
//     const response = await fetch("http://localhost:5000/xgboost", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         learningRate,
//         maxDepth,
//         nEstimators
//       }),
//     });

//     const data = await response.json();

//     if (!data.success) {
//       throw new Error(data.error || "Backend error");
//     }

//     setProgress(100);

//     const results = {
//       learningRate,
//       maxDepth,
//       nEstimators,
//       trained: true,
//       accuracy: data.accuracy.toFixed(4),
//       r2Score: data.r2Score.toFixed(4),
//       predictions: data.predictions,
//       featureImportance: data.featureImportance,
//     };

//     onDataUpdate?.(results);
//     toast({
//       title: "Model Trained Successfully",
//       description: `Accuracy: ${results.accuracy}, R² Score: ${results.r2Score}`,
//     });
//   } catch (err: any) {
//     toast({
//       title: "Training Failed",
//       description: err.message,
//       variant: "destructive",
//     });
//   } finally {
//     setTraining(false);
//   }
// };


//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="learning-rate">Learning Rate</Label>
//         <Input 
//           id="learning-rate" 
//           type="number" 
//           placeholder="0.1" 
//           step="0.01"
//           value={learningRate}
//           onChange={(e) => setLearningRate(parseFloat(e.target.value))}
//           disabled={training}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="max-depth">Max Depth</Label>
//         <Input 
//           id="max-depth" 
//           type="number" 
//           placeholder="6"
//           value={maxDepth}
//           onChange={(e) => setMaxDepth(parseInt(e.target.value))}
//           disabled={training}
//         />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="n-estimators">N Estimators</Label>
//         <Input 
//           id="n-estimators" 
//           type="number" 
//           placeholder="100"
//           value={nEstimators}
//           onChange={(e) => setNEstimators(parseInt(e.target.value))}
//           disabled={training}
//         />
//       </div>

//       {training && (
//         <div className="space-y-2">
//           <Label>Training Progress</Label>
//           <Progress value={progress} />
//           <p className="text-xs text-muted-foreground text-center">{progress}%</p>
//         </div>
//       )}

//       <Button className="w-full" onClick={trainModel} disabled={training}>
//         {training ? "Training..." : "Train Model"}
//       </Button>

//       {itemData?.trained && (
//         <div className="mt-6 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="p-3 bg-muted rounded-lg">
//               <p className="text-xs text-muted-foreground">Accuracy</p>
//               <p className="text-lg font-bold">{itemData.accuracy}</p>
//             </div>
//             <div className="p-3 bg-muted rounded-lg">
//               <p className="text-xs text-muted-foreground">R² Score</p>
//               <p className="text-lg font-bold">{itemData.r2Score}</p>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <h4 className="font-semibold text-sm">Feature Importance</h4>
//             {itemData.featureImportance.map((item: any, i: number) => (
//               <div key={i} className="flex items-center gap-2">
//                 <span className="text-xs w-20">{item.feature}</span>
//                 <Progress value={parseFloat(item.importance) * 100} className="flex-1" />
//                 <span className="text-xs w-12 text-right">{item.importance}</span>
//               </div>
//             ))}
//           </div>

//           <div className="space-y-2">
//             <h4 className="font-semibold text-sm">Sample Predictions (First 5)</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs border">
//                 <thead>
//                   <tr className="bg-muted">
//                     <th className="border p-2">Actual</th>
//                     <th className="border p-2">Predicted</th>
//                     <th className="border p-2">Error</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {itemData.predictions.slice(0, 5).map((pred: any, i: number) => {
//                     const error = Math.abs(parseFloat(pred.actual) - parseFloat(pred.predicted)).toFixed(2);
//                     return (
//                       <tr key={i}>
//                         <td className="border p-2 text-center">{pred.actual}</td>
//                         <td className="border p-2 text-center">{pred.predicted}</td>
//                         <td className="border p-2 text-center">{error}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };



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

export const XGBoostTool = ({ itemData, connectedItems, onDataUpdate }: ToolProps) => {
  const [learningRate, setLearningRate] = useState(itemData?.learningRate || 0.1);
  const [maxDepth, setMaxDepth] = useState(itemData?.maxDepth || 6);
  const [nEstimators, setNEstimators] = useState(itemData?.nEstimators || 100);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(itemData || null);

  const trainModel = async () => {
    const inputData = connectedItems?.find(item => item.type === "data-input")?.data;

    if (!inputData) {
      toast({
        title: "No Input Data",
        description: "Please connect a Data Input tool first",
        variant: "destructive",
      });
      return;
    }

    setTraining(true);
    setProgress(0);

    try {
      // simulate progress bar animation
      for (let i = 0; i <= 90; i += 10) {
        await new Promise(res => setTimeout(res, 150));
        setProgress(i);
      }

      const res = await fetch("http://localhost:5000/xgboost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learningRate, maxDepth, nEstimators }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Training failed");

      setProgress(100);

      const resultData = {
        learningRate,
        maxDepth,
        nEstimators,
        trained: true,
        task: data.task,
        accuracy: data.accuracy != null ? Number(data.accuracy).toFixed(4) : "-",
        r2Score: data.r2Score != null ? Number(data.r2Score).toFixed(4) : "-",
        predictions: data.predictions,
        featureImportance: data.featureImportance,
};


      setResults(resultData);
      onDataUpdate?.(resultData);

      toast({
        title: "Model Trained Successfully",
        description: `Accuracy: ${resultData.accuracy}, R² Score: ${resultData.r2Score}`,
      });
    } catch (err: any) {
      toast({
        title: "Training Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setTraining(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="learning-rate">Learning Rate</Label>
        <Input
          id="learning-rate"
          type="number"
          step="0.01"
          value={learningRate}
          onChange={(e) => setLearningRate(parseFloat(e.target.value))}
          disabled={training}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-depth">Max Depth</Label>
        <Input
          id="max-depth"
          type="number"
          value={maxDepth}
          onChange={(e) => setMaxDepth(parseInt(e.target.value))}
          disabled={training}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="n-estimators">N Estimators</Label>
        <Input
          id="n-estimators"
          type="number"
          value={nEstimators}
          onChange={(e) => setNEstimators(parseInt(e.target.value))}
          disabled={training}
        />
      </div>

      {training && (
        <div className="space-y-2">
          <Label>Training Progress</Label>
          <Progress value={progress} />
          <p className="text-xs text-center text-muted-foreground">{progress}%</p>
        </div>
      )}

      <Button className="w-full" onClick={trainModel} disabled={training}>
        {training ? "Training..." : "Train Model"}
      </Button>

      {/* ==== Display Results ==== */}
      {results?.trained && (
        <div className="mt-6 space-y-4">
         
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-lg font-bold">
                  {results.task === "classification" && results.accuracy != null
                    ? results.accuracy
                    : "-"}
                </p>
              </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">R² Score</p>
              <p className="text-lg font-bold">
                {results.task === "regression" && results.r2Score != null
                  ? results.r2Score
                  : "-"}
              </p>
            </div>

            <div> Learning rate - {results.learningRate} , Max Depth - {results.maxDepth} , Estimators -  {results.nEstimators}</div>
          </div>

                  {/* feature importance */}
          {/* <div className="space-y-2">
            <h4 className="font-semibold text-sm">Feature Importance</h4>
            {results.featureImportance.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-24">{item.feature}</span>
                <Progress value={parseFloat(item.importance) * 100} className="flex-1" />
                <span className="text-xs w-12 text-right">{item.importance}</span>
              </div>
            ))}
          </div> */}
                {/* ## sample predictions  */}

          {/* <div className="space-y-2">
            <h4 className="font-semibold text-sm">Sample Predictions</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2">Actual</th>
                    <th className="border p-2">Predicted</th>
                    <th className="border p-2">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {results.predictions.slice(0, 5).map((pred: any, i: number) => {
                    const error = Math.abs(pred.actual - pred.predicted).toFixed(2);
                    return (
                      <tr key={i}>
                        <td className="border p-2 text-center">{pred.actual != null ? Number(pred.actual).toFixed(2) : "-"}</td>
                        <td className="border p-2 text-center">{pred.predicted != null ? Number(pred.predicted).toFixed(2) : "-"}</td>
                        <td className="border p-2 text-center">{error}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};
