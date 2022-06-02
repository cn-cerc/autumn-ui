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

export default class FrmReport16 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead
            .setValue('客户名称', { name: '客户名称', width: '10' })
            .setValue('单价（元/吨）', { name: '单价（元/吨）', width: '5' })
            .setValue('数量（吨）', { name: '数量（吨）', width: '4' })
            .setValue('金额（元）', { name: '金额（元）', width: '4' })
            .setValue('销售目标（吨）', { name: '销售目标（吨）', width: '6' })
            .setValue('A6', { name: '销售目标达成率', width: '6' });
        let date = new Date();
        while (dataSet.fetch()) {
            let date_ = new Date(dataSet.getString('出货日期'));
            if (date_.getFullYear() == date.getFullYear()) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A6', `${(dataSet.getDouble('数量（吨）') / dataSet.getDouble('销售目标（吨）') * 100).toFixed(2)}%`)
            }
        }

        // reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', '100').setValue('A4', 100000).setValue('A5', 210).setValue('A6', '52%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', '90').setValue('A4', 90000).setValue('A5', 220).setValue('A6', '59%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 1000).setValue('A3', '70').setValue('A4', 70000).setValue('A5', 130).setValue('A6', '46%');
        // reportData.append().setValue('A1', '赵六').setValue('A2', 1000).setValue('A3', '10').setValue('A4', 10000).setValue('A5', 470).setValue('A6', '97%');
        // reportData.append().setValue('A1', '孙七').setValue('A2', 1000).setValue('A3', '70').setValue('A4', 70000).setValue('A5', 330).setValue('A6', '78%');
        // reportData.append().setValue('A1', '洪八').setValue('A2', 1000).setValue('A3', '360').setValue('A4', 360000).setValue('A5', 430).setValue('A6', '16%');
        // reportData.append().setValue('A1', '磊九').setValue('A2', 1000).setValue('A3', '170').setValue('A4', 170000).setValue('A5', 460).setValue('A6', '63%');

        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}本年出货动态（${new Date().getFullYear()}年）`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='工业4.0-数字化销售管理中心V1.0'></ReportDetail>
    }
}