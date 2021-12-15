import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DBGrid, { Column } from "../rcc/DBGrid";
import styles from "./StaffDialog.css";

type MLRemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class MLRemarkDialog extends BaseDialog<BaseDialogPropsType, MLRemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'MN11').setValue('Reason_', '耗材需求');
        dataSet.append().setValue('Code_', 'MN12').setValue('Reason_', '廠商借料需求');
        dataSet.append().setValue('Code_', 'MN14').setValue('Reason_', '樣品需求');
        dataSet.append().setValue('Code_', 'MN15').setValue('Reason_', '業務售后服務需求');
        dataSet.append().setValue('Code_', 'MN17').setValue('Reason_', '生產異常換領需求');
        dataSet.append().setValue('Code_', 'MN19').setValue('Reason_', '品保測試需求');
        dataSet.append().setValue('Code_', 'MN21').setValue('Reason_', '人資贈品需求');
        dataSet.append().setValue('Code_', 'MN25').setValue('Reason_', 'BGT倉庫包材類需求');
        dataSet.append().setValue('Code_', 'MN23').setValue('Reason_', 'BGT倉庫修竿配節需求');
        dataSet.append().setValue('Code_', 'MN24').setValue('Reason_', 'BGT採購非BOM包材需求');
        dataSet.append().setValue('Code_', 'MN26').setValue('Reason_', '品管復檢不良維修需用');
        dataSet.append().setValue('Code_', 'MN27').setValue('Reason_', '业务营销与广告宣传需用');
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
                <DBGrid dataSet={this.state.dataSet}>
                    <Column name='异动代码' code='Code_' width='10'></Column>
                    <Column name='异动原因' code='Reason_' width='25'></Column>
                    <Column name='操作' code='opera' width='15' textAlign='center' customText={(row: DataRow) => {
                        return <span role='opera' onClick={this.handleClick.bind(this, row)}>选择</span>
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