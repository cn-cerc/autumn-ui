import React, { MouseEventHandler } from "react";
import DataRow from "../db/DataRow";
import { OnFieldChangedEvent } from "./DBEdit";
import WebControl from "./WebControl";
export declare type ModifyOnExecute = (row: DataRow, opera: string) => void;
declare type propsType = {
    dataRow: DataRow;
    onExecute: ModifyOnExecute;
};
declare type stateType = {
    dataRow: DataRow;
};
export default class ModifyPanel extends WebControl<propsType, stateType> {
    constructor(props: propsType);
    render(): JSX.Element;
    getItems(): React.ReactNode[];
    onChanged: OnFieldChangedEvent;
    btnExecute: MouseEventHandler<HTMLButtonElement>;
}
export {};
