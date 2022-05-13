import React from "react";
import { DataRow, BaseDialogPropsType, BaseDialogStateType, BaseDialog } from "autumn-ui";
import styles from './DateDialog.css';

type YearType = {
    years: any[],
    year: number,
    onClick: Function
}

class Year extends React.Component<YearType> {
    constructor(props: YearType) {
        super(props);
    }

    render() {
        return (
            <div className='yearList'>
                <div className={styles.listTitle}>年：</div>
                <ul key="yearList">{this.getList()}</ul>
            </div>

        )
    }

    getList() {
        let list = this.props.years.map((year) => (
            <li key={"year" + year} className={year == this.props.year ? styles.checked : ''} onClick={() => this.props.onClick(year)}>{year}</li>
        ))
        return list;
    }
}

type MonthType = {
    months: any[],
    month: number,
    onClick: Function
}

class Month extends React.Component<MonthType> {
    constructor(props: MonthType) {
        super(props)
    }

    render() {
        return (
            <div className='monthList'>
                <div className={styles.listTitle}>月：</div>
                <ul key="monthList">{this.getList()}</ul>
            </div>
        )
    }

    getList() {
        let list = this.props.months.map((month, index) => (
            <React.Fragment key={"month" + month + index}>
                <li className={Number(month) == this.props.month ? styles.checked : ''} onClick={() => this.props.onClick(Number(month))}>{month}</li>{index == 5 ? (<br />) : ""}
            </React.Fragment>
        ))
        return list;
    }
}

type TableProp = {
    year: number,
    month: number,
    date: number,
    onClick: Function
}

type TableState = {
    weekArr: string[]
}

class DayTable extends React.Component<TableProp, TableState> {
    constructor(props: TableProp) {
        super(props)
        this.state = {
            weekArr: ["日", "一", "二", "三", "四", "五", "六"]
        }
    }

    render() {
        return (
            <table>
                <tbody>
                    {this.getTableHead()}
                    {this.getTableContent()}
                </tbody>
            </table>
        )
    }

    getTableHead() {
        let list = this.state.weekArr.map((week, index) => (<th key={"th" + index}>{week}</th>))
        return (<tr key={"tr0"}>{list}</tr>)
    }

    getTableContent() {
        let days = new Date(this.props.year, this.props.month, 0).getDate();
        let beginDay = Number(new Date(this.props.year, this.props.month - 1, 1).getDay());
        let begin = 1;
        let lines = Array(Math.ceil((days + beginDay) / 7)).fill(null).map((week, weekIndex) => {
            let line = [];
            let start = 0;
            if (weekIndex == 0 && beginDay > 0) {
                for (let i = 0; i < beginDay; i++) {
                    line.push((<td key={"td" + (weekIndex + 1) + "_" + (i + 1)}></td>))
                }
                start = beginDay;
            }
            while (start < 7 && begin <= days) {
                start++;
                let day = begin;
                line.push((
                    <td align="center" key={"td" + (weekIndex + 1) + "_" + (start + 1)} className={begin == this.props.date ? styles.checked : styles.date} onClick={() => this.props.onClick(day)}>{begin < 10 ? "0" + begin : begin}</td>
                ))
                beginDay++;
                begin++;
            }
            while (start < 7 && begin > days) {
                start++;
                line.push((<td key={"td" + (weekIndex + 1) + "_" + (start + 1)}></td>))
            }
            return (<tr key={"tr" + (weekIndex + 1)}>{line}</tr>)
        });
        return lines;
    }
}

type DateTypeProps = {
    dataRow?: DataRow,
    dataField?: string,
    handleSelect?: Function
} & Partial<BaseDialogPropsType>

type stateType = {
    years: number[],
    months: string[],
    year: number,
    month: number,
    date: number,
} & Partial<BaseDialogStateType>

export default class DateDialog extends BaseDialog<DateTypeProps, stateType> {
    constructor(props: DateTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            years: this.getYears(),
            months: this.getMonths(),
            year: Number(new Date().getFullYear()),
            month: Number(new Date().getMonth() + 1),
            date: Number(new Date().getDate()),
            width: "37.5rem",
            height: "26rem"
        }
        this.setTitle('日期选择');
    }

    getYears(): number[] {
        let arr = Array(5).fill(null);
        let year = new Date().getFullYear();
        let yearArr = arr.map((data, index) => year + index - 3);
        return yearArr;
    }

    getMonths(): any {
        let arr = Array(12).fill(null);
        let monthArr = arr.map((data, i) => {
            let index = i + 1;
            return index < 10 ? "0" + index : String(index);
        });
        return monthArr;
    }

    handleClickByYear(year: number) {
        this.setState({
            year,
            date: 0,
        })
    }

    handleClickByMonth(month: number) {
        this.setState({
            month,
            date: 0
        })
    }

    handleClickByDate(date: number) {
        let month = this.state.month < 10 ? "0" + this.state.month : this.state.month;
        let day = date < 10 ? "0" + date : date;
        let resultDate = this.state.year + "-" + month + "-" + day;
        if (this.props.isChild) {
            this.props.dataRow.setValue(this.props.dataField, resultDate);
            this.props.handleSelect();
            this.handleClose();
        } else {
            $("#" + this.props.inputId, parent.document).val(resultDate);
            this.setState({ date });
            this.handleSelect();
        }

    }

    content(): JSX.Element {
        return (
            <div className={styles.dateDialog} >
                <div className='date'>
                    <Year years={this.state.years} year={this.state.year} onClick={this.handleClickByYear.bind(this)} />
                    <Month months={this.state.months} month={this.state.month} onClick={this.handleClickByMonth.bind(this)} />
                </div>
                <DayTable year={this.state.year} month={this.state.month} date={this.state.date} onClick={this.handleClickByDate.bind(this)} />
            </div>
        )
    }
}