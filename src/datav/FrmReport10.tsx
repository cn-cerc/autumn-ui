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

export default class FrmReport10 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 105).setValue('A4', 52500).setValue('A5', 105).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', 210).setValue('A4', 70000).setValue('A5', 210).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', 105).setValue('A4', 105000).setValue('A5', 105).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 800).setValue('A3', 154).setValue('A4', 123200).setValue('A5', 154).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 2000).setValue('A3', 126).setValue('A4', 224000).setValue('A5', 126).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 500).setValue('A3', 112).setValue('A4', 56000).setValue('A5', 112).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 3000).setValue('A3', 49).setValue('A4', 14700).setValue('A5', 49).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 1500).setValue('A3', 161).setValue('A4', 241500).setValue('A5', 161).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 200).setValue('A3', 112).setValue('A4', 22400).setValue('A5', 112).setValue('A6', '100%');
        reportData.append().setValue('A1', '李四').setValue('A2', 600).setValue('A3', 154).setValue('A4', 92400).setValue('A5', 154).setValue('A6', '100%');
        reportData.append().setValue('A1', '张三').setValue('A2', 1500).setValue('A3', 126).setValue('A4', 189000).setValue('A5', 126).setValue('A6', '100%');
        reportData.append().setValue('A1', '王五').setValue('A2', 2400).setValue('A3', 70).setValue('A4', 168000).setValue('A5', 70).setValue('A6', '100%');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材本周接单动态（T）' key={this.state.reportData.json}></ReportDetail>
    }
}