import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import styles from './Block.css';
import { ChildRow, Column, ColumnType, OnRowClickEvent } from "./DBGrid";
import Control from "./WebControl";

type propsType = {
    dataSet?: DataSet;
    readOnly?: boolean;
    onRowClick?: OnRowClickEvent;
}

type stateType = {
    rowMax: number,
}

export default class Block extends Control<propsType, stateType> {
    private arriveBottom: boolean = false;
    constructor(props: propsType) {
        super(props);
        this.state = {
            rowMax: 50,
        }
    }

    scroll() {
        if (!document.getElementById('more')) return;
        let clientHeight = document.documentElement.clientHeight;
        let bottom = document.getElementById('more').getBoundingClientRect().bottom;
        if (Math.abs(clientHeight - bottom) < 100 && !this.arriveBottom && this.state.rowMax < this.props.dataSet.size) {
            this.arriveBottom = true
            let rowMax = this.state.rowMax + 50;
            rowMax = rowMax > this.props.dataSet.size ? this.props.dataSet.size : rowMax
            this.setState({ ...this.state, rowMax: rowMax })
        }
    }

    componentWillMount(): void {
        document.querySelector('main').addEventListener('scroll', this.scroll.bind(this), false);
    }

    render() {
        return (
            <div className={styles.block}>
                {this.getRows()}
                {this.state.rowMax <= this.props.dataSet.size ? <div id='more' className={styles.more}>总记录数：{this.props.dataSet.size}</div> : ''}
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
                <div className={styles.row} key={`master_${recNo}`} data-key={`master_${recNo}`} role='tr' onClick={this.onTrClick}>
                    {this.getLines(dataRow, recNo)}
                </div>
            )
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
                    let display = 'block';
                    if (child.props.visible || (child.props.autoJudge && isHide))
                        display = 'none'
                    items.push(
                        <div className={`${styles.row} ${styles.childRow}`} key={`child_${key}`} id={`child_${key}`} data-key={`child_${key}`} role='tr' onClick={this.onTrClick}>
                            {React.cloneElement(child, { key: child.props.code, colSpan: 1, dataRow: dataRow })}
                        </div>
                    )
                }
            })
            if (this.state.rowMax <= ds.recNo) {
                break;
            }
        }
        this.arriveBottom = false;
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
        let tr: HTMLElement = sender.target.closest('div[role="tr"]');
        let reactKey: string = tr.dataset.key;

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