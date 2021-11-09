import { post } from "jquery";
import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";
import { OnFieldChangedEvent } from "./DBEdit";
import { Column, ColumnType, OnDataRowChangedEvent, OnDataSetChangedEvvent, OnRowClickEvent } from "./DBGrid";
import { OnSelectDataRowEvent } from "./DialogComponent";
import styles from './ComboBox.css';

type PropsType = {
    dataSource?: DataSource;
    dataField: string;
    dataName?: string;
    placeholder?: string;
    onChanged?: OnFieldChangedEvent;
    autoFocus?: boolean;
}

export type ClientSite = { left: number; top: number; }
type ComboBoxState = {
    row: DataRow;
    filterText: string;
    site: ClientSite;
}

export default class ComboBox extends React.Component<PropsType, ComboBoxState> {

    constructor(props: PropsType) {
        super(props);
        let row
        if (props.dataSource != undefined)
            row = props.dataSource.current
        else
            row = new DataRow()
        this.state = { row, site: { top: -1, left: -1 }, filterText: '' }
    }

    render() {
        let value = this.state.row.getString(this.props.dataField)
        let dataName;
        if (this.props.dataName)
            dataName = (<label htmlFor={this.props.dataField} >{this.props.dataName}：</label>)

        return (
            <span>
                {dataName}
                <input type="text" autoFocus={this.props.autoFocus} id={this.props.dataField}
                    name={this.props.dataField} value={value} onChange={this.inputOnChange}
                    placeholder={this.props.placeholder} />
                {React.Children.map(this.props.children, child => {
                    if (this.state.site.left > -1) {
                        if (isValidElement(child)) {
                            return React.cloneElement(child, {
                                onSelect: this.onListSelect, site: this.state.site,
                                filterText: this.state.filterText
                            })
                        }
                    }
                })}
            </span>
        )
    }

    inputOnChange = (sender: any) => {
        let el: HTMLInputElement = sender.target;
        let filterText: string = el.value;
        let site: ClientSite = { top: -1, left: -1 }
        if (filterText.length >= 3) {
            let pos = el.getBoundingClientRect();
            site = { top: pos.top + pos.height, left: pos.left }
        }
        this.state.row.setValue(this.props.dataField, filterText);
        this.setState({ ...this.state, site, filterText });
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(el.name));
    }

    onListSelect: OnSelectDataRowEvent = (values: DataRow) => {
        if (values.fieldDefs.fields.length == 0)
            throw new Error('返回值错误：没有任何字段')
        let value = values.getString(values.fieldDefs.fields[0].code);
        this.state.row.setValue(this.props.dataField, value);
        this.setState(this.state);
        if (this.props.onChanged)
            this.props.onChanged(this.props.dataSource.current.fieldDefs.get(this.props.dataField));
    }

}

export type OnListFilterEvent = (row: DataRow) => boolean;

type ListGridProps = {
    dataSource: DataSet;
    readOnly?: boolean;
    onFilter: OnListFilterEvent;
    onRowClick?: OnRowClickEvent;
}

type ListGridState = {
    dataSet: DataSet;
}

export class ListGrid extends React.Component<ListGridProps, ListGridState> {
    static defaultProps = {
        readOnly: true
    }
    constructor(props: ListGridProps) {
        super(props);
        this.state = { dataSet: this.props.dataSource }
    }

    render() {
        return (
            <table className={styles.grid}>
                <tbody>
                    {this.getRows().map(item => item)}
                </tbody>
            </table>
        )
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let recNo = 0;
        for (let row of this.state.dataSet.records) {
            recNo++;
            if (this.props.onFilter(row)) {
                items.push(
                    <tr key={items.length} onClick={this.onTrClick}>
                        {this.getRow(row, recNo).map(item => item)}
                    </tr>
                )
            }
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

    getRow(row: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.td, key: child.props.code, row, recNo
                }));
        })
        return items;
    }

}
