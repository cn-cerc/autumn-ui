import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { Excel, excelData } from "../db/Utils";
import { AuiMath } from "../diteng/Summer";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport4 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('订单编号', { name: '生产订单', width: '20' }).setValue('销售目标（吨）', { name: '生产数量（T）', width: '25' }).setValue('A3', { name: '产能/日', width: '16' }).setValue('接单日期', { name: '入库日期', width: '14' }).setValue('销售目标（吨）', { name: '入库数量（T）', width: '18' }).setValue('A6', { name: '产能目标达成率', width: '18' }).setValue('备注', { name: '备注', width: '18' });
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
        let math = new AuiMath();
        while (dataSet.fetch()) {
            let date = new Date(dataSet.getString('接单日期'));
            let endDate = new Date(dataSet.getString('出货日期'));
            let num = dataSet.getDouble('数量（吨）');
            let time = date.getTime();
            let endTime_ = endDate.getTime();
            if (time >= startTime && time <= endTime) {
                reportData.append().copyRecord(dataSet.current);
                let generaDay = (endTime_ - time) / (24*60*60*1000) + 1;
                reportData.setValue('A3', math.toFixed(num/generaDay, 2));
                reportData.setValue('A6', '100%');
            }
        }
        // reportData.append().setValue('A1', '001').setValue('A2', 10).setValue('A3', 8).setValue('A4', '2022-04-17').setValue('A5', 8).setValue('A6', '80%').setValue('A7', '备注1');
        // reportData.append().setValue('A1', '002').setValue('A2', 15).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '100%').setValue('A7', '备注2');
        // reportData.append().setValue('A1', '003').setValue('A2', 20).setValue('A3', 18).setValue('A4', '2022-04-17').setValue('A5', 18).setValue('A6', '90%').setValue('A7', '备注3');
        // reportData.append().setValue('A1', '004').setValue('A2', 25).setValue('A3', 20).setValue('A4', '2022-04-17').setValue('A5', 20).setValue('A6', '80%').setValue('A7', '备注4');
        // reportData.append().setValue('A1', '005').setValue('A2', 20).setValue('A3', 17).setValue('A4', '2022-04-17').setValue('A5', 17).setValue('A6', '85%').setValue('A7', '备注5');
        // reportData.append().setValue('A1', '006').setValue('A2', 30).setValue('A3', 28).setValue('A4', '2022-04-17').setValue('A5', 28).setValue('A6', '93.33%').setValue('A7', '备注6');
        // reportData.append().setValue('A1', '007').setValue('A2', 20).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '75%').setValue('A7', '备注7');
        // reportData.append().setValue('A1', '008').setValue('A2', 15).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '100%').setValue('A7', '备注8');
        // reportData.append().setValue('A1', '009').setValue('A2', 10).setValue('A3', 10).setValue('A4', '2022-04-17').setValue('A5', 10).setValue('A6', '100%').setValue('A7', '备注9');
        // reportData.append().setValue('A1', '010').setValue('A2', 30).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '50%').setValue('A7', '备注10');
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`本周${this.state.reportName}入库动态（T）`} key={this.state.reportData.json} backHref='FrmManufactureChart' backTitle='制造数据管理中心'></ReportDetail>
    }
}