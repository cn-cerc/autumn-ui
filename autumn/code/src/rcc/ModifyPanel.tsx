import React, { isValidElement, MouseEventHandler, ReactNode } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import WebControl from "./WebControl";

export type ModifyOnExecute = (row: DataRow, opera: string) => void;

type propsType = {
    dataRow: DataRow;
    onExecute: ModifyOnExecute;
    children?: ReactNode | undefined
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
            <div className='aui-modifyPanel-main'>
                <div className='aui-modifyPanel-main'>{this.getItems()}</div>
                <div className='aui-modifyPanel-opera'>
                    <button data-opera='save' onClick={this.btnExecute}>保存</button>
                    <button data-opera='final' onClick={this.btnExecute}>生效</button>
                    <button data-opera='unchange' onClick={this.btnExecute}>撤消</button>
                    <button data-opera='reclace' onClick={this.btnExecute}>作废</button>
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
        let button: HTMLButtonElement = sender.target;
        let opera = button.dataset.opera;
        if (this.props.onExecute) {
            this.props.onExecute(this.state.dataRow, opera);
        }
    }
}
