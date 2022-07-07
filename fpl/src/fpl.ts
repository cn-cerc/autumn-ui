//引入autumn-ui样式文件
import DialogDOM from "@diteng/dialog/DialogDOM";
import diteng from "@diteng/diteng";
import "autumn-ui/assets/autumn-ui.css";
import CargoCodeTypeDialog from "./dialog/CargoCodeTypeDialog";
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
import custTLinkMC from "./page/custTLinkMC";
import firmTLinkMC from "./page/firmTLinkMC";
import FrmAPManageMC from "./page/FrmAPManageMC";
import FrmAPManageMC1 from "./page/FrmAPManageMC1";
import FrmARManageMC from "./page/FrmARManageMC";
import FrmARManageMC1 from "./page/FrmARManageMC1";
import FrmCarManagerMC from "./page/FrmCarManagerMC";
import FrmCarManagerMC2 from "./page/FrmCarManagerMC2";
import FrmContractManageMC from "./page/FrmContractManageMC";
import FrmContractManageMC1 from "./page/FrmContractManageMC1";
import FrmContractManageMC2 from "./page/FrmContractManageMC2";
import FrmDriverArrangeCarDetail from "./page/FrmDriverArrangeCarDetail";
import FrmDriverReceive from "./page/FrmDriverReceive";
import FrmInvoiceManage from "./page/FrmInvoiceManage";
import FrmInvoiceManage1 from "./page/FrmInvoiceManage1";
import FrmMaintenanceAR from "./page/FrmMaintenanceAR";
import FrmMaintenanceBook from "./page/FrmMaintenanceBook";
import FrmMaintenanceCar from "./page/FrmMaintenanceCar";
import FrmMaintenanceCus from "./page/FrmMaintenanceCus";
import FrmMaintenanceSparepart from "./page/FrmMaintenanceSparepart";
import FrmSpectaculars1 from "./page/FrmSpectaculars1";
import FrmSpectaculars2 from "./page/FrmSpectaculars2";
import FrmSpectaculars3 from "./page/FrmSpectaculars3";
import FrmTaurusMC from "./page/FrmTaurusMC";
import FrmTaurusMC1 from "./page/FrmTaurusMC1";
import FrmTaurusMC2 from "./page/FrmTaurusMC2";
import FrmWagonAccountBook from "./page/FrmWagonAccountBook";
import hrMC from "./page/hrMC";
import paMC from "./page/paMC";
import TAccMC from "./page/TAccMC";
import TFrmStockTotalMC from "./page/TFrmStockTotalMC";
import itMC from "./page/itMC";
import myMC from "./page/myMC";
import TMakeMC from "./page/TMakeMC";
import TOrd from "./page/TOrd";
import TPurMC from "./page/TPurMC";
import TStockMC from "./page/TStockMC";
import FrmAuthManageMC from "./page/FrmAuthManageMC";
import FrmWagonHome from "./page/FrmWagonHome";
import Frm4PLCusManage from "./page/Frm4PLCusManage";
import FrmWagonManage from "./page/FrmWagonManage";

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
    CargoCodeTypeDialog,
    //MC控制台
    FrmTaurusMC,
    TStockMC,
    FrmContractManageMC,
    FrmContractManageMC1,
    FrmContractManageMC2,
    TPurMC,
    FrmSpectaculars2,
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
    FrmMaintenanceBook,
    hrMC,
    TOrd,
    FrmDriverReceive,
    FrmDriverArrangeCarDetail,
    FrmWagonAccountBook,
    TMakeMC,
    paMC,
    FrmARManageMC,
    FrmARManageMC1,
    FrmAPManageMC,
    FrmAPManageMC1,
    TAccMC,
    custTLinkMC,
    firmTLinkMC,
    TFrmStockTotalMC,
    itMC,
    myMC,
    FrmAuthManageMC,
    FrmWagonHome,
    Frm4PLCusManage,
    FrmWagonManage
}