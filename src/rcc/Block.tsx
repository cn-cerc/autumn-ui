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
                {this.getRows().map(item => item)}
            </div>
        )
    }

    getRows(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        for (let row of this.props.dataSet.records) {
            items.push(<div className={styles.row} key={items.length}>{this.getLines(row).map(item => item)}</div>)
        }
        return items;
    }

    getLines(row: DataRow): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let lineNo = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Line) {
                items.push(React.cloneElement(child, { row, key: lineNo++ }));
            }
        })
        return items;
    }
}

type LinePropsType = {
    row?: DataRow;
    readOnly?: boolean;
}

export class Line extends Control<LinePropsType> {
    render() {
        return (
            <div className={styles.line}>
                {this.getRow().map(item => item)}
            </div>
        )
    }

    getRow(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        React.Children.map(this.props.children, child => {
            if (isValidElement(child) && child.type == Column)
                items.push(React.cloneElement(child, {
                    tag: ColumnType.span, key: child.props.code, row: this.props.row
                }));
        })
        return items;
    }
}