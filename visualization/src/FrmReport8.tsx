import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { Excel, excelData } from "../db/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class FrmReport8 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        await fetch('./在岗人员.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataSet = dataList[0].data;
        reportHead
            .setValue('A0', { name: '项别', width: '10' })
            .setValue('A1', { name: '线材线', width: '10' })
            .setValue('A2', { name: '卷材线', width: '10' })
            .setValue('A3', { name: 'H型钢材线', width: '10' })
            .setValue('A4', { name: '螺纹钢材线', width: '10' })
        dataSet.first();
        let arr = ['在编人数', '30岁以下', '30-40岁', '41-50岁', '51-60岁', '60岁以上', '今日出勤', '今日调休', '今日请假'];
        let dataArr2: any[] = [];
        arr.forEach((name: string) => {
            dataArr2.push({
                A0: name,
                A1: 0,
                A2: 0,
                A3: 0,
                A4: 0
            })
        })
        while (dataSet.fetch()) {
            let age = dataSet.getDouble('年龄');
            let index = 1;
            if (age >= 30 && age <= 40)
                index = 2;
            else if (age > 40 && age <= 50)
                index = 3;
            else if (age > 50 && age <= 60)
                index = 4
            else if (age > 60)
                index = 5;
            let xb = dataSet.getString('项别');
            let stateIndex = 0;
            let state = dataSet.getString('考勤状态');
            switch (state) {
                case '出勤':
                    stateIndex = 1;
                    break;
                case '调休':
                    stateIndex = 2;
                    break;
                case '请假':
                    stateIndex = 3;
                    break;
            }
            switch (xb) {
                case '线材线':
                    dataArr2[index].A1 += 1;
                    dataArr2[5 + stateIndex].A1 += 1;
                    dataArr2[0].A1 += 1;
                    break;
                case '卷材线':
                    dataArr2[index].A2 += 1;
                    dataArr2[5 + stateIndex].A2 += 1;
                    dataArr2[0].A2 += 1;
                    break;
                case 'H钢材线':
                    dataArr2[index].A3 += 1;
                    dataArr2[5 + stateIndex].A3 += 1;
                    dataArr2[0].A3 += 1;
                    break;
                case '螺纹钢材线':
                    dataArr2[index].A4 += 1;
                    dataArr2[5 + stateIndex].A4 += 1;
                    dataArr2[0].A4 += 1;
                    break;
            }

        }
        dataArr2.forEach((data) => {
            reportData.append().setValue('A0', data.A0).setValue('A1', data.A1).setValue('A2', data.A2).setValue('A3', data.A3).setValue('A4', data.A4);
        })
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='生产在编在岗人员动态（T）' key={this.state.reportData.json} backHref='FrmManufactureChart' backTitle='制造数据管理中心' hideIt={true}></ReportDetail>
    }
}