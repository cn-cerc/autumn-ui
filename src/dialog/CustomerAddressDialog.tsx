import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type CustomerAddressProps = {
    cusCode: String
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class CustomerAddressDialog extends BaseDialog<CustomerAddressProps, StaffTypeState> {
    constructor(props: CustomerAddressProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('cusCode', this.props.cusCode);
        console.log(this.props.cusCode);
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
        let dataSet = await FplApi.getCustomerAddress(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="contact_" dataName="姓名" autoFocus></DBEdit>
                    <DBEdit dataField="mobile_" dataName="手机号" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt />
                    <Column code="opera" name="操作" width="60" textAlign='center' customText={(row: DataRow) => {
                        return <span role="auiOpera" id='category' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                    <Column code="address_" name="收货地址" width="250"></Column>
                    <Column code="contact_" name="收货人员" width="60"></Column>
                    <Column code="mobile_" name="收货电话" width="120"></Column>
                </DBGrid>
            </div>
        )
    }
    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        console.log(inputIds);
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        let input3 = document.getElementById('receive_detail_') as HTMLInputElement;
        let input4 = document.getElementById('receive_phone_') as HTMLInputElement;
        let address = dataRow.getString('Area1_') + '\\' + dataRow.getString('Area2_') + '\\' + dataRow.getString('Area3_');;
        input1.value = address;
        input2.value = address;
        input3.value = dataRow.getString('Area4_') + dataRow.getString('Area5_');
        input4.value = dataRow.getString('mobile_');
        this.handleSelect();
    }
}