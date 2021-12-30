import React from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from "./DBEdit.css"

type PropsType = {
    dataRow?: DataRow,
    options?: Map<string, any>;
    dataName?: string;
    dataField: string;
    onChanged?: OnFieldChangedEvent;
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
            <span className={styles.main}>
                {dataName}
                <select id={this.props.dataField} onChange={this.handleChange.bind(this)} value={this.props.dataRow.getString(this.props.dataField)}>
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
        let dataSet = this.props.dataRow.dataSet;
        if (dataSet) {
            dataSet.setRecNo(dataSet.locationRow(this.props.dataRow));
            dataSet.edit();
        }
        this.props.dataRow.setValue(this.props.dataField, option.value);
        this.setState({ ...this.state });
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataRow.fields.get(this.props.dataField));
    }

}