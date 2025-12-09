import {
  Scanner as QRScanner,
  type IDetectedBarcode,
} from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { itemService } from "@/api/inventory.service";
import { useNavigate } from "react-router";

export default function Scanner() {
  const [usingCamera, setUsingCamera] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (checked: boolean) => {
    setUsingCamera(checked);
  };

  const handleQr = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
  };

  const handleScanResult = async (detectedCodes: IDetectedBarcode[]) => {
    if (detectedCodes !== null && detectedCodes.length > 0) {
      let detectedQrCode = detectedCodes[0];
      let itemResult = await itemService.getItem(detectedQrCode.rawValue);

      if (itemResult === null) {
        navigate("../item-form/", {
          state: {
            item: null,
          },
        });
      } else {
        navigate("../item-form/", {
          state: {
            item: itemResult,
          },
        });
      }
    }
  };

  return (
    <>
      <div className="flex flex-row space-x-1">
        <Switch id="use-camera" onCheckedChange={handleSwitch} />
        <Label>Use Camera</Label>
      </div>

      {usingCamera ? (
        <QRScanner
          onScan={handleScanResult}
          onError={(error: any) => console.log(error?.message)}
        />
      ) : (
        <div>
          <Input type="text" placeholder="Scan here" onChange={handleQr} />
        </div>
      )}
    </>
  );
}
