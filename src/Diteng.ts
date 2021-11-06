import DataRow from "./db/DataRow";
import DataSet from "./db/DataSet";
import Datetime from "./db/Datetime";
import RemoteService from "./db/RemoteService";
import CheckDraftTB from "./diteng/CheckDraftTB";
import CheckReport from "./diteng/CheckReport";
import CheckWorkflow from "./diteng/CheckWorkflow";
import CusDialog from "./diteng/CusDialog";
import TSchProductAnalysis from "./diteng/TSchProductAnalysis";
import TSchScmStockInOut from "./diteng/TSchScmStockInOut";
import UserDialog from "./diteng/UserDialog";
import TGrid from "./ext/TGrid";
import TGridColumn from "./ext/TGridColumn";
import Grid from "./rcc/Grid";
import GridConfig from "./rcc/GridConfig";
import TComponent from "./ui/TComponent";

export default class Diteng {
    //db
    static Datetime = Datetime;
    static DataSet = DataSet;
    static DataRow = DataRow;
    static QueryService = DataRow;
    //rcc
    static Grid = Grid;
    static GridConfig = GridConfig;
    //地藤专用
    static TSchProductAnalysis = TSchProductAnalysis;
    static TSchScmStockInOut = TSchScmStockInOut;
    //首页检测
    static CheckDraftTB = CheckDraftTB;
    static CheckWorkflow = CheckWorkflow;
    static CheckReport = CheckReport;
    //开窗选择
    static UserDialog = UserDialog;
    static CusDialog = CusDialog;
}
