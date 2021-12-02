import React, { Component } from 'react';
import DataRow from '../db/DataRow';
import KeyValue from '../db/KeyValue';
import { TGridConfig } from '../vcl/TGrid';
import MutiPage, { DefaultPageSize, OnPageChanged } from './MutiPage';
import styles from './Grid.css';

const defaultProps = {
    id: ''
}

type PropsType = {
    config: TGridConfig;
    setChild: Function;
} & Partial<typeof defaultProps>;

interface stateType {
    beginPoint: number;
    endPoint: number;
}

export default class Grid extends React.Component<PropsType, stateType> {
    static defaultProps = defaultProps;

    constructor(props: PropsType) {
        super(props)
        this.state = { beginPoint: 1, endPoint: DefaultPageSize };
        $("#page").css({
            "height": "0",
            "flex": "1",
            "display": "flex",
            "flex-direction": "column"
        });
        this.props.setChild(this);
    }

    render() {
        return (
            <div className={styles.main}>
                <table>
                    <tbody>
                        <tr>{this.getTitles().map(item => item)}</tr>
                        {this.getRows().map(item => item)}
                    </tbody>
                </table >
                {this.getNavigator()}
            </div>
        )
    }

    getTitles(): any[] {
        let items: any[] = [];
        if (this.props.config != null) {
            let total = this.props.config.getTotalWidth();
            for (let column of this.props.config.columns) {
                if (column.visible) {
                    let title = column.name ? column.name : column.code;
                    let style = {};
                    if (total > 0 && column.width > 0) {
                        let rate = column.width / total * 100;
                        let width = `${rate.toFixed(1)}%`;
                        style = { ...style, width }
                    }
                    //
                    items.push(<th key={column.code} style={style} onClick={(e)=>this.gridSort(e,column.code)}>{title}</th>);
                }
            }
        }
        return items;
    }

    getRows(): any[] {
        let items: any[] = [];
        let ds = this.props.config.dataSet;
        let recNo = ds.recNo;
        for (let i = this.state.beginPoint; i <= this.state.endPoint; i++) {
            if (i > ds.size)
                break;
            ds.setRecNo(i);
            this.props.config.setCurrent(ds.current);
            items.push(this.getMasterRow(ds.current));
            for (let child of this.props.config.children) {
                items.push(this.getChildRow(child, ds.current));
            }
        }
        ds.setRecNo(recNo);
        return items;
    }

    getMasterRow(dataRow: DataRow) {
        let key = "master_" + dataRow.dataSet.recNo;
        let items: any[] = [];
        for (let column of this.props.config.columns) {
            if (column.visible) {
                if (column.onRender) {
                    items.push(<td key={column.code} role={column.code}>{column.onRender(column, dataRow)}</td>);
                } else {
                    let value = dataRow.getText(column.code);
                    let style = {}
                    if (column.align)
                        style = { ...style, textAlign: column.align };
                    items.push(<td key={column.code} style={style} role={column.code}>{value}</td>);
                }
            }
        }
        return <tr key={key} id={`tr${dataRow.dataSet.recNo}`}>{items}</tr>;
    }

    getChildRow(child: TGridConfig, dataRow: DataRow) {
        child.setCurrent(dataRow);
        let key = "child_" + dataRow.dataSet.recNo;
        let value: string = "";
        for (let column of child.columns) {
            if (column.visible) {
                let text = dataRow.getText(column.code);
                if (text)
                    value = value + column.name + ": " + text + " ";
            }
        }

        let display = new KeyValue(child.visible);
        if (child.onOutput)
            child.onOutput(child, display);

        let style = {};
        if (!display.asBoolean())
            style = { display: 'none' };

        let colSpan = this.props.config.columns.length;
        let id = `tr${dataRow.dataSet.recNo}_1`;
        return (<tr key={key} id={id} style={style}>
            <td colSpan={colSpan}>{value}</td>
        </tr>);
    }

    getNavigator(): React.ReactNode {
        if (this.props.config.dataSet.size <= DefaultPageSize)
            return null;
        return (
            <MutiPage total={this.props.config.dataSet.size} onPageChanged={this.onPageChanged} />
        )
    }

    onPageChanged: OnPageChanged = (beginPoint: number, endPoint: number) => {
        this.setState({ ...this.state, beginPoint, endPoint });
    }

    gridSort(render: any, code: string) {
        //@ts-ignore
        top.gridSort(render.currentTarget, code);
    }

    initGrid() {
        this.setState({
            beginPoint: 1,
            endPoint: DefaultPageSize
        })
    }

}

