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
import UserDialog from "./diteng/UserDialog";
import DateDialog from "./diteng/DateDialog";
import SalesmanDialog from "./diteng/SalesmanDialog";
import Grid from "./rcc/Grid";
import { TGridConfig } from "./vcl/TGrid";

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
    UserDialog,
    CusDialog,
    DateDialog,
    SalesmanDialog,
}
