import DataRow from "./db/DataRow";
import DataSet from "./db/DataSet";
import Datetime from "./db/Datetime";
import QueryService from "./db/QueryService";
import CheckDraftTB from "./diteng/CheckDraftTB";
import CheckReport from "./diteng/CheckReport";
import CheckWorkflow from "./diteng/CheckWorkflow";
import CusDialog from "./diteng/CusDialog";
import TSchProductAnalysis from "./diteng/TSchProductAnalysis";
import TSchScmStockInOut from "./diteng/TSchScmStockInOut";
import DialogDOM from "./diteng/DialogDOM";
import UserDialog from "./diteng/UserDialog";
import DateDialog from "./diteng/DateDialog";
import SalesmanDialog from "./diteng/SalesmanDialog";
import ProductClassDialog from "./diteng/ProductClassDialog";
import DateYMDialog from "../src/diteng/DateYMDialog";
import StaffDialog from "./diteng/StaffDialog";
import SupDialog from "./diteng/SupDialog";
import ProductDialog from "./diteng/ProductDialog";
import SubordinateDialog from "./diteng/SubordinateDialog";
import WareBasicDialog from "./diteng/WareBasicDialog";
import LogisticsDialog from "./diteng/LogisticsDialog";
import PartCodePartStockDialog from "./diteng/PartCodePartStockDialog";
import VipCardDialog from "./diteng/VipCardDialog";
import PartStockDialog from "./diteng/PartStockDialog";
import BankAccountDialog from "./diteng/BankAccount";
import CardTypeDialog from "./diteng/CardTypeDialog";
import OutInfoDialog from "./diteng/OurInfoDialog";
import PartModeldDialog from "./diteng/PartModeldDialog";
import FastCorpDialog from "./diteng/FastCorpDialog";
import BOMProcessDialog from "./diteng/BOMProcessDialog";
import CusAreaDialog from "./diteng/CusAreaDialog";
import WorkerDialog from "./diteng/WorkerDialog";
import Grid from "./rcc/Grid";
import BrandDialog from "./diteng/BrandDialog";
import { TGridConfig } from "./vcl/TGrid";
import TCustomComponent from "./vcl/TCustomComponent";
import BaseAreaDialog from "./diteng/BaseAreaDialog";

export default {
    //db
    Datetime,
    DataSet,
    DataRow,
    QueryService,
    //rcc
    Grid,
    //地藤专用
    TSchProductAnalysis,
    TSchScmStockInOut,
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
    SubordinateDialog,
    WareBasicDialog,
    LogisticsDialog,
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
    //地藤jsp转java中js继承类
    TCustomComponent
}
