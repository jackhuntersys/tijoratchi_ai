import { DataInputTool } from "./DataInputTool";
import { CorrelationMatrixTool } from "./CorrelationMatrixTool";
import { DataPlotTool } from "./DataPlotTool";
import { AISummarizerTool } from "./AISummarizerTool";
import { DataChatTool } from "./DataChatTool";
import { AISuggestionsTool } from "./AISuggestionsTool";
import { XGBoostTool } from "./XGBoostTool";
import { RandomForestTool } from "./RandomForestTool";
import { NeuralNetworkTool } from "./NeuralNetworkTool";
import { SVMTool } from "./SVMTool";
import { PredictionTool } from "./PredictionTool";

export const ToolRegistry: Record<string, React.ComponentType<any>> = {
  "data-input": DataInputTool,
  "correlation": CorrelationMatrixTool,
  "data-plot": DataPlotTool,
  "ai-summarizer": AISummarizerTool,
  "data-chat": DataChatTool,
  "ai-suggestions": AISuggestionsTool,
  "xgboost": XGBoostTool,
  "random-forest": RandomForestTool,
  "neural-network": NeuralNetworkTool,
  "svm": SVMTool,
  "predict": PredictionTool,
};
