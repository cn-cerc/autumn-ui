import React from "react"
import ReactDOM from "react-dom"
import DataRow from "../src/db/DataRow"
import DataSet from "../src/db/DataSet"
import Datetime from "../src/db/Datetime"
import QueryService from "../src/db/QueryService"
import RemoteService from "../src/db/RemoteService"
import CheckDraftTB from "../src/diteng/CheckDraftTB"
import CheckReport from "../src/diteng/CheckReport"
import CheckWorkflow from "../src/diteng/CheckWorkflow"
import CusDialog from "../src/diteng/CusDialog"
import TSchProductAnalysis from "../src/diteng/TSchProductAnalysis"
import TSchScmStockInOut from "../src/diteng/TSchScmStockInOut"
import UserDialog from "../src/diteng/UserDialog"
import Grid from "../src/rcc/Grid"
import TComponent from "../src/vcl/TComponent"
import TGrid, { TGridConfig, TGridColumn } from "../src/vcl/TGrid"
import FrmDept from "./FrmDept"

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
    UserDialog,
    CusDialog,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmDept);
    ReactDOM.render(el, app)
}