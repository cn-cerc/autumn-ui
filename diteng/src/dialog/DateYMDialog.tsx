import React from "react";
import BaseDialog, { BaseDialogStateType, BaseDialogPropsType } from "../rcc/BaseDialog";
import styles from "./DateYMDialog.css";

type DateYMTypeProps = {
    inputId: string,
} & Partial<BaseDialogPropsType>

type DateYMTypeState = {
    years: number[],
    months: string[],
    year: number,
    month: string
}  & Partial<BaseDialogStateType>
export default class DateYMDialog extends BaseDialog<DateYMTypeProps, DateYMTypeState> {
    constructor(props: DateYMTypeProps) {
        super(props);
        let month = String(new Date().getMonth() + 1);
        if (new Date().getMonth() + 1 < 10) {
            month = "0" + month
        }
        this.setTitle('请选择年月');
        this.state = {
            ...this.state,
            years: this.getYears(),
            months: this.getMonths(),
            year: new Date().getFullYear(),
            month,
            width: '25rem',
            height: '16rem'
        }
    }

    content() {
        return (
            <div className={styles.main}>
                <ul className={styles.years}>
                    {this.state.years.map((year) => <li key={year} className={year == this.state.year ? styles.checked : ''} onClick={() => this.handleClick(year)}>{year}</li>)}
                </ul>
                <ul className={styles.months}>
                    {this.getMonthList()}
                </ul>
            </div>
        )
    }

    getYears() {
        let arr = Array(5).fill(null);
        let year = new Date().getFullYear();
        let yearArr = arr.map((data, index) => year + index - 3);
        return yearArr;
    }

    getMonths() {
        let arr = Array(12).fill(null).map((m, i) => {
            let month = String(i + 1);
            if (i + 1 < 10)
                month = "0" + month;
            return month;
        });
        return arr;
    }

    getMonthList() {
        let arr = this.state.months.map((m) => {
            let date = this.state.year.toString() + m;
            return <li key={date} className={m == this.state.month ? styles.checked : ''} onClick={() => this.handleSubmit(m)}>{date}</li>
        })
        return arr;
    }

    handleClick(year: number) {
        this.setState({
            year,
            month: ''
        })
    }

    handleSubmit(month: string) {
        $("#" + this.props.inputId, parent.document).val(this.state.year.toString() + month)
        this.setState({
            month
        });
        this.handleSelect();
    }
}