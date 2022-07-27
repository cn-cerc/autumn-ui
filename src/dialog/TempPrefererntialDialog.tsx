import { BaseDialog, BaseDialogPropsType, BaseDialogStateType, Column, ColumnIt, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import { showMsg } from "../tool/Summer";
import styles from "./TempPrefererntialDialog.css";

type TempPrefererntialTypeState = {
    dataIn: DataRow,
    dataSet: DataSet,
    showForm: boolean
} & Partial<BaseDialogStateType>

export default class TempPrefererntialDialog extends BaseDialog<BaseDialogPropsType, TempPrefererntialTypeState> {
    constructor(props: BaseDialogPropsType) {
        super(props);
        this.state = {
            ...this.state,
            dataIn: new DataRow(),
            dataSet: new DataSet(),
            showForm: false,
            width: '40rem',
            height: '25rem'
        }
        this.setTitle('请选择优惠原因');
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSet = await this.getTempPrefererntial();
        this.setState({
            dataSet
        })
    }

    content(): JSX.Element {
        let subject = this.state.dataIn.getValue('Subject_') || ''
        return (
            <div className={styles.main}>
                <div className={styles.button}>
                    <span role='auiOpera' onClick={this.handleAppend}>+增加优惠原因</span>
                </div>
                <form onSubmit={this.btnExecute.bind(this)} className={this.state.showForm ? styles.form : `${styles.formHide} ${styles.form}`}>
                    <div>
                        <label htmlFor='Subject_'>优惠原因：</label>
                        <input id='Subject_' name='Subject_' type="text" value={subject} required={true} onInput={this.handleInput} />
                    </div>
                    <button type='submit'>保存</button>
                </form>
                <DBGrid dataSet={this.state.dataSet} openPage={false}>
                    <ColumnIt/>
                    <Column name='优惠原因' code='Subject_' width='15'></Column>
                    <Column name='操作' code='opera' width='15' textAlign='center' customText={(row: DataRow) => {
                        return (
                            <React.Fragment>
                                <span role='auiOpera' onClick={this.handleChose.bind(this, row)}>选择</span>
                                <i style={{ 'padding': '0 .5rem', 'color': '#888888' }}>|</i>
                                <span role='auiOpera' onClick={this.handleRemove.bind(this, row)}>删除</span>
                            </React.Fragment>
                        )
                    }}></Column>
                </DBGrid>
            </div>
        )
    }

    handleInput: any = (sender: any) => {
        let input = sender.target as HTMLInputElement;
        let dataIn = new DataRow();
        dataIn.setValue('Subject_', input.value);
        this.setState({
            dataIn
        })
    }

    async btnExecute(sender: any) {
        sender.preventDefault();
        let dataOut = await DitengApi.appendTempPrefererntial(this.state.dataIn);
        if (dataOut.state <= 0) {
            showMsg(dataOut.message)
        } else {
            let dataSet = await this.getTempPrefererntial();
            this.setState({
                dataIn: new DataRow(),
                dataSet,
                showForm: false
            })
        }
    }

    handleAppend: any = (sender: any) => {
        this.setState({
            showForm: !this.state.showForm
        })
    }

    handleChose(row: DataRow) {
        let input = document.getElementById(this.props.inputId) as HTMLInputElement;
        input.value = row.getString('Subject_');
        this.handleSelect();
    }

    async handleRemove(row: DataRow) {
        let dataOut = await DitengApi.removeTempPrefererntial({ UID_: row.getString('UID_') });
        if (dataOut.state <= 0) {
            showMsg(dataOut.message)
        } else {
            let dataSet = await this.getTempPrefererntial();
            showMsg('此优惠原因已删除！');
            this.setState({
                dataSet,
                dataIn: new DataRow(),
                showForm: false
            })
        }
    }

    async getTempPrefererntial() {
        this.setLoad(true);
        let dataSet = await DitengApi.getTempPrefererntial();
        this.setLoad(false);
        return dataSet;
    }
}