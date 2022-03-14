import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
import { OnSelectDataRowEvent } from "./DialogComponent";
import styles from "./DBEdit.css"

export type OnFieldChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataRow?: DataRow;
    dataField: string;
    dataName?: string;
    placeholder?: string;
    onChanged?: OnFieldChangedEvent;
    autoFocus?: boolean;
    readOnly?: boolean;
    type?: 'text' | 'password' | 'checkbox' | 'number' | 'radio';
    autoComplete?: string;
    onFocus?: Function,
    onBlur?: Function,
    onKeyDown?: Function,
    changed?: boolean,
    className?: string
}

type DBEditState = {
    row: DataRow
}

export type OnSelectValueEvent = (value: string) => void;

export interface ISelectDialog {
    select(value: string): void;
}

export default class DBEdit extends React.Component<PropsType, DBEditState> {
    static defaultProps = {
        type: 'text'
    }
    constructor(props: PropsType) {
        super(props);
        let row
        if (props.dataRow != undefined)
            row = props.dataRow
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
            <span className={`${styles.main} ${this.props.className || ''}`}>
                {dataName}
                <input type={this.props.type} autoFocus={this.props.autoFocus} id={this.props.dataField}
                    name={this.props.dataField} value={value} onChange={this.inputOnChange}
                    placeholder={this.props.placeholder} readOnly={this.props.readOnly} onFocus={this.selectAllText
                        .bind(this)} onBlur={this.handleBlur.bind(this)} autoComplete={this.props.autoComplete ? this.props.autoComplete : 'off'} className={this.props.changed ? styles.changed : ''} onKeyDown={this.handleKeyDown.bind(this)}/>
                {React.Children.map(this.props.children, child => {
                    if (isValidElement(child)) {
                        return React.cloneElement(child, { onSelect: this.onDialogSelect, dataRow: this.props.dataRow, onChanged: this.onDialogSelect })
                    }
                })}
            </span>
        )
    }

    selectAllText(sender: any) {
        let input = sender.target as HTMLInputElement;
        input.select();
        if (this.props.onFocus)
            this.props.onFocus(sender);
    }

    inputOnChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        if (this.props.dataRow.dataSet) {
            let recNo = this.props.dataRow.dataSet.locationRow(this.state.row);
            this.props.dataRow.dataSet.setRecNo(recNo);
            this.props.dataRow.dataSet.edit();
        }
        this.state.row.setValue(this.props.dataField, el.value);
        this.setState(this.state);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataRow.fields.get(el.name));
    }

    onDialogSelect: OnSelectDataRowEvent = (values: DataRow) => {
        if (values.fields.items.length == 0)
            throw new Error('返回值错误：没有任何字段')
        let value = values.getString(values.fields.items[0].code);

        let dataSet = this.props.dataRow.dataSet;
        if (dataSet) {
            dataSet.setRecNo(dataSet.locationRow(this.props.dataRow));
            dataSet.edit();
        }
        this.state.row.setValue(this.props.dataField, value);
        this.setState(this.state);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataRow.fields.get(this.props.dataField));
    }

    handleBlur() {
        if (this.props.onBlur)
            this.props.onBlur();
    }

    handleKeyDown(sender: any) {
        if(this.props.onKeyDown)
            this.props.onKeyDown(sender)
    }
}