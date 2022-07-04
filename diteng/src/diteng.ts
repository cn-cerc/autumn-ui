//引入autumn-ui样式文件
import "autumn-ui/assets/autumn-ui.css";

import CheckDraftTB from "./block/CheckDraftTB";
import CheckReport from "./block/CheckReport";
import CheckWorkflow from "./block/CheckWorkflow";
import AccountEditDialog from "./dialog/AccountEditDialog";
import AERemarkDialog from "./dialog/AERemarkDialog";
import AHRemarkDialog from "./dialog/AHRemarkDialog";
import AORemarkDialog from "./dialog/AORemarkDialog";
import AreaDialog from "./dialog/AreaDialog";
import BankAccountDialog from "./dialog/BankAccountDialog";
import BaseAreaDialog from "./dialog/BaseAreaDialog";
import BIRemarkDialog from "./dialog/BIRemarkDialog";
import BOMProcessDialog from "./dialog/BOMProcessDialog";
import BrandDialog from "./dialog/BrandDialog";
import BRRemarkDialog from "./dialog/BRRemarkDialog";
import CardTypeDialog from "./dialog/CardTypeDialog";
import CopyReportDialog from "./dialog/CopyReportDialog";
import CusAreaDialog from "./dialog/CusAreaDialog";
import CusDialog from "./dialog/CusDialog";
import CusTypeDialog from "./dialog/CusTypeDialog";
import DateDialog from "./dialog/DateDialog";
import DateYMDialog from "./dialog/DateYMDialog";
import DepartmentDialog from "./dialog/DepartmentDialog";
import DialogDOM from "./dialog/DialogDOM";
import FastCorpDialog from "./dialog/FastCorpDialog";
import FreightWayDialog from "./dialog/FreightWayDialog";
import LogisticsDialog from "./dialog/LogisticsDialog";
import MarqueDialog from "./dialog/MarqueDialog";
import MLRemarkDialog from "./dialog/MLRemarkDialog";
import NewProductDialog from "./dialog/NewProductDialog";
import OutInfoDialog from "./dialog/OurInfoDialog";
import PABChangeDialog from "./dialog/PABChangeDialog";
import PartClassDialog from "./dialog/PartClassDialog";
import PartCodePartStockDialog from "./dialog/PartCodePartStockDialog";
import PartModeldDialog from "./dialog/PartModeldDialog";
import PartStockDialog from "./dialog/PartStockDialog";
import ProcStepDialog from "./dialog/ProcStepDialog";
import ProductClassDialog from "./dialog/ProductClassDialog";
import ProductDialog from "./dialog/ProductDialog";
import RABChangeDialog from "./dialog/RABChangeDialog";
import RemarkDialog from "./dialog/RemarkDialog";
import SaleCurrentNumDialog from "./dialog/SaleCurrentNumDialog";
import SalesmanDialog from "./dialog/SalesmanDialog";
import SelectLotNoDialog from "./dialog/SelectLotNoDialog";
import SpecCodeDialog from "./dialog/SpecCodeDialog";
import StaffDialog from "./dialog/StaffDialog";
import SubordinateDialog from "./dialog/SubordinateDialog";
import SupBankDialog from "./dialog/SupBankDialog";
import SupDialog from "./dialog/SupDialog";
import TempPrefererntialDialog from "./dialog/TempPrefererntialDialog";
import UserDialog from "./dialog/UserDialog";
import VipCardDialog from "./dialog/VipCardDialog";
import WareBasicDialog from "./dialog/WareBasicDialog";
import WorkerDialog from "./dialog/WorkerDialog";
import ErrorPage from "./page/ErrorPage";
import FrmLogin from "./page/FrmLogin";
import FrmOEMAppend from "./page/FrmOEMAppend";
import FrmOEMChange from "./page/FrmOEMChange";
import FrmPartPrinciple from "./page/FrmPartPrinciple";
import FrmPrivacyRight from "./page/FrmPrivacyRight";
import FrmUserAgreement from "./page/FrmUserAgreement";
import TFrmProProcess from "./page/TFrmProProcess";
import TFrmTranOD from "./page/TFrmTranOD";
import TSchProductAnalysis from "./page/TSchProductAnalysis";
import TSchProductInOutAnalysis from "./page/TSchProductInOutAnalysis";
import TSchScmStockInOut from "./page/TSchScmStockInOut";
import { TCustomComponent } from "autumn-ui";
import { Loading } from "./tool/Loading";
import Utils, { ClientStorage } from "./tool/Utils";
import RapidInput from "./custom/RapidInput";
import AdPlayerMC from "./dialog/AdPlayerMC";
import AdvertContentDialog from "./dialog/AdvertContentDialog";
import FrmMessage from "./page/FrmMessage";
import FrmMessageDetails from "./page/FrmMessageDetails";
import FrmMyContact from "./page/FrmMyContact";
import FrmMyContactDetail from "./page/FrmMyContactDetail";
import TOrd from "./page/TOrd";
import TStockMC from "./page/TStockMC";
import TPurMC from "./page/TPurMC";
import hrMC from "./page/hrMC";
import TRetailMC from "./page/TRetailMC";
import TMakeMC from "./page/TMakeMC";

export default {
    //地藤专用
    TSchProductAnalysis,
    TSchScmStockInOut,
    TSchProductInOutAnalysis,
    TFrmTranOD,
    TFrmProProcess,
    //首页检测
    CheckDraftTB,
    CheckWorkflow,
    CheckReport,
    //开窗选择
    DialogDOM,
    UserDialog,
    CusDialog,
    DateDialog,
    SalesmanDialog,
    BrandDialog,
    ProductClassDialog,
    DateYMDialog,
    StaffDialog,
    SupDialog,
    ProductDialog,
    NewProductDialog,
    SubordinateDialog,
    WareBasicDialog,
    LogisticsDialog,
    DepartmentDialog,
    PartCodePartStockDialog,
    VipCardDialog,
    PartStockDialog,
    BankAccountDialog,
    CardTypeDialog,
    OutInfoDialog,
    PartModeldDialog,
    FastCorpDialog,
    BOMProcessDialog,
    CusAreaDialog,
    WorkerDialog,
    BaseAreaDialog,
    AreaDialog,
    ProcStepDialog,
    RemarkDialog,
    SaleCurrentNumDialog,
    SupBankDialog,
    CusTypeDialog,
    TempPrefererntialDialog,
    AERemarkDialog,
    RABChangeDialog,
    PABChangeDialog,
    AORemarkDialog,
    BRRemarkDialog,
    AHRemarkDialog,
    MLRemarkDialog,
    BIRemarkDialog,
    AccountEditDialog,
    FreightWayDialog,
    SpecCodeDialog,
    PartClassDialog,
    MarqueDialog,
    SelectLotNoDialog,
    //地藤jsp转java中js继承类
    TCustomComponent,
    //用户政策与隐私协议
    FrmPrivacyRight,
    FrmUserAgreement,
    //地藤原jsp页面
    ErrorPage,
    FrmLogin,
    CopyReportDialog,
    //工具类
    Utils,
    ClientStorage,
    Loading,
    //快录专用
    RapidInput,
    //新增编码原则
    FrmPartPrinciple,
    //OEM新增
    FrmOEMAppend,
    //OEM修改
    FrmOEMChange,
    AdPlayerMC,
    AdvertContentDialog,
    //地藤消息页面
    FrmMessage,
    FrmMessageDetails,
    //地藤通讯录
    FrmMyContact,
    FrmMyContactDetail,
    TOrd,
    //MC控制台
    TStockMC,
    TPurMC,
    hrMC,
    TRetailMC,
    TMakeMC
}
