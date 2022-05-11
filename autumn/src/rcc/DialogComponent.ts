import React, { ReactNode } from "react";
import DataRow from "../db/DataRow";

export type OnSelectDataRowEvent = (value: DataRow) => void;

export type DialogComponentProps = {
    title?: string;
    style?: object;
    onSelect?: OnSelectDataRowEvent;
    children?: ReactNode | undefined
}

export type DialogComponentState = {
    active: () => boolean;
}

export default class DialogComponent<T extends DialogComponentProps, DialogComponentState>
    extends React.Component<T, DialogComponentState> {
    private _active: boolean;

    constructor(props: T) {
        super(props)
        this._active = false;
    }

    active = () => { return this._active }
    setActive = (active: boolean) => {
        this._active = active;
        this.setState({ ...this.state })
    };
}