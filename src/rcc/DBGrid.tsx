import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import './DBGrid.css';

type propsType = {
    dataSource: DataSet;
    readOnly?: boolean;
}

export default class DBGrid extends React.Component<propsType> {

    constructor(props: propsType) {
        super(props);
    }

    render() {
        return (
            <table className='grid'>
                <tbody>
                    <tr key='head'>{this.getHead().map(item => item)}</tr>
                    {this.getRows().map(item => item)}
                </tbody>
            </table>
        )
    }

    getHead(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, { tag: ColumnType.th, key: child.props.code }));
        })
        return items;
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        for (let row of this.props.dataSource.records) {
            items.push(<tr key={items.length}>{this.getRow(row).map(item => item)}</tr>)
        }
        return items;
    }

    getRow(row: DataRow): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, row
                }));
        })
        return items;
    }
}

export enum ColumnType {
    th, td, span
}

type ColumnPropsType = {
    tag?: ColumnType;
    row?: DataRow;
    code: string;
    name: string;
    width: string;
}

export class Column extends React.Component<ColumnPropsType> {
    static defaultProps = {
        tag: ColumnType.td
    }

    constructor(props: ColumnPropsType) {
        super(props)
    }

    render() {
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th className='column'>{this.props.name}</th>
                )
            case ColumnType.td: {
                let value = '';
                if (this.props.row)
                    value = this.props.row.getString(this.props.code);
                return (
                    <td className='column'>{value}</td>
                )
            }
            case ColumnType.span: {
                let value = '';
                if (this.props.row)
                    value = this.props.row.getString(this.props.code);
                let text = `${this.props.name}：${value}`;
                return (
                    <span className='column'>{text}</span>
                )
            }
            default:
                throw Error('不支持的输出类型')
        }
    }
}
