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

export default class FrmReport5 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('A0', { name: '周次', width: '15' }).setValue('A1', { name: '产能目标/月', width: '20' }).setValue('A2', { name: '入库数量（T）', width: '25' }).setValue('A3', { name: '产能目标达成率', width: '16' }).setValue('A4', { name: '超产数量（T）', width: '14' }).setValue('A5', { name: '超产率', width: '18' }).setValue('A6', { name: '备注', width: '18' });
        reportData.append().setValue('A0', '第一周').setValue('A1', 500).setValue('A2', 510).setValue('A3', '100%').setValue('A4', 10).setValue('A5', '5%').setValue('A6', '备注1');
        reportData.append().setValue('A0', '第二周').setValue('A1', 600).setValue('A2', 550).setValue('A3', '91.6%').setValue('A4', 0).setValue('A5', '0%').setValue('A6', '备注2');
        reportData.append().setValue('A0', '第三周').setValue('A1', 300).setValue('A2', 400).setValue('A3', '100%').setValue('A4', 100).setValue('A5', '33.33%').setValue('A6', '备注3');
        reportData.append().setValue('A0', '第四周').setValue('A1', 800).setValue('A2', 600).setValue('A3', '75%').setValue('A4', 0).setValue('A5', '0%').setValue('A6', '备注4');
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='本月线材入库动态（T）' hideIt={true} key={this.state.reportData.json} backHref='FrmManufactureChart' backTitle='制造数据管理中心'></ReportDetail>
    }
}