import { CanvasItem } from "@/pages/Workspace";

interface ConnectionLinesProps {
  items: CanvasItem[];
}

export const ConnectionLines = ({ items }: ConnectionLinesProps) => {
  if (items.length < 2) return null;

  // Connect each item to the previous one in order
  const connections = items.slice(1).map((item, idx) => ({
    from: items[idx],
    to: item,
  }));

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    >
      {connections.map((conn, idx) => {
        const x1 = conn.from.x + 90; // Center of from node
        const y1 = conn.from.y + 30;
        const x2 = conn.to.x + 90; // Center of to node
        const y2 = conn.to.y + 30;

        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        );
      })}
    </svg>
  );
};
