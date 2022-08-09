import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import { showMsg } from "../tool/Summer";
import BasePopup, { BasePopupTypeProps, BasePopupTypeState, PopupEdit } from "./BasePopup";
import styles from "./CodeRecordTwoPopup.css";

type CodeRecordTwoPopupTypeProps = {
    code: String,
    callBack?: Function;
} & BasePopupTypeProps

type CodeRecordTwoPopupTypeState = {
    dataRow: DataRow,
    dataSet: DataSet,
    dataSet_: DataSet
} & BasePopupTypeState

export default class CodeRecordTwoPopup extends BasePopup<CodeRecordTwoPopupTypeProps, CodeRecordTwoPopupTypeState> {
    constructor(props: CodeRecordTwoPopupTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue('parent_code_', this.props.code);
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
            <p>货物名称<span>（注：有记录默认搜索，没有记录直接添加）</span></p>
            <ul className={styles.inputLine}>
                <li>
                    <PopupEdit dataRow={this.state.dataRow} dataField='code_' class={styles.nameInput} placeHolder='请输入货物名称' onChange={this.handleChange.bind(this)}></PopupEdit>
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
        let dataOut: DataSet = await FplApi.getCargoCodeRecord(this.state.dataRow);
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
                <span>{dataSet.getString('code_')}</span>
                <span role="auiOpera" onClick={this.handleSubmit.bind(this, dataSet.current)}>选择</span>
            </li>)
        }
        return <ul className={styles.list}>{list}</ul>
    }

    handleSubmit(row: DataRow) {
        let name = row.getString('code_');
        if (!name) {
            showMsg('货物名称不可为空!');
            return;
        }
        
        let inputIds = this.props.inputId.split(',');
        let input1 = document.getElementById(inputIds[0]) as HTMLInputElement;
        if (input1)
            input1.value = name;
        if (this.props.callBack)
            this.props.callBack(row);
        this.handleClose();
    }
}