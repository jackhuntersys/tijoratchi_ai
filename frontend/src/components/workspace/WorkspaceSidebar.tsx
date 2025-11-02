import * as Icons from "lucide-react";

interface Tool {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface WorkspaceSidebarProps {
  tools: {
    category: string;
    items: Tool[];
  }[];
  onDragStart: (tool: Tool) => void;
}

export const WorkspaceSidebar = ({ tools, onDragStart }: WorkspaceSidebarProps) => {
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Box;
    return Icon;
  };

  return (
    <aside className="w-64 border-r bg-card overflow-y-auto">
      <div className="p-4">
        {tools.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              {section.category}
            </h3>
            <div className="space-y-2">
              {section.items.map((tool) => {
                const Icon = getIcon(tool.icon);
                return (
                  <div
                    key={tool.id}
                    draggable
                    onDragStart={() => onDragStart(tool)}
                    className="p-3 rounded-xl border-2 cursor-move hover:shadow-md transition-all duration-200 bg-card"
                    style={{ borderColor: tool.color }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" style={{ color: tool.color }} />
                      <span className="text-sm font-medium">{tool.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
