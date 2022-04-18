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

export default class FrmReport11 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A1', { name: '客户名称', width: '20' }).setValue('A2', { name: '单价（元/吨）', width: '25' }).setValue('A3', { name: '数量（吨）', width: '16' }).setValue('A4', { name: '金额（元）', width: '14' }).setValue('A5', { name: '销售目标（吨）', width: '18' }).setValue('A6', { name: '销售目标达成率', width: '18' });
        reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 5040).setValue('A4', 2520000).setValue('A5', 5040).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', 10080).setValue('A4', 3360000).setValue('A5', 10080).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', 5040).setValue('A4', 5040000).setValue('A5', 5040).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 800).setValue('A3', 7392).setValue('A4', 5913600).setValue('A5', 7392).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 2000).setValue('A3', 6144).setValue('A4', 10752000).setValue('A5', 6144).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 5376).setValue('A4', 2688000).setValue('A5', 5376).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 3000).setValue('A3', 2352).setValue('A4', 705600).setValue('A5', 2352).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 1500).setValue('A3', 7728).setValue('A4', 11592000).setValue('A5', 7728).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 200).setValue('A3', 5376).setValue('A4', 1075200).setValue('A5', 5376).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 600).setValue('A3', 7392).setValue('A4', 4435200).setValue('A5', 7392).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 1500).setValue('A3', 6144).setValue('A4', 9072000).setValue('A5', 6144).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 2400).setValue('A3', 3360).setValue('A4', 7824000).setValue('A5', 3360).setValue('A6', '100%');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材本年接单动态（2022年）' key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}