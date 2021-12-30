import React from "react"
import ReactDOM from "react-dom"
import diteng from '../src/diteng'
import FrmAccObjT from "../src/diteng/acc/FrmAccObjT"
import FrmACSubjectType from "../src/diteng/acc/FrmACSubjectType"
import FrmMoneyRate from "../src/diteng/acc/FrmMoneyRate"
import index from '../src/index'
import IndexKsdl from "../src/ksdl/IndexKsdl"
import AcPaySet from "./AcPaySet"

export default {
    ...index,
    ...diteng,
    //ksdl
    IndexKsdl,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmMoneyRate);
    ReactDOM.render(el, app)
}