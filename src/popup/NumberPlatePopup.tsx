import { DataRow, DataSet } from "autumn-ui";
import { event } from "jquery";
import React from "react";
import FplApi from "../api/FplApi";
import StaticFile from "../static/StaticFile";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./FSCusPopup.css";
import numberStyle from "./NumberPlatePopup.css";

type NumberPlatePopupTypeProps = {
    deptCode: string,
} & BasePopupTypeProps

type NumberPlatePopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet,
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

type NumberPlatePopup_MCTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet,
    provinceIndex: number,
    cityCodeIndex: number,
    showIcon: boolean,
    isAuth: boolean
} & BasePopupTypeState

export class NumberPlatePopup_MC extends BasePopup<NumberPlatePopup_MCTypeProps, NumberPlatePopup_MCTypeState> {
    private provinceArr = [{ name: '安徽', shortName: '皖' }, { name: '澳门', shortName: '澳' }, { name: '北京', shortName: '京' }, { name: '重庆', shortName: '渝' }, { name: '福建', shortName: '闽' }, { name: '甘肃', shortName: '甘' }, { name: '广东', shortName: '粤' }, { name: '广西', shortName: '桂' }, { name: '贵州', shortName: '黔' }, { name: '海南', shortName: '琼' }, { name: '河北', shortName: '冀' }, { name: '河南', shortName: '豫' }, { name: '黑龙江', shortName: '黑' }, { name: '湖北', shortName: '鄂' }, { name: '湖南', shortName: '湘' }, { name: '吉林', shortName: '吉' }, { name: '江苏', shortName: '苏' }, { name: '江西', shortName: '赣' }, { name: '辽宁', shortName: '辽' }, { name: '内蒙古', shortName: '蒙' }, { name: '宁夏', shortName: '宁' }, { name: '青海', shortName: '青' }, { name: '山东', shortName: '鲁' }, { name: '山西', shortName: '晋' }, { name: '陕西', shortName: '陕' }, { name: '上海', shortName: '沪' }, { name: '四川', shortName: '川' }, { name: '台湾', shortName: '台' }, { name: '天津', shortName: '津' }, { name: '西藏', shortName: '藏' }, { name: '香港', shortName: '港' }, { name: '新疆', shortName: '新' }, { name: '云南', shortName: '滇' }, { name: '浙江', shortName: '浙' }];
    private cityCodeArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    constructor(props: NumberPlatePopup_MCTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('maxRecord', -1);
        this.state = {
            ...this.state,
            title: this.props.title || '',
            height: '35rem',
            dataRow,
            dataSet: new DataSet(),
            dataSet_: new DataSet(),
            provinceIndex: null,
            cityCodeIndex: null,
            showIcon: false,
            isAuth: null
        }
    }

    content(): JSX.Element {
        return <div className={`${styles.main} ${numberStyle.main}`}>
            <div className={numberStyle.title}>
                <p>车牌号<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
                <ul className={`${styles.inputLine} ${numberStyle.inputLine}`}>
                    <li>
                        <PopupEdit dataRow={this.state.dataRow} dataField='car_name_' class={styles.nameInput} placeHolder='请选择' readonly={true}></PopupEdit>
                        <img src={StaticFile.getImage('images/icon/popupEdit_remove.png')} className={numberStyle.icon} style={{ 'display': this.state.provinceIndex != null || this.state.cityCodeIndex != null ? 'block' : 'none' }} onClick={this.handleRemove.bind(this)}></img>
                    </li>
                    <li>
                        <PopupEdit dataRow={this.state.dataRow} dataField='car_num_' class={styles.nameInput} placeHolder='请输入车牌号' onChange={this.handleChange.bind(this)}></PopupEdit>
                        <img src={StaticFile.getImage('images/icon/plate_certified.png')} className={numberStyle.icon} style={{ 'display': this.state.showIcon && this.state.isAuth ? 'block' : 'none' }}></img>
                        <img src={StaticFile.getImage('images/icon/plate_notCertified.png')} className={numberStyle.icon} style={{ 'display': this.state.showIcon && !this.state.isAuth ? 'block' : 'none' }}></img>
                    </li>
                </ul>
                <div className={`${styles.buttonLine} ${numberStyle.buttonLine}`}>
                    <button onClick={this.handleSubmit.bind(this, this.state.dataRow, true)}>确定</button>
                </div>
            </div>
            <div className={numberStyle.content}>
                {this.getPrivince()}
                {this.getCityCode()}
                {this.getCarList()}
            </div>
        </div>
    }

