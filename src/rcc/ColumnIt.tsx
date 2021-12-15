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
        return this.props.recNo;
    }
}