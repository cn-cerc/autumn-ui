import React from "react";
import DialogComponent, { DialogComponentProps, DialogComponentState } from "./DialogComponent";
export default class YearDialog extends DialogComponent<DialogComponentProps, DialogComponentState> {
    static defaultProps: {
        title: string;
    };
    render(): JSX.Element;
    onSelect: React.MouseEventHandler<HTMLLIElement>;
}
