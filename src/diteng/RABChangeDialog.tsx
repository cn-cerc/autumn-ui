import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBGrid, { Column } from "../rcc/DBGrid";
import styles from "./StaffDialog.css";

type RABChangeTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class RABChangeDialog extends BaseDialog<BaseDialogPropsType, RABChangeTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'CA101').setValue('Reason_', '出货差异');
        dataSet.append().setValue('Code_', 'CA102').setValue('Reason_', '折扣.折让');
        dataSet.append().setValue('Code_', 'CA103').setValue('Reason_', '集团对帐往来');
        dataSet.append().setValue('Code_', 'CA104').setValue('Reason_', '汇差');
        dataSet.append().setValue('Code_', 'CA105').setValue('Reason_', '加工收入');
        dataSet.append().setValue('Code_', 'CA106').setValue('Reason_', '退货成本扣款');
        dataSet.append().setValue('Code_', 'CA201').setValue('Reason_', '代付费用');
        dataSet.append().setValue('Code_', 'CA202').setValue('Reason_', '租金收入');
        dataSet.append().setValue('Code_', 'CA203').setValue('Reason_', '利息收入');
        dataSet.append().setValue('Code_', 'CA204').setValue('Reason_', '保证金.保证票');
        dataSet.append().setValue('Code_', 'CA205').setValue('Reason_', '开发票补税');
        dataSet.append().setValue('Code_', 'CA206').setValue('Reason_', '其他收入');
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