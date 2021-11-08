import React from "react";
import DataRow from "../db/DataRow";
import DialogComponent, { DialogComponentProps, DialogComponentState } from "./DialogComponent";
import { DialogForm } from "./DialogForm";
import './YearDialog.css';

export default class YearDialog extends DialogComponent<DialogComponentProps, DialogComponentState> {

    static defaultProps = {
        title: '选择年份'
    }

    render() {
        return (
            <DialogForm title={this.props.title} active={this.active} setActive={this.setActive}>
                <ul>
                    <li onClick={this.onSelect}>2019</li>
                    <li onClick={this.onSelect}>2020</li>
                    <li onClick={this.onSelect}>2021</li>
                </ul>
            </DialogForm>
        )
    }

    onSelect: React.MouseEventHandler<HTMLLIElement> = (sender: any) => {
        if (this.props.onSelect) {
            let el: HTMLLIElement = sender.target;
            let row = new DataRow();
            row.setValue('year', el.innerText);
            this.props.onSelect(row);
        }
        this.setActive(false);
    }

}