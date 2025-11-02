import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const SVMTool = ({}: ToolProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Kernel</Label>
        <select className="w-full p-2 border rounded-md bg-background">
          <option value="rbf">RBF</option>
          <option value="linear">Linear</option>
          <option value="poly">Polynomial</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="c-param">C Parameter</Label>
        <Input id="c-param" type="number" placeholder="1.0" step="0.1" />
      </div>
      <Button className="w-full">Train SVM</Button>
    </div>
  );
};
