import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";

export type OnChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataRow?: DataRow;
    dataField: string;
    dataName?: string;
    isUseChangedEvent?: boolean;
    onChanged?: OnChangedEvent;
    className?: string;
    children?: ReactNode | undefined
}

export default class DBCheckbox extends React.Component<PropsType> {
    static defaultProps = {
        isUseChangedEvent: true
    }

    constructor(props: PropsType) {
        super(props);
    }

    render() {
        let row = this.props.dataRow;
        if (!row)
            return null;
        let value = false;
        if (row)
            value = row.getBoolean(this.props.dataField);

        let dataName;
        if (this.props.dataName) {
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}</label>)
        }
        return (
            <div className={this.props.className || ''}>
                <input type="checkbox" role={`${this.props.dataRow.getString('columnName')}`} id={this.props.dataField} name={this.props.dataField} checked={value} onChange={this.onChange} />
                {dataName}
            </div>
        )
    }

    onChange = (sender: any) => {
        if (!this.props.isUseChangedEvent) return;

        let el: HTMLInputElement = sender.target;
        let row = this.props.dataRow;
        row.setValue(this.props.dataField, !row.getBoolean(this.props.dataField));
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataRow.fields.get(el.name));
    }
}