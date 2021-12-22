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
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    items.push(React.cloneElement(child, { tag: ColumnType.th, key: child.props.code, width: this.getWidth(child.props.width) }));
                }
            }
        })
        return items;
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let ds: DataSet = this.props.dataSet;
        ds.first()
        while (ds.fetch()) {
            let recNo: number = ds.recNo
            let dataRow: DataRow = ds.current
            //输出主行
            items.push(
                <tr key={`master_${recNo}`} onClick={this.onTrClick}>
                    {this.getRow(dataRow, recNo)}
                </tr>
            )

            //输出子行 
            let colSpan = 0;
            React.Children.map(this.props.children, child => {
                if (isValidElement(child)) {
                    // @ts-ignore
                    let className = child.type.className || ''
                    if (className == Column.className) {
                        colSpan++;
                    }
                }
            })
            let total = 0;
            React.Children.map(this.props.children, child => {
                if (isValidElement(child) && child.type == ChildRow) {
                    total++;
                    let key: string = `${recNo}.${total}`;
                    items.push(
                        <tr key={`child_${key}`} onClick={this.onTrClick} style={{ 'display': child.props.visible ? 'none' : 'table-row' }}>
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
        let tr = sender.target.closest('tr');
        let reactKey: string;
        Object.keys(tr).forEach(function (key: string) {
            if (/^__reactInternalInstance/.test(key)) {
                reactKey = tr[key].key
            }
        })
        if (!reactKey) throw new Error('请设置key值');

        let recNo: number = Number(reactKey.split('_')[1].split('\.')[0]);
        this.props.dataSet.setRecNo(recNo);
        this.props.onRowClick(this.props.dataSet.current);
    }

    getRow(dataRow: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className)
                    items.push(React.cloneElement(child, {
                        tag: ColumnType.td, key: child.props.code, dataRow, recNo,
                        onChangedOwner: this.onChanged
                    }));
            }
        })
        return items;
    }

    onChanged: OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
        this.props.dataSet.setRecNo(recNo);
        this.props.dataSet.setValue(field, value);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSet);
    }

    getAllWidth() {
        let width: number = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    width += Number(child.props.width)
                }
            }
        })
        return width;
    }

    getWidth(width: string) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
    }
}

export enum ColumnType {
    th, td, span
}

export type ColumnPropsType = {
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
    visible?: boolean; //用于控制子行的
}

type ColumnStateType = {
    dataRow: DataRow;
}

export class Column extends WebControl<ColumnPropsType, ColumnStateType> {
    static className: string = "Column";

    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1
    }

    constructor(props: ColumnPropsType) {
        super(props)
        this.state = { dataRow: this.props.dataRow }
    }

    render() {
        if (this.props.recNo)
            this.props.dataRow.dataSet.setRecNo(this.props.recNo)
        if (this.props.customText && this.props.tag != ColumnType.th) {
            let child: JSX.Element = this.props.customText(this.props.dataRow);
            if (this.props.tag == ColumnType.td)
                return <td colSpan={this.props.colSpan} align={this.props.textAlign ? this.props.textAlign : 'left'} style={{ 'display': this.props.visible ? 'none' : 'table-cell' }}>{child}</td>
            else
                return <span style={{ 'width': this.props.width, 'display': 'inline-block', 'text-align': this.props.textAlign ? this.props.textAlign : 'left' }}>{child}</span>

        }
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th className={styles.column} style={{ "width": this.props.width, 'display': this.props.visible ? 'none' : 'table-cell' }}>{this.props.name}</th>
                )
            case ColumnType.td: {
                return this.getTd();
            }
            case ColumnType.span: {
                return (
                    <span className={styles.column} style={{ "width": this.props.width, 'display': 'inline-block' }}>
                        {this.props.name ? this.props.name + '：' : ''}
                        {this.props.dataRow ? this.getValue() : ''}
                    </span>
                )
            }
            default:
                throw Error('不支持的输出类型')
        }
    }

    getTd() {
        return (
            <td data-field={this.props.code} className={styles.column} colSpan={this.props.colSpan} align={this.props.textAlign ? this.props.textAlign : "left"} style={{ 'display': this.props.visible ? 'none' : 'table-cell' }}>
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
    visible?: boolean
}

export class ChildRow extends React.Component<ChildRowPropsType> {
    render() {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: this.props.dataRow,
                    colSpan: this.props.colSpan,
                    visible: this.props.visible
                }));
        })
        return items;
    }
}