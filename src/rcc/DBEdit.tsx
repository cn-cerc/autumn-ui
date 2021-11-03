import React from "react";
import { FieldMeta } from "../Autumn-UI";
import DataSource from "../db/DataSource";

export type OnChangedEvent = (meta: FieldMeta) => void;

type PropsType = {
    dataSource: DataSource;
    dataField: string;
    dataName: string;
    placeholder?: string;
    onChanged: OnChangedEvent;
    autoFocus?: boolean;
}

export default class DBEdit extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props);
    }

    render() {
        let ds = this.props.dataSource;
        if (!ds)
            return null;
        let row = this.props.dataSource.current;
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
                <input type="text" autoFocus={this.props.autoFocus} id={this.props.dataField} name={this.props.dataField} value={value} onChange={this.onChange} placeholder={this.props.placeholder} />
            </div>
        )
    }

    onChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        let row = this.props.dataSource.current;
        row.setValue(this.props.dataField, el.value);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(el.name));
    }
}