//引入autumn-ui样式文件
import DialogDOM from "@diteng/dialog/DialogDOM";
import diteng from "@diteng/diteng";
import "autumn-ui/assets/autumn-ui.css";
import CategoryDialog from "./dialog/CategoryDialog";
import CeshiDialog from "./dialog/CeshiDialog";
import ContractDialog from "./dialog/ContractDialog";
import DriverBindingRecordDialog from "./dialog/DriverBindingRecordDialog";
import DriverInfoDialog from "./dialog/DriverInfoDialog";
import FleetDialog from "./dialog/FleetDialog";
import MaintainVehicleDialog from "./dialog/MaintainVehicleDialog";
import NumberPlateDialog from "./dialog/NumberPlateDialog";
import PayeeDialog from "./dialog/PayeeDialog";

export default {
    ...diteng,
    DialogDOM,
    CeshiDialog,
    CategoryDialog,
    DriverInfoDialog,
    FleetDialog,
    DriverBindingRecordDialog,
    NumberPlateDialog,
    PayeeDialog,
    ContractDialog,
    MaintainVehicleDialog,
}