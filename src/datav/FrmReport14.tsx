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

export default class FrmReport14 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead
            .setValue('A1', { name: '客户名称', width: '10' })
            .setValue('A2', { name: '单价（元/吨）', width: '5' })
            .setValue('A3', { name: '数量（吨）', width: '4' })
            .setValue('A4', { name: '金额（元）', width: '4' })
            .setValue('A5', { name: '销售目标（吨）', width: '6' })
            .setValue('A6', { name: '销售目标达成率', width: '6' });

            reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', '370').setValue('A4', 370000).setValue('A5', 430).setValue('A6', '13%');
            reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', '200').setValue('A4', 200000).setValue('A5', 320).setValue('A6', '37%');
            reportData.append().setValue('A1', '王五').setValue('A2', 1000).setValue('A3', '30').setValue('A4', 30000).setValue('A5', 160).setValue('A6', '81%');
            reportData.append().setValue('A1', '赵六').setValue('A2', 1000).setValue('A3', '160').setValue('A4', 160000).setValue('A5', 170).setValue('A6', '5%');
            reportData.append().setValue('A1', '孙七').setValue('A2', 1000).setValue('A3', '250').setValue('A4', 250000).setValue('A5', 360).setValue('A6', '30%');
            reportData.append().setValue('A1', '洪八').setValue('A2', 1000).setValue('A3', '180').setValue('A4', 180000).setValue('A5', 350).setValue('A6', '48%');
            reportData.append().setValue('A1', '磊九').setValue('A2', 1000).setValue('A3', '140').setValue('A4', 140000).setValue('A5', 340).setValue('A6', '58%');
            
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材本周出货动态（4月）
        ' key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}