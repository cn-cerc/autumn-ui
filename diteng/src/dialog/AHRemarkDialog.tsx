import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBGrid, { Column } from "../rcc/DBGrid";
import styles from "./StaffDialog.css";

type AHRemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class AHRemarkDialog extends BaseDialog<BaseDialogPropsType, AHRemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'AH000').setValue('Reason_', '系統自動轉單專用,人員禁用');
        dataSet.append().setValue('Code_', 'AH01').setValue('Reason_', '不良轉良');
        dataSet.append().setValue('Code_', 'AH02').setValue('Reason_', '良轉不良');
        dataSet.append().setValue('Code_', 'AH03').setValue('Reason_', '庫別調撥');
        dataSet.append().setValue('Code_', 'AH10').setValue('Reason_', '正常公倉調撥(每月OD需求調撥)');
        dataSet.append().setValue('Code_', 'AH11').setValue('Reason_', '正常友倉調撥(無需歸還)');
        dataSet.append().setValue('Code_', 'AH12').setValue('Reason_', '異常公倉調撥');
        dataSet.append().setValue('Code_', 'AH13').setValue('Reason_', '異常友倉調撥(需歸還)');
        dataSet.append().setValue('Code_', 'AH14').setValue('Reason_', '友倉調拔(消呆調拔)');
        dataSet.append().setValue('Code_', 'AH18').setValue('Reason_', '退貨不良調A-A不良倉');
        dataSet.append().setValue('Code_', 'AH19').setValue('Reason_', '修竿OK調良品倉');
        dataSet.append().setValue('Code_', 'AH20').setValue('Reason_', 'A-P5庫存確認可出貨調良品倉');
        dataSet.append().setValue('Code_', 'AH21').setValue('Reason_', '品管復檢不良暫調不良倉待採購退貨');
        dataSet.append().setValue('Code_', 'AH22').setValue('Reason_', '不良倉調回正倉地藤作退貨');
        this.state = {
            ...this.state,
            dataSet,
            width: '30rem',
            height: '25rem'
        }
        this.setTitle('请选择异动原因');
    }

    content(): JSX.Element {
        return (
            <div className={styles.main} role='content'>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <Column name='异动代码' code='Code_' width='10'></Column>
                    <Column name='异动原因' code='Reason_' width='25'></Column>
                    <Column name='操作' code='opera' width='15' textAlign='center' customText={(row: DataRow) => {
                        return <span role='auiOpera' onClick={this.handleClick.bind(this, row)}>选择</span>
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleClick(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Code_') + ',' + row.getString('Reason_');
        this.handleSelect();
    }
}