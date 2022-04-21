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

export default class FrmReport10 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        let year_ = date.getFullYear();
        let month_ = date.getMonth();
        let day_ = date.getDay();
        if (day_ == 0)
            day_ = 7;
        let date_ = date.getDate();
        let startDay = new Date(year_, month_, 1).getDay();
        let dates = new Date(year_, month_ + 1, 0).getDate();
        if (startDay == 0)
            startDay = 7;
        let startTime = 0;
        if (day_ > date_) {
            let month = month_;
            let year = year_;
            if (month > 0) {
                month--;
            } else {
                year--;
            }
            let lastMonthDay = new Date(year, month + 1, 0).getDate();
            let day = lastMonthDay - startDay + 2;
            startTime = new Date(year, month, day).getTime();
        } else {
            startTime = new Date(year_, month_, (date_ - day_ + 1)).getTime()
        }
        let endTime = 0;
        if (date_ + 7 - day_ > dates) {
            let month = month_;
            let year = year_;
            if (month < 11) {
                month++;
            } else {
                year++;
            }
            let day = 8 - day_ + date_ - dates;
            endTime = new Date(year, month, day).getTime();
        } else {
            endTime = new Date(year_, month_, (date_ + 7 - day_ + 1)).getTime();
        }
        while(dataSet.fetch()) {
            let time_ = new Date(dataSet.getString('接单日期')).getTime();
            if (time_ >= startTime && time_ <= endTime) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A6', `${(dataSet.getDouble('销售目标（吨）') / dataSet.getDouble('数量（吨）') * 100).toFixed(2)}%`)
            }
        }
        // reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 105).setValue('A4', 52500).setValue('A5', 105).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', 210).setValue('A4', 70000).setValue('A5', 210).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', 105).setValue('A4', 105000).setValue('A5', 105).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 800).setValue('A3', 154).setValue('A4', 123200).setValue('A5', 154).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 2000).setValue('A3', 126).setValue('A4', 224000).setValue('A5', 126).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 112).setValue('A4', 56000).setValue('A5', 112).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 3000).setValue('A3', 49).setValue('A4', 14700).setValue('A5', 49).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 1500).setValue('A3', 161).setValue('A4', 241500).setValue('A5', 161).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 200).setValue('A3', 112).setValue('A4', 22400).setValue('A5', 112).setValue('A6', '100%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 600).setValue('A3', 154).setValue('A4', 92400).setValue('A5', 154).setValue('A6', '100%');
        // reportData.append().setValue('A1', '张三').setValue('A2', 1500).setValue('A3', 126).setValue('A4', 189000).setValue('A5', 126).setValue('A6', '100%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 2400).setValue('A3', 70).setValue('A4', 168000).setValue('A5', 70).setValue('A6', '100%');
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}本周接单动态（T）`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}