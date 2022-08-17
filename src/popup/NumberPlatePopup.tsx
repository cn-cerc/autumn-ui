import { DataRow, DataSet } from "autumn-ui";
import { event } from "jquery";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./FSCusPopup.css";
import styles1 from "./NumberPlatePopup.css";

type NumberPlatePopupTypeProps = {
    deptCode: string,
} & BasePopupTypeProps

type NumberPlatePopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet,
    city_value: string,
    code_value: string
} & BasePopupTypeState

export default class NumberPlatePopup extends BasePopup<NumberPlatePopupTypeProps, NumberPlatePopupTypeState> {
    constructor(props: NumberPlatePopupTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('maxRecord', -1);
        this.state = {
            ...this.state,
            title: this.props.title || '',
            height: '25rem',
            dataRow,
            dataSet: new DataSet(),
            dataSet_: new DataSet(),
        }
    }

    content(): JSX.Element {
        return <div className={styles.main}>
            <p>车牌号<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='car_num_' class={styles.nameInput} placeHolder='请输入车牌号' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
            </ul>
            <div className={styles.buttonLine}>
                <button onClick={this.handleSubmit.bind(this, this.state.dataRow)}>确定</button>
            </div>
            {this.getLines()}
        </div>
    }

    componentDidMount(): void {
        this.init();
    }

    handleChange() {
        let arr = Array.from(this.state.dataRow.items);
        let dataSet_ = new DataSet();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.dataSet);
        dataSet.forEach((row: DataRow) => {
            let bool = true;
            arr.forEach((keyValue: any[]) => {
                if (row.getString(keyValue[0]) && row.getString(keyValue[0]).indexOf(keyValue[1]) < 0)
                    bool = false;
            })
            if (bool)
                dataSet_.append().copyRecord(row);
        })
        this.setState({
            dataSet_
        })
    }

    async init() {
        this.showLoad();
        let dataOut: DataSet = await FplApi.getCarsByDeptCode(this.state.dataRow);
        this.hideLoad();
        this.setState({
            dataSet: dataOut,
            dataSet_: dataOut
        })
    }

    getLines() {
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.dataSet_);
        dataSet.first();
        let list = [];
        while (dataSet.fetch()) {
            list.push(<li key={dataSet.recNo}>
                <span>{dataSet.recNo}</span>
                <span style={{ 'flex': '3' }}>{dataSet.getString('car_num_')}</span>
                <span>核定载重({dataSet.getString('approved_load_')})</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let carNum = row.getString('car_num_');
        if (!carNum) {
            showMsg('车牌号不可为空!');
            return;
        }
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        input1.value = row.getString('car_no_');
        input2.value = carNum;
        this.handleClose();
    }
}

type NumberPlatePopup_MCTypeProps = {
    onSelect: Function
} & BasePopupTypeProps

export class NumberPlatePopup_MC extends BasePopup<NumberPlatePopup_MCTypeProps, NumberPlatePopupTypeState> {
    private city = ['北京市：京', '广东省：粤', '福建省：闽', '湖南省：湘', '天津市：津', '山西省：晋', '河北省：冀', '辽宁省：辽', '吉林省：吉', '黑龙江省：黑',
        '上海市：沪', '江苏省：苏', '浙江省：浙', '安徽省：皖', '山东省：鲁', '河南省：豫', '湖北省：鄂', '广西壮族自治区：桂', '海南省：琼', '重庆市：渝', '四川省：川', '贵州省：贵',
        '云南省：云', '西藏自治区：藏', '陕西省：陕', '甘肃省：甘', '青海省：青', '宁夏回族自治区：宁', '新疆维吾尔自治区：新', '香港特别行政区：港', '澳门特别行政区：澳', '台湾省：台', '内蒙古自治区：内蒙古']
    private ABCCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    constructor(props: NumberPlatePopup_MCTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('maxRecord', -1);
        this.state = {
            ...this.state,
            title: this.props.title || '',
            height: '25rem',
            dataRow,
            dataSet: new DataSet(),
            dataSet_: new DataSet(),
            city_value: "",
            code_value: ""
        }
    }

