import React, { isValidElement } from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import WebControl from "./WebControl";

export type SearchPanelOnExecute = (row: DataRow) => void;
export type SearchPanelonFileChange = (file: string) => void;

type propsType = {
    dataRow: DataRow;
    onExecute: SearchPanelOnExecute;
}

type stateType = {
    dataRow: DataRow;
}

export default class SearchPanel extends WebControl<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = { dataRow: this.props.dataRow };
    }

    render() {
        return (
            <form className='aui-searchPanel-main' role="searchPanel" onSubmit={this.btnExecute} style={{ 'flexDirection': this.isPhone ? 'column' : 'row' }}>
                <div className={this.isPhone ? 'aui-searchPanel-search aui-searchPanel-searchPhone' : 'aui-searchPanel-search'}>{this.getItems()}</div>
                <button onClick={this.btnExecute}>查询</button>
            </form>
        )
    }

    getItems(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let key = 0;
        React.Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                let changed = child.props.onChanged
                let item = React.cloneElement(child, {
                    key: key++,
                    dataRow: this.state.dataRow,
                    onChanged: (meta: FieldMeta) => {
                        if (changed)
                            changed();
                        this.onChanged.bind(this, meta)();
                    }
                });
                items.push(item);
            }
        })
        return items;
    }

    onChanged: OnFieldChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
    }

    btnExecute: any = (sender: any) => {
        sender.preventDefault();
        if (this.props.onExecute)
            this.props.onExecute(this.state.dataRow);
    }
}

export interface ISearchItem {
    setDataSource(value: DataRow): Object;
}