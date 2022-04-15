import React from "react"
import ReactDOM from "react-dom"
import FrmManufactureChart from "../src/datav/FrmManufactureChart"
import FrmPurchaseChart from "../src/datav/FrmPurchaseChart"
import diteng from '../src/diteng'
import index from '../src/index'
import IndexKsdl from "../src/ksdl/IndexKsdl"

export default {
    ...index,
    ...diteng,
    //ksdl
    IndexKsdl,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmManufactureChart);
    ReactDOM.render(el, app)
}