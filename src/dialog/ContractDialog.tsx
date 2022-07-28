import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type ContractProps = {
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class ContractDialog extends BaseDialog<ContractProps, StaffTypeState> {
    constructor(props: ContractProps) {
        super(props)
        let dataIn = new DataRow();
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '65rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getContractList(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="contract_type_name_" dataName="合同名称" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt />
                    <Column code="contract_type_name_" name="合同名称" width="130"></Column>
                    <Column code="party_a_name_" name="甲方公司" width="70"></Column>
                    <Column code="party_b_name_" name="乙方公司" width="70"></Column>
                    <Column code="cargo_unit_price_" name="订单价" width="50"></Column>
                    <Column code="arrangecar_unit_price_" name="运单价" width="50"></Column>
                    <Column code="cargo_loss_rate_" name="货损率" width="40"></Column>
                    <Column code="contract_amount_" name="合同金额" width="50"></Column>
                    <Column code="recharged_amount_" name="充值金额" width="50"></Column>
                    <Column code="remaining_amount_" name="可用余额" width="50"></Column>
                    <Column code="opera" name="操作" width="50" textAlign='center' customText={(row: DataRow) => {
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
        let input3 = document.getElementById("remaining_amount_") as HTMLInputElement;
        let input4 = document.getElementById("unit_price_") as HTMLInputElement;
        let input5 = document.getElementById("waybill_unit_price_") as HTMLInputElement;
        let input6 = document.getElementById("cargo_loss_rate_") as HTMLInputElement;

        input1.value = dataRow.getString('contract_no_');
        input2.value = dataRow.getString('contract_type_name_');
        input3.value = dataRow.getString('remaining_amount_');
        input4.value = dataRow.getString('cargo_unit_price_');
        input5.value = dataRow.getString('arrangecar_unit_price_');
        input6.value = dataRow.getString('cargo_loss_rate_');
        this.handleSelect();
    }
}