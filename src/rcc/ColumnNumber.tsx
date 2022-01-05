import React from "react";
import { Column, ColumnType } from "./DBGrid";

export class ColumnNumber extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'right',
    }

    getValue(): React.ReactNode {
        return this.props.dataRow.getNumber(this.props.code);
    }
}