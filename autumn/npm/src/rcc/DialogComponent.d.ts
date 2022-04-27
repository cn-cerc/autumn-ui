import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";
export declare type OnSelectDataRowEvent = (value: DataRow) => void;
export declare type DialogComponentProps = {
    title?: string;
    style?: object;
    onSelect?: OnSelectDataRowEvent;
    children?: ReactNode | undefined;
};
export declare type DialogComponentState = {
    active: () => boolean;
};
export default class DialogComponent<T extends DialogComponentProps, DialogComponentState> extends React.Component<T, DialogComponentState> {
    private _active;
    constructor(props: T);
    active: () => boolean;
    setActive: (active: boolean) => void;
}
