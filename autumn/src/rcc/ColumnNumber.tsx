import React from "react";
import { Column, ColumnType } from "./DBGrid";

export class ColumnNumber extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'right',
        color: '',
    }

    getValue(): React.ReactNode {
        //@ts-ignore
        let color = this.props.color;
        if (color) {
            return <span style={{ color }}>{this.props.dataRow.getNumber(this.props.code)}</span>;
        } else
            return this.props.dataRow.getNumber(this.props.code);
    }
}