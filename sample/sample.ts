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
import NewProductDialog from "../src/diteng/NewProductDialog"
import SubordinateDialog from "../src/diteng/SubordinateDialog"
import WareBasicDialog from "../src/diteng/WareBasicDialog"
import LogisticsDialog from "../src/diteng/LogisticsDialog"
import PartCodePartStockDialog from "../src/diteng/PartCodePartStockDialog"
import TSchProductAnalysis from "../src/diteng/TSchProductAnalysis"
import TSchScmStockInOut from "../src/diteng/TSchScmStockInOut"
import UserDialog from "../src/diteng/UserDialog"
import DepartmentDialog from "../src/diteng/DepartmentDialog"
import VipCardDialog from "../src/diteng/VipCardDialog"
import PartStockDialog from "../src/diteng/PartStockDialog"
import BankAccountDialog from "../src/diteng/BankAccount"
import CardTypeDialog from "../src/diteng/CardTypeDialog"
import OutInfoDialog from "../src/diteng/OurInfoDialog"
import PartModeldDialog from "../src/diteng/PartModeldDialog"
import FastCorpDialog from "../src/diteng/FastCorpDialog"
import BOMProcessDialog from "../src/diteng/BOMProcessDialog"
import CusAreaDialog from "../src/diteng/CusAreaDialog"
import WorkerDialog from "../src/diteng/WorkerDialog"
import ProcStepDialog from "../src/diteng/ProcStepDialog"
import RemarkDialog from "../src/diteng/RemarkDialog"
import SaleCurrentNumDialog from "../src/diteng/SaleCurrentNumDialog"
import SupBankDialog from "../src/diteng/SupBankDialog"
import CusTypeDialog from "../src/diteng/CusTypeDialog"
import TempPrefererntialDialog from "../src/diteng/TempPrefererntialDialog"
import AccountEditDialog from "../src/diteng/AccountEditDialog"
import AERemarkDialog from "../src/diteng/AERemarkDialog"
import RABChangeDialog from "../src/diteng/RABChangeDialog"
import PABChangeDialog from "../src/diteng/PABChangeDialog"
import AORemarkDialog from "../src/diteng/AORemarkDialog"
import BRRemarkDialog from "../src/diteng/BRRemarkDialog"
import AHRemarkDialog from "../src/diteng/AHRemarkDialog"
import MLRemarkDialog from "../src/diteng/MLRemarkDialog"
import BIRemarkDialog from "../src/diteng/BIRemarkDialog"
import FreightWayDialog from "../src/diteng/FreightWayDialog"
import SpecCodeDialog from "../src/diteng/SpecCodeDialog"
import PartClassDialog from "../src/diteng/PartClassDialog"
import IndexKsdl from "../src/ksdl/IndexKsdl"
import Grid from "../src/rcc/Grid"
import TComponent from "../src/vcl/TComponent"
import TGrid, { TGridColumn, TGridConfig } from "../src/vcl/TGrid"
import FrmAccTran from "./FrmAccTran"
import AcPaySet from "./AcPaySet"
import TCustomComponent from "../src/vcl/TCustomComponent"
import BaseAreaDialog from "../src/diteng/BaseAreaDialog"
import AreaDialog from "../src/diteng/AreaDialog"
import MarqueDialog from "../src/diteng/MarqueDialog"

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
    AccountEditDialog,
    AERemarkDialog,
    RABChangeDialog,
    PABChangeDialog,
    AORemarkDialog,
    BRRemarkDialog,
    AHRemarkDialog,
    MLRemarkDialog,
    BIRemarkDialog,
    FreightWayDialog,
    SpecCodeDialog,
    MarqueDialog,
    PartClassDialog,
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