    content(): JSX.Element {
        return <div className={`${styles.main} ${styles1.main}`}>
            <p className={styles1.marginLR}>车牌号<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={`${styles.inputLine} ${styles1.marginLR}`}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='car_num_' class={styles.nameInput} placeHolder='请输入车牌号' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
            </ul>
            <div className={`${styles.buttonLine} ${styles1.buttonMargin}`}>
                <button onClick={this.handleSubmit.bind(this, this.state.dataRow)}>确定</button>
            </div>
            <div className={styles1.bgDiv}></div>
            {this.getLines()}
        </div>
    }

    componentDidMount(): void {
        this.init();
        console.log(this.state.dataRow.getString("car_num_"))
    }

    handleChange() {
        let arr = Array.from(this.state.dataRow.items);
        let dataSet_ = new DataSet();
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.dataSet);
        dataSet.forEach((row: DataRow) => {
            let bool = true;
            arr.forEach((keyValue: any[]) => {
                if (row.getString(keyValue[0]) && row.getString(keyValue[0]).indexOf(keyValue[1]) < 0)
                    bool = false;
            })
            if (bool)
                dataSet_.append().copyRecord(row);
        })
        this.setState({
            dataSet_
        })
    }

    cityOnclick(e: any) {
        new Promise((resolve, reject) => {
            let city_value = e.target.innerHTML;
            city_value = city_value.charAt(city_value.length - 1)
            this.setState({
                city_value,
                code_value: ""
            })
            resolve("")
        }).then((res) => {
            let dataSet_ = new DataSet();
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.state.dataSet);
            dataSet.forEach((row: DataRow) => {
                let bool = true;
                console.log(row)
                if (row.getString("car_num_").indexOf(this.state.city_value + this.state.code_value) < 0)
                    bool = false;
                if (bool)
                    dataSet_.append().copyRecord(row);
            })
            this.setState({
                dataSet_
            })
        }, function (err) {
            console.log(err)
        })
    }

    codeOnclick(e: any) {
        new Promise((resolve, reject) => {
            let code_value = e.target.innerHTML;
            this.setState({
                code_value
            })
            resolve("")
        }).then((res) => {
            let dataSet_ = new DataSet();
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.state.dataSet);
            dataSet.forEach((row: DataRow) => {
                let bool = true;
                console.log(row)
                if (row.getString("car_num_").indexOf(this.state.city_value + this.state.code_value) < 0)
                    bool = false;
                if (bool)
                    dataSet_.append().copyRecord(row);
            })
            this.setState({
                dataSet_
            })
        }, function (err) {
            console.log(err)
        })
    }

    async init() {
        this.showLoad();
        let dataOut: DataSet = await FplApi.getCarsByDeptCode(this.state.dataRow);
        this.hideLoad();
        this.setState({
            dataSet: dataOut,
            dataSet_: dataOut
        })
    }

    getLines() {
        let dataSet = new DataSet();
        dataSet.appendDataSet(this.state.dataSet_);
        dataSet.first();
        let list = [];
        let list2 = [];
        for (let i = 0; i < this.city.length; i++) {
            list2.push(<li key={i} className={styles1.tableList}>
                <span onClick={(e) => this.cityOnclick(e)}>{this.city[i]}</span>
                <span onClick={(e) => this.codeOnclick(e)}>{this.ABCCode[i]}</span>
            </li>)
        }
        while (dataSet.fetch()) {
            list.push(<li key={dataSet.recNo} className={styles1.tableList2}>
                {/* <span>{dataSet.recNo}</span> */}
                {/* <span onClick={this.onclick.bind(this)}>{this.city[dataSet.recNo - 1]}</span>
                <span>{this.ABCCode[dataSet.recNo - 1]}</span> */}
                <span style={{ 'flex': '3' }}>{dataSet.getString('car_num_')}</span>
                {/* <span>核定载重({dataSet.getString('approved_load_')})</span> */}
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <div className={styles1.bottomDiv}>
            <ul className={styles1.bottomUl}>{list2}</ul>
            <ul className={styles1.bottomUl}>{list}</ul>
        </div>
    }

    handleSubmit(row: DataRow) {
        let carNum = row.getString('car_num_');
        if (!carNum) {
            showMsg('车牌号不可为空!');
            return;
        }
        this.props.onSelect(row);
        this.handleClose();
    }
}