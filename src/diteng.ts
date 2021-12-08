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
import Grid from "./rcc/Grid";
import BrandDialog from "./diteng/BrandDialog";
import { TGridConfig } from "./vcl/TGrid";
import TCustomComponent from "./vcl/TCustomComponent";

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
    //地藤jsp转java中js继承类
    TCustomComponent
}
