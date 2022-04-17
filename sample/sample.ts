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
import FrmReport3 from "../src/datav/FrmReport3"
import FrmReport4 from "../src/datav/FrmReport4"
import FrmReport5 from "../src/datav/FrmReport5"
import FrmReport6 from "../src/datav/FrmReport6"
import FrmReport7 from "../src/datav/FrmReport7"
import FrmReport9 from "../src/datav/FrmReport9"
import FrmReport10 from "../src/datav/FrmReport10"
import FrmReport11 from "../src/datav/FrmReport11"
import FrmReport12 from "../src/datav/FrmReport12"

export default {
    ...index,
    ...diteng,
    //ksdl
    IndexKsdl,
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmReport12);
    ReactDOM.render(el, app)
}