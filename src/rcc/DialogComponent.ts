import React from "react";
import DataRow from "../db/DataRow";

export type OnSelectDataRowEvent = (value: DataRow) => void;

export type DialogComponentProps = {
    onSelect?: OnSelectDataRowEvent;
}

export type DialogComponentState = {
    active: boolean;
}

export default class DialogComponent<T extends DialogComponentProps, S extends DialogComponentState>
    extends React.Component<T, S> {

    constructor(props: T) {
        super(props)
    }

    setActive = (active: boolean) => {
        this.setState({ ...this.state, active })
    }

}