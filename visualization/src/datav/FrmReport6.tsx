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

export default class FrmReport6 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        let reportName = dataList[this.props.index].name;
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let monthArr = new Array(month + 1);
        for (let i = 0; i < monthArr.length; i++) {
            let arr = { A1: 0, A2: 0, A3: 0, A4: 0, A5: '' };
            monthArr[i] = arr;
        }
        reportHead.setValue('A0', { name: '月份', width: '15' }).setValue('A1', { name: '线材线', width: '20' }).setValue('A2', { name: '卷材线', width: '25' }).setValue('A3', { name: 'H型钢线', width: '16' }).setValue('A4', { name: '螺纹钢材', width: '14' }).setValue('A5', { name: '备注', width: '18' });
        dataList.forEach((data, index) => {
            let ds = data.data;
            ds.first();
            while (ds.fetch()) {
                let date_ = new Date(ds.getString('接单日期'));
                let year_ = date_.getFullYear();
                let month_ = date_.getMonth();
                if (year_ == year && month_ <= month) {
                    monthArr[month_][`A${index + 1}`] += ds.getDouble('销售目标（吨）');
                    monthArr[month_]['A5'] = ds.getString('备注');
                }
            }
        })
        monthArr.forEach((data, index) => {
            reportData.append().setValue('A0', `${index+1}月`).setValue('A1', data.A1).setValue('A2', data.A2).setValue('A3', data.A3).setValue('A4', data.A4).setValue('A5', data.A5);
        })
        // reportData.append().setValue('A0', '1月').setValue('A1', 500).setValue('A2', 510).setValue('A3', 220).setValue('A4', 240).setValue('A5', '备注1');
        // reportData.append().setValue('A0', '2月').setValue('A1', 480).setValue('A2', 520).setValue('A3', 200).setValue('A4', 220).setValue('A5', '备注2');
        // reportData.append().setValue('A0', '3月').setValue('A1', 460).setValue('A2', 600).setValue('A3', 210).setValue('A4', 260).setValue('A5', '备注3');
        // reportData.append().setValue('A0', '4月').setValue('A1', 520).setValue('A2', 500).setValue('A3', 260).setValue('A4', 210).setValue('A5', '备注4');
        // reportData.append().setValue('A0', '5月').setValue('A1', 540).setValue('A2', 350).setValue('A3', 250).setValue('A4', 260).setValue('A5', '备注5');
        // reportData.append().setValue('A0', '6月').setValue('A1', 320).setValue('A2', 480).setValue('A3', 210).setValue('A4', 220).setValue('A5', '备注6');
        // reportData.append().setValue('A0', '7月').setValue('A1', 380).setValue('A2', 500).setValue('A3', 180).setValue('A4', 240).setValue('A5', '备注7');
        // reportData.append().setValue('A0', '8月').setValue('A1', 450).setValue('A2', 460).setValue('A3', 150).setValue('A4', 290).setValue('A5', '备注8');
        // reportData.append().setValue('A0', '9月').setValue('A1', 500).setValue('A2', 600).setValue('A3', 260).setValue('A4', 180).setValue('A5', '备注9');
        // reportData.append().setValue('A0', '10月').setValue('A1', 600).setValue('A2', 350).setValue('A3', 180).setValue('A4', 300).setValue('A5', '备注10');
        // reportData.append().setValue('A0', '11月').setValue('A1', 680).setValue('A2', 260).setValue('A3', 200).setValue('A4', 220).setValue('A5', '备注11');
        // reportData.append().setValue('A0', '12月').setValue('A1', 620).setValue('A2', 370).setValue('A3', 220).setValue('A4', 240).setValue('A5', '备注12');
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`本年${this.state.reportName}入库动态（T）`} hideIt={true} key={this.state.reportData.json} backHref='FrmManufactureChart' backTitle='制造数据管理中心'></ReportDetail>
    }
}