import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type DriverBindingRecordProps = {
    carNo: string,
    objCorpNo: string
} & Partial<BaseDialogPropsType>

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class DriverBindingRecordDialog extends BaseDialog<DriverBindingRecordProps, StaffTypeState> {
    constructor(props: DriverBindingRecordProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('car_no_', this.props.carNo);
        dataIn.setValue('obj_corp_no_', this.props.objCorpNo);
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
        let dataSet = await FplApi.getDriverBindingRecords(this.state.dataIn);
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
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt/>
                    <Column code="driver_no_" name="司机编号" width="50"></Column>
                    <Column code="name_" name="司机名称" width="50"></Column>
                    <Column code="opera" name="操作" width="20" textAlign='center' customText={(row: DataRow)=>{
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
        let input3 = document.getElementById("after_user_code_") as HTMLInputElement;

        input1.value = dataRow.getString('driver_no_');
        input2.value = dataRow.getString('name_');
        if(input3){
            input3.value=dataRow.getString('driver_user_code_');
        }
        this.handleSelect();
    }
}