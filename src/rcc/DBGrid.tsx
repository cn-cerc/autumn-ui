import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from './DBGrid.css';

export type OnDataSetChangedEvvent = (dataSet: DataSet) => void;
export type OnRowClickEvent = (row: DataRow) => void;

type DBGridProps = {
    dataSet: DataSet;
    readOnly?: boolean;
    onChanged?: OnDataSetChangedEvvent;
    onRowClick?: OnRowClickEvent;
}

type DBGridState = {
    dataSet: DataSet;
}

export type OnDataRowChangedEvent = (recNo: number, field: string, value: string) => void;

export default class DBGrid extends React.Component<DBGridProps, DBGridState> {
    static defaultProps = {
        readOnly: true
    }
    constructor(props: DBGridProps) {
        super(props);
        this.state = { dataSet: this.props.dataSet }
    }

    render() {
        return (
            <div className={styles.main}>
                <table className={styles.grid}>
                    <tbody>
                        <tr key='head'>{this.getHead()}</tr>
                        {this.getRows().map(item => item)}
                    </tbody>
                </table>
            </div>
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
        for (let dataRow of this.state.dataSet.records) {
            recNo++;
            //输出主行
            items.push(
                <tr key={items.length} onClick={this.onTrClick}>
                    {this.getRow(dataRow, recNo).map(item => item)}
                </tr>
            )

            //输出子行 
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
                    items.push(
                        <tr key={key} onClick={this.onTrClick}>
                            {React.cloneElement(child, { key: child.props.code, colSpan, dataRow: dataRow })}
                        </tr>
                    );
                }
            })
        }
        return items;
    }

    onTrClick: MouseEventHandler<HTMLTableRowElement> = (sender: any) => {
        if (!this.props.onRowClick)
            return;

        let tr: HTMLTableRowElement = sender.target.parentElement;
        let row = new DataRow();
        for (let i = 0; i < tr.children.length; i++) {
            let td = tr.children[i];
            let field = td.getAttribute('data-field');
            let value = td.innerHTML;
            if (field)
                row.setValue(field, value);
        }
        this.props.onRowClick(row)
    }

    getRow(dataRow: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow, recNo,
                    onChangedOwner: this.onChanged
                }));
        })
        return items;
    }

    onChanged: OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
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
    dataRow?: DataRow;
    recNo?: number;
    code: string;
    name: string;
    width: string;
    colSpan?: number;
    onChanged?: OnDataRowChangedEvent;
    onChangedOwner?: OnDataRowChangedEvent;
}

type ColumnStateType = {
    dataRow: DataRow;
}

export class Column extends React.Component<ColumnPropsType, ColumnStateType> {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1
    }

    constructor(props: ColumnPropsType) {
        super(props)
        this.state = { dataRow: this.props.dataRow }
    }

    render() {
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th className={styles.column}>{this.props.name}</th>
                )
            case ColumnType.td: {
                return this.getTd();
            }
            case ColumnType.span: {
                let value = '';
                if (this.props.dataRow)
                    value = this.props.dataRow.getString(this.props.code);
                let text = `${this.props.name}：${value}`;
                return (
                    <span className={styles.column}>{text}</span>
                )
            }
            default:
                throw Error('不支持的输出类型')
        }
    }

    getTd() {
        return (
            <td data-field={this.props.code} className={styles.column} colSpan={this.props.colSpan}>
                {this.getValue()}
            </td>
        )
    }

    getValue(): React.ReactNode {
        if (!this.props.children) {
            let value = '';
            if (this.props.dataRow)
                value = this.props.dataRow.getString(this.props.code);
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
                    key: items.length, dataRow: this.state.dataRow,
                    onChanged: this.onChanged
                }))
        })
        return items;
    }

    onChanged: OnFieldChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
        if (this.props.dataRow && this.props.recNo) {
            if (this.props.onChangedOwner)
                this.props.onChangedOwner(this.props.recNo, meta.code, this.state.dataRow.getValue(meta.code));
            if (this.props.onChanged)
                this.props.onChanged(this.props.recNo, meta.code, this.state.dataRow.getValue(meta.code));
        }
    }

}

type ChildRowPropsType = {
    dataRow?: DataRow;
    colSpan?: number;
}

export class ChildRow extends React.Component<ChildRowPropsType> {
    render() {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: this.props.dataRow,
                    colSpan: this.props.colSpan
                }));
        })
        return items;
    }
}