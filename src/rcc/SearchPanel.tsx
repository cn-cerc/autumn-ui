import React from "react";
import DataRow from "../db/DataRow";
import DataSource from "../db/DataSource";
import TControl from "./Control";

type propsType = {
    dataSource: DataSource;
    onExecute: (row: DataRow) => void;
}

export default class SearchPanel extends TControl<propsType> {

    constructor(props: propsType) {
        super(props)
    }

    render() {
        return (
            <div className='searchPanel'>
                {this.getItems().map(item => item)}
            </div>
        )
    }

    getItems(): React.ReactNode[] {
        return React.Children.map(this.props.children, (child, index) => {
            if (child.hasOwnProperty('setDataSource')) {
                let item = child as SearchItem;
                item.setDataSource(this.props.dataSource);
                return child;
            }
        })
    }
}

export interface SearchItem {
    setDataSource(value: DataSource): Object;
}