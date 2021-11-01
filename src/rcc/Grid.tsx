import { extend } from 'jquery';
import React, { Component } from 'react';
import { DataRow, TGridGroupChild, TGridGroupMaster } from '../Autumn-UI';
import DataSet from '../db/DataSet';
import KeyValue from '../db/KeyValue';

const defaultProps = {
    id: ''
}

type PropsType = {
    dataSet: DataSet;
    master: TGridGroupMaster;
    child?: TGridGroupChild;
} & Partial<typeof defaultProps>;

const tableStyle = {
    // border: '1px solid green',
    // width: '100%'
}

const tdStyle = {
    // border: '1px solid green'
}

const thStyle = {
    // border: '1px solid green',
    // backgroundColor: 'green',
    // color: 'white'
}

export interface IGridState {
    dataSet: DataSet
    master: TGridGroupMaster
    child?: TGridGroupChild
}

export default class Grid extends React.Component<PropsType> {
    static defaultProps = defaultProps;

    constructor(props: PropsType) {
        super(props)
    }

    getTitles(): any[] {
        let items: any[] = [];
        if (this.props.master != null) {
            let total = this.props.master.getTotalWidth();
            for (let column of this.props.master.columns) {
                let title = column.name ? column.name : column.code;
                let style = { ...thStyle };
                if (total > 0 && column.width > 0) {
                    let rate = column.width / total * 100;
                    let width = `${rate.toFixed(1)}%`;
                    style = { ...style, width }
                }
                items.push(<th key={column.code} style={style}>{title}</th>);
            }
        }
        return items;
    }

    getRows(): any[] {
        let items: any[] = [];
        let ds = this.props.dataSet;
        let recNo = ds.recNo;
        ds.first();
        while (ds.fetch()) {
            this.props.master.setCurrent(ds.getCurrent());
            items.push(this.getMasterRow(ds.getCurrent()));
            if (this.props.child != null) {
                this.props.child.setCurrent(ds.getCurrent());
                items.push(this.getChildRow(ds.getCurrent()));
            }
        }
        ds.recNo = recNo;
        return items;
    }

    getMasterRow(row: DataRow) {
        let key = "master_" + row.dataSet.recNo;
        let items: any[] = [];
        for (let column of this.props.master.columns) {
            if (column.visible) {
                if (column.onRender) {
                    items.push(<td style={tdStyle} key={column.code}>{column.onRender(column, row)}</td>);
                } else {
                    let value = row.getText(column.code);
                    let style = { ...tdStyle }
                    if (column.align)
                        style = { ...style, textAlign: column.align };
                    items.push(<td key={column.code} style={style}>{value}</td>);
                }
            }
        }
        return <tr key={key}>{items}</tr>;
    }

    getChildRow(row: DataRow) {
        let key = "child_" + row.dataSet.recNo;
        let value: string = "";
        for (let column of this.props.child.columns) {
            if (column.visible) {
                let text = row.getText(column.code);
                if (text)
                    value = value + column.name + ": " + text + " ";
            }
        }

        let child = this.props.child;
        let display = new KeyValue(child.visible);
        if (child.onOutput)
            child.onOutput(child, display);

        let style = {};
        if (!display.asBoolean())
            style = { display: 'none' };

        let colSpan = this.props.master.getColumnCount();
        let id = `tr${row.dataSet.recNo}_1`;
        return (<tr key={key} id={id} style={style}>
            <td colSpan={colSpan}>{value}</td>
        </tr>);
    }

    render() {
        if (this.props.child)
            this.props.child.setMaster(this.props.master);
        return (
            <table style={tableStyle} className='dbgrid'>
                <tbody>
                    <tr>{this.getTitles().map(item => item)}</tr>
                    {this.getRows().map(item => item)}
                </tbody>
            </table >
        )
    }

}

