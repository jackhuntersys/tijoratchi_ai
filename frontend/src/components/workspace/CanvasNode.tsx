import { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { CanvasItem } from "@/pages/Workspace";

interface CanvasNodeProps {
  item: CanvasItem;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onMove: (id: string, x: number, y: number) => void;
}

export const CanvasNode = ({
  item,
  isSelected,
  onSelect,
  onDoubleClick,
  onMove,
}: CanvasNodeProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, offsetX: 0, offsetY: 0 });

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Box;
    return Icon;
  };

  const Icon = getIcon(item.icon);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: item.x,
      offsetY: item.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      onMove(item.id, dragRef.current.offsetX + dx, dragRef.current.offsetY + dy);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, item.id, onMove])

  return (
    <div
      className={`absolute p-4 rounded-xl border-2 bg-card cursor-move shadow-md transition-all ${
        isSelected ? "ring-2 ring-primary ring-offset-2" : ""
      }`}
      style={{
        left: item.x,
        top: item.y,
        borderColor: item.color,
        minWidth: "180px",
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6" style={{ color: item.color }} />
        <span className="font-medium">{item.label}</span>
      </div>
    </div>
  );
};
