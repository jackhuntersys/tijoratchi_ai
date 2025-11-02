import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const DataChatTool = ({}: ToolProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Chat History</Label>
        <Textarea placeholder="Conversation with your data..." rows={8} readOnly />
      </div>
      <div className="flex gap-2">
        <Input placeholder="Ask a question about your data..." />
        <Button>Send</Button>
      </div>
    </div>
  );
};
