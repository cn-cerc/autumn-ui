import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import { Excel, excelData } from "../db/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport2 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: ''
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        let dataList: excelData[] = [];
        await fetch('./kanban1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        reportHead.setValue('采购合同号', { name: '采购合同号', width: '20' }).setValue('采购数量', { name: '采购数量（T）', width: '25' }).setValue('交期', { name: '交期', width: '16' }).setValue('单价', { name: '单价', width: '14' }).setValue('合同金额', { name: '合同金额', width: '18' }).setValue('入库数量', { name: '入库数量', width: '18' }).setValue('欠料数量', { name: '欠料数量', width: '18' }).setValue('已付金额', { name: '已付金额', width: '18' }).setValue('备注', { name: '备注', width: '20' });
        let dataSet = dataList[this.props.index].data;
        dataSet.first();
        let year = new Date().getFullYear();
        while(dataSet.fetch()) {
            if(new Date(dataSet.getString('入库日期')).getFullYear() == year) {
                reportData.append().copyRecord(dataSet.current);
            }
        }
        // reportData.append().setValue('ContractId_', '001').setValue('ContractNum_', 10).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '88').setValue('HTMoney_', '500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '500').setValue('Remark_', '备注1');
        // reportData.append().setValue('ContractId_', '002').setValue('ContractNum_', 8).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '66').setValue('HTMoney_', '500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '500').setValue('Remark_', '备注2');
        // reportData.append().setValue('ContractId_', '003').setValue('ContractNum_', 6).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '188').setValue('HTMoney_', '1500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '1500').setValue('Remark_', '备注3');
        // reportData.append().setValue('ContractId_', '004').setValue('ContractNum_', 15).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '166').setValue('HTMoney_', '1500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '1500').setValue('Remark_', '备注4');
        // reportData.append().setValue('ContractId_', '005').setValue('ContractNum_', 20).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '288').setValue('HTMoney_', '2500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '2500').setValue('Remark_', '备注5');
        // reportData.append().setValue('ContractId_', '006').setValue('ContractNum_', 15).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '266').setValue('HTMoney_', '2500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '2500').setValue('Remark_', '备注6');
        // reportData.append().setValue('ContractId_', '007').setValue('ContractNum_', 16).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '388').setValue('HTMoney_', '3500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '3500').setValue('Remark_', '备注7');
        // reportData.append().setValue('ContractId_', '008').setValue('ContractNum_', 18).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '366').setValue('HTMoney_', '3500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '3500').setValue('Remark_', '备注8');
        // reportData.append().setValue('ContractId_', '009').setValue('ContractNum_', 23).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '588').setValue('HTMoney_', '4500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '4500').setValue('Remark_', '备注9');
        // reportData.append().setValue('ContractId_', '010').setValue('ContractNum_', 30).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '566').setValue('HTMoney_', '4500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '4500').setValue('Remark_', '备注10');
        this.setState({
            reportHead,
            reportData,
            reportName: dataList[this.props.index].name
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}年度采购数量（T）`} key={this.state.reportData.json} backHref='FrmPurchaseChart' backTitle='采购数据管理中心'></ReportDetail>
    }
}