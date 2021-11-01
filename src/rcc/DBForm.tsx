import React, { MouseEventHandler, ReactNode } from "react";
import { DataRow, FieldMeta } from "../Autumn-UI";
import DataSource from "../db/DataSource";
import DBEdit, { OnChangedEvent } from "./DBEdit";

interface propsType {
    dataSource: DataSource;
    onSubmit: (row: DataRow) => void;
}

interface stateType {
    dataSource: DataSource;
}

export default class DBForm extends React.Component<propsType, stateType> {

    constructor(props: propsType) {
        super(props);
        this.state = { dataSource: props.dataSource };
    }

    buttonClick: MouseEventHandler<HTMLButtonElement> = (sender: any) => {
        sender.preventDefault();
        if (this.props.onSubmit)
            this.props.onSubmit(this.state.dataSource.current);
    }

    onChanged: OnChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
    }

    render() {
        let row = this.state.dataSource.current;
        return (
            <form>
                {this.getItems().map(item => item)}
                <button onClick={this.buttonClick}>查询</button>
            </form>
        )
    }

    getItems(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        for (let meta of this.state.dataSource.current.fieldDefs.fields) {
            items.push(
                <DBEdit key={meta.code} dataSource={this.state.dataSource} dataField={meta.code} dataName={meta.name} placeholder={meta.remark} onChanged={this.onChanged} />
            )
        }
        return items;
    }

}
