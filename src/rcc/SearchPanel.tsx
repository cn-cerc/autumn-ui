import React, { isValidElement, MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSource from "../db/DataSource";
import FieldMeta from "../db/FieldMeta";
import { OnFieldChangedEvent } from "./DBEdit";
import WebControl from "./WebControl";

type propsType = {
    dataSource: DataSource;
    onExecute: (row: DataRow) => void;
}

type stateType = {
    dataSource: DataSource;
}

export default class SearchPanel extends WebControl<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = { dataSource: this.props.dataSource };
    }

    render() {
        return (
            <div className='searchPanel'>
                {this.getItems().map(item => item)}
                <button onClick={this.btnExecute}>查询</button>
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
                    dataSource: this.state.dataSource, onChanged: this.onChanged
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
            this.props.onExecute(this.state.dataSource.current);
    }
}

export interface ISearchItem {
    setDataSource(value: DataSource): Object;
}