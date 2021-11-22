import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSource from "../db/DataSource";
import FieldMeta from "../db/FieldMeta";
import DBEdit, { OnFieldChangedEvent } from "./DBEdit";

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
            this.props.onSubmit(this.state.dataSource.first);
    }

    onChanged: OnFieldChangedEvent = (meta: FieldMeta) => {
        this.setState(this.state);
    }

    render() {
        let row = this.state.dataSource.first;
        return (
            <form>
                {this.getItems().map(item => item)}
                <button onClick={this.buttonClick}>查询</button>
            </form>
        )
    }

    getItems(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        for (let meta of this.state.dataSource.first.fieldDefs.fields) {
            items.push(
                <DBEdit key={meta.code} dataRow={this.state.dataSource.first} dataField={meta.code} dataName={meta.name} placeholder={meta.remark} onChanged={this.onChanged} />
            )
        }
        return items;
    }

}
