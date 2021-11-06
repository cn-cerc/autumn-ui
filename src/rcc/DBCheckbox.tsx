import React from "react";
import DataSource from "../db/DataSource";
import FieldMeta from "../db/FieldMeta";

export type OnChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataSource: DataSource;
    dataField: string;
    dataName: string;
    onChanged: OnChangedEvent;
}

export default class DBCheckbox extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props);
    }

    render() {
        let ds = this.props.dataSource;
        if (!ds)
            return null;
        let row = this.props.dataSource.current;
        let value = false;
        if (row)
            value = row.getBoolean(this.props.dataField);

        let dataName;
        if (this.props.dataName) {
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}</label>)
        }
        return (
            <div>
                <input type="checkbox" id={this.props.dataField} name={this.props.dataField} checked={value} onChange={this.onChange} />
                {dataName}
            </div>
        )
    }

    onChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        let row = this.props.dataSource.current;
        row.setValue(this.props.dataField, !row.getBoolean(this.props.dataField));
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(el.name));
    }
}