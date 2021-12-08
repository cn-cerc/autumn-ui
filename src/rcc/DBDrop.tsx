import React from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from "./DBEdit.css"

type PropsType = {
    dataRow?: DataRow,
    options?: Map<string, string>;
    dataName: string;
    dataField: string;
    onChanged?: OnFieldChangedEvent;
}

export default class DBDrop extends React.Component<PropsType> {
    private defaultValue: string;

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
                <select id={this.props.dataField} onChange={this.handleChange} value={this.props.dataRow.getString(this.props.dataField)}>
                    {this.getOptions()}
                </select>
            </span>
        )
    }

    getOptions() {
        let options: any[] = [];
        this.props.options.forEach((value, key)=>{
            options.push(<option key={key} value={value}>{key}</option>)
        })
        return options;
    }

    handleChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        this.props.dataRow.setValue(this.props.dataField, el.value);
        this.setState({...this.state});
    }

}