import "./src/tool/Summer.css";
import "autumn-ui/assets/autumn-ui.css";

import React from "react";
import ReactDOM from "react-dom";
import FrmEmployee1 from "./src/datav/FrmEmployee1";
import FrmEmployee2 from "./src/datav/FrmEmployee2";
import FrmEmployee3 from "./src/datav/FrmEmployee3";
import FrmEmployee4 from "./src/datav/FrmEmployee4";
import FrmManufactureChart from "./src/datav/FrmManufactureChart";
import FrmPurchaseChart from "./src/datav/FrmPurchaseChart";
import FrmReport1 from "./src/datav/FrmReport1";
import FrmReport10 from "./src/datav/FrmReport10";
import FrmReport11 from "./src/datav/FrmReport11";
import FrmReport12 from "./src/datav/FrmReport12";
import FrmReport13 from "./src/datav/FrmReport13";
import FrmReport14 from "./src/datav/FrmReport14";
import FrmReport15 from "./src/datav/FrmReport15";
import FrmReport16 from "./src/datav/FrmReport16";
import FrmReport17 from "./src/datav/FrmReport17";
import FrmReport18 from "./src/datav/FrmReport18";
import FrmReport19 from "./src/datav/FrmReport19";
import FrmReport2 from "./src/datav/FrmReport2";
import FrmReport3 from "./src/datav/FrmReport3";
import FrmReport4 from "./src/datav/FrmReport4";
import FrmReport5 from "./src/datav/FrmReport5";
import FrmReport6 from "./src/datav/FrmReport6";
import FrmReport7 from "./src/datav/FrmReport7";
import FrmReport8 from "./src/datav/FrmReport8";
import FrmReport9 from "./src/datav/FrmReport9";
import FrmSaleChart from "./src/datav/FrmSaleChart";
import FrmPurchaseChart3 from "./src/datav/FrmPurchaseChart3";
import FrmPurchaseChart4 from "./src/datav/FrmPurchaseChart4";
import FrmPurchaseChart5 from "./src/datav/FrmPurchaseChart5";
import ReportDetail1 from "./src/datav/ReportDetail1";
import SaleDetail1 from "./src/datav/SaleDetail1";
import SaleDetail2 from "./src/datav/SaleDetail2";
import SaleDetail3 from "./src/datav/SaleDetail3";
import SaleDetail4 from "./src/datav/SaleDetail4";
import SaleDetail5 from "./src/datav/SaleDetail5";
export default {
    FrmPurchaseChart,
    FrmPurchaseChart3,
    FrmPurchaseChart4,
    FrmPurchaseChart5,
    FrmManufactureChart,
    FrmSaleChart,
    FrmReport1,
    FrmReport2,
    FrmReport3,
    FrmReport4,
    FrmReport5,
    FrmReport6,
    FrmReport7,
    FrmReport8,
    FrmReport9,
    FrmReport10,
    FrmReport11,
    FrmReport12,
    FrmReport13,
    FrmReport14,
    FrmReport15,
    FrmReport16,
    FrmReport17,
    FrmReport18,
    FrmReport19,
    FrmEmployee1,
    FrmEmployee2,
    FrmEmployee3,
    FrmEmployee4,
    ReportDetail1,
    SaleDetail1,
    SaleDetail2,
    SaleDetail3,
    SaleDetail4,
    SaleDetail5,
    showPage
}

function showPage(str: string, title: string, props?: object) {
    let app = document.getElementById('app');
    ReactDOM.unmountComponentAtNode(app);
    document.title = title;
    ReactDOM.render(React.createElement(eval(`aui.${str}`), props), app)
}
