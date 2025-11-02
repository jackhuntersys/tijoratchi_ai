import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ToolProps {
  itemId?: string;
  itemData?: any;
  connectedItems?: any[];
  onDataUpdate?: (data: any) => void;
}

export const NeuralNetworkTool = ({}: ToolProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hidden-layers">Hidden Layers</Label>
        <Input id="hidden-layers" placeholder="64,32,16" />
      </div>
      <div className="space-y-2">
        <Label>Activation Function</Label>
        <select className="w-full p-2 border rounded-md bg-background">
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="epochs">Epochs</Label>
        <Input id="epochs" type="number" placeholder="100" />
      </div>
      <Button className="w-full">Train Network</Button>
    </div>
  );
};
