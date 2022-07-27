import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type DriverInfoProps = {
    deptCode: string,
    callBack?: Function,
    DriverStatus?: boolean,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class DriverInfoDialog extends BaseDialog<DriverInfoProps, StaffTypeState> {
    constructor(props: DriverInfoProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('dept_code_', this.props.deptCode);
        dataIn.setValue("maxRecord", 100);
        dataIn.setValue("DriverStatus_", this.props.DriverStatus);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
        this.setTitle("选择司机")
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getDriverInfos(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="name_" dataName="司机名称" autoFocus></DBEdit>
                    <DBEdit dataField="maxRecord" dataName="载入笔数"></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt />
                    <Column code="name_" name="司机名称" width="20"></Column>
                    <Column code="phone_num_" name="联系方式" width="20"></Column>
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
        let input3 = document.getElementById(inputIds[2]) as HTMLInputElement;
        input1.value = dataRow.getString('driver_no_');
        if (input2)
            input2.value = dataRow.getString('name_');
        if (input3)
            input3.value = dataRow.getString('phone_num_');
        if (this.props.callBack)
            this.props.callBack();
        this.handleSelect();
    }
}