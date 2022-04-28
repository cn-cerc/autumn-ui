import React from "react";
import styles from "./CopyReportDialog.css";
import DialogApi from './DialogApi';
import { showMsg } from "../tool/Summer";
import { BaseDialogStateType, DataRow, BaseDialog, DBEdit, DataSet } from "autumn-ui";

type BaseAreaProps = {
    uid: number,
    reportName: string,
    pageName: string,
    rptCode: string,
} & Partial<BaseDialogStateType>

type BaseAreaState = {
    dataIn: DataRow
} & Partial<BaseDialogStateType>

export default class CopyReportDialog extends BaseDialog<BaseAreaProps, BaseAreaState> {
    constructor(props: BaseAreaProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('UID_', this.props.uid);
        dataIn.setValue('PageName_', this.props.pageName);
        dataIn.setValue('ReportName_', this.props.reportName);
        dataIn.setValue('RptCode_', this.props.rptCode);
        this.state = {
            ...this.state,
            dataIn,
            width: '25rem',
            height: '17rem',
        }
        this.setTitle('复制报表')
    }

    content() {
        return (
            <div className={styles.main}>
                <DBEdit dataName='报表名称' dataRow={this.state.dataIn} dataField='ReportName_' placeholder={this.props.reportName}></DBEdit>
                <DBEdit dataName='纸张名称' dataRow={this.state.dataIn} dataField='PageName_' placeholder={this.props.pageName}></DBEdit>
                <DBEdit dataName='报表编号' dataRow={this.state.dataIn} dataField='RptCode_' placeholder={this.props.rptCode}></DBEdit>
                <div className={styles.submit} onClick={this.handleSubmit.bind(this)}>确认</div>
            </div>
        )
    }

    async handleSubmit() {
        let data: DataRow = this.state.dataIn;
        if (!data.has('ReportName_')) {
            showMsg('报表名称不允许为空！');
            return;
        }
        if (!data.has('PageName_')) {
            showMsg('纸张名称不允许为空！');
            return;
        }
        if (this.props.reportName == data.getString('ReportName_')) {
            showMsg('请输入新的报表名称！');
            return;
        }
        if (this.props.rptCode == data.getString('RptCode_')) {
            showMsg('请输入新的报表编号！');
            return;
        }
        let ds: DataSet = await DialogApi.postCopyReport(data);
        if (ds.state <= 0) {
            showMsg(ds.message);
            return;
        }
        showMsg('报表复制完成！');
        window.location.href = window.location.href;
    }
}