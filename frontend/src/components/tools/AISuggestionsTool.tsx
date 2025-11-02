import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const AISuggestionsTool = ({}: ToolProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Suggestion Categories</Label>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Data Quality</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Feature Engineering</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span>Model Selection</span>
          </label>
        </div>
      </div>
      <Button className="w-full">Get Suggestions</Button>
    </div>
  );
};
