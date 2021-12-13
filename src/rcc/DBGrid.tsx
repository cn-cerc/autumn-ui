import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from './DBGrid.css';
import WebControl from "./WebControl";

export type OnDataSetChangedEvvent = (dataSet: DataSet) => void;
export type OnRowClickEvent = (row: DataRow) => void;

type DBGridProps = {
    dataSet: DataSet;
    readOnly?: boolean;
    onChanged?: OnDataSetChangedEvvent;
    onRowClick?: OnRowClickEvent;
    showOrder?: boolean,
    orderWidth?: string
}

type DBGridState = {
    dataSet: DataSet;
    allWidth: number
}

export type OnDataRowChangedEvent = (recNo: number, field: string, value: string) => void;

export default class DBGrid extends WebControl<DBGridProps, DBGridState> {
    static defaultProps = {
        readOnly: true
    }
    constructor(props: DBGridProps) {
        super(props);
        this.state = {
            dataSet: this.props.dataSet,
            allWidth: this.getAllWidth()
        }

    }

    render() {
        if (this.props.dataSet == undefined)
            return (<div>props.dataSet is undefined</div>);
        return (
            <div className={styles.main} role="dbgrid">
                <table className={styles.grid}>
                    <tbody>
                        <tr key='head'>{this.getHead()}</tr>
                        {this.getRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    getHead(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        if (this.props.showOrder) {
            items.push(<Column key="orderTitle" code="order" name="序号" width={this.props.orderWidth ? this.getWidth(this.props.orderWidth) : this.getWidth('5')} tag={ColumnType.th}></Column>)
        }
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column) {
                items.push(React.cloneElement(child, { tag: ColumnType.th, key: child.props.code, width: this.getWidth(child.props.width) }));
            }
        })
        return items;
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let recNo = 0;
        for (let dataRow of this.props.dataSet.records) {
            recNo++;
            //输出主行
            items.push(
                <tr key={recNo} onClick={this.onTrClick}>
                    {this.getRow(dataRow, recNo)}
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
        let tr: HTMLTableRowElement = sender.target.closest('tr');
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
        if (this.props.showOrder) {
            items.push(<Column key={`order${recNo}`} code="order" textAlign='center' name="序号" width={this.props.orderWidth ? this.props.orderWidth : '5'} customText={() => <span>{recNo}</span>}></Column>)
        }
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

    getAllWidth() {
        let width: number = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column) {
                width += Number(child.props.width)
            }
        })
        if (this.props.showOrder)
            width += Number(this.props.orderWidth) || 5;
        return width;
    }

    getWidth(width: string) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
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
    name?: string;
    width: string;
    colSpan?: number;
    onChanged?: OnDataRowChangedEvent;
    onChangedOwner?: OnDataRowChangedEvent;
    textAlign?: "left" | "right" | "center" | "char";
    customText?: Function;  // 用于自定义table中的行
}

type ColumnStateType = {
    dataRow: DataRow;
}

export class Column extends WebControl<ColumnPropsType, ColumnStateType> {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1
    }

    constructor(props: ColumnPropsType) {
        super(props)
        this.state = { dataRow: this.props.dataRow }
    }

    render() {
        if (this.props.customText && this.props.tag != ColumnType.th) {
            let child: JSX.Element = this.props.customText(this.props.dataRow);
            if (this.props.tag == ColumnType.td)
                return <td align={this.props.textAlign ? this.props.textAlign : 'left'}>{child}</td>
            else
                return <span style={{ 'width': this.props.width, 'display': 'inline-block', 'text-align': this.props.textAlign ? this.props.textAlign : 'left' }}>{child}</span>

        }
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th className={styles.column} style={{ "width": this.props.width }}>{this.props.name}</th>
                )
            case ColumnType.td: {
                return this.getTd();
            }
            case ColumnType.span: {
                let value = '';
                let name = '';
                if (this.props.dataRow)
                    value = this.props.dataRow.getString(this.props.code);
                if (this.props.name)
                    name = `${this.props.name}：`
                let text = `${name}${value}`;
                return (
                    <span className={styles.column} style={{ "width": this.props.width, 'display': 'inline-block' }}>{text}</span>
                )
            }
            default:
                throw Error('不支持的输出类型')
        }
    }

    getTd() {
        return (
            <td data-field={this.props.code} className={styles.column} colSpan={this.props.colSpan} align={this.props.textAlign ? this.props.textAlign : "left"}>
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