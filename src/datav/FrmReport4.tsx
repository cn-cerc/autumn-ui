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

export default class FrmReport4 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A1', { name: '生产订单', width: '20' }).setValue('A2', { name: '生产数量（T）', width: '25' }).setValue('A3', { name: '产能/日', width: '16' }).setValue('A4', { name: '入库日期', width: '14' }).setValue('A5', { name: '入库数量（T）', width: '18' }).setValue('A6', { name: '产能目标达成率', width: '18' }).setValue('A7', { name: '备注', width: '18' });
        reportData.append().setValue('A1', '001').setValue('A2', 10).setValue('A3', 8).setValue('A4', '2022-04-17').setValue('A5', 8).setValue('A6', '80%').setValue('A7', '备注1');
        reportData.append().setValue('A1', '002').setValue('A2', 15).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '100%').setValue('A7', '备注2');
        reportData.append().setValue('A1', '003').setValue('A2', 20).setValue('A3', 18).setValue('A4', '2022-04-17').setValue('A5', 18).setValue('A6', '90%').setValue('A7', '备注3');
        reportData.append().setValue('A1', '004').setValue('A2', 25).setValue('A3', 20).setValue('A4', '2022-04-17').setValue('A5', 20).setValue('A6', '80%').setValue('A7', '备注4');
        reportData.append().setValue('A1', '005').setValue('A2', 20).setValue('A3', 17).setValue('A4', '2022-04-17').setValue('A5', 17).setValue('A6', '85%').setValue('A7', '备注5');
        reportData.append().setValue('A1', '006').setValue('A2', 30).setValue('A3', 28).setValue('A4', '2022-04-17').setValue('A5', 28).setValue('A6', '93.33%').setValue('A7', '备注6');
        reportData.append().setValue('A1', '007').setValue('A2', 20).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '75%').setValue('A7', '备注7');
        reportData.append().setValue('A1', '008').setValue('A2', 15).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '100%').setValue('A7', '备注8');
        reportData.append().setValue('A1', '009').setValue('A2', 10).setValue('A3', 10).setValue('A4', '2022-04-17').setValue('A5', 10).setValue('A6', '100%').setValue('A7', '备注9');
        reportData.append().setValue('A1', '010').setValue('A2', 30).setValue('A3', 15).setValue('A4', '2022-04-17').setValue('A5', 15).setValue('A6', '50%').setValue('A7', '备注10');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='本周线材入库动态（T）' key={this.state.reportData.json}></ReportDetail>
    }
}