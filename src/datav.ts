import FrmManufactureChart from "./datav/FrmManufactureChart";
import FrmPurchaseChart from "./datav/FrmPurchaseChart";
import FrmSaleChart from "./datav/FrmSaleChart";
import FrmReport1 from "./datav/FrmReport1";
import FrmReport2 from "./datav/FrmReport2";
import FrmReport3 from "./datav/FrmReport3";
import FrmReport4 from "./datav/FrmReport4";
import FrmReport5 from "./datav/FrmReport5";
import FrmReport6 from "./datav/FrmReport6";
import FrmReport7 from "./datav/FrmReport7";
import FrmReport9 from "./datav/FrmReport9";
import FrmReport10 from "./datav/FrmReport10";
import FrmReport11 from "./datav/FrmReport11";
import FrmReport12 from "./datav/FrmReport12";
import FrmReport13 from "./datav/FrmReport13";
import FrmReport14 from "./datav/FrmReport14";
import FrmReport15 from "./datav/FrmReport15";
import FrmReport16 from "./datav/FrmReport16";
import FrmReport17 from "./datav/FrmReport17";
import FrmEmployee1 from "./datav/FrmEmployee1";
import FrmEmployee2 from "./datav/FrmEmployee2";
import FrmEmployee3 from "./datav/FrmEmployee3";
import FrmEmployee4 from "./datav/FrmEmployee4";

export default {
    // FrmPurchaseChart,
    // FrmManufactureChart,
    // FrmSaleChart,
    // FrmReport1,
    // FrmReport2,
    // FrmReport3,
    // FrmReport4,
    // FrmReport5,
    // FrmReport6,
    // FrmReport7,
    // FrmReport9,
    // FrmReport10,
    // FrmReport11,
    // FrmReport12,
    // FrmReport13,
    // FrmReport14,
    // FrmReport15,
    // FrmReport16,
    // FrmReport17,
    // FrmEmployee1,
    // FrmEmployee2,
    // FrmEmployee3,
    // FrmEmployee4,
    showPage
}

function showPage(str: string, title: string, props?: object) {
    let app = document.getElementById('app');
    //@ts-ignore
    aui.ReactDOM.unmountComponentAtNode(app);
    document.title = title;
    //@ts-ignore
    aui.ReactDOM.render(aui.React.createElement(eval(`aui.${str}`), props), app)
}
