import React from "react"
import ReactDOM from "react-dom"
import FrmPurchaseChart from "../src/datav/FrmPurchaseChart"
import FrmManufactureChart from "../src/datav/FrmManufactureChart"
import FrmSaleChart from "../src/datav/FrmSaleChart"
import diteng from '../src/diteng'
import index from '../src/index'
import IndexKsdl from "../src/ksdl/IndexKsdl"
import FrmReport1 from "../src/datav/FrmReport1"
import FrmEmployee1 from "../src/datav/FrmEmployee1"
import FrmEmployee2 from "../src/datav/FrmEmployee2"
import FrmEmployee3 from "../src/datav/FrmEmployee3"
import FrmEmployee4 from "../src/datav/FrmEmployee4"
import FrmReport2 from "../src/datav/FrmReport2"

export default {
    ...index,
    ...diteng,
    //ksdl
    IndexKsdl,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmReport2);
    ReactDOM.render(el, app)
}