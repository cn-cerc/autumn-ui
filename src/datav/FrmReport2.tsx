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

export default class FrmReport2 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('ContractId_', { name: '采购合同号', width: '20' }).setValue('ContractNum_', { name: '采购数量（T）', width: '25' }).setValue('JiaoQi_', { name: '交期', width: '16' }).setValue('Price_', { name: '单价', width: '14' }).setValue('HTMoney_', { name: '合同金额', width: '18' }).setValue('InStock_', { name: '入库数量', width: '18' }).setValue('QLNum_', { name: '欠料数量', width: '18' }).setValue('YFMoney_', { name: '已付金额', width: '18' }).setValue('Remark_', { name: '备注', width: '20' });
        reportData.append().setValue('ContractId_', '001').setValue('ContractNum_', 10).setValue('JiaoQi_', '2022-04-17').setValue('Price_', '88').setValue('HTMoney_', '500').setValue('InStock_', 10).setValue('QLNum_', 0).setValue('YFMoney_', '500').setValue('Remark_', '备注1');
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
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='铁矿石年度采购数量（T）' key={this.state.reportData.json}></ReportDetail>
    }
}