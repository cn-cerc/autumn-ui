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

export default class FrmReport3 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A1', { name: '采购合同号', width: '20' }).setValue('A2', { name: '采购数量（T）', width: '25' }).setValue('A3', { name: '交期', width: '16' }).setValue('A4', { name: '运输方式', width: '14' }).setValue('A5', { name: '本次在途数量', width: '18' }).setValue('A6', { name: '预计到料时间', width: '18' }).setValue('A7', { name: '备注', width: '18' });
        reportData.append().setValue('A1', '001').setValue('A2', 10).setValue('A3', '2022-04-23').setValue('A4', '专车').setValue('A5', 10).setValue('A6', '2022-04-20').setValue('A7', '备注1');
        reportData.append().setValue('A1', '002').setValue('A2', 15).setValue('A3', '2022-04-24').setValue('A4', '专车').setValue('A5', 15).setValue('A6', '2022-04-20').setValue('A7', '备注2');
        reportData.append().setValue('A1', '003').setValue('A2', 14).setValue('A3', '2022-04-25').setValue('A4', '货车').setValue('A5', 14).setValue('A6', '2022-04-21').setValue('A7', '备注3');
        reportData.append().setValue('A1', '004').setValue('A2', 13).setValue('A3', '2022-04-25').setValue('A4', '货车').setValue('A5', 13).setValue('A6', '2022-04-21').setValue('A7', '备注4');
        reportData.append().setValue('A1', '005').setValue('A2', 22).setValue('A3', '2022-04-26').setValue('A4', '货车').setValue('A5', 22).setValue('A6', '2022-04-22').setValue('A7', '备注5');
        reportData.append().setValue('A1', '006').setValue('A2', 13).setValue('A3', '2022-04-26').setValue('A4', '货车').setValue('A5', 13).setValue('A6', '2022-04-22').setValue('A7', '备注6');
        reportData.append().setValue('A1', '007').setValue('A2', 32).setValue('A3', '2022-04-26').setValue('A4', '火车').setValue('A5', 32).setValue('A6', '2022-04-23').setValue('A7', '备注7');
        reportData.append().setValue('A1', '008').setValue('A2', 12).setValue('A3', '2022-04-27').setValue('A4', '火车').setValue('A5', 12).setValue('A6', '2022-04-24').setValue('A7', '备注8');
        reportData.append().setValue('A1', '009').setValue('A2', 53).setValue('A3', '2022-04-27').setValue('A4', '火车').setValue('A5', 53).setValue('A6', '2022-04-24').setValue('A7', '备注9');
        reportData.append().setValue('A1', '010').setValue('A2', 24).setValue('A3', '2022-04-29').setValue('A4', '飞机').setValue('A5', 25).setValue('A6', '2022-04-25').setValue('A7', '备注10');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='铁矿石当前在途数量（T）' key={this.state.reportData.json} backHref='FrmPurchaseChart' backTitle='采购数据管理中心'></ReportDetail>
    }
}