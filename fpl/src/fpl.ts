//引入autumn-ui样式文件
import "autumn-ui/assets/autumn-ui.css";
import diteng from "@diteng/diteng";
import DialogDOM from "@diteng/dialog/DialogDOM";
import CategoryDialog from "./dialog/CategoryDialog";
import CeshiDialog from "./dialog/CeshiDialog";
import DriverInfoDialog from "./dialog/DriverInfoDialog";
import FleetDialog from "./dialog/FleetDialog";
import OwnerDialog from "./dialog/OwnerDialog";

export default {
    ...diteng,
    DialogDOM,
    CeshiDialog,
    CategoryDialog,
    DriverInfoDialog,
    FleetDialog,
    OwnerDialog
}