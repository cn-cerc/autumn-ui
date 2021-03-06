import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";

type PropsType = {
    dataRow?: DataRow,
    options?: Map<string, any>;
    dataName?: string;
    dataField: string;
    onChanged?: OnFieldChangedEvent;
    className?: string;
    disabled?: boolean;
    children?: ReactNode | undefined
}

export default class DBDrop extends React.Component<PropsType> {
    constructor(props: PropsType) {
        super(props);
    }

    render() {
        let dataName;
        if (this.props.dataName)
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}：</label>)

        return (
            <span className={`aui-form-main ${this.props.className}`}>
                {dataName}
                <select id={this.props.dataField} onChange={this.handleChange.bind(this)} value={this.props.dataRow.getString(this.props.dataField)} disabled={this.props.disabled}>
                    {this.getOptions()}
                </select>
            </span>
        )
    }

    getOptions() {
        let options: any[] = [];
        this.props.options.forEach((value, key) => {
            options.push(<option key={key} value={value}>{key}</option>)
        })
        return options;
    }

    handleChange = (sender: any) => {
        let el: HTMLSelectElement = sender.target;
        let option: HTMLOptionElement = el.selectedOptions[0];
        this.props.dataRow.setValue(this.props.dataField, option.value);
        this.setState({ ...this.state }, () => {
            let dataSet = this.props.dataRow.dataSet;
            if (dataSet) {
                dataSet.setRecNo(dataSet.locationRow(this.props.dataRow));
                dataSet.edit();
            }
        });
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataRow.fields.get(this.props.dataField));
    }

}