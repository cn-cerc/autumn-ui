import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class FrmReport6 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A0', { name: '月份', width: '15' }).setValue('A1', { name: '线材线', width: '20' }).setValue('A2', { name: '卷材线', width: '25' }).setValue('A3', { name: 'H型钢线', width: '16' }).setValue('A4', { name: '螺纹钢材', width: '14' }).setValue('A5', { name: '备注', width: '18' });
        reportData.append().setValue('A0', '1月').setValue('A1', 500).setValue('A2', 510).setValue('A3', 220).setValue('A4', 240).setValue('A5', '备注1');
        reportData.append().setValue('A0', '2月').setValue('A1', 480).setValue('A2', 520).setValue('A3', 200).setValue('A4', 220).setValue('A5', '备注2');
        reportData.append().setValue('A0', '3月').setValue('A1', 460).setValue('A2', 600).setValue('A3', 210).setValue('A4', 260).setValue('A5', '备注3');
        reportData.append().setValue('A0', '4月').setValue('A1', 520).setValue('A2', 500).setValue('A3', 260).setValue('A4', 210).setValue('A5', '备注4');
        reportData.append().setValue('A0', '5月').setValue('A1', 540).setValue('A2', 350).setValue('A3', 250).setValue('A4', 260).setValue('A5', '备注5');
        reportData.append().setValue('A0', '6月').setValue('A1', 320).setValue('A2', 480).setValue('A3', 210).setValue('A4', 220).setValue('A5', '备注6');
        reportData.append().setValue('A0', '7月').setValue('A1', 380).setValue('A2', 500).setValue('A3', 180).setValue('A4', 240).setValue('A5', '备注7');
        reportData.append().setValue('A0', '8月').setValue('A1', 450).setValue('A2', 460).setValue('A3', 150).setValue('A4', 290).setValue('A5', '备注8');
        reportData.append().setValue('A0', '9月').setValue('A1', 500).setValue('A2', 600).setValue('A3', 260).setValue('A4', 180).setValue('A5', '备注9');
        reportData.append().setValue('A0', '10月').setValue('A1', 600).setValue('A2', 350).setValue('A3', 180).setValue('A4', 300).setValue('A5', '备注10');
        reportData.append().setValue('A0', '11月').setValue('A1', 680).setValue('A2', 260).setValue('A3', 200).setValue('A4', 220).setValue('A5', '备注11');
        reportData.append().setValue('A0', '12月').setValue('A1', 620).setValue('A2', 370).setValue('A3', 220).setValue('A4', 240).setValue('A5', '备注12');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='本年线材入库动态（T）' hideIt={true} key={this.state.reportData.json}></ReportDetail>
    }
}