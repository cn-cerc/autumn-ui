import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { OnRowClickEvent } from "./DBGrid";
import Control from "./WebControl";
declare type propsType = {
    dataSet?: DataSet;
    readOnly?: boolean;
    onRowClick?: OnRowClickEvent;
};
declare type stateType = {
    rowMax: number;
};
export default class Block extends Control<propsType, stateType> {
    private arriveBottom;
    constructor(props: propsType);
    scroll(): void;
    componentWillMount(): void;
    render(): JSX.Element;
    getRows(): React.ReactNode[];
    getLines(row: DataRow, recNo: number): React.ReactNode[];
    onTrClick: MouseEventHandler<HTMLTableRowElement>;
}
declare type LinePropsType = {
    row?: DataRow;
    readOnly?: boolean;
    className?: string;
    recNo?: number;
};
declare type LineTypeState = {
    allWidth: number;
};
export declare class Line extends Control<LinePropsType, LineTypeState> {
    constructor(props: LinePropsType);
    render(): JSX.Element;
    getRow(): React.ReactNode[];
    getAllWidth(): number;
    getWidth(width: string): string;
}
export {};
