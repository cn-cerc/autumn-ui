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
    border: '1px solid green',
    width: '100%'
}

const tdStyle = {
    border: '1px solid green'
}

const thStyle = {
    border: '1px solid green',
    backgroundColor: 'green',
    color: 'white'
}

export default class Grid extends React.Component<PropsType> {
    static defaultProps = defaultProps;

    constructor(props: PropsType) {
        super(props)
    }

    getTitles(): any[] {
        let items: any[] = [];
        if (this.props.master != null) {
            for (let column of this.props.master.columns) {
                let title = column.name ? column.name : column.code;
                items.push(<th style={thStyle} key={column.code}>{title}</th>);
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
            this.props.master.current = ds.getCurrent();
            items.push(this.getMasterRow(ds.getCurrent()));
            if (this.props.child != null) {
                this.props.child.current = ds.getCurrent();
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
                    items.push(<td style={tdStyle} key={column.code}>{value}</td>);
                }
            }
        }
        return <tr key={key}>{items}</tr>;
    }

    getChildRow(row: DataRow) {
        let key = "child_" + row.dataSet.recNo;
        let items: any[] = [];
        for (let column of this.props.child.columns) {
            if (column.visible) {
                let value = row.getText(column.code);
                let colSpan = this.props.master.getColumnCount();
                items.push(<td key={column.code} colSpan={colSpan}>{value}</td>);
            }
        }
        let child = this.props.child;
        let display = new KeyValue(child.visible);
        if (child.onOutput)
            child.onOutput(child, display);
        if (display.asBoolean())
            return <tr key={key}>{items}</tr>;
        else
            return <tr key={key} style={{ display: 'none' }}>{items}</tr>;
    }

    render() {
        if (this.props.child)
            this.props.child.master = this.props.master;
        return (
            <table style={tableStyle}>
                <tbody>
                    <tr>{this.getTitles().map(item => item)}</tr>
                    {this.getRows().map(item => item)}
                </tbody>
            </table >
        )
    }

}

