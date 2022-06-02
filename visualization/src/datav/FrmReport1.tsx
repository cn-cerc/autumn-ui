import React from "react";
import { DataRow, DataSet } from "autumn-ui";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport1 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('采购合同号', { name: '采购合同号', width: '20' }).setValue('采购数量', { name: '采购数量（T）', width: '25' }).setValue('入库日期', { name: '入库日期', width: '18' }).setValue('入库数量', { name: '入库数量', width: '18' }).setValue('报损数量', { name: '报损数量', width: '18' }).setValue('年度入库累计', { name: '年度入库累计', width: '25' }).setValue('备注', { name: '备注', width: '20' });
        let dataSet = dataList[this.props.index].data;
        dataSet.first();
        let year = new Date().getFullYear();
        while (dataSet.fetch()) {
            if (new Date(dataSet.getString('入库日期')).getFullYear() == year) {
                reportData.append().copyRecord(dataSet.current);
            }
        }
        // reportData.append().setValue('ContractId_', '001').setValue('ContractNum_', 10).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 10).setValue('DamagedNum_', 0).setValue('Total_', 10).setValue('Remark_', '备注1');
        // reportData.append().setValue('ContractId_', '002').setValue('ContractNum_', 15).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 14).setValue('DamagedNum_', 1).setValue('Total_', 14).setValue('Remark_', '备注2');
        // reportData.append().setValue('ContractId_', '003').setValue('ContractNum_', 18).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 18).setValue('DamagedNum_', 0).setValue('Total_', 18).setValue('Remark_', '备注3');
        // reportData.append().setValue('ContractId_', '004').setValue('ContractNum_', 20).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 16).setValue('DamagedNum_', 4).setValue('Total_', 16).setValue('Remark_', '备注4');
        // reportData.append().setValue('ContractId_', '005').setValue('ContractNum_', 30).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 30).setValue('DamagedNum_', 0).setValue('Total_', 30).setValue('Remark_', '备注5');
        // reportData.append().setValue('ContractId_', '006').setValue('ContractNum_', 15).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 15).setValue('DamagedNum_', 0).setValue('Total_', 15).setValue('Remark_', '备注6');
        // reportData.append().setValue('ContractId_', '007').setValue('ContractNum_', 20).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 20).setValue('DamagedNum_', 0).setValue('Total_', 20).setValue('Remark_', '备注7');
        // reportData.append().setValue('ContractId_', '008').setValue('ContractNum_', 26).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 26).setValue('DamagedNum_', 0).setValue('Total_', 26).setValue('Remark_', '备注8');
        // reportData.append().setValue('ContractId_', '009').setValue('ContractNum_', 14).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 14).setValue('DamagedNum_', 0).setValue('Total_', 14).setValue('Remark_', '备注9');
        // reportData.append().setValue('ContractId_', '010').setValue('ContractNum_', 8).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 7).setValue('DamagedNum_', 1).setValue('Total_', 7).setValue('Remark_', '备注10');
        // reportData.append().setValue('ContractId_', '011').setValue('ContractNum_', 5).setValue('InStockDate_', '2022-04-17').setValue('InStockNum_', 5).setValue('DamagedNum_', 0).setValue('Total_', 5).setValue('Remark_', '备注11');

        this.setState({
            reportHead,
            reportData,
            reportName: dataList[this.props.index].name
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}年度入库数量（T）`} key={this.state.reportData.json} backHref='FrmPurchaseChart' backTitle='工业4.0-数字化供应链管理中心V1.0'></ReportDetail>
    }
}