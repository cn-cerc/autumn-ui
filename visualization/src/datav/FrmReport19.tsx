import React from "react";
import { DataRow, DataSet } from "autumn-ui";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";
import FrmManufactureChart from "./FrmManufactureChart";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class FrmRepor19 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet()
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        let dataList: excelData[] = [];
        await fetch('./设备停机.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataSet = dataList[0].data;
        reportHead
            .setValue('A0', { name: '月份', width: '10' })
            .setValue('A1', { name: '线材线(H)', width: '10' })
            .setValue('A2', { name: '卷材线(H)', width: '10' })
            .setValue('A3', { name: 'H型钢材线(H)', width: '10' })
            .setValue('A4', { name: '螺纹钢材线(H)', width: '10' })
            .setValue('A5', { name: '合计(H)', width: '10' })
        dataSet.first();
        let arr = ['01月份', '02月份', '03月份', '04月份', '05月份', '06月份', '07月份', '08月份', '09月份', '10月份', '11月份', '12月份'];
        let dataArr: any[] = [];
        arr.forEach((name: string) => {
            dataArr.push({
                A0: name,
                A1: 0,
                A2: 0,
                A3: 0,
                A4: 0,
                A5: 0
            })
        })
        while (dataSet.fetch()) {
            let date = new Date(dataSet.getString('日期'));
            let month = date.getMonth();
            let state = dataSet.getString('类型');
            let hour = dataSet.getDouble('时长');
            switch (state) {
                case '线材':
                    dataArr[month].A1 += hour;
                    break;
                case '卷材':
                    dataArr[month].A2 += hour;
                    break;
                case 'H型钢材':
                    dataArr[month].A3 += hour;
                    break;
                case '螺纹钢材':
                    dataArr[month].A4 += hour;
                    break;
            }
            dataArr[month].A5 += hour;
        }
        dataArr.forEach((data) => {
            reportData.append().setValue('A0', data.A0).setValue('A1', data.A1).setValue('A2', data.A2).setValue('A3', data.A3).setValue('A4', data.A4).setValue('A5', data.A5);
        })
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='生产设备停机动态' key={this.state.reportData.json} backHref={FrmManufactureChart} backTitle='工业4.0-数字化制造管理中心V1.0' hideIt={true}></ReportDetail>
    }
}