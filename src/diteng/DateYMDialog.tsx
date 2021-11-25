import React from "react";
import styles from "./DateYMDialog.css";

type propType = {
    inputId: string,
    viewId: string
}

type stateType = {
    years: number[],
    months: string[],
    year: number,
    month: string
}
export default class DateYMDialog extends React.Component<propType, stateType> {
    constructor(props: propType) {
        super(props);
        let month = String(new Date().getMonth() + 1);
        if (new Date().getMonth() + 1 < 10) {
            month = "0" + month
        }
        this.state = {
            years: this.getYears(),
            months: this.getMonths(),
            year: new Date().getFullYear(),
            month
        }
    }

    render() {
        return (
            <div className={styles.main}>
                <ul className={styles.years}>
                    {this.state.years.map((year) => <li key={year} className={year == this.state.year ? styles.checked : ''} onClick={()=>this.handleClick(year)}>{year}</li>)}
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
            return <li key={date} className={m == this.state.month ? styles.checked : ''} onClick={()=>this.handleSubmit(m)}>{date}</li>
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
        //@ts-ignore
        top.deleteDialog(this.props.viewId);
        this.setState({
            month
        })
    }
}