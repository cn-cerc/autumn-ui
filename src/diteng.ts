import DateYMDialog from "../src/diteng/DateYMDialog";
import FrmPrivacyRight from "../src/diteng/FrmPrivacyRight";
import FrmUserAgreement from "../src/diteng/FrmUserAgreement";
import index from '../src/index';
import AccountEditDialog from "./diteng/AccountEditDialog";
import AERemarkDialog from "./diteng/AERemarkDialog";
import AHRemarkDialog from "./diteng/AHRemarkDialog";
import AORemarkDialog from "./diteng/AORemarkDialog";
import AreaDialog from "./diteng/AreaDialog";
import BankAccountDialog from "./diteng/BankAccount";
import BaseAreaDialog from "./diteng/BaseAreaDialog";
import BIRemarkDialog from "./diteng/BIRemarkDialog";
import BOMProcessDialog from "./diteng/BOMProcessDialog";
import BrandDialog from "./diteng/BrandDialog";
import BRRemarkDialog from "./diteng/BRRemarkDialog";
import CardTypeDialog from "./diteng/CardTypeDialog";
import CheckDraftTB from "./diteng/CheckDraftTB";
import CheckReport from "./diteng/CheckReport";
import CheckWorkflow from "./diteng/CheckWorkflow";
import CusAreaDialog from "./diteng/CusAreaDialog";
import CusDialog from "./diteng/CusDialog";
import CusTypeDialog from "./diteng/CusTypeDialog";
import DateDialog from "./diteng/DateDialog";
import DepartmentDialog from "./diteng/DepartmentDialog";
import DialogDOM from "./diteng/DialogDOM";
import ErrorPage from "./diteng/ErrorPage";
import FastCorpDialog from "./diteng/FastCorpDialog";
import FreightWayDialog from "./diteng/FreightWayDialog";
import LogisticsDialog from "./diteng/LogisticsDialog";
import MarqueDialog from "./diteng/MarqueDialog";
import MLRemarkDialog from "./diteng/MLRemarkDialog";
import NewProductDialog from "./diteng/NewProductDialog";
import OutInfoDialog from "./diteng/OurInfoDialog";
import PABChangeDialog from "./diteng/PABChangeDialog";
import PartClassDialog from "./diteng/PartClassDialog";
import PartCodePartStockDialog from "./diteng/PartCodePartStockDialog";
import PartModeldDialog from "./diteng/PartModeldDialog";
import PartStockDialog from "./diteng/PartStockDialog";
import ProcStepDialog from "./diteng/ProcStepDialog";
import ProductClassDialog from "./diteng/ProductClassDialog";
import ProductDialog from "./diteng/ProductDialog";
import RABChangeDialog from "./diteng/RABChangeDialog";
import RemarkDialog from "./diteng/RemarkDialog";
import SaleCurrentNumDialog from "./diteng/SaleCurrentNumDialog";
import SalesmanDialog from "./diteng/SalesmanDialog";
import SpecCodeDialog from "./diteng/SpecCodeDialog";
import StaffDialog from "./diteng/StaffDialog";
import SubordinateDialog from "./diteng/SubordinateDialog";
import SupBankDialog from "./diteng/SupBankDialog";
import SupDialog from "./diteng/SupDialog";
import TempPrefererntialDialog from "./diteng/TempPrefererntialDialog";
import TSchProductAnalysis from "./diteng/TSchProductAnalysis";
import TSchProductInOutAnalysis from "./diteng/TSchProductInOutAnalysis";
import TSchScmStockInOut from "./diteng/TSchScmStockInOut";
import UserDialog from "./diteng/UserDialog";
import VipCardDialog from "./diteng/VipCardDialog";
import WareBasicDialog from "./diteng/WareBasicDialog";
import WorkerDialog from "./diteng/WorkerDialog";
import TCustomComponent from "./vcl/TCustomComponent";

export default {
    ...index,
    //地藤专用
    TSchProductAnalysis,
    TSchScmStockInOut,
    TSchProductInOutAnalysis,
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
    //地藤jsp转java中js继承类
    TCustomComponent,
    //用户政策与隐私协议
    FrmPrivacyRight,
    FrmUserAgreement,
    //地藤原jsp页面
    ErrorPage,
}
