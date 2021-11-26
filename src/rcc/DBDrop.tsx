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
                <select id={this.props.dataField} onChange={this.handleChange}>
                    {this.getOptions()}
                </select>
            </span>
        )
    }

    componentDidMount() {
        this.props.dataRow.setValue(this.props.dataField, this.defaultValue);
    }

    getOptions() {
        let options: any[] = [];
        let i = 0;
        this.props.options.forEach((value, key)=>{
            if(i == 0)
                this.defaultValue = value;
            if(value == this.props.dataRow.getValue(this.props.dataField))
                options.push(<option key={key} value={value} selected>{key}</option>)
            else
                options.push(<option key={key} value={value}>{key}</option>)
            i++;
        })
        return options;
    }

    handleChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        this.props.dataRow.setValue(this.props.dataField, el.value);
        this.setState({...this.state});
    }

}