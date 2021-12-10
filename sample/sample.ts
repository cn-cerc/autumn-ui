import React from "react"
import ReactDOM from "react-dom"
import DataRow from "../src/db/DataRow"
import DataSet from "../src/db/DataSet"
import Datetime from "../src/db/Datetime"
import QueryService from "../src/db/QueryService"
import RemoteService from "../src/db/RemoteService"
import BrandDialog from "../src/diteng/BrandDialog"
import CheckDraftTB from "../src/diteng/CheckDraftTB"
import CheckReport from "../src/diteng/CheckReport"
import CheckWorkflow from "../src/diteng/CheckWorkflow"
import DialogDOM from "../src/diteng/DialogDOM"
import CusDialog from "../src/diteng/CusDialog"
import DateDialog from "../src/diteng/DateDialog"
import SalesmanDialog from "../src/diteng/SalesmanDialog"
import ProductClassDialog from "../src/diteng/ProductClassDialog";
import DateYMDialog from "../src/diteng/DateYMDialog"
import StaffDialog from "../src/diteng/StaffDialog"
import SupDialog from "../src/diteng/SupDialog"
import ProductDialog from "../src/diteng/ProductDialog"
import SubordinateDialog from "../src/diteng/SubordinateDialog"
import WareBasicDialog from "../src/diteng/WareBasicDialog"
import LogisticsDialog from "../src/diteng/LogisticsDialog"
import PartCodePartStockDialog from "../src/diteng/PartCodePartStockDialog"
import TSchProductAnalysis from "../src/diteng/TSchProductAnalysis"
import TSchScmStockInOut from "../src/diteng/TSchScmStockInOut"
import UserDialog from "../src/diteng/UserDialog"
import VipCardDialog from "../src/diteng/VipCardDialog"
import IndexKsdl from "../src/ksdl/IndexKsdl"
import Grid from "../src/rcc/Grid"
import TComponent from "../src/vcl/TComponent"
import TGrid, { TGridColumn, TGridConfig } from "../src/vcl/TGrid"
import FrmAccTran from "./FrmAccTran"
import AcPaySet from "./AcPaySet"
import TCustomComponent from "../src/vcl/TCustomComponent"

export default {
    //db
    Datetime,
    DataSet,
    DataRow,
    RemoteService,
    QueryService,
    //vcl
    TComponent,
    TGridColumn,
    TGridConfig,
    TGrid,
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
    //ksdl
    IndexKsdl,
    //地藤jsp转java中js继承类
    TCustomComponent
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(AcPaySet);
    ReactDOM.render(el, app)
}