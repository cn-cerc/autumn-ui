import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class ReportDetail1 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: '煤炭/焦煤'
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        reportHead.setValue('采购合同号', { name: '采购合同号', width: '20' }).setValue('采购数量', { name: '采购数量（T）', width: '25' }).setValue('合同金额', {name: '合同金额', width: '10'}).setValue('采购热量标准', { name: '采购热量标准', width: '20' }).setValue('到港数量', { name: '到港数量', width: '10' }).setValue('出港数量', { name: '出港数量', width: '10' }).setValue('到厂数量', { name: '到厂数量', width: '10' }).setValue('损耗数量', { name: '损耗数量', width: '10' }).setValue('损耗比例', { name: '损耗比例', width: '10' }).setValue('水分检验', { name: '水分检验', width: '10' }).setValue('热量检验', { name: '热量检验', width: '20' }).setValue('承运车辆', { name: '承运车辆', width: '20' }).setValue('备注', { name: '备注', width: '20' });
        reportData.append().setValue('采购合同号', 'P000001').setValue('采购数量', 10).setValue('合同金额', 54000).setValue('采购热量标准', 1000).setValue('到港数量', 10).setValue('出港数量', 10).setValue('到厂数量', 9.98).setValue('损耗数量', 0.02).setValue('损耗比例', 0.002).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '鄂A3005').setValue('备注', '备注1');
        reportData.append().setValue('采购合同号', 'P000002').setValue('采购数量', 12).setValue('合同金额', 64800).setValue('采购热量标准', 1000).setValue('到港数量', 12).setValue('出港数量', 12).setValue('到厂数量', 11.95).setValue('损耗数量', 0.05).setValue('损耗比例', 0.004).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '京A1245').setValue('备注', '备注2');
        reportData.append().setValue('采购合同号', 'P000003').setValue('采购数量', 10.5).setValue('合同金额', 56700).setValue('采购热量标准', 1000).setValue('到港数量', 10.5).setValue('出港数量', 10.5).setValue('到厂数量', 10.5).setValue('损耗数量', 0).setValue('损耗比例', 0).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '沪B2674').setValue('备注', '备注3');
        reportData.append().setValue('采购合同号', 'P000004').setValue('采购数量', 8).setValue('合同金额', 43200).setValue('采购热量标准', 1000).setValue('到港数量', 8).setValue('出港数量', 8).setValue('到厂数量', 7.98).setValue('损耗数量', 0.02).setValue('损耗比例', 0.0025).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '渝C6845').setValue('备注', '备注4');
        reportData.append().setValue('采购合同号', 'P000005').setValue('采购数量', 11).setValue('合同金额', 59400).setValue('采购热量标准', 1000).setValue('到港数量', 11).setValue('出港数量', 11).setValue('到厂数量', 10.98).setValue('损耗数量', 0.02).setValue('损耗比例', 0.0018).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '冀K5612').setValue('备注', '备注5');
        reportData.append().setValue('采购合同号', 'P000006').setValue('采购数量', 12.5).setValue('合同金额', 67500).setValue('采购热量标准', 1000).setValue('到港数量', 12.45).setValue('出港数量', 12.45).setValue('到厂数量', 12.45).setValue('损耗数量', 0.05).setValue('损耗比例', 0.004).setValue('水分检验', 10).setValue('热量检验', 1000).setValue('承运车辆', '宁A8452').setValue('备注', '备注6');
        this.setState({
            reportHead,
            reportData,
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}年度入库数量（T）`} key={this.state.reportData.json} backHref='FrmPurchaseChart' backTitle='采购数据管理中心'></ReportDetail>
    }
}