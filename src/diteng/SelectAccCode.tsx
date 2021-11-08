import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DBGrid, { Column, OnRowClickEvent } from "../rcc/DBGrid";
import DialogComponent, { DialogComponentProps, DialogComponentState } from "../rcc/DialogComponent";
import { DialogForm } from "../rcc/DialogForm";
import './SelectAccCode.css';

type TypeState = {
    dataSet: DataSet;
} & Partial<DialogComponentState>

export default class SelectAccCode extends DialogComponent<DialogComponentProps, TypeState> {

    static defaultProps = {
        title: '选择会计科目'
    }

    constructor(props: DialogComponentProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.append().setValue('code_', '1001').setValue('name_', '固定资产');
        dataSet.append().setValue('code_', '1002').setValue('name_', '流动资产');
        this.state = { dataSet }
    }

    render() {
        return (
            <DialogForm title={this.props.title} active={this.active} setActive={this.setActive}>
                <DBGrid dataSource={this.state.dataSet} onRowClick={this.onRowClick}>
                    <Column code='code_' name='会计科目' width='10'></Column>
                    <Column code='name_' name='科目名称' width='20'></Column>
                </DBGrid>
            </DialogForm>
        )
    }

    onRowClick: OnRowClickEvent = (row: DataRow) => {
        if (this.props.onSelect)
            this.props.onSelect(row);
        this.setActive(false);
    }

}