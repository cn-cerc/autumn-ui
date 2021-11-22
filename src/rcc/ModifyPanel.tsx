import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import styles from './ModifyPanel.css';
import WebControl from "./WebControl";

type propsType = {
    dataRow: DataRow;
    onExecute: (row: DataRow) => void;
}

type stateType = {
    dataRow: DataRow;
}

export default class ModifyPanel extends WebControl<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = { dataRow: this.props.dataRow };
    }

    render() {
        return (
            <div className={styles.main}>
                <div className={styles.head}>{this.getItems()}</div>
                <div className={styles.opera}>
                    <button onClick={this.btnExecute}>保存</button>
                    <button onClick={this.btnExecute}>生效</button>
                    <button onClick={this.btnExecute}>撤消</button>
                    <button onClick={this.btnExecute}>作废</button>
                </div>
            </div>
        )
    }

    getItems(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let key = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                let item = React.cloneElement(child, {
                    key: key++,
                    dataRow: this.state.dataRow, onChanged: this.onChanged
                });
                items.push(item);
            }
        })
        return items;
    }

    onChanged: OnFieldChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
    }

    btnExecute: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        if (this.props.onExecute)
            this.props.onExecute(this.state.dataRow);
    }
}
