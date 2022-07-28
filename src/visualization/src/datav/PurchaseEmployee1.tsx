import React from "react";
import { DataRow } from "autumn-ui";
import Employee from "./Employee";


type FrmEmployeeTypeProps = {

}

type FrmEmployeeTypeState = {
    dataRow: DataRow
}

export default class PurchaseEmployee1 extends React.Component<FrmEmployeeTypeProps, FrmEmployeeTypeState> {
    constructor(props: FrmEmployeeTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('Name_', '张××').setValue('Contact_', '138××××0715').setValue('CurrentCapacity_', '10吨/天').setValue('State_', '良好').setValue('Temperature_', '38℃').setValue('Humidity_', '70%').setValue('Noise_', '60分贝').setValue('Power_', '良好');
        this.state = {
            dataRow
        }
    }

    render(): React.ReactNode {
        return <Employee dataRow={this.state.dataRow} title='焦煤厂' backHref='FrmPurchaseChart5' backTitle='工业4.0-数字化制造管理中心V1.0' type={2}></Employee>
    }
}