import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type QuoteCusProps = {
    callBack?: Function;
    cusCode: String;
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class QuoteCusDialog extends BaseDialog<QuoteCusProps, StaffTypeState> {
    constructor(props: QuoteCusProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue("cus_code_", this.props.cusCode);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '75rem',
            height: this.isPhone ? '25rem' : '40rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getQuoteCusList(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="line_name_" dataName="线路名称" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false} onRowClick={this.handleClick.bind(this)}>
                    <ColumnIt />
                    <Column code="line_name_" name="线路名称" width="120"></Column>
                    <Column code="cargo_oriup_" name="订单价" width="50"></Column>
                    <Column code="arrangecar_oriup_" name="运单价" width="50"></Column>
                    <Column code="rate_" name="平台费率‰" width="80"></Column>
                    <Column code="cargo_loss_rate_" name="货损率%" width="60"></Column>

                    <Column code="send_name_" name="发货人" width="60"></Column>
                    <Column code="send_address" name="发货地" width="140" textAlign='center' customText={(row: DataRow) => {
                        return <span> {row.getString("send_city_") + row.getString("send_county_")}</span>
                    }}></Column>
                    <Column code="receive_name_" name="收货人" width="60"></Column>
                    <Column code="receive_address" name="收货地" width="140y" textAlign='center' customText={(row: DataRow) => {
                        return <span> {row.getString("receive_city_") + row.getString("receive_county_")}</span>
                    }}></Column>
                    <Column code="opera" name="操作" width="50" textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera'>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(dataRow: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;

        input1.value = dataRow.getString("tb_no_");
        input2.value = dataRow.getString("line_name_");

        if (this.props.callBack)
            this.props.callBack(dataRow);
        this.handleSelect();
    }
}