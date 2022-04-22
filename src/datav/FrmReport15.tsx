import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { Excel, excelData } from "../db/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport15 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        dataSet.first();
        let date = new Date();
        while (dataSet.fetch()) {
            let date_ = new Date(dataSet.getString('出货日期'));
            if (date_.getFullYear() == date.getFullYear() && date_.getMonth() == date.getMonth()) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A6', `${(dataSet.getDouble('数量（吨）') / dataSet.getDouble('销售目标（吨）') * 100).toFixed(2)}%`)
            }
        }
        // reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', '100').setValue('A4', 100000).setValue('A5', 180).setValue('A6', '44%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', '200').setValue('A4', 200000).setValue('A5', 240).setValue('A6', '16%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 1000).setValue('A3', '190').setValue('A4', 190000).setValue('A5', 280).setValue('A6', '32%');
        // reportData.append().setValue('A1', '赵六').setValue('A2', 1000).setValue('A3', '340').setValue('A4', 340000).setValue('A5', 400).setValue('A6', '15%');
        // reportData.append().setValue('A1', '孙七').setValue('A2', 1000).setValue('A3', '190').setValue('A4', 190000).setValue('A5', 200).setValue('A6', '5%');
        // reportData.append().setValue('A1', '洪八').setValue('A2', 1000).setValue('A3', '120').setValue('A4', 120000).setValue('A5', 300).setValue('A6', '60%');
        // reportData.append().setValue('A1', '磊九').setValue('A2', 1000).setValue('A3', '240').setValue('A4', 240000).setValue('A5', 270).setValue('A6', '11%');

        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}本月出货动态（${new Date().getMonth() + 1}月）`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}