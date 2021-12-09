import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import Control from "./WebControl";
import { Column, ColumnType } from "./DBGrid";
import styles from './Block.css';

type propsType = {
    dataSet?: DataSet;
    readOnly?: boolean;
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
        let recNo = 0;
        for (let row of this.props.dataSet.records) {
            recNo++;
            items.push(<div className={styles.row} key={items.length}>{this.getLines(row, recNo)}</div>)
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
}

type LinePropsType = {
    row?: DataRow;
    readOnly?: boolean;
    className?: string;
    showOrder?: boolean;
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
        if (this.props.showOrder) {
            items.push((
                <Column width={this.getWidth('5')} key={'order'} code='order' tag={ColumnType.span} customText={() => <span>{this.props.recNo}</span>}></Column>
            ))
        }
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.span, key: child.props.code, dataRow: this.props.row, width: this.getWidth(child.props.width)
                }));
        })
        return items;
    }

    getAllWidth() {
        let width: number = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column) {
                width += Number(child.props.width)
            }
        })
        if (this.props.showOrder) {
            width += 5;
        }
        return width;
    }

    getWidth(width: string) {
        return (Number(width) / this.state.allWidth) * 100 + "%";
    }
}