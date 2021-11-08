import React, { isValidElement } from "react";
import DataSource from "../db/DataSource";
import FieldMeta from "../db/FieldMeta";
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

export type OnSelectedEvent = (value: string) => void;

export interface ISelectDialog {
    select(value: string): void;
}

export default class DBEdit extends React.Component<PropsType> implements ISearchItem {
    private _dataSource: DataSource;

    constructor(props: PropsType) {
        super(props);
        if (props.dataSource != undefined)
            this._dataSource = props.dataSource;
    }

    render() {
        if (!this.dataSource)
            return null;
        let value = "";
        let row = this.dataSource.current;
        if (row)
            value = row.getString(this.props.dataField);

        let dataName;
        if (this.props.dataName)
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}：</label>)

        return (
            <span>
                {dataName}
                <input type="text" autoFocus={this.props.autoFocus} id={this.props.dataField}
                    name={this.props.dataField} value={value} onChange={this.inputOnChange}
                    placeholder={this.props.placeholder} />
                {React.Children.map(this.props.children, item => item)}
            </span>
        )
    }

    getDialog(): React.ReactNode {
        if (this.props.children == undefined)
            return null;
        let child = this.props.children as Object;
        if (child.hasOwnProperty('setOnSelected')) {
            let obj = child as ISelectDialog;
            return child;
        } else {
            if (isValidElement(child))
                console.log(child.type);

            throw Error('child not is ISelectDialog');
        }
    }

    get dataSource(): DataSource { return this._dataSource; }
    setDataSource(value: DataSource): DBEdit {
        this._dataSource = value;
        return this;
    }

    inputOnChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        let row = this.dataSource.current;
        row.setValue(this.props.dataField, el.value);
        if (this.props.onChanged)
            this.props.onChanged(this.dataSource.current.fieldDefs.get(el.name));
    }
}