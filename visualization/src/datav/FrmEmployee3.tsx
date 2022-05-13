import React from "react";
import { DataRow } from "autumn-ui";
import Employee from "./Employee";


type FrmEmployeeTypeProps = {

}

type FrmEmployeeTypeState = {
    dataRow: DataRow
}

export default class FrmEmployee3 extends React.Component<FrmEmployeeTypeProps, FrmEmployeeTypeState> {
    constructor(props: FrmEmployeeTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('Name_', '王五').setValue('Model_', 'H型钢材').setValue('Capacity_', '良好').setValue('CurrentCapacity_', '10').setValue('State_', '良好').setValue('OilTemp_', '100℃').setValue('Stock_', '5s/次').setValue('Noise_', '60分贝').setValue('Bearing_', '良好').setValue('Motor_', '良好');
        this.state = {
            dataRow
        }
    }

    render(): React.ReactNode {
        return <Employee dataRow={this.state.dataRow} title='H型钢材生产线' backHref='FrmManufactureChart' backTitle='制造数据管理中心'></Employee>
    }
}