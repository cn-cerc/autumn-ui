import React from "react";
import { FieldMeta } from "../Autumn-UI";
import DataSource from "../db/DataSource";
import { SearchItem } from "./SearchPanel";

export type OnChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataSource?: DataSource;
    dataField: string;
    dataName: string;
    placeholder?: string;
    onChanged?: OnChangedEvent;
    autoFocus?: boolean;
}

export type OnSelectedEvent = (value: string) => void;

export interface ISelectDialog {
    setOnSelected(value: OnSelectedEvent): Object;
}

export default class DBEdit extends React.Component<PropsType> implements SearchItem {
    private _dataSource: DataSource;

    constructor(props: PropsType) {
        super(props);
        if (props.dataSource != undefined)
            this._dataSource = props.dataSource;
    }

    render() {
        if (!this.dataSource)
            return null;
        let row = this.dataSource.current;
        let value = "";
        if (row)
            value = row.getString(this.props.dataField);

        let dataName;
        if (this.props.dataName) {
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}：</label>)
        }
        return (
            <div>
                {dataName}
                <input type="text" autoFocus={this.props.autoFocus} id={this.props.dataField}
                    name={this.props.dataField} value={value} onChange={this.inputOnChange}
                    placeholder={this.props.placeholder} />
                {this.getDialog()}
            </div>
        )
    }

    getDialog(): React.ReactNode {
        if (this.props.children == undefined)
            return null;
        let child = this.props.children as Object;
        if (child.hasOwnProperty('setOnSelected')) {
            let obj = child as ISelectDialog;
            obj.setOnSelected(this.dialogSelect);
            return child;
        } else
            throw Error('child not is ISelectDialog');
    }

    dialogSelect(value: string) {
        throw new Error("Method not implemented.");
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