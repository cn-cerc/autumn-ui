import React from "react";
import { DataSet, BaseDialogStateType, BaseDialog, BaseDialogPropsType } from "autumn-ui";
import styles from "./PartStockDialog.css";

type FreightWayTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class FreightWayDialog extends BaseDialog<BaseDialogPropsType, FreightWayTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('FreightWay_', '金洲安能');
        dataSet.append().setValue('FreightWay_', '順能安能');
        dataSet.append().setValue('FreightWay_', '德邦物流');
        dataSet.append().setValue('FreightWay_', '中通快运');
        dataSet.append().setValue('FreightWay_', '快递');
        dataSet.append().setValue('FreightWay_', '金洲-韵达快运');
        dataSet.append().setValue('FreightWay_', '金洲-壹米滴答');
        dataSet.append().setValue('FreightWay_', '金洲-顺心快运');
        dataSet.append().setValue('FreightWay_', '金洲-百世快递');
        this.state = {
            ...this.state,
            dataSet,
            width: '30rem',
            height: '20rem'
        }
        this.setTitle('请选择运货方式');
    }

    content() {
        return (
            <ul className={styles.main}>
                {this.state.dataSet.records.map((row) => {
                    let freightWay = row.getString('FreightWay_');
                    return <li key={freightWay} onClick={this.handleClick.bind(this, freightWay)}>{freightWay}</li>
                })}
            </ul>
        )
    }

    handleClick(freightWay: string) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = freightWay;
        this.handleSelect();
    }
}