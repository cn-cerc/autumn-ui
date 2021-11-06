import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import TStringField from "./TStringField";

type propsType = {
    dataSource: DataSet;
    children: React.ReactNode[];
}

export default class TDBGrid extends React.Component<propsType> {
    constructor(props: propsType) {
        super(props);
    }

    getHead(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        for (let child of this.props.children) {
            let item: TStringField = child as TStringField;
            items.push(
                <th key={item.props.code}>{item.props.name}</th>
            );
        }
        return items;
    }

    getBody(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let ds = this.props.dataSource;
        let i = 0;
        for (let row of this.props.dataSource.records) {
            items.push(<tr key={++i}>{this.getRow(row)}</tr>)
        }
        return items;
    }

    getRow(row: DataRow): React.ReactNode {
        let items: React.ReactNode[] = [];
        for (let child of this.props.children) {
            let item: TStringField = child as TStringField;
            items.push(
                <td key={item.props.code}>{row.getString(item.props.code)}</td>
            );
        }
        return items;
    }

    render() {
        return (
            <table className="TDBGrid">
                <tbody>
                    <tr key='head'>
                        {this.getHead().map(item => item)}
                    </tr>
                    {this.getBody().map(item => item)}
                </tbody>
            </table>
        )
    }

}