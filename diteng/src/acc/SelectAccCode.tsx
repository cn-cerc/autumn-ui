import { DataSet, DialogComponent, DialogForm, DBGrid, Column, OnRowClickEvent, DataRow } from "autumn-ui";
import { DialogComponentState, DialogComponentProps } from "autumn-ui/src/rcc/DialogComponent";
import React from "react";
import AccCodeLists from "./AccCodeLists";
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
        this.state = { dataSet: new AccCodeLists().dataSet }
    }

    render() {
        return (
            <DialogForm title={this.props.title} style={this.props.style}
                active={this.active} setActive={this.setActive}>
                <DBGrid dataSet={this.state.dataSet} onRowClick={this.onRowClick}>
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