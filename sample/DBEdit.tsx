import React from "react";
import DataSource from "../src/db/DataSource";

type PropsType = {
    dataSource: DataSource;
    dataField: string;
    label: string;
}

export default class DBEdit extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props);
    }

    onChange = (el: any) => {
        let row = this.props.dataSource.getCurrent();
        row.setValue(this.props.dataField, el.target.value);
    }

    render() {
        let ds = this.props.dataSource;
        if (!ds)
            return null;
        let value = this.props.dataSource.getCurrent().getString(this.props.dataField);
        return (
            <div>{this.props.label}
                <input type="input" value={value} onChange={this.onChange} />
            </div>
        )
    }
}