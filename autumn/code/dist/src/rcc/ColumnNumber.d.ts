import React from "react";
import { Column, ColumnType } from "./DBGrid";
export declare class ColumnNumber extends Column {
    static defaultProps: {
        tag: ColumnType;
        colSpan: number;
        textAlign: string;
        color: string;
    };
    getValue(): React.ReactNode;
}
