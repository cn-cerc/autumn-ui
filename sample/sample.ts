import React from "react"
import ReactDOM from "react-dom"
import diteng from '../src/diteng'
import FrmAccObjT from "../src/diteng/acc/FrmAccObjT"
import FrmACSubjectType from "../src/diteng/acc/FrmACSubjectType"
import FrmMoneyDecimalPoint from "../src/diteng/acc/FrmMoenyDecimalPoint"
import FrmMoneyRate from "../src/diteng/acc/FrmMoneyRate"
import FrmSysList13 from "../src/diteng/acc/FrmSysList13"
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
    let el = React.createElement(FrmMoneyDecimalPoint);
    ReactDOM.render(el, app)
}