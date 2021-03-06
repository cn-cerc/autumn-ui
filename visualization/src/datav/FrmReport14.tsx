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

export default class FrmReport14 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        while (dataSet.fetch()) {
            let time_ = new Date(dataSet.getString('????????????')).getTime();
            if (time_ >= startTime && time_ <= endTime) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A6', `${(dataSet.getDouble('???????????????') / dataSet.getDouble('?????????????????????') * 100).toFixed(2)}%`)
            }
        }
        reportHead
            .setValue('????????????', { name: '????????????', width: '10' })
            .setValue('????????????/??????', { name: '????????????/??????', width: '5' })
            .setValue('???????????????', { name: '???????????????', width: '4' })
            .setValue('???????????????', { name: '???????????????', width: '4' })
            .setValue('?????????????????????', { name: '?????????????????????', width: '6' })
            .setValue('A6', { name: '?????????????????????', width: '6' });

        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '370').setValue('A4', 370000).setValue('A5', 430).setValue('A6', '13%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '200').setValue('A4', 200000).setValue('A5', 320).setValue('A6', '37%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '30').setValue('A4', 30000).setValue('A5', 160).setValue('A6', '81%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '160').setValue('A4', 160000).setValue('A5', 170).setValue('A6', '5%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '250').setValue('A4', 250000).setValue('A5', 360).setValue('A6', '30%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '180').setValue('A4', 180000).setValue('A5', 350).setValue('A6', '48%');
        // reportData.append().setValue('A1', '??????').setValue('A2', 1000).setValue('A3', '140').setValue('A4', 140000).setValue('A5', 340).setValue('A6', '58%');

        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}?????????????????????${new Date().getMonth() + 1}???${new Date().getDate()}??????`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='????????????????????????'></ReportDetail>
    }
}