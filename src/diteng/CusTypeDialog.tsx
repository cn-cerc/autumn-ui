import React from "react";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DataSet from "../db/DataSet";
import DataRow from "../db/DataRow";
import styles from "./PartStockDialog.css";

type CusTypeTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class CusTypeDialog extends BaseDialog<BaseDialogPropsType, CusTypeTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('CusType_', '代理商');
        dataSet.append().setValue('CusType_', '发货中心');
        dataSet.append().setValue('CusType_', '特约经销商');
        dataSet.append().setValue('CusType_', '形象店（旗舰店）');
        dataSet.append().setValue('CusType_', '鉑金通路');
        dataSet.append().setValue('CusType_', '黃金通路');
        dataSet.append().setValue('CusType_', '鉆石通路');
        dataSet.append().setValue('CusType_', '电商');
        dataSet.append().setValue('CusType_', '钻石专柜');
        dataSet.append().setValue('CusType_', '铂金专柜');
        dataSet.append().setValue('CusType_', '黃金专柜');
        dataSet.append().setValue('CusType_', '集团内部客户');
        dataSet.append().setValue('CusType_', '区域品牌大使');
        dataSet.append().setValue('CusType_', '市场开拓');
        dataSet.append().setValue('CusType_', '公司活动');
        dataSet.append().setValue('CusType_', '售后服务');
        dataSet.append().setValue('CusType_', '钓鱼场');
        dataSet.append().setValue('CusType_', '零售客户');
        this.state = {
            ...this.state,
            dataSet,
            width: '30rem',
            height: '20rem'
        }
        this.setTitle('请选择客户类别');
    }

    content(): JSX.Element {
        return (
            <ul className={styles.main}>
                {this.state.dataSet.records.map((row: DataRow) => {
                    let cusType = row.getString('CusType_');
                    return <li key={cusType} onClick={this.handleClick.bind(this, cusType)}>{cusType}</li>
                })}
            </ul>
        )
    }

    handleClick(cusType: string) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = cusType;
        this.handleSelect();
    }
}