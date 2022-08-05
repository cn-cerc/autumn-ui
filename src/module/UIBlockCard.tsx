import { DataRow, DataSet } from "autumn-ui";
import React, { ReactNode } from "react";
import styles from "./UIBlockCard.css";

type UIBlockCardTypeProps = {
    dataSet: DataSet
}

type UIBlockCardTypeState = {
    lineMap: Map<string, any>
    childMap: Map<string, any>
}

export default class UIBlockCard extends React.Component<UIBlockCardTypeProps, UIBlockCardTypeState> {
    constructor(props: UIBlockCardTypeProps) {
        super(props);
        let childMap = new Map();
        let lineMap = new Map();
        React.Children.map(this.props.children, (child: any) => {
            console.log(child);
            if (child.type.className === UICardLine.className) {
                lineMap.set(child.props.dataField, child);
            };
            if (child.type.className === UICardChildLine.className) {
                childMap.set(child.props.dataField, child)
            }
        })
        console.log(lineMap)
        this.state = {
            lineMap,
            childMap
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getHead()}
            {this.getContent()}
        </div>
    }

    getHead() {
        let lineArr = Array.from(this.state.lineMap);
        let list = lineArr.map((item) => {
            return <li key={`head_${item[0]}`}>{item[1].props.dataName}</li>
        })
        return <ul>{list}</ul>
    }

    getContent() {
        let ds = new DataSet();
        ds.appendDataSet(this.props.dataSet);
        ds.first();
        let items = [];
        while(ds.fetch()) {
            items.push(this.getMainLine(ds.current, ds.recNo))
            items.push(this.getChildLine(ds.current, ds.recNo))
        }
        return <div>{items}</div>
    }

    getMainLine(row: DataRow, recNo: number) {
        let lineArr = Array.from(this.state.lineMap);
        let list = lineArr.map((item) => {
            return <li key={`line${recNo}_${item[0]}`}>{this.getText(item, row)}</li>
        })
        return <ul key={`line${recNo}`}>{list}</ul>
    }

    getChildLine(row: DataRow, recNo: number) {
        let lineArr = Array.from(this.state.childMap);
        let list = lineArr.map((item) => {
            return React.cloneElement(item[1], {
                dataRow: row,
                recNo,
                key: `childLine${recNo}`
            })
        })
        return list;
    }

    getText(item: any, row: DataRow) {
        if(item[1].props.customText) {
            return item[1].props.customText();
        } else
            return row.getString(item[0]);
    }
}

type UICardLineTypeProps = {
    dataField: string,
    dataName: string,
    width: number,
    customText?: Function
}

export class UICardLine extends React.Component<UICardLineTypeProps> {
    static className = 'UICardLine';
    constructor(props: UICardLineTypeProps) {
        super(props);
    }
}

type UICardChildLineTypeProps = {
    dataRow?: DataRow
    recNo?: number
}

export class UICardChildLine extends React.Component<UICardChildLineTypeProps> {
    static className = 'UICardChildLine';
    constructor(props: UICardChildLineTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        let list: ReactNode[] = [];
        React.Children.map(this.props.children, (child: any) => {
            if (child.type.className === UICardLine.className) {
                list.push(<li key={`childLine${this.props.recNo}_${child.props.dataField}`}>{this.props.dataRow.getString(child.props.dataField)}</li>)
            };
        })
        return <ul>{list}</ul>
    }
}