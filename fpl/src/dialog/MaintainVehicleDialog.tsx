import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, Column, ColumnIt } from "autumn-ui";
import FplDialogApi from "./FplDialogApi";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class MaintainVehicleDialog extends BaseDialog<BaseDialogPropsType, StaffTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props)
        let dataIn = new DataRow();
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplDialogApi.getMaintainVehicles(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="plate_number_" dataName="车牌号" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt/>
                    <Column code="ShortName_" name="客户名称" width="50"></Column>
                    <Column code="sales_name_" name="业务员" width="50"></Column>
                    <Column code="plate_number_" name="车牌号码" width="50"></Column>
                    <Column code="cg_name_" name="车辆类型" width="60"></Column>
                    <Column code="opera" name="操作" width="20" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input1.value = dataRow.getString('plate_number_');
        input2.value = dataRow.getString('plate_number_');
        this.handleSelect();
    }
}