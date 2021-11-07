import React from "react"
import ReactDOM from "react-dom"
import DataRow from "../src/db/DataRow"
import DataSet from "../src/db/DataSet"
import Datetime from "../src/db/Datetime"
import QueryService from "../src/db/QueryService"
import RemoteService from "../src/db/RemoteService"
import TGrid from "../src/ext/TGrid"
import TGridColumn from "../src/ext/TGridColumn"
import Grid from "../src/rcc/Grid"
import GridConfig from "../src/rcc/GridConfig"
import TComponent from "../src/ui/TComponent"
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
    TGrid,
    //rcc
    Grid,
    GridConfig,
}

let app = document.getElementById('app');
if (app) {
    ReactDOM.render(<FrmDept />, app)
}