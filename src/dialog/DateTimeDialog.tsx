import { BaseDialog, BaseDialogPropsType, BaseDialogStateType } from "autumn-ui";
import React from "react";
import styles from "./DateTimeDialog.css";

type DateTimeTypeState = {
    showTime: boolean,
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    second: number,
} & Partial<BaseDialogStateType>

export default class DateTimeDialog extends BaseDialog<BaseDialogPropsType, DateTimeTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.state = {
            ...this.state,
            showTime: false,
            year: null,
            month: null,
            day: null,
            hour: null,
            minute: null,
            second: null
        }
    }
    content(): JSX.Element {
        return <div className={styles.main}>
            <div className={styles.title}>
                <input type="text" readOnly value={this.getFormatDate()}/>
                <input type="text" readOnly value={this.getFormatTime()}/>
            </div>
            {this.state.showTime ? this.getDateDOM() : this.getTimeDOM()}
        </div>
    }

    getDateDOM() {
        
    }

    getTimeDOM() {

    }

    getFormatDate() {
        let date = '';
        if(this.state.year)
            date += this.state.year;
        if(this.state.month)
            date += `-${this.state.month}`
        if(this.state.day)
            date += `-${this.state.day}`
        return date;
    }

    getFormatTime() {
        let time = '';
        if(this.state.hour)
            time += this.state.hour;
        if(this.state.minute)
            time += `-${this.state.minute}`
        if(this.state.second)
            time += `-${this.state.second}`
        return time;
    }

}