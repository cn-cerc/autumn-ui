//引入autumn-ui样式文件
import DialogDOM from "@diteng/dialog/DialogDOM";
import diteng from "@diteng/diteng";
import "autumn-ui/assets/autumn-ui.css";
import CategoryDialog from "./dialog/CategoryDialog";
import CeshiDialog from "./dialog/CeshiDialog";
import CodeRecordDialog from "./dialog/CodeRecordDialog";
import ContractDialog from "./dialog/ContractDialog";
import DriverBindingRecordDialog from "./dialog/DriverBindingRecordDialog";
import DriverInfoDialog from "./dialog/DriverInfoDialog";
import FleetDialog from "./dialog/FleetDialog";
import MaintainVehicleDialog from "./dialog/MaintainVehicleDialog";
import NumberPlateDialog from "./dialog/NumberPlateDialog";
import PayeeDialog from "./dialog/PayeeDialog";
import showSiteDialog from "./dialog/showSiteDialog";
import FrmContractManageMC from "./page/FrmContractManageMC";
import FrmPurchaseMC from "./page/FrmPurchaseMC";
import FrmSpectaculars2 from "./page/FrmSpectaculars2";
import FrmTaurusMC from "./page/FrmTaurusMC";
import TStockMC from "./page/TStockMC";
import FrmTaurusMC1 from "./page/FrmTaurusMC1";
import FrmTaurusMC2 from "./page/FrmTaurusMC2";
import TOrd from "./page/TOrd";

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
    MaintainVehicleDialog,
    CodeRecordDialog,
    //MC控制台
    FrmTaurusMC,
    TStockMC,
    FrmContractManageMC,
    FrmPurchaseMC,
    FrmSpectaculars2,
    TOrd,
    FrmTaurusMC1,
    FrmTaurusMC2
}