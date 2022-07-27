import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import styles from "./StaffDialog.css";

type BIRemarkTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class BIRemarkDialog extends BaseDialog<BaseDialogPropsType, BIRemarkTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'BP000').setValue('Reason_', '系統自動轉單專用,人員禁用');
        dataSet.append().setValue('Code_', 'BP01').setValue('Reason_', '總務物品領用');
        dataSet.append().setValue('Code_', 'BP04').setValue('Reason_', '耗材領用');
        dataSet.append().setValue('Code_', 'BP05').setValue('Reason_', '樣品領用');
        dataSet.append().setValue('Code_', 'BP09').setValue('Reason_', '業務售后服務領料');
        dataSet.append().setValue('Code_', 'BP11').setValue('Reason_', '生產異常換領出庫');
        dataSet.append().setValue('Code_', 'BP13').setValue('Reason_', '品保測試領用');
        dataSet.append().setValue('Code_', 'BP16').setValue('Reason_', '人資贈品需求');
        dataSet.append().setValue('Code_', 'BP23').setValue('Reason_', 'BGT倉庫包材類領用');
        dataSet.append().setValue('Code_', 'BP21').setValue('Reason_', 'BGT倉庫修竿配節領用');
        dataSet.append().setValue('Code_', 'BP22').setValue('Reason_', 'BGT採購非BOM包材領用');
        dataSet.append().setValue('Code_', 'BP24').setValue('Reason_', '品管復檢不良維修領用');
        dataSet.append().setValue('Code_', 'BP25').setValue('Reason_', '业务营销与广告宣传领用');
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