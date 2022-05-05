import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class FrmReport7 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A0', { name: '月份', width: '15' }).setValue('A1', { name: '线材线（H）', width: '20' }).setValue('A2', { name: '卷材线（H）', width: '25' }).setValue('A3', { name: 'H型钢线（H）', width: '16' }).setValue('A4', { name: '螺纹钢材（H）', width: '14' }).setValue('A5', { name: '合计', width: '18' }).setValue('A6', { name: '备注', width: '20' });
        reportData.append().setValue('A0', '01月份').setValue('A1', 10).setValue('A2', 8).setValue('A3', 22).setValue('A4', 32).setValue('A5', '72').setValue('A6', '备注1');
        reportData.append().setValue('A0', '02月份').setValue('A1', 5).setValue('A2', 3).setValue('A3', 18).setValue('A4', 25).setValue('A5', '51').setValue('A6', '备注2');
        reportData.append().setValue('A0', '03月份').setValue('A1', 0).setValue('A2', 10).setValue('A3', 24).setValue('A4', 14).setValue('A5', '48').setValue('A6', '备注3');
        reportData.append().setValue('A0', '04月份').setValue('A1', 6).setValue('A2', 12).setValue('A3', 22).setValue('A4', 55).setValue('A5', '95').setValue('A6', '备注4');
        reportData.append().setValue('A0', '05月份').setValue('A1', 12).setValue('A2', 3).setValue('A3', 15).setValue('A4', 23).setValue('A5', '53').setValue('A6', '备注5');
        reportData.append().setValue('A0', '06月份').setValue('A1', 8).setValue('A2', 7).setValue('A3', 16).setValue('A4', 7).setValue('A5', '38').setValue('A6', '备注6');
        reportData.append().setValue('A0', '07月份').setValue('A1', 0).setValue('A2', 3).setValue('A3', 7).setValue('A4', 45).setValue('A5', '55').setValue('A6', '备注7');
        reportData.append().setValue('A0', '08月份').setValue('A1', 2).setValue('A2', 15).setValue('A3', 23).setValue('A4', 15).setValue('A5', '55').setValue('A6', '备注8');
        reportData.append().setValue('A0', '09月份').setValue('A1', 3).setValue('A2', 4).setValue('A3', 16).setValue('A4', 23).setValue('A5', '46').setValue('A6', '备注9');
        reportData.append().setValue('A0', '10月份').setValue('A1', 9).setValue('A2', 6).setValue('A3', 22).setValue('A4', 5).setValue('A5', '42').setValue('A6', '备注10');
        reportData.append().setValue('A0', '11月份').setValue('A1', 15).setValue('A2', 7).setValue('A3', 18).setValue('A4', 41).setValue('A5', '81').setValue('A6', '备注11');
        reportData.append().setValue('A0', '12月份').setValue('A1', 0).setValue('A2', 14).setValue('A3', 10).setValue('A4', 11).setValue('A5', '35').setValue('A6', '备注12');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='生产设备停机动态（T）' hideIt={true} key={this.state.reportData.json}></ReportDetail>
    }
}