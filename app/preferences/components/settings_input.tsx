import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



export default function SettingsInput({ isEditing, tempValue, detailsValue, label, placeHolder,  setTempShopDetails}
    : {isEditing:boolean,tempValue:string,detailsValue:string,label:string,placeHolder:string,setTempShopDetails:any}) {
    return (
        <div className="flex-1 space-y-2">
            <Label htmlFor={label}>{ label }</Label>
        <Input
          id={label}
          value={isEditing ? tempValue : detailsValue}
          onChange={(e) => setTempShopDetails(e.target.value)}
          placeholder={placeHolder}
          className="max-w-md"
          disabled={!isEditing}
        />
      </div>
    )
}