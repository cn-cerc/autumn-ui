import React from "react";
import DataRow from "../db/DataRow";
import { Column, ColumnType } from "./DBGrid";

export class Checkbox extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        width: '3',
        code: '_select_',
        textAlign: 'center',
        name: '选择',
    }
    getValue(): React.ReactNode {
        return <input type='checkbox' checked={this.props.dataRow.getBoolean(this.props.code)} />
    }
}