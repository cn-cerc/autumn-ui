import React from "react";
import DataSource from "../db/DataSource";

type PropsType = {
    dataSource: DataSource;
    dataField: string;
    label: string;
    updateRow: () => void;
}

export default class DBEdit extends React.Component<PropsType> {

    constructor(props: PropsType) {
        super(props);
    }

    onChange = (el: any) => {
        let row = this.props.dataSource.current;
        row.setValue(this.props.dataField, el.target.value);
        if (this.props.updateRow)
            this.props.updateRow();
    }

    render() {
        let ds = this.props.dataSource;
        if (!ds)
            return null;
        let row = this.props.dataSource.current;
        let value = "";
        if (row)
            value = row.getString(this.props.dataField);
        return (
            <div>{this.props.label}
                <input type="input" value={value} onChange={this.onChange} />
            </div>
        )
    }
}