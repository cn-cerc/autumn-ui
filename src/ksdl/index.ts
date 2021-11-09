import React from "react"
import ReactDOM from "react-dom"
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import Datetime from "../db/Datetime";
import QueryService from "../db/QueryService";
import IndexKsdl from "./IndexKsdl";

export default {
    //db
    Datetime,
    DataSet,
    DataRow,
    QueryService,
    //ksdl
    IndexKsdl,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(IndexKsdl);
    ReactDOM.render(el, app)
}