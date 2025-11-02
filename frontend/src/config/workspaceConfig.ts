import { Search, Target, Cpu } from "lucide-react";

export const workspaceConfig: Record<string, any> = {
  "data-insight": {
    title: "Data Insight",
    icon: Search,
    color: "hsl(var(--workspace-data-insight))",
    tools: [
      {
        category: "Analysis Tools",
        items: [
          { id: "data-input", label: "Data Input", icon: "Database", color: "hsl(var(--tool-blue))" },
          { id: "correlation", label: "Correlation Matrix", icon: "GitBranch", color: "hsl(var(--tool-purple))" },
          { id: "data-plot", label: "Data Plot", icon: "BarChart3", color: "hsl(var(--tool-pink))" },
          { id: "ai-summarizer", label: "AI Summarizer", icon: "Brain", color: "hsl(var(--tool-purple))" },
          { id: "data-chat", label: "Data Chat", icon: "MessageSquare", color: "hsl(var(--tool-cyan))" },
          { id: "ai-suggestions", label: "AI Suggestions", icon: "Lightbulb", color: "hsl(var(--tool-yellow))" },
        ],
      },
    ],
  },
  "model-trainer": {
    title: "Model Trainer",
    icon: Target,
    color: "hsl(var(--workspace-model-trainer))",
    tools: [
      {
        category: "ML Models",
        items: [
          { id: "data-input", label: "Data Input", icon: "Database", color: "hsl(var(--tool-blue))" },
          { id: "xgboost", label: "XGBoost", icon: "Zap", color: "hsl(var(--tool-green))" },
          { id: "random-forest", label: "Random Forest", icon: "Trees", color: "hsl(var(--tool-cyan))" },
          { id: "neural-network", label: "Neural Network", icon: "Network", color: "hsl(var(--tool-purple))" },
          { id: "svm", label: "SVM", icon: "Shapes", color: "hsl(var(--tool-orange))" },
        ],
      },
      {
        category: "Auxiliary",
        items: [
          { id: "predict", label: "Predict", icon: "Activity", color: "hsl(var(--tool-cyan))" },
          { id: "visualization", label: "Visualization", icon: "PieChart", color: "hsl(var(--tool-pink))" },
          { id: "output", label: "Output", icon: "Download", color: "hsl(var(--tool-blue))" },
        ],
      },
    ],
  },
  optimizer: {
    title: "Black-Box Optimizer",
    icon: Cpu,
    color: "hsl(var(--workspace-optimizer))",
    tools: [
      {
        category: "Optimization Algorithms",
        items: [
          { id: "bayesian", label: "Bayesian Optimization", icon: "Target", color: "hsl(var(--tool-cyan))" },
          { id: "nsga", label: "NSGA-II", icon: "Network", color: "hsl(var(--tool-purple))" },
          { id: "pso", label: "PSO", icon: "Sparkles", color: "hsl(var(--tool-orange))" },
          { id: "genetic", label: "Genetic Algorithm", icon: "Dna", color: "hsl(var(--tool-green))" },
        ],
      },
      {
        category: "Analysis",
        items: [
          { id: "pareto", label: "Pareto Front", icon: "TrendingUp", color: "hsl(var(--tool-pink))" },
          { id: "convergence", label: "Convergence Plot", icon: "LineChart", color: "hsl(var(--tool-blue))" },
        ],
      },
    ],
  },
};
