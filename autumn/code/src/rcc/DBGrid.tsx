import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import FieldMeta from "../db/FieldMeta";
import { Line } from "./Block";
import DBEdit, { OnFieldChangedEvent } from "./DBEdit";
import MutiPage, { DefaultPageSize, OnPageChanged, USER_PAGE_SIZE_KEY } from "./MutiPage";
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
    allowSort?: boolean;
    className?: string;
    onKeyDown?: Function; // 用于监听表格按钮事件
    allowCheck?: boolean
}

type sortType = 'desc' | 'asc'

type DBGridState = {
    allWidth: number,
    beginPoint: number,
    endPoint: number,
    sortData: {
        code: string,
        sortType: sortType
    },
    direction: [number, number],
    allowInput: boolean,
    isInput: boolean,
}

export type OnDataRowChangedEvent = (recNo: number, field: string, value: string) => void;

export default class DBGrid extends WebControl<DBGridProps, DBGridState> {
    static defaultProps = {
        readOnly: true,
        openPage: true,
    }
    private self: any;
    private children: React.ReactNode[][];
    private allowChildren: React.ReactNode[][];
    private colunmMap: Map<string, JSX.Element>;
    private allowMap: Map<string, JSX.Element>;
    private size: number;
    constructor(props: DBGridProps) {
        super(props);
        let value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        this.size = Number(value);
        if (!this.size) {
            this.size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(this.size));
        }
        this.state = {
            allWidth: this.getAllWidth(),
            beginPoint: 1,
            endPoint: this.props.openPage ? this.size : this.props.dataSet.size,
            sortData: {
                code: '',
                sortType: null
            },
            direction: [0, 0],
            allowInput: false,
            isInput: false
        }
        this.initColumnMap();
    }

    componentDidUpdate(prevProps: DBGridProps): void {
        if (this.props.dataSet.size !== prevProps.dataSet.size) {
            if (!this.size) {
                this.size = DefaultPageSize;
                localStorage.setItem(USER_PAGE_SIZE_KEY, String(this.size));
            }
            this.setState({
                ...this.state,
                beginPoint: 1,
                endPoint: this.props.openPage ? this.size : this.props.dataSet.size,
            })
        }
    }

    initColumnMap() {
        this.colunmMap = new Map();
        this.allowMap = new Map();
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    this.colunmMap.set(child.props.code, React.cloneElement(child, { tag: ColumnType.td, key: child.props.code }))
                    if (child.props.allowCheck)
                        this.allowMap.set(child.props.code, React.cloneElement(child, { tag: ColumnType.td, key: child.props.code }));
                }
            }
        })
    }

    render() {
        this.children = [];
        this.allowChildren = [];
        if (this.props.dataSet == undefined)
            return (<div>props.dataSet is undefined</div>);
        return (
            <div className={`aui-dbgrid-main ${this.props.className || ''}`} ref={self => this.self = self} role="dbgrid" onKeyDown={this.handleKeyDown.bind(this)} tabIndex={1}>
                <table>
                    <tbody>
                        <tr key='head'>{this.getHead()}</tr>
                        {this.getRows()}
                    </tbody>
                </table>
                {this.getNavigator()}
            </div >
        )
    }

    getHead(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let arr: React.ReactNode[] = Array.from(this.colunmMap.values());
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == MainRow.className) {
                    items.push(React.cloneElement(child, { key: `head_${child.props.code}`, tag: ColumnType.th }))
                }
            }
        })
        if (this.props.dataJson) {
            let dataSet = new DataSet();
            dataSet.setJson(this.props.dataJson);
            dataSet.first();
            while (dataSet.fetch()) {
                arr.forEach((child) => {
                    if (isValidElement(child)) {
                        if (child.props.code == dataSet.getString('field')) {
                            items.push(React.cloneElement(child, { tag: ColumnType.th, width: this.getWidth(child.props.width), visible: dataSet.getString('visible') == 'true' ? true : false, setSort: this.setSort.bind(this), sortType: child.props.code == this.state.sortData.code ? this.state.sortData.sortType : null }))
                        }
                    }
                })
            }
        } else {
            arr.forEach((child) => {
                if (isValidElement(child)) {
                    items.push(React.cloneElement(child, { tag: ColumnType.th, width: this.getWidth(child.props.width), setSort: this.setSort.bind(this), sortType: child.props.code == this.state.sortData.code ? this.state.sortData.sortType : null }))
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
            let recNo: number = ds.recNo;
            let dataRow: DataRow = ds.current;
            React.Children.map(this.props.children, child => {
                if (isValidElement(child)) {
                    // @ts-ignore
                    let className = child.type.className || ''
                    if (className == MainRow.className) {
                        items.push(
                            <tr key={`master_${recNo}`} onClick={this.onTrClick.bind(this, recNo)} data-key={`master_${recNo}`} className={`${recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : ''} ${child.props.dynamicClass(dataRow) || ''}`}>
                                {React.cloneElement(child, { onChangedOwner: this.onChanged, dataRow, recNo })}
                            </tr>
                        )
                    }
                }
            })
            if (this.colunmMap.size > 0) {
                let childArr: React.ReactNode[] = this.getRow(dataRow, recNo);
                let allChildArr: React.ReactNode[] = childArr.filter((child) => {
                    return isValidElement(child) && child.props.allowCheck;
                })
                //输出主行
                items.push(
                    <tr key={`master_${recNo}`} onClick={this.onTrClick.bind(this, recNo)} data-key={`master_${recNo}`} className={recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : ''}>
                        {childArr}
                    </tr>
                )
                this.children.push(childArr);
                this.allowChildren.push(allChildArr);
            }
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
                    if (child.props.autoJudge) {
                        React.Children.map(child.props.children, item => {
                            if (item && dataRow.has(item.props.code) && isHide) {
                                isHide = false;
                            }
                        })
                    }
                    total++;
                    let key: string = `${recNo}.${total}`;
                    let display = 'table-row';
                    if (child.props.visible || (child.props.autoJudge && isHide))
                        display = 'none'
                    items.push(
                        <tr key={`child_${key}`} data-key={`child_${key}`} onClick={this.onTrClick.bind(this, recNo)} style={{ 'display': display }} className={recNo % 2 == 0 ? 'aui-dbgrid-evenLine' : ''}>
                            {React.cloneElement(child, { key: child.props.code, colSpan, dataRow: dataRow })}
                        </tr>
                    );
                }
            })
        }
        return items;
    }

    onTrClick = (recNo: number, sender: any) => {
        if (this.props.allowCheck) {
            this.state.direction[0] = recNo;
            let arr = Array.from(this.allowMap.values());
            for (let i = 1; i <= arr.length; i++) {
                if (arr[i - 1].key == sender.target.getAttribute('data-field'))
                    this.state.direction[1] = i;
            }
            this.setState({
                allowInput: false
            })
        }
        if (!this.props.onRowClick)
            return;
        this.props.dataSet.setRecNo(recNo);
        this.props.onRowClick(this.props.dataSet.current, sender);
    }

    handleKeyDown(sender: any) {
        if (this.props.onKeyDown)
            this.props.onKeyDown(sender);
        else {
            if (!this.state.direction[0] || !this.state.direction[1])
                return;
            let element = this.allowChildren[this.state.direction[0] - 1][this.state.direction[1] - 1];
            if (!isValidElement(element))
                return;
            if (!this.state.allowInput) {
                let keyCode: number = sender.keyCode;
                let allowInput = false;
                if (keyCode == 37)
                    this.state.direction[1] = this.state.direction[1] - 1 || 1;
                if (keyCode == 38)
                    this.state.direction[0] = this.state.direction[0] - 1 || 1;
                if (keyCode == 39)
                    this.state.direction[1] = this.state.direction[1] + 1 > this.allowMap.size ? this.allowMap.size : this.state.direction[1] + 1;
                if (keyCode == 40)
                    this.state.direction[0] = this.state.direction[0] + 1 > this.props.dataSet.size ? this.props.dataSet.size : this.state.direction[0] + 1;
                if (keyCode == 13 && !element.props.enterEvent)
                    allowInput = true;
                if (element.props.enterEvent && !allowInput && keyCode == 13)
                    element.props.enterEvent(this.state.direction[0]);
                this.setState({
                    allowInput
                })
            } else {
                let keyCode: number = sender.keyCode;
                if (keyCode == 13) {
                    sender.preventDefault();
                    let tr: HTMLTableRowElement = this.self.querySelectorAll(`tr[data-key^="master_"]`)[this.state.direction[0] - 1];
                    let td: HTMLTableCellElement = tr.querySelector(`td[data-field='${element.props.code}']`);
                    this.props.dataSet.records[this.state.direction[0] - 1].setValue(element.props.code, td.innerText);
                    this.setState({
                        allowInput: false,
                        isInput: false
                    }, () => {
                        this.self.focus();
                    })
                }
            }
        }
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
                            items.push(React.cloneElement(child, { onChangedOwner: this.onChanged, dataRow, recNo, visible: dataSet.getString('visible') == 'true' ? true : false, setSort: this.setSort.bind(this), sortType: child.props.code == this.state.sortData.code ? this.state.sortData.sortType : null }))
                        }
                    }
                })
            }
        } else {
            arr.forEach((child) => {
                if (isValidElement(child)) {
                    let checked: boolean = this.getChecked(child.key, recNo);
                    let allowInput: boolean = this.getAllowInput(child.key, recNo);
                    items.push(React.cloneElement(child, { onChangedOwner: this.onChanged, dataRow, recNo, checked, allowInput, onChangeInput: this.changeIsInput.bind(this), setSort: this.setSort.bind(this), sortType: child.props.code == this.state.sortData.code ? this.state.sortData.sortType : null }))
                }
            })
        }
        return items;
    }

    getChecked(key: React.Key, recNo: number) {
        let bool = false;
        let arr: React.ReactNode[] = Array.from(this.allowMap.values());
        arr.forEach((child, index) => {
            if (isValidElement(child)) {
                if (child.key == key && recNo == this.state.direction[0] && (index + 1) == this.state.direction[1])
                    bool = true
            }
        })
        return bool;
    }

    getAllowInput(key: React.Key, recNo: number) {
        let bool = false;
        let arr: React.ReactNode[] = Array.from(this.allowMap.values());
        arr.forEach((child, index) => {
            if (isValidElement(child)) {
                if (child.key == key && recNo == this.state.direction[0] && (index + 1) == this.state.direction[1] && this.state.allowInput)
                    bool = true
            }
        })
        return bool;
    }

    onChanged: OnDataRowChangedEvent = (recNo: number, field: string, value: string) => {
        this.props.dataSet.setRecNo(recNo);
        let row: DataRow = this.props.dataSet.current;
        let oldValue = row.getValue(field);
        row.setValue(field, value);
        if (this.props.onChanged)
            this.props.onChanged(row, field, oldValue);
        this.setState(this.state);
    }

    getNavigator(): React.ReactNode {
        if (!this.props.openPage || this.props.dataSet.size <= this.size)
            return null;
        return (
            <MutiPage total={this.props.dataSet.size} onPageChanged={this.onPageChanged} />
        )
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

    componentWillUnmount(): void {
        let mainArr = document.querySelectorAll(`.aui-dbgrid-main`);
        mainArr.forEach((main) => {
            main.removeEventListener('keydown', this.handleInputKeydown.bind(this))
        });
    }

    // 绑定输入框事件
    bindInputEvent() {
        let mainArr = document.querySelectorAll(`.aui-dbgrid-main`);
        mainArr[mainArr.length - 1].addEventListener('keydown', this.handleInputKeydown.bind(this))
    }

    handleInputKeydown(e: any) {
        if (e.target.tagName.toLowerCase() == 'input') {
            let element = e.target as HTMLInputElement;
            let keyCode = 0;
            keyCode = e.keyCode - 37;
            if (keyCode < 0 || keyCode > 3) return;
            let tr = element.closest('tr') as HTMLTableRowElement;
            let isMaster: boolean = tr.getAttribute('data-key').indexOf('master') > -1;
            if (keyCode % 2 == 0) {
                if (isMaster) {
                    let items = element.closest('tr').querySelectorAll('input');
                    let index = 0;
                    for (let i = 0; i < items.length; i++) {
                        if (items[i] == element) index = i; continue;
                    }
                    index = keyCode == 0 ? index - 1 : index + 1;
                    let cursor = element as HTMLInputElement;
                    if ((cursor.selectionStart == 0 && keyCode == 0) || (cursor.selectionStart == cursor.value.length && keyCode == 2)) {
                        let input = items[index] as HTMLInputElement;
                        e.preventDefault();
                        if (input) {
                            if (e.ctrlKey)
                                this.initDataSet(input, element, index);
                            input.focus();
                        }
                    }
                }
            } else {
                let items = document.querySelectorAll(`.aui-dbgrid-main input[name='${element.getAttribute('name')}']`);
                let index = 0;
                for (let i = 0; i < items.length; i++) {
                    if (items[i] == element) index = i; continue;
                }
                index = keyCode == 1 ? index - 1 : index + 1;
                let input = items[index] as HTMLInputElement;
                e.preventDefault();
                if (input) {
                    if (e.ctrlKey)
                        this.initDataSet(input, element, index);
                    input.focus();
                }
            }
        } else if (e.keyCode == 13) {
            e.preventDefault();
            this.setState({
                allowInput: !this.state.allowInput
            }, () => {
                if (!this.state.allowInput)
                    this.self.focus();
            })
        }
    }

    initDataSet(input: HTMLInputElement, element: HTMLInputElement, index: number) {
        input.value = element.value;
        if (this.props.dataSet.records[index].dataSet) {
            let row: DataRow = this.props.dataSet.records[index];
            row.dataSet.setRecNo(index);
            row.dataSet.edit.bind(row)();
        }
        this.props.dataSet.records[index].setValue(element.name, element.value);
    }

    setSort(code: string, sortString: string) {
        if (!this.props.allowSort)
            return;
        let sortType: sortType = 'asc';
        if (this.state.sortData.code == code)
            sortType = this.state.sortData.sortType == 'asc' ? 'desc' : 'asc';
        let sort: string[] = [];
        if (sortString) {
            let sortArr = sortString.split(',');
            sortArr.forEach((sortCode: string) => {
                sort.push(`${sortCode} ${sortType}`);
            })
        } else
            sort = [`${code} ${sortType}`];
        if (code == '_it_' && this.state.sortData.sortType)
            this.props.dataSet.reverse();
        else
            this.props.dataSet.setSort(...sort);
        this.setState({
            sortData: {
                code,
                sortType
            }
        });
    }

    resetDirection() {
        this.setState({
            direction: [0, 0]
        })
    }

    changeIsInput(bool: boolean) {
        this.setState({
            isInput: bool
        })
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
    textAlign?: "left" | "right" | "center";
    customText?: Function;  // 用于自定义table中的行
    customSort?: string
    visible?: boolean; //用于控制子行的
    setSort?: Function; // 用于表格排序
    sortType?: sortType,
    allowCheck?: boolean;
    checked?: boolean;
    allowInput?: boolean;
    enterEvent?: Function;
    onChangeInput?: Function
}

type ColumnStateType = {
    dataRow: DataRow;
}

export class Column extends WebControl<ColumnPropsType, ColumnStateType> {
    static className: string = "Column";
    private self: any;

    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1
    }

    constructor(props: ColumnPropsType) {
        super(props)
        this.state = {
            dataRow: this.props.dataRow
        }
    }

    componentWillReceiveProps() {
        setTimeout(() => {
            if (this.props.allowInput) {
                this.setState({
                    ...this.state
                }, () => {
                    if (this.self) {
                        let range = document.createRange();
                        range.selectNodeContents(this.self);
                        let sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                })
            }
        }, 100)

    }

    render() {
        if (this.props.recNo)
            this.props.dataRow.dataSet.setRecNo(this.props.recNo)
        if (this.props.customText && this.props.tag != ColumnType.th) {
            let child: JSX.Element = this.props.customText(this.props.dataRow);
            if (this.props.tag == ColumnType.td)
                return <td data-field={this.props.code} className={`${this.props.checked ? 'aui-dbgrid-columnCheck' : ''}`} colSpan={this.props.colSpan} align={this.props.textAlign ? this.props.textAlign : 'left'} style={{ 'display': this.props.visible ? 'none' : 'table-cell' }}>{child}</td>
            else
                return <span className='aui-dbgrid-inline' style={{ 'width': this.props.width, 'textAlign': this.props.textAlign }}>{this.props.name ? this.props.name + '：' : ''}{child}</span>

        }
        switch (this.props.tag) {
            case ColumnType.th:
                return (
                    <th style={{ "width": this.props.width, 'display': this.props.visible ? 'none' : 'table-cell' }} onClick={this.setSort.bind(this)}>{this.props.name}{this.getArrow()}</th>
                )
            case ColumnType.td: {
                return this.getTd();
            }
            case ColumnType.span: {
                return (
                    <span className='aui-dbgrid-inline' style={{ "width": this.props.width }}>
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
            <td data-field={this.props.code} className={`${this.props.checked ? 'aui-dbgrid-columnCheck' : ''}`} colSpan={this.props.colSpan} align={this.props.textAlign ? this.props.textAlign : "left"} style={{ 'display': this.props.visible ? 'none' : 'table-cell' }} contentEditable={this.props.allowInput} onFocus={this.handleFocus.bind(this)} ref={self => this.self = self}
                onBlur={this.handleBlur.bind(this)} onClick={this.handleClick.bind(this)}>
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
            if (isValidElement(child)) {
                let bool = false;
                if (child.type == DBEdit && this.state.dataRow.history)
                    bool = this.state.dataRow.getString(child.props.dataField) != this.state.dataRow.history.getString(child.props.dataField)
                items.push(React.cloneElement(child, {
                    key: items.length, dataRow: this.state.dataRow,
                    onChanged: this.onChanged,
                    changed: bool
                }))
            }
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

    setSort() {
        if (this.props.setSort)
            this.props.setSort(this.props.code, this.props.customSort);
    }

    getArrow() {
        if (this.props.sortType) {
            let arrow = this.props.sortType == 'desc' ? '↓' : '↑';
            return <span style={{ 'color': 'red' }}>{arrow}</span>
        }
    }

    handleFocus() {
        if (this.props.allowInput) {
            let range = document.createRange();
            range.selectNodeContents(this.self);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            if (this.props.onChangeInput)
                this.props.onChangeInput(true);
        }
    }

    handleBlur(e: any) {
        if (this.props.allowInput) {
            let text = e.target.innerText;
            this.props.dataRow.setValue(this.props.code, text);
            if (this.props.onChangeInput)
                this.props.onChangeInput(false);
        }
    }

    handleClick(e: any) {
        if (this.props.allowInput) {
            e.preventDefault();
            e.stopPropagation();
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
            // @ts-ignore
            if (isValidElement(child) && child.type == Column) {
                let colSpan = child.props.colSpan;
                if (childNum == oldItems)
                    colSpan = this.props.colSpan - oldItems + 1;
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, dataRow: this.props.dataRow,
                    colSpan: colSpan,
                    visible: this.props.visible
                }));
            } else if (isValidElement(child) && child.type == Line) {
                items.push(React.cloneElement(child, {
                    key: child.props.code, row: this.props.dataRow,
                    recNo: this.props.dataRow.dataSet.recNo
                }));
            }
        })
        return items;
    }
}

type MainRowTypeProps = {
    dataRow?: DataRow,
    dynamicClass?: (row: DataRow) => string,
    tag?: ColumnType;
    recNo?: number
}

type MainRowTypeState = {
    allWidth: number
}

export class MainRow extends React.Component<MainRowTypeProps, MainRowTypeState> {
    static className = 'MainRow';
    constructor(props: MainRowTypeProps) {
        super(props);
        this.state = {
            allWidth: this.getAllWidth(),
        }
    }
    render() {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className) {
                    if (this.props.tag == ColumnType.th) {
                        items.push(React.cloneElement(child, {
                            key: `head_${child.props.code}`, tag: ColumnType.th, width: this.getWidth(child.props.width)
                        }))
                    } else {
                        items.push(React.cloneElement(child, {
                            key: child.props.code, dataRow: this.props.dataRow,
                            recNo: this.props.recNo
                        }))
                    }
                }
            }
        })
        return items;
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