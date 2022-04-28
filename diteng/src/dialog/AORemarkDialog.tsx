import { DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, DBGrid, Column, DataRow } from "autumn-ui";
import React from "react";
import styles from "./StaffDialog.css";

type AORemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class AORemarkDialog extends BaseDialog<BaseDialogPropsType, AORemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'AB01').setValue('Reason_', '餘料還庫');
        dataSet.append().setValue('Code_', 'AB02').setValue('Reason_', '跨公司調用庫存');
        dataSet.append().setValue('Code_', 'AB03').setValue('Reason_', '其它入庫');
        dataSet.append().setValue('Code_', 'AB04').setValue('Reason_', '期初開帳');
        dataSet.append().setValue('Code_', 'AB05').setValue('Reason_', '拆竿配節入庫');
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