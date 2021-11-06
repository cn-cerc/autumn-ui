import React, { MouseEventHandler } from 'react';
import DataRow from '../db/DataRow';
import KeyValue from '../db/KeyValue';
import GridConfig from './GridConfig';

export type OnTrClickEvent = (row: DataRow) => void;

const defaultProps = {
    id: ''
}
type PropsType = {
    config: GridConfig;
    onTrClick?: OnTrClickEvent;
} & Partial<typeof defaultProps>;

export default class DialogGrid extends React.Component<PropsType> {
    static defaultProps = defaultProps;
    constructor(props: PropsType) {
        super(props)
    }

    render() {
        return (
            <React.Fragment>
                <table className='dbgrid'>
                    <tbody>
                        <tr>{this.getTitles().map(item => item)}</tr>
                        {this.getRows().map(item => item)}
                    </tbody>
                </table >
            </React.Fragment>
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
                    items.push(<th key={column.code} style={style}>{title}</th>);
                }
            }
        }
        return items;
    }

    getRows(): any[] {
        let items: any[] = [];
        let ds = this.props.config.dataSet;
        ds.first()
        while (ds.fetch()) {
            this.props.config.setCurrent(ds.current);
            items.push(this.getMasterRow(ds.current));
            for (let child of this.props.config.children) {
                items.push(this.getChildRow(child, ds.current));
            }
        }
        return items;
    }

    getMasterRow(row: DataRow) {
        let key = "master_" + row.dataSet.recNo;
        let items: any[] = [];
        for (let column of this.props.config.columns) {
            if (column.visible) {
                let style = {}
                if (column.align)
                    style = { ...style, textAlign: column.align };
                if (column.onRender) {
                    items.push(<td key={column.code} style={style}>{column.onRender(column, row)}</td>);
                } else {
                    let value = row.getText(column.code);
                    items.push(<td key={column.code} style={style}>{value}</td>);
                }
            }
        }
        return <tr onClick={this.onTrClick} key={key}>{items}</tr>;
    }

    getChildRow(child: GridConfig, row: DataRow) {
        child.setCurrent(row);
        let key = "child_" + row.dataSet.recNo;
        let value: string = "";
        for (let column of child.columns) {
            if (column.visible) {
                let text = row.getText(column.code);
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
        let id = `tr${row.dataSet.recNo}_1`;
        return (<tr key={key} id={id} style={style}>
            <td colSpan={colSpan}>{value}</td>
        </tr>);
    }

    onTrClick: MouseEventHandler<HTMLTableRowElement> = (sender: any) => {
        let tr = sender.currentTarget;
        let reactKey: string;
        Object.keys(tr).forEach(function (key: string) {
            if (/^__reactInternalInstance/.test(key)) {
                reactKey = tr[key].key
            }
        })

        if (!reactKey) throw new Error('请设置key值');

        let recNo: number = Number(reactKey.split('_')[1]);
        let row: DataRow = this.props.config.dataSet.records[recNo - 1];
        if (this.props.onTrClick)
            this.props.onTrClick(row)
    };
}

