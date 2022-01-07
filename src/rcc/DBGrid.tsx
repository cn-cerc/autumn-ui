import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from './DBGrid.css';
import MutiPage, { DefaultPageSize, OnPageChanged } from "./MutiPage";
import WebControl from "./WebControl";

export type OnRowChangedEvent = (row: DataRow, field: string, oldValue: string) => void;
export type OnRowClickEvent = (row: DataRow, sender?: any) => void;

type DBGridProps = {
    dataSet: DataSet;
    readOnly?: boolean;
    onChanged?: OnRowChangedEvent;
    onRowClick?: OnRowClickEvent;
    dataJson?: string;
    openPage?: boolean;
}

type DBGridState = {
    allWidth: number,
    mutiPage: MutiPage | null,
    beginPoint: number,
    endPoint: number,
}

export type OnDataRowChangedEvent = (recNo: number, field: string, value: string) => void;

export default class DBGrid extends WebControl<DBGridProps, DBGridState> {
    static defaultProps = {
        readOnly: true,
        openPage: true,
    }
    private colunmMap: Map<string, JSX.Element>;
    constructor(props: DBGridProps) {
        super(props);
        this.state = {
            allWidth: this.getAllWidth(),
            beginPoint: 1,
            endPoint: this.props.openPage ? DefaultPageSize : this.props.dataSet.size,
            mutiPage: null,
        }
        this.initColumnMap();
    }

    componentDidUpdate(prevProps: Readonly<DBGridProps>, prevState: Readonly<DBGridState>, snapshot?: any): void {
        if (!this.props.openPage && this.props.dataSet.size !== prevProps.dataSet.size) {
            this.setState({ ...this.state, endPoint: this.props.dataSet.size })
        }
    }

    initColumnMap() {
        this.colunmMap = new Map();
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    this.colunmMap.set(child.props.code, React.cloneElement(child, { tag: ColumnType.td, key: child.props.code }))
                }
            }
        })
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
                {this.getNavigator()}
            </div>
        )
    }

    getHead(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let arr: React.ReactNode[] = Array.from(this.colunmMap.values());
        if (this.props.dataJson) {
            let dataSet = new DataSet();
            dataSet.setJson(this.props.dataJson);
            dataSet.first();
            while (dataSet.fetch()) {
                arr.forEach((child) => {
                    if (isValidElement(child)) {
                        if (child.props.code == dataSet.getString('field')) {
                            items.push(React.cloneElement(child, { tag: ColumnType.th, width: this.getWidth(child.props.width), visible: dataSet.getString('visible') == 'true' ? true : false }))
                        }
                    }
                })
            }
        } else {
            arr.forEach((child) => {
                if (isValidElement(child)) {
                    items.push(React.cloneElement(child, { tag: ColumnType.th, width: this.getWidth(child.props.width) }))
                }
            })
        }

        return items;
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let ds: DataSet = this.props.dataSet;
        for (let i = this.state.beginPoint; i <= this.state.endPoint; i++) {
            if (i > ds.size)
                break;
            ds.setRecNo(i);
            let recNo: number = ds.recNo
            let dataRow: DataRow = ds.current
            //输出主行
            items.push(
                <tr key={`master_${recNo}`} onClick={this.onTrClick.bind(this)} data-key={`master_${recNo}`}>
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
                    let isHide = true;
                    if(child.props.autoJudge) {
                        React.Children.map(child.props.children, item => {
                            if (item && dataRow.has(item.props.code) && isHide) {
                                isHide = false;
                            }
                        })
                    }
                    total++;
                    let key: string = `${recNo}.${total}`;
                    let display = 'table-row';
                    if(child.props.visible || (child.props.autoJudge && isHide))
                        display = 'none'
                    items.push(
                        <tr key={`child_${key}`} data-key={`child_${key}`} onClick={this.onTrClick.bind(this)} style={{ 'display': display }}>
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
        let tr: HTMLElement = sender.target.closest('tr');
        let reactKey: string = tr.dataset.key;
        let recNo: number = Number(reactKey.split('_')[1].split('\.')[0]);
        this.props.dataSet.setRecNo(recNo);
        this.props.onRowClick(this.props.dataSet.current, sender);
    }

    getRow(dataRow: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let arr: React.ReactNode[] = Array.from(this.colunmMap.values());
        if (this.props.dataJson) {
            let dataSet = new DataSet();
            dataSet.setJson(this.props.dataJson);
            dataSet.first();
            while (dataSet.fetch()) {
                arr.forEach((child) => {
                    if (isValidElement(child)) {
                        if (child.props.code == dataSet.getString('field')) {
                            items.push(React.cloneElement(child, { onChangedOwner: this.onChanged, dataRow, recNo, visible: dataSet.getString('visible') == 'true' ? true : false }))
                        }
                    }
                })
            }
        } else {
            arr.forEach((child) => {
                if (isValidElement(child)) {
                    items.push(React.cloneElement(child, { onChangedOwner: this.onChanged, dataRow, recNo }))
                }
            })
        }
        return items;
    }

    onChanged: OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
        this.props.dataSet.setRecNo(recNo);
        let row: DataRow = this.props.dataSet.current;
        let oldValue = row.getValue(field);
        row.setValue(field, value);
        if (this.props.onChanged)
            this.props.onChanged(row, field, oldValue);
    }

    getNavigator(): React.ReactNode {
        if (!this.props.openPage || this.props.dataSet.size <= DefaultPageSize)
            return null;
        return (
            <MutiPage total={this.props.dataSet.size} bindMutiPage={this.bindMutiPage.bind(this)} onPageChanged={this.onPageChanged} />
        )
    }

    bindMutiPage(mutiPage: MutiPage) {
        this.setState({ ...this.state, mutiPage });
    }

    onPageChanged: OnPageChanged = (beginPoint: number, endPoint: number) => {
        this.setState({ ...this.state, beginPoint, endPoint });
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
    visible?: boolean;
    autoJudge?: boolean
}

export class ChildRow extends React.Component<ChildRowPropsType> {
    render() {
        let items: React.ReactNode[] = [];
        let oldItems = (this.props.children as Array<React.ReactNode>).length || 1;
        let childNum = 0;

        React.Children.map(this.props.children, child => {
            childNum++;
            if (isValidElement(child) && child.type == Column) {
                let colSpan = child.props.colSpan;
                if (childNum == oldItems)
                    colSpan = this.props.colSpan - oldItems + 1;
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: this.props.dataRow,
                    colSpan: colSpan,
                    visible: this.props.visible
                }));
            }
        })
        return items;
    }
}