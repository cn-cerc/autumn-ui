import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBEdit, DBGrid, OperatePanel, SearchPanel } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { AuiMath, showMsg } from "../tool/Summer";
import "../tool/Summer.css";
import styles from "./DialogCommon.css";

type PayeeProps = {
    deptCode: string,
    cusCode?: string,
    callBack?: Function,
} & Partial<BaseDialogPropsType>

type StaffTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    selectDataSet: DataSet,
} & Partial<BaseDialogStateType>

export default class PayeeAmountDialog extends BaseDialog<PayeeProps, StaffTypeState> {
    constructor(props: PayeeProps) {
        super(props)
        let dataIn = new DataRow();
        dataIn.setValue("dept_code_", this.props.deptCode);
        dataIn.setValue("cus_code_", this.props.cusCode);
        this.state = {
            ...this.state,
            dataIn,
            dataSet: new DataSet(),
            selectDataSet: new DataSet(),
            width: "45rem",
            height: this.isPhone ? '25rem' : '35rem'
        }
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await FplApi.getCusBindPayee(this.state.dataIn);
        this.setLoad(false);
        this.setState({
            dataSet
        })
    }

    content() {
        return (
            <div role="content" className={styles.main}>
                <SearchPanel dataRow={this.state.dataIn} onExecute={this.init.bind(this)}>
                    <DBEdit dataName="收款人" dataField="payee_name_" autoFocus></DBEdit>
                </SearchPanel>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.append.bind(this)} openPage={false}>
                    <ColumnIt />
                    <Column name='收款人' code='payee_name_' width='6'></Column>
                    <Column name='联系方式' code='phone_number_' width='11'></Column>
                    <Column name='银行' code='bank_name_' width='20'></Column>
                    <Column name='操作' code='opera' width='4' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera'>选择</span>
                    }}></Column>
                </DBGrid>
                <hr />
                <span>已选收款人：</span>
                <DBGrid dataSet={this.state.selectDataSet} openPage={false} key={this.state.selectDataSet.json}>
                    <ColumnIt />
                    <Column name='收款人' code='payee_name_' width='6'></Column>
                    <Column name='联系方式' code='phone_number_' width='11'></Column>
                    <Column name='银行' code='bank_name_' width='20'></Column>
                    <Column name='金额' code='amount' width='10'>
                        <DBEdit dataField="amount" className=""></DBEdit>
                    </Column>
                    <Column name='操作' code='opera' width='4' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.delete.bind(this, row)}>移除</span>
                    }}></Column>
                </DBGrid>
                <OperatePanel>
                    <button className={styles.operaButton} onClick={this.btnSave.bind(this)}>保存</button>
                    <button className={styles.operaButton} onClick={() => { window.location.href = 'FrmCusBindPayee' }}>去绑定收款人</button>
                </OperatePanel>
            </div>
        )
    }

    append(dataRow: DataRow) {
        let selectDataSet = this.state.selectDataSet;
        if (!selectDataSet.locate('bank_card_', dataRow.getString('bank_card_'))) {
            selectDataSet.append().copyRecord(dataRow);
            this.setState({ ...this.state, selectDataSet });
        } else {
            showMsg('您选择的收款人已经添加过了！')
        }
    }

    delete(dataRow: DataRow) {
        let selectDataSet = this.state.selectDataSet;
        selectDataSet.first();
        if (selectDataSet.locate('bank_card_', dataRow.getString('bank_card_'))) {
            selectDataSet.delete()
            this.setState({ ...this.state, selectDataSet });
        }
    }

    btnSave() {
        let trs = document.querySelectorAll('.dbgrid tr');
        let math = new AuiMath();
        trs.forEach(item => {
            if ($(item).find('#checkBoxName').is(':checked'))
                $(item).trigger('click');
            // @ts-ignore
            var row = new GridRow($(item));
            let amount = row.get('Amount_') as number;
            let record = this.getRecord(amount);
            if (record) {
                row.set('BankAccount_', record.getString('payee_name_'));
                row.set('BankName_', record.getString('bank_name_'));
                row.set('BankNo_', record.getString('bank_card_'));
                row.set('payee_no_', record.getString('payee_no_'));
                record.setValue('addAmount', math.add(record.getDouble('addAmount'), amount));
                $(item).trigger('click');
            }
        })
        this.handleClose()
    }

    getRecord(amount: number): DataRow {
        let dataSet = this.state.selectDataSet;
        let record: DataRow = null;
        dataSet.forEach(item => {
            if (!record && item.getDouble('amount') - item.getDouble('addAmount') > amount)
                record = item;
        })
        return record;
    }
}