import React from "react";
import DataSet from "../db/DataSet";
import BaseDialog, { BaseDialogPropsType, BaseDialogStateType } from "../rcc/BaseDialog";
import DialogApi from "./DialogApi";
import styles from "./PartStockDialog.css";

type PartStockTypeProps = {
    repairedCW: string,
} & Partial<BaseDialogPropsType>

type PartStockTypeState = {
    dataSet: DataSet
} & Partial<BaseDialogStateType>

export default class PartStockDialog extends BaseDialog<PartStockTypeProps, PartStockTypeState> {
    constructor(props: PartStockTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            dataSet: new DataSet(),
            width: '30rem',
            height: '20rem'
        }
        this.setTitle('请选择仓别');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        this.setLoad(true);
        let dataSet = await DialogApi.getDfPartCWList({
            RepairedCW_: this.props.repairedCW
        });
        this.setState({
            dataSet
        })
        this.setLoad(false);
    }

    content() {
        return (
            <ul className={styles.main}>
                {this.state.dataSet.records.map((row) => {
                    let cwCode = row.getString('CWCode_');
                    return <li key={cwCode} onClick={this.handleClick.bind(this, cwCode)}>{cwCode}</li>
                })}
            </ul>
        )
    }

    handleClick(cwCode: string) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = cwCode;
        this.handleSelect();
    }
}