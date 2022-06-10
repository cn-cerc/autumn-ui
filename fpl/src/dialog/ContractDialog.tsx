import React from "react";
import { DataRow, DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import FplDialogApi from "./FplDialogApi";
import styles from "./DialogCommon.css";
import "../tool/Summer.css";

type ContractProps = {
    state: string,
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class ContractDialog extends BaseDialog<ContractProps, StaffTypeState> {
    constructor(props: ContractProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue('status_', this.props.state);
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
        let dataSet = await FplDialogApi.getContractList(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataField="contract_no_" dataName="合同编号" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column code="contract_no_" name="合同编号" width="50"></Column>
                    <Column code="party_a_" name="甲方公司" width="50"></Column>
                    <Column code="party_b_" name="乙方公司" width="50"></Column>
                    <Column code="contract_amount_" name="合同金额" width="50"></Column>
                    <Column code="recharged_amount_" name="已充值金额" width="50"></Column>
                    <Column code="remaining_amount_" name="可用余额" width="50"></Column>
                    <Column code="opera" name="操作" width="30" textAlign='center' customText={(row: DataRow)=>{
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

        input1.value = dataRow.getString('contract_no_');
        input2.value = dataRow.getString('contract_no_');
        input3.value = dataRow.getString('remaining_amount_');
        this.handleSelect();
    }
}