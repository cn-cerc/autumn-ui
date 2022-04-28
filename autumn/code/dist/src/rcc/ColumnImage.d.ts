import React from "react";
import { Column, ColumnPropsType, ColumnType } from "./DBGrid";
export declare type ImagePropsType = {
    imgWidth?: string;
    imgHeight?: string;
} & ColumnPropsType;
export declare class ColumnImage extends Column {
    static defaultProps: {
        tag: ColumnType;
        colSpan: number;
        textAlign: string;
        imgWidth: string;
        imgHeight: string;
    };
    constructor(props: ImagePropsType);
    getValue(): React.ReactNode;
}
