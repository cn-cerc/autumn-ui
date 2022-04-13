import React from "react";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DataSet from "../db/DataSet";
import DataRow from "../db/DataRow";
import DBGrid, { Column } from "../rcc/DBGrid";
import DialogApi from "./DialogApi";
import styles from "./StaffDialog.css";
import { ColumnIt } from "../rcc/ColumnIt";

type BankAccountTypeProps = {
    inputId: string,
    disable: boolean | string
} & Partial<BaseDialogPropsType>

type BankAccountTypeState = {
    dataIn: DataRow,
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BankAccountDialog extends BaseDialog<BankAccountTypeProps, BankAccountTypeState> {
    constructor(props: BankAccountTypeProps) {
        super(props);
        let dataIn = new DataRow();
        // 过滤掉虚拟银行账户：代收账户
        dataIn.setValue('FastBank', true);
        // 查有效账户
        dataIn.setValue('Used_', 1);
        // 是否显示禁用的银行
        if (this.props.disable === false || this.props.disable === 'false') {
            dataIn.setValue('Disable_', false);
        }
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            width: '40rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    content(): JSX.Element {
        return (
            <div role='content' className={styles.main}>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt width={this.isPhone ? '8' : '5'}/>
                    <Column code='Name_' name='账户简称' width='20'></Column>
                    <Column code='AccountBank_' name='开户行' width='25'></Column>
                    <Column code='opera' name='操作' width={this.isPhone ? '10' : '8'} textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getBankInfos(this.state.dataIn);
        console.log(dataSet)
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Name_');
        this.handleSelect();
    }
}