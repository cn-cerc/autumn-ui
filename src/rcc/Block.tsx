import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import styles from './Block.css';
import { Column, ColumnType, OnRowClickEvent } from "./DBGrid";
import Control from "./WebControl";

type propsType = {
    dataSet?: DataSet;
    readOnly?: boolean;
    onRowClick?: OnRowClickEvent;
}

export default class Block extends Control<propsType> {

    render() {
        return (
            <div className={styles.block}>
                {this.getRows()}
            </div>
        )
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let ds = this.props.dataSet;
        ds.first();
        while (ds.fetch()) {
            let recNo: number = ds.recNo
            let dataRow: DataRow = ds.current
            items.push(
                <div className={styles.row} key={`master_${recNo}`} role='tr' onClick={this.onTrClick}>
                    {this.getLines(dataRow, recNo)}
                </div>
            )
        }
        return items;
    }

    getLines(row: DataRow, recNo: number): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let lineNo = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Line) {
                items.push(React.cloneElement(child, { row, key: lineNo++, recNo: recNo }));
            }
        })
        return items;
    }

    onTrClick: MouseEventHandler<HTMLTableRowElement> = (sender: any) => {
        if (!this.props.onRowClick)
            return;
        let tr = sender.target.closest('div[role="tr"]');
        let reactKey: string;
        Object.keys(tr).forEach(function (key: string) {
            if (/^__reactInternalInstance/.test(key)) {
                reactKey = tr[key].key
            }
        })
        if (!reactKey) throw new Error('请设置key值');

        let recNo: number = Number(reactKey.split('_')[1].split('\.')[0]);
        this.props.dataSet.setRecNo(recNo);
        this.props.onRowClick(this.props.dataSet.current)
    }

}

type LinePropsType = {
    row?: DataRow;
    readOnly?: boolean;
    className?: string;
    recNo?: number
}

type LineTypeState = {
    allWidth: number
}

export class Line extends Control<LinePropsType, LineTypeState> {
    constructor(props: LinePropsType) {
        super(props);
        this.state = {
            allWidth: this.getAllWidth()
        }
    }

    render() {
        return (
            <div className={this.props.className ? styles.line + ` ${this.props.className}` : styles.line}>
                {this.getRow()}
            </div>
        )
    }

    getRow(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                // @ts-ignore
                let className = child.type.className || ''
                if (className == Column.className)
                    items.push(React.cloneElement(child, {
                        tag: ColumnType.span, key: child.props.code, dataRow: this.props.row, recNo: this.props.recNo, width: this.getWidth(child.props.width)
                    }));
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