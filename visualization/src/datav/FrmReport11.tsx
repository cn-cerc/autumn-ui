import React from "react";
import { DataRow, DataSet } from "autumn-ui";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport11 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: ''
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        let dataList: excelData[] = [];
        await fetch('./kanban3.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataSet = dataList[this.props.index].data;
        let reportName = dataList[this.props.index].name;
        reportHead.setValue('客户名称', { name: '客户名称', width: '20' }).setValue('单价（元/吨）', { name: '单价（元/吨）', width: '25' }).setValue('数量（吨）', { name: '数量（吨）', width: '16' }).setValue('金额（元）', { name: '金额（元）', width: '14' }).setValue('销售目标（吨）', { name: '销售目标（吨）', width: '18' }).setValue('A6', { name: '销售目标达成率', width: '18' });
        dataSet.first();
        let date = new Date();
        while (dataSet.fetch()) {
            let date_ = new Date(dataSet.getString('接单日期'));
            if (date_.getFullYear() == date.getFullYear() && date_.getMonth() == date.getMonth()) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A6', `${(dataSet.getDouble('数量（吨）') / dataSet.getDouble('销售目标（吨）') * 100).toFixed(2)}%`)
            }
        }
        // reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 420).setValue('A4', 210000).setValue('A5', 420).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', 840).setValue('A4', 280000).setValue('A5', 840).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', 420).setValue('A4', 420000).setValue('A5', 420).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 800).setValue('A3', 616).setValue('A4', 492800).setValue('A5', 616).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 2000).setValue('A3', 512).setValue('A4', 896000).setValue('A5', 512).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 448).setValue('A4', 224000).setValue('A5', 448).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 3000).setValue('A3', 196).setValue('A4', 58800).setValue('A5', 196).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 1500).setValue('A3', 644).setValue('A4', 966000).setValue('A5', 644).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 200).setValue('A3', 448).setValue('A4', 89600).setValue('A5', 448).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 600).setValue('A3', 616).setValue('A4', 369600).setValue('A5', 616).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 1500).setValue('A3', 512).setValue('A4', 756000).setValue('A5', 512).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 2400).setValue('A3', 280).setValue('A4', 652000).setValue('A5', 280).setValue('A6', '100%');
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}本月接单动态（4月）`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='工业4.0-数字化销售管理中心V1.0'></ReportDetail>
    }
}