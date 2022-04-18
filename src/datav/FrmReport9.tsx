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

export default class FrmReport9 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A0', { name: '订单编号', width: '15' }).setValue('A1', { name: '客户名称', width: '20' }).setValue('A2', { name: '单价（元/吨）', width: '25' }).setValue('A3', { name: '数量（吨）', width: '16' }).setValue('A4', { name: '金额（元）', width: '14' }).setValue('A5', { name: '备注', width: '18' });
        reportData.append().setValue('A0', '001').setValue('A1', '张三').setValue('A2', 500).setValue('A3', 15).setValue('A4', 7500).setValue('A5', '备注1');
        reportData.append().setValue('A0', '002').setValue('A1', '李四').setValue('A2', 1000).setValue('A3', 30).setValue('A4', 10000).setValue('A5', '备注2');
        reportData.append().setValue('A0', '003').setValue('A1', '张三').setValue('A2', 1000).setValue('A3', 15).setValue('A4', 15000).setValue('A5', '备注3');
        reportData.append().setValue('A0', '004').setValue('A1', '王五').setValue('A2', 800).setValue('A3', 22).setValue('A4', 17600).setValue('A5', '备注4');
        reportData.append().setValue('A0', '005').setValue('A1', '王五').setValue('A2', 2000).setValue('A3', 18).setValue('A4', 32000).setValue('A5', '备注5');
        reportData.append().setValue('A0', '006').setValue('A1', '张三').setValue('A2', 500).setValue('A3', 16).setValue('A4', 8000).setValue('A5', '备注6');
        reportData.append().setValue('A0', '007').setValue('A1', '李四').setValue('A2', 3000).setValue('A3', 7).setValue('A4', 2100).setValue('A5', '备注7');
        reportData.append().setValue('A0', '008').setValue('A1', '王五').setValue('A2', 1500).setValue('A3', 23).setValue('A4', 34500).setValue('A5', '备注8');
        reportData.append().setValue('A0', '009').setValue('A1', '张三').setValue('A2', 200).setValue('A3', 16).setValue('A4', 3200).setValue('A5', '备注9');
        reportData.append().setValue('A0', '010').setValue('A1', '李四').setValue('A2', 600).setValue('A3', 22).setValue('A4', 13200).setValue('A5', '备注10');
        reportData.append().setValue('A0', '011').setValue('A1', '张三').setValue('A2', 1500).setValue('A3', 18).setValue('A4', 27000).setValue('A5', '备注11');
        reportData.append().setValue('A0', '012').setValue('A1', '王五').setValue('A2', 2400).setValue('A3', 10).setValue('A4', 24000).setValue('A5', '备注12');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材接单今日动态（T）' key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}