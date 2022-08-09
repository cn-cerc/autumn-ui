import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./FSCusPopup.css";

type AddressPopupTypeProps = {
    parms?: String,
    personID: String,
    callBack?: Function;
} & BasePopupTypeProps

type AddressPopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet
} & BasePopupTypeState

export default class AddressPopup extends BasePopup<AddressPopupTypeProps, AddressPopupTypeState> {
    constructor(props: AddressPopupTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('maxRecord', -1);
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
            <p>发货人<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='contact_' class={styles.nameInput} placeHolder='请输入姓名' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='mobile_' class={styles.mobileInput} placeHolder='请输入手机号' onChange={this.handleChange.bind(this)}></PopupEdit>
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
        let dataOut: DataSet = await FplApi.getAddress(this.state.dataRow);
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
                <span>{dataSet.getString('contact_')}</span>
                <span>{dataSet.getString('mobile_')}</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let name = row.getString('contact_');
        let mobile = row.getString('mobile_');
        if (!name) {
            showMsg('姓名不可为空!');
            return;
        }
        if (!mobile) {
            showMsg('手机号不可为空!');
            return;
        }

        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        if (input1)
            input1.value = row.getString('contact_');
        if (this.props.callBack)
            this.props.callBack(row);
        if (this.props.parms)
            this.callBackInputs(row, this.props.parms);
        if (this.props.personID)
            $("#" + this.props.personID).val(row.getString("contact_"));
        this.handleClose();
    }

    callBackInputs(dataRow: DataRow, parms: String) {
        if (parms) {
            let arr = parms.split(",");
            for (let i = 0; i < arr.length; i += 2) {
                let key = arr[i];
                //回写的input
                let targetInput = arr[i + 1];
                if (dataRow)
                    $("#" + targetInput).val(dataRow.getValue(key));
            }
        }
    }
}