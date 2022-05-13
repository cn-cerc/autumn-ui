import React from "react";
import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBGrid } from "autumn-ui";
import styles from "./StaffDialog.css";

type AERemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class AERemarkDialog extends BaseDialog<BaseDialogPropsType, AERemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'AE000').setValue('Reason_', '系統自動轉單專用,人員禁用');
        dataSet.append().setValue('Code_', 'AE01').setValue('Reason_', '實物盤點');
        dataSet.append().setValue('Code_', 'AE02').setValue('Reason_', '帳目錯誤');
        dataSet.append().setValue('Code_', 'AE09').setValue('Reason_', '托外加工入庫');
        dataSet.append().setValue('Code_', 'AE10').setValue('Reason_', '托外加工出庫');
        dataSet.append().setValue('Code_', 'AE11').setValue('Reason_', '處理地藤同步');
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