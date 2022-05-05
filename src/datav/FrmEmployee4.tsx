import React from "react";
import DataRow from "../db/DataRow";
import Employee from "./Employee";


type FrmEmployeeTypeProps = {

}

type FrmEmployeeTypeState = {
    dataRow: DataRow
}

export default class FrmEmployee4 extends React.Component<FrmEmployeeTypeProps, FrmEmployeeTypeState> {
    constructor(props: FrmEmployeeTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('Name_', '钱万三').setValue('Model_', '螺纹钢材').setValue('Capacity_', '警告').setValue('CurrentCapacity_', '10').setValue('State_', '警告').setValue('OilTemp_', '500℃').setValue('Stock_', '10s/次').setValue('Noise_', '100分贝').setValue('Bearing_', '良好').setValue('Motor_', '过热');
        this.state = {
            dataRow
        }
    }

    render(): React.ReactNode {
        return <Employee dataRow={this.state.dataRow} title='螺纹钢材生产线' backHref='FrmManufactureChart' backTitle='制造数据管理中心'></Employee>
    }
}