import React from "react";
import Control from "./WebControl";
import { ISelectDialog, OnSelectedEvent } from "./DBEdit";

export default class DateDialog extends Control implements ISelectDialog {
    private _onSelected: OnSelectedEvent;

    render() {
        return (
            <div onClick={this.onSelected}>select</div>
        )
    }

    onSelected: React.MouseEventHandler<HTMLDivElement> = (sender: any) => {
        if (this._onSelected)
            this._onSelected('test');
    }

    setOnSelected(value: OnSelectedEvent): DateDialog { this._onSelected = value; return this; }
}