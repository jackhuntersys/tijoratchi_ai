import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkspaceSidebar } from "@/components/workspace/WorkspaceSidebar";
import { CanvasNode } from "@/components/workspace/CanvasNode";
import { ConnectionLines } from "@/components/workspace/ConnectionLines";
import { workspaceConfig } from "@/config/workspaceConfig";
import { ToolRegistry } from "@/components/tools/ToolRegistry";

export interface CanvasItem {
  id: string;
  type: string;
  label: string;
  color: string;
  icon: string;
  x: number;
  y: number;
  data?: any; // Store tool-specific data and results
}

const Workspace = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<CanvasItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const config = workspaceId ? workspaceConfig[workspaceId] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" && selectedItem) {
        setItems(items.filter((item) => item.id !== selectedItem));
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, items]);

  const handleDragStart = (tool: any) => {
    setDraggedItem(tool);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem: CanvasItem = {
      id: `${draggedItem.id}-${Date.now()}`,
      type: draggedItem.id,
      label: draggedItem.label,
      color: draggedItem.color,
      icon: draggedItem.icon,
      x,
      y,
    };

    setItems([...items, newItem]);
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemDoubleClick = (item: CanvasItem) => {
    setModalItem(item);
  };

  const handleItemMove = (id: string, x: number, y: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, x, y } : item)));
  };

  const handleToolDataUpdate = (id: string, data: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, data } : item)));
  };

  const getConnectedItems = (itemId: string) => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    return items.slice(0, itemIndex);
  };

  if (!config) {
    return <div>Workspace not found</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <config.icon className="h-5 w-5" style={{ color: config.color }} />
            <h1 className="text-lg font-bold">{config.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default">Save</Button>
          <Button variant="outline">Train Model</Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <WorkspaceSidebar
          tools={config.tools}
          onDragStart={handleDragStart}
        />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 bg-background p-8 overflow-auto relative"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Database className="h-20 w-20 mb-4 opacity-20" />
              <h3 className="text-2xl font-semibold mb-2">
                {config.title === "Data Insight" ? "Start Analyzing" : "Start Building"}
              </h3>
              <p className="text-center">
                {config.title === "Data Insight"
                  ? "Drag analysis tools onto the canvas"
                  : "Drag ML blocks onto the canvas"}
              </p>
            </div>
          ) : (
            <>
              <ConnectionLines items={items} />
              {items.map((item) => (
                <CanvasNode
                  key={item.id}
                  item={item}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                  onMove={handleItemMove}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!modalItem} onOpenChange={() => setModalItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{modalItem?.label}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            {modalItem && ToolRegistry[modalItem.type] ? (
              (() => {
                const ToolComponent = ToolRegistry[modalItem.type];
                const connectedItems = getConnectedItems(modalItem.id);
                return (
                  <ToolComponent 
                    itemId={modalItem.id}
                    itemData={modalItem.data}
                    connectedItems={connectedItems}
                    onDataUpdate={(data: any) => handleToolDataUpdate(modalItem.id, data)}
                  />
                );
              })()
            ) : (
              <div className="bg-muted p-6 rounded-lg">
                <p className="text-sm text-center">
                  Tool configuration interface would go here
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tip */}
      <div className="border-t bg-card px-6 py-2 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold">💡 Tip</span>
        <span>Hold Shift to connect. Del to delete.</span>
      </div>
    </div>
  );
};

export default Workspace;
