import React from "react";
import Control from "./WebControl";
import { ISelectDialog, OnSelectedEvent } from "./DBEdit";

export default class DateDialog extends Control implements ISelectDialog {

    render() {
        return (
            <div onClick={this.onSelected}>select</div>
        )
    }

    onSelected: React.MouseEventHandler<HTMLDivElement> = (sender: any) => {
        this.select('test');
    }

    select(value: string): void {
        throw new Error("Method not implemented.");
    }

}