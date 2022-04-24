import React from "react";
import { Column, ColumnType } from "./DBGrid";

export class ColumnIt extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        code: '_it_',
        width: '5',
        textAlign: 'center',
        name: '序'
    }

    getValue(): React.ReactNode {
        let bool = this.props.sortType == 'desc'
        return bool ? this.props.dataRow.dataSet.size - this.props.recNo + 1 : this.props.recNo;
    }
}