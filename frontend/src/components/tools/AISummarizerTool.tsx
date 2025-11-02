import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const AISummarizerTool = ({}: ToolProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Summary Type</Label>
        <select className="w-full p-2 border rounded-md bg-background">
          <option value="brief">Brief Overview</option>
          <option value="detailed">Detailed Analysis</option>
          <option value="insights">Key Insights</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label>Output</Label>
        <Textarea placeholder="AI-generated summary will appear here..." rows={6} />
      </div>
      <Button className="w-full">Generate Summary</Button>
    </div>
  );
};
