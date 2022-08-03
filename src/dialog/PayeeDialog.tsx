import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Block, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, Line, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type PayeeProps = {
    deptCode: string,
    callBack?: Function,
    personID: string,
} & Partial<BaseDialogPropsType>

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class PayeeDialog extends BaseDialog<PayeeProps, StaffTypeState> {
    constructor(props: PayeeProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue("dept_code_", this.props.deptCode);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: "45rem",
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getPayeeCode(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
        console.log(this.props)
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName="收款人姓名" dataField="payee_name_" autoFocus></DBEdit>
                </SearchPanel>
                {this.getTable()}
            </div>
        )
    }

    getTable() {
        if (this.isPhone) {
            return <Block dataSet={this.state.dataSet}>
                <Line>
                    <ColumnIt width='10' name='' />
                    <Column name='收款人姓名' code='payee_name_' width='90'></Column>
                </Line>
                <Line>
                    <Column name='联系方式' code='phone_number_' width='80'></Column>
                    <Column name='' code='opera' width='20' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </Line>
            </Block>
        } else {
            return <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                <ColumnIt />
                <Column name='收款人姓名' code='payee_name_' width='20'></Column>
                <Column name='联系方式' code='phone_number_' width='20'></Column>
                <Column name='操作' code='opera' width='20' textAlign='center' customText={(row: DataRow) => {
                    return <span role='auiOpera'>选择</span>
                }}></Column>
            </DBGrid>
        }
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if (input1)
            input1.value = dataRow.getString("payee_no_");
        if (input2)
            input2.value = dataRow.getString("payee_name_");
        if (this.props.callBack)
            this.props.callBack(dataRow);
        if (this.props.personID)
            $("#" + this.props.personID).val(dataRow.getString("payee_name_"))
        this.handleClose();
    }
}