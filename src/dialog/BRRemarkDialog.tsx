import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import styles from "./StaffDialog.css";

type BRRemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BRRemarkDialog extends BaseDialog<BaseDialogPropsType, BRRemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'BR000').setValue('Reason_', '系統自動轉單專用,人員禁用');
        dataSet.append().setValue('Code_', 'BR01').setValue('Reason_', '材料報廢');
        dataSet.append().setValue('Code_', 'BR02').setValue('Reason_', '半成品報廢');
        dataSet.append().setValue('Code_', 'BR03').setValue('Reason_', '成品報廢');
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