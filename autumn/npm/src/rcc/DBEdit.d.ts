import React from "react";
import DataRow from "../db/DataRow";
import FieldMeta from "../db/FieldMeta";
import { OnSelectDataRowEvent } from "./DialogComponent";
export declare type OnFieldChangedEvent = (meta: FieldMeta) => void;
declare type PropsType = {
    dataRow?: DataRow;
    dataField: string;
    dataName?: string;
    placeholder?: string;
    onChanged?: OnFieldChangedEvent;
    autoFocus?: boolean;
    readOnly?: boolean;
    type?: 'text' | 'password' | 'checkbox' | 'number' | 'radio' | 'hidden';
    autoComplete?: string;
    onFocus?: Function;
    onBlur?: Function;
    onKeyDown?: Function;
    changed?: boolean;
    className?: string;
};
declare type DBEditState = {
    row: DataRow;
};
export declare type OnSelectValueEvent = (value: string) => void;
export interface ISelectDialog {
    select(value: string): void;
}
export default class DBEdit extends React.Component<PropsType, DBEditState> {
    static defaultProps: {
        type: string;
    };
    constructor(props: PropsType);
    render(): JSX.Element;
    selectAllText(sender: any): void;
    inputOnChange: (sender: any) => void;
    onDialogSelect: OnSelectDataRowEvent;
    handleBlur(): void;
    handleKeyDown(sender: any): void;
}
export {};
