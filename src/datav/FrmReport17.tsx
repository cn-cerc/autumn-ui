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

export default class FrmReport17 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        await fetch('./kanban3.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataSet = dataList[this.props.index].data;
        let reportName = dataList[this.props.index].name;
        reportHead
            .setValue('客户名称', { name: '客户名称', width: '10' })
            .setValue('单价（元/吨）', { name: '单价（元/吨）', width: '5' })
            .setValue('数量（吨）', { name: '数量（吨）', width: '5' })
            .setValue('未出货数量（吨）', { name: '未出货数量（吨）', width: '8' })
            .setValue('当前库存', { name: '当前库存（吨）', width: '6' })
            .setValue('金额（元）', { name: '金额（元）', width: '4' })
            .setValue('销售目标（吨）', { name: '销售目标（吨）', width: '5' })
            .setValue('A7', { name: '销售目标达成率', width: '6' });
        dataSet.first();
        let date = new Date();
        while (dataSet.fetch()) {
            let time = new Date(dataSet.getString('接单日期')).getTime();
            let noOutStock = dataSet.getDouble('未出货数量（吨）');
            if (time <= date.getTime() && noOutStock > 0) {
                reportData.append().copyRecord(dataSet.current);
                reportData.setValue('A7', `${(dataSet.getDouble('数量（吨）') / dataSet.getDouble('销售目标（吨）') * 100).toFixed(2)}%`)
            }
        }
        // reportData.append().setValue('A1', '张三').setValue('A2', 1000).setValue('A3', '90').setValue('A4', 470).setValue('A5', 20000).setValue('A6', 110).setValue('A7', '18%');
        // reportData.append().setValue('A1', '李四').setValue('A2', 1000).setValue('A3', '220').setValue('A4', 200).setValue('A5', 160000).setValue('A6', 380).setValue('A7', '42%');
        // reportData.append().setValue('A1', '王五').setValue('A2', 1000).setValue('A3', '70').setValue('A4', 380).setValue('A5', 30000).setValue('A6', 100).setValue('A7', '30%');
        // reportData.append().setValue('A1', '赵六').setValue('A2', 1000).setValue('A3', '70').setValue('A4', 120).setValue('A5', 90000).setValue('A6', 160).setValue('A7', '56%');
        // reportData.append().setValue('A1', '孙七').setValue('A2', 1000).setValue('A3', '280').setValue('A4', 360).setValue('A5', 10000).setValue('A6', 290).setValue('A7', '3%');
        // reportData.append().setValue('A1', '洪八').setValue('A2', 1000).setValue('A3', '140').setValue('A4', 350).setValue('A5', 30000).setValue('A6', 170).setValue('A7', '17%');
        // reportData.append().setValue('A1', '磊九').setValue('A2', 1000).setValue('A3', '20').setValue('A4', 120).setValue('A5', 90000).setValue('A6', 110).setValue('A7', '81%');

        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材未出货订单与库存动态（2022年）' key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}