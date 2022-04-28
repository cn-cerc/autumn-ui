import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";
import WebControl from "./WebControl";
export declare type SearchPanelOnExecute = (row: DataRow) => void;
export declare type SearchPanelonFileChange = (file: string) => void;
declare type propsType = {
    dataRow: DataRow;
    onExecute: SearchPanelOnExecute;
    children?: ReactNode | undefined;
};
declare type stateType = {
    dataRow: DataRow;
};
export default class SearchPanel extends WebControl<propsType, stateType> {
    constructor(props: propsType);
    render(): JSX.Element;
    getItems(): React.ReactNode[];
    onChanged: OnFieldChangedEvent;
    btnExecute: any;
}
export interface ISearchItem {
    setDataSource(value: DataRow): Object;
}
export {};
