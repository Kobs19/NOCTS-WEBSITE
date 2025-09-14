import { Button } from "@/components/ui/button";

interface PumpSelectorProps {
  selectedPump: number | null;
  onPumpSelect: (pumpNumber: number) => void;
}

const PumpSelector = ({ selectedPump, onPumpSelect }: PumpSelectorProps) => {
  const pumps = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-3 gap-4">
      {pumps.map((pumpNumber) => (
        <Button
          key={pumpNumber}
          variant={selectedPump === pumpNumber ? "kiosk" : "pump"}
          size="kiosk"
          onClick={() => onPumpSelect(pumpNumber)}
          className="aspect-square text-xl font-bold"
        >
          {pumpNumber}
        </Button>
      ))}
    </div>
  );
};

export default PumpSelector;