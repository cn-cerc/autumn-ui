import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import './DBGrid.css';

export type OnDataSetChangedEvvent = (dataSet: DataSet) => void;

type propsType = {
    dataSource: DataSet;
    readOnly?: boolean;
    onChanged?: OnDataSetChangedEvvent;
}

type stateType = {
    dataSet: DataSet;
}

export type OnDataRowChangedEvent = (recNo: number, field: string, value: object) => void;

export default class DBGrid extends React.Component<propsType, stateType> {
    static defaultProps = {
        readOnly: true
    }
    constructor(props: propsType) {
        super(props);
        this.state = { dataSet: this.props.dataSource }
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
        let recNo = 0;
        for (let row of this.state.dataSet.records) {
            recNo++;
            items.push(<tr key={items.length}>{this.getRow(row, recNo).map(item => item)}</tr>)

            let colSpan = 0;
            React.Children.map(this.props.children, child => {
                if (isValidElement(child) && child.type == Column) {
                    colSpan++;
                }
            })

            let total = 0;
            React.Children.map(this.props.children, child => {
                if (isValidElement(child) && child.type == ChildRow) {
                    total++;
                    let key: string = `${items.length}.${total}`;
                    items.push(<tr key={key}>{React.cloneElement(child, {
                        key: child.props.code, colSpan, row
                    })}</tr>);
                }
            })
        }
        return items;
    }

    getRow(row: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, row, recNo,
                    onChanged: this.onChanged
                }));
        })
        return items;
    }

    onChanged: OnDataRowChangedEvent = (recNo: number, field: string, value: object) => {
        this.state.dataSet.setRecNo(recNo);
        this.state.dataSet.setValue(field, value);
        if (this.props.onChanged)
            this.props.onChanged(this.state.dataSet);
    }
}

export enum ColumnType {
    th, td, span
}

type ColumnPropsType = {
    tag?: ColumnType;
    row?: DataRow;
    recNo?: number;
    code: string;
    name: string;
    width: string;
    colSpan?: number;
    onChanged?: OnDataRowChangedEvent;
}

type ColumnStateType = {
    row: DataRow;
}

export class Column extends React.Component<ColumnPropsType, ColumnStateType> {
    static defaultProps = {
        tag: ColumnType.td
    }

    constructor(props: ColumnPropsType) {
        super(props)
        this.state = { row: this.props.row }
    }

    render() {
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th className='column'>{this.props.name}</th>
                )
            case ColumnType.td: {
                return this.getTd();
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

    getTd() {
        if (this.props.colSpan)
            return <td className='column' colSpan={this.props.colSpan}>{this.getValue()}</td>
        else
            return <td className='column'>{this.getValue()}</td>
    }

    getValue(): React.ReactNode {
        if (!this.props.children) {
            let value = '';
            if (this.props.row)
                value = this.props.row.getString(this.props.code);
            return value;
        }
        return (
            <React.Fragment>
                {this.getContent().map(item => item)}
            </React.Fragment>
        )
    }

    getContent() {
        let items: React.ReactElement<any, string | React.JSXElementConstructor<any>>[] = []
        React.Children.map(this.props.children, child => {
            if (isValidElement(child))
                items.push(React.cloneElement(child, {
                    key: items.length, dataSource: this.state.row,
                    onChanged: this.onChanged
                }))
        })
        return items;
    }

    onChanged: OnFieldChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
        if (this.props.row && this.props.onChanged && this.props.recNo)
            this.props.onChanged(this.props.recNo, meta.code, this.state.row.getValue(meta.code));
    }

}

type ChildRowPropsType = {
    row?: DataRow;
    colSpan?: number;
}

export class ChildRow extends React.Component<ChildRowPropsType> {
    render() {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, row: this.props.row, colSpan: this.props.colSpan
                }));
        })
        return items;
    }
}