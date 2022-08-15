import { DataRow, DataSet, DBEdit } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./FSCusPopup.css";

type FSCusPopupTypeProps = {
    nameId: string,
    phoneId: string,
    personID: string
} & BasePopupTypeProps

type FSCusPopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet
} & BasePopupTypeState

export default class FSCusPopup extends BasePopup<FSCusPopupTypeProps, FSCusPopupTypeState> {
    constructor(props: FSCusPopupTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('MaxRecord_', -1);
        this.state = {
            ...this.state,
            title: this.props.title || '',
            height: '25rem',
            dataRow,
            dataSet: new DataSet(),
            dataSet_: new DataSet()
        }
    }

    content(): JSX.Element {
        return <div className={styles.main}>
            <p>收货人<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='Name_' class={styles.nameInput} placeHolder='请输入姓名' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='Mobile_' class={styles.mobileInput} placeHolder='请输入手机号' onChange={this.handleChange.bind(this)}></PopupEdit>
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
        let dataOut: DataSet = await DitengApi.getCusInfos(this.state.dataRow);
        let ds = new DataSet();
        dataOut.first();
        while (dataOut.fetch()) {
            if (dataOut.getBoolean("CorpNo_")) {
                ds.append().copyRecord(dataOut.current);
            }
        }
        this.hideLoad();
        this.setState({
            dataSet: ds,
            dataSet_: ds
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
                <span>{dataSet.getString('Name_')}</span>
                <span>{dataSet.getString('Mobile_')}</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let name = row.getString('Name_');
        let mobile = row.getString('Mobile_');
        if (!name) {
            showMsg('姓名不可为空!');
            return;
        }
        if (!mobile) {
            showMsg('手机号不可为空!');
            return;
        }
        let nameInput = document.getElementById(this.props.nameId) as HTMLInputElement;
        nameInput.value = name;
        if (this.props.phoneId) {
            let phoneInput = document.getElementById(this.props.phoneId) as HTMLInputElement;
            phoneInput.value = mobile;
        }
        if (this.props.personID) {
            if (row.getBoolean('Contact_'))
                $("#" + this.props.personID).val(row.getString('Contact_'));
            else
                $("#" + this.props.personID).val(name);
        }

        this.handleClose();
    }
}

type FSCusPopup_MCTypeProps = {
    onSelect: Function
} & BasePopupTypeProps

export class FSCusPopup_MC extends BasePopup<FSCusPopup_MCTypeProps, FSCusPopupTypeState> {
    constructor(props: FSCusPopup_MCTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('MaxRecord_', -1);
        this.state = {
            ...this.state,
            title: '收货人信息',
            height: '25rem',
            dataRow,
            dataSet: new DataSet(),
            dataSet_: new DataSet()
        }
    }

    content(): JSX.Element {
        return <div className={styles.main}>
            <p>收货人<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='Name_' class={styles.nameInput} placeHolder='请输入姓名' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='Mobile_' class={styles.mobileInput} placeHolder='请输入手机号' onChange={this.handleChange.bind(this)}></PopupEdit>
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
        let dataOut: DataSet = await DitengApi.getCusInfos(this.state.dataRow);
        let ds = new DataSet();
        dataOut.first();
        while (dataOut.fetch()) {
            if (dataOut.getBoolean("CorpNo_")) {
                ds.append().copyRecord(dataOut.current);
            }
        }
        this.hideLoad();
        this.setState({
            dataSet: ds,
            dataSet_: ds
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
                <span>{dataSet.getString('Name_')}</span>
                <span>{dataSet.getString('Mobile_')}</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let name = row.getString('Name_');
        let mobile = row.getString('Mobile_');
        if (!name) {
            showMsg('姓名不可为空!');
            return;
        }
        if (!mobile) {
            showMsg('手机号不可为空!');
            return;
        }
        this.props.onSelect(row);
        this.handleClose();
    }
}