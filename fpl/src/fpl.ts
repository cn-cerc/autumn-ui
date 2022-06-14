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
import NumberPlateDialog from "./dialog/NumberPlateDialog";
import PayeeDialog from "./dialog/PayeeDialog";
import showSiteDialog from "./dialog/showSiteDialog";

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
    showSiteDialog,
}