    componentDidMount(): void {
        this.init();
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

    // 获取省份结构
    getPrivince() {
        let list = this.provinceArr.map((province, index) => {
            return <li key={province.shortName} className={this.state.provinceIndex == index ? numberStyle.privinceActive : ''} onClick={this.selectProvince.bind(this, index)}>{province.name}：{province.shortName}</li>
        })
        return <ul className={numberStyle.province}>{list}</ul>
    }

    // 获取字母
    getCityCode() {
        let list = this.cityCodeArr.map((cityCode, index) => {
            return <li key={cityCode} className={this.state.cityCodeIndex == index ? numberStyle.cityActive : ''} onClick={this.selectCityCode.bind(this, index)}>{cityCode}</li>
        })
        return <ul className={numberStyle.cityCode}>{list}</ul>
    }

    // 获取车牌结构
    getCarList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.dataSet_);
        ds.first();
        while (ds.fetch()) {
            list.push(<li key={ds.recNo}>
                <span>{ds.getString('car_num_')}</span>
                <span role='auiOpera' onClick={this.handleSubmit.bind(this, ds.current, false)}>选择</span>
            </li>)
        }
        if (!list.length) {
            list.push(<li key='noData' className={numberStyle.noData}>暂无相关的车牌号</li>)
        }
        return <ul className={numberStyle.carCodeList}>{list}</ul>
    }

    handleRemove() {
        this.state.dataRow.setValue('car_name_', '');
        this.setState({
            provinceIndex: null,
            cityCodeIndex: null
        }, () => {
            this.handleChange();
        })
    }

    async handleChange() {
        let carName = this.state.dataRow.getString('car_name_');
        let carNum = this.state.dataRow.getString('car_num_');
        let carNumber = carName + carNum;
        let dataSet_ = new DataSet();
        let dataSet = new DataSet();
        if (carNumber) {
            dataSet.appendDataSet(this.state.dataSet);
            dataSet.forEach((row: DataRow) => {
                if (row.getString('car_num_').indexOf(carNumber) > -1)
                    dataSet_.append().copyRecord(row);
            })
            if (!dataSet_.size && carName.length >= 2 && carNum.length >= 5) {
                let headIn = new DataRow();
                headIn.setValue('car_num_', carNumber);
                this.setState({
                    showLoad: true,
                    message: '正在校验车牌号是否认证，请稍后...'
                })
                let dataOut = await FplApi.queryCarCertification(headIn);
                if (dataOut.state > 0) {
                    this.setState({
                        dataSet_,
                        showLoad: false,
                        showIcon: true,
                        isAuth: dataOut.head.getBoolean('auth_type_')
                    })
                } else {
                    showMsg(dataOut.message);
                }
            } else {
                this.setState({
                    dataSet_,
                    showIcon: false,
                    isAuth: null
                })
            }
        } else {
            dataSet_.appendDataSet(this.state.dataSet);
            this.setState({
                dataSet_,
                showIcon: false,
                isAuth: null
            })
        }

    }

    // 选择省份
    selectProvince(index: number) {
        let province = this.provinceArr[index].shortName;
        let cityCode = '';
        if (this.state.cityCodeIndex != null)
            cityCode = this.cityCodeArr[this.state.cityCodeIndex];
        this.state.dataRow.setValue('car_name_', `${province}${cityCode}`);
        this.setState({
            provinceIndex: index
        }, () => {
            this.handleChange();
        })
    }

    // 选择城市代码
    selectCityCode(index: number) {
        let province = '';
        if (this.state.provinceIndex != null)
            province = this.provinceArr[this.state.provinceIndex].shortName;
        let cityCode = this.cityCodeArr[index];
        this.state.dataRow.setValue('car_name_', `${province}${cityCode}`);
        this.setState({
            cityCodeIndex: index
        }, () => {
            this.handleChange();
        })
    }

    handleSubmit(row: DataRow, isState: boolean) {
        let carNumber = '';
        if (isState) {
            let carName = row.getString('car_name_');
            let carNum = row.getString('car_num_');
            if (!carName) {
                showMsg('车牌号省市不可为空!');
                return;
            } if (!carNum) {
                showMsg('车牌号编码不可为空!');
                return;
            }
            carNumber = carName + carNum;
        } else {
            carNumber = row.getString('car_num_');
        }
        let dataRow = new DataRow();
        dataRow.setValue('car_num_', carNumber);
        this.props.onSelect(dataRow);
        this.handleClose();
    }
}