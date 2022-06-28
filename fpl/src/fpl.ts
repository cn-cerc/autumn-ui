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
import FrmSpectaculars2 from "./page/FrmSpectaculars2";
import FrmTaurusMC from "./page/FrmTaurusMC";
import TStockMC from "./page/TStockMC";
import FrmTaurusMC1 from "./page/FrmTaurusMC1";
import FrmTaurusMC2 from "./page/FrmTaurusMC2";
import TOrd from "./page/TOrd";
import TPurMC from "./page/TPurMC";
import FrmSpectaculars1 from "./page/FrmSpectaculars1";
import FrmSpectaculars3 from "./page/FrmSpectaculars3";
import FrmCarManagerMC from "./page/FrmCarManagerMC";
import FrmContractManageMC1 from "./page/FrmContractManageMC1";
import FrmContractManageMC2 from "./page/FrmContractManageMC2";
import FrmCarManagerMC2 from "./page/FrmCarManagerMC2";
import FrmInvoiceManage1 from "./page/FrmInvoiceManage1";
import FrmInvoiceManage from "./page/FrmInvoiceManage";
import FrmMaintenanceCar from "./page/FrmMaintenanceCar";
import FrmMaintenanceAR from "./page/FrmMaintenanceAR";
import FrmMaintenanceCus from "./page/FrmMaintenanceCus";
import FrmMaintenanceSparepart from "./page/FrmMaintenanceSparepart";
import FrmMaintenanceBook from "./page/FrmMaintenanceBook";

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
    FrmContractManageMC1,
    FrmContractManageMC2,
    TPurMC,
    FrmSpectaculars2,
    TOrd,
    FrmTaurusMC1,
    FrmTaurusMC2,
    FrmSpectaculars1,
    FrmSpectaculars3,
    FrmInvoiceManage,
    FrmInvoiceManage1,
    FrmCarManagerMC,
    FrmCarManagerMC2,
    FrmMaintenanceCar,
    FrmMaintenanceAR,
    FrmMaintenanceCus,
    FrmMaintenanceSparepart,
    FrmMaintenanceBook
}