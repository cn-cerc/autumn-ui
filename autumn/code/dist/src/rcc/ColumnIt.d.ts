import React from "react";
import { Column, ColumnType } from "./DBGrid";
export declare class ColumnIt extends Column {
    static defaultProps: {
        tag: ColumnType;
        colSpan: number;
        code: string;
        width: string;
        textAlign: string;
        name: string;
    };
    getValue(): React.ReactNode;
}
