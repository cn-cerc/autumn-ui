import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import styles from "./StaffDialog.css";

type SupBankTypeProps = {
    supCode: string
} & Partial<BaseDialogPropsType>

type SupBankTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class SupBankDialog extends BaseDialog<SupBankTypeProps, SupBankTypeState> {
    constructor(props: SupBankTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            width: '50rem',
            height: this.isPhone ? '25rem' : '35rem'
        }
        this.setTitle('请选择厂商账户');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DitengApi.getSupBanks({ SupCode_: this.props.supCode });
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content(): JSX.Element {
        return (
            <div className={styles.main} role='content'>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.handleClick.bind(this)} openPage={false}>
                    <ColumnIt width={this.isPhone ? '10' : '5'}/>
                    <Column name='银行名称' code='Name_' width='20'></Column>
                    <Column name='开户行' code='AccountBank_' width='30'></Column>
                    <Column name='银行帐号' code='AccountNo_' width='40'></Column>
                    <Column name='操作' code='opera' textAlign='center' width='10' customText={(row: DataRow) => {
                        return <span role='auiOpera'>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        input1.value = row.getString('AccountBank_');
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if(input2) input2.value = row.getString('AccountNo_');
        this.handleSelect();
    }
}