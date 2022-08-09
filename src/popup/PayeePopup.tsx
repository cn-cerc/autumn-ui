import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./FSCusPopup.css";

type PayeePopupTypeProps = {
    deptCode: string,
    callBack?: Function,
    personID: string,
} & BasePopupTypeProps

type PayeePopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet
} & BasePopupTypeState

export default class PayeePopup extends BasePopup<PayeePopupTypeProps, PayeePopupTypeState> {
    constructor(props: PayeePopupTypeProps) {
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
            <p>收款人<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='payee_name_' class={styles.nameInput} placeHolder='请输入姓名' onChange={this.handleChange.bind(this)}></PopupEdit>
                </li>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='phone_number_' class={styles.mobileInput} placeHolder='请输入手机号' onChange={this.handleChange.bind(this)}></PopupEdit>
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
        let dataSet = await FplApi.getPayeeCode(this.state.dataRow);
        this.hideLoad();
        this.setState({
            dataSet: dataSet,
            dataSet_: dataSet
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
                <span>{dataSet.getString('payee_name_')}</span>
                <span>{dataSet.getString('phone_number_')}</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let name = row.getString('payee_name_');
        let mobile = row.getString('phone_number_');
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
        let input2 = document.getElementById(inputIds[1]) as HTMLInputElement;
        if (input1)
            input1.value = row.getString("payee_no_");
        if (input2)
            input2.value = row.getString("payee_name_");
        if (this.props.callBack)
            this.props.callBack(row);
        if (this.props.personID)
            $("#" + this.props.personID).val(row.getString("payee_name_"))

        this.handleClose();
    }
}