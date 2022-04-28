import { DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType, DBGrid, Column, DataRow } from "autumn-ui";
import React from "react";
import styles from "./StaffDialog.css";

type PABChangeTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class PABChangeDialog extends BaseDialog<BaseDialogPropsType, PABChangeTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('Code_', 'CB101').setValue('Reason_', '提货/运费/进出口报关');
        dataSet.append().setValue('Code_', 'CB102').setValue('Reason_', '厂商扣款');
        dataSet.append().setValue('Code_', 'CB105').setValue('Reason_', '税金');
        dataSet.append().setValue('Code_', 'CB106').setValue('Reason_', '对账差异调整');
        dataSet.append().setValue('Code_', 'CB107').setValue('Reason_', '折扣');
        dataSet.append().setValue('Code_', 'CB108').setValue('Reason_', '预付款');
        dataSet.append().setValue('Code_', 'CB201').setValue('Reason_', '普通薪资');
        dataSet.append().setValue('Code_', 'CB202').setValue('Reason_', '退休金/经济补偿金/资遣费等');
        dataSet.append().setValue('Code_', 'CB203').setValue('Reason_', '专利/顾问费及专业机构之劳务费');
        dataSet.append().setValue('Code_', 'CB204').setValue('Reason_', '国内差旅费用');
        dataSet.append().setValue('Code_', 'CB205').setValue('Reason_', '国外差旅费用');
        dataSet.append().setValue('Code_', 'CB206').setValue('Reason_', '交际、餐费支出');
        dataSet.append().setValue('Code_', 'CB207').setValue('Reason_', '水电邮电网费等及政府规费');
        dataSet.append().setValue('Code_', 'CB208').setValue('Reason_', '广告行销费用');
        dataSet.append().setValue('Code_', 'CB209').setValue('Reason_', '保险费');
        dataSet.append().setValue('Code_', 'CB210').setValue('Reason_', '捐赠');
        dataSet.append().setValue('Code_', 'CB211').setValue('Reason_', '利息费用');
        dataSet.append().setValue('Code_', 'CB212').setValue('Reason_', '保证金、其他损失');
        dataSet.append().setValue('Code_', 'CB213').setValue('Reason_', '其他营业外支出');
        dataSet.append().setValue('Code_', 'CB214').setValue('Reason_', '营业税');
        dataSet.append().setValue('Code_', 'CB215').setValue('Reason_', '营利事业所得税');
        dataSet.append().setValue('Code_', 'CB216').setValue('Reason_', '其它税捐');
        dataSet.append().setValue('Code_', 'CB217').setValue('Reason_', '投资支出');
        dataSet.append().setValue('Code_', 'CB218').setValue('Reason_', '其它费用');
        dataSet.append().setValue('Code_', 'CB219').setValue('Reason_', '租金');
        dataSet.append().setValue('Code_', 'CB220').setValue('Reason_', '集团分摊款');
        dataSet.append().setValue('Code_', 'CB221').setValue('Reason_', '高干薪资');
        dataSet.append().setValue('Code_', 'CB222').setValue('Reason_', '驻外台干薪资');
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