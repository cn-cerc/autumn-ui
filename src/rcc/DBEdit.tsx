import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";
import FieldMeta from "../db/FieldMeta";
import { OnSelectDataRowEvent } from "./DialogComponent";
import { DialogForm, OnSelectDataSetEvent } from "./DialogForm";
import { ISearchItem } from "./SearchPanel";

export type OnFieldChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataSource?: DataSource;
    dataField: string;
    dataName?: string;
    placeholder?: string;
    onChanged?: OnFieldChangedEvent;
    autoFocus?: boolean;
}

type DBEditState = {
    row: DataRow
}

export type OnSelectValueEvent = (value: string) => void;

export interface ISelectDialog {
    select(value: string): void;
}

export default class DBEdit extends React.Component<PropsType, DBEditState> {

    constructor(props: PropsType) {
        super(props);
        let row
        if (props.dataSource != undefined)
            row = props.dataSource.current
        else
            row = new DataRow()
        this.state = { row }
    }

    render() {
        let value = this.state.row.getString(this.props.dataField)
        let dataName;
        if (this.props.dataName)
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}：</label>)

        return (
            <span>
                {dataName}
                <input type="text" autoFocus={this.props.autoFocus} id={this.props.dataField}
                    name={this.props.dataField} value={value} onChange={this.inputOnChange}
                    placeholder={this.props.placeholder} />
                {React.Children.map(this.props.children, child => {
                    if (isValidElement(child)) {
                        return React.cloneElement(child, { onSelect: this.onDialogSelect })
                    }
                })}
            </span>
        )
    }

    inputOnChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        this.state.row.setValue(this.props.dataField, el.value);
        this.setState(this.state);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(el.name));
    }

    onDialogSelect: OnSelectDataRowEvent = (values: DataRow) => {
        let value = values.getString(values.fieldDefs.fields[0].code);
        this.state.row.setValue(this.props.dataField, value);
        this.setState(this.state);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(this.props.dataField));
    }

}