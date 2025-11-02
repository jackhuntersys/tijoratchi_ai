import { useNavigate } from "react-router-dom";
import { Search, Target, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const workspaces = [
  {
    id: "data-insight",
    title: "Data Insight",
    description: "Explore, analyze, and understand your data",
    icon: Search,
    color: "hsl(var(--workspace-data-insight))",
    tools: ["Correlation Matrix", "Data Plot", "AI Summarizer", "+2 more"],
    route: "/workspace/data-insight",
  },
  {
    id: "model-trainer",
    title: "Model Trainer",
    description: "Build and train machine learning models",
    icon: Target,
    color: "hsl(var(--workspace-model-trainer))",
    tools: ["XGBoost", "Random Forest", "Neural Network", "+2 more"],
    route: "/workspace/model-trainer",
  },
  {
    id: "optimizer",
    title: "Black-Box Optimizer",
    description: "Multi-objective optimization for complex problems",
    icon: Cpu,
    color: "hsl(var(--workspace-optimizer))",
    tools: ["Bayesian Optimization", "NSGA-II", "PSO", "+2 more"],
    route: "/workspace/optimizer",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center gap-3 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Cpu className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ML Platform</h1>
            <p className="text-xs text-muted-foreground">Select a workspace</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-16">
        <div className="mx-auto max-w-4xl text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Choose Your Workspace</h2>
          <p className="text-xl text-muted-foreground">
            Select a canvas to start working on your ML project
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {workspaces.map((workspace) => {
            const Icon = workspace.icon;
            return (
              <Card
                key={workspace.id}
                className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: workspace.color }}
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{workspace.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {workspace.description}
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                      Available Tools
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {workspace.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-xs px-2 py-1 bg-muted rounded-md"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full text-base py-6"
                    style={{ backgroundColor: workspace.color }}
                    onClick={() => navigate(workspace.route)}
                  >
                    Open Workspace →
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
