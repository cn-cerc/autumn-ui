import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {
    index: number
}

export default class SaleDetail5 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        reportHead.setValue('A1', { name: '销售区域', width: '10' }).setValue('A2', { name: '区域负责人', width: '8' }).setValue('A3', { name: '产品类型', width: '8' }).setValue('A4', { name: '销售目标（T）', width: '8' }).setValue('A5', { name: '实际销售（T）', width: '8' }).setValue('A6', { name: '销售目标达成率', width: '12' }).setValue('A7', { name: '销售排名（类别）', width: '12' });
        let reportData = new DataSet();
        let dataList: excelData[] = [];
        await fetch('./kanban3_1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        });
        let dataArr: DataSet[] = [];
        dataList.forEach((data) => {
            if (data.name.indexOf('区材料销售') > -1)
                dataArr.push(data.data);
        })
        let date = new Date('2022-06-04');
        let time = date.getTime();
        dataArr.forEach((ds: DataSet, index: number) => {
            ds.first();
            while (ds.fetch()) {
                let startTime = new Date(ds.getString('接单日期')).getTime();
                let endTime = new Date(ds.getString('出货日期')).getTime();
                if (startTime <= time && endTime > time) {
                    reportData.append().setValue('订单编号', ds.getString('订单编号')).setValue('客户名称', ds.getString('客户名称')).setValue('单价', ds.getString('单价')).setValue('A1', ds.getString('销售数量')).setValue('A2', '18').setValue('销售额', ds.getString('销售额')).setValue('A3', '10').setValue('A4', '88%');
                }
            }
        })
        this.setState({
            reportHead,
            reportData,
        })
    }

    render(): React.ReactNode {
        let date = new Date();
        let year = date.getFullYear();
        return <React.Fragment>
            <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`区域销售月底动态分析表`} key={String(this.state.reportData.json)} backHref='FrmPurchaseChart4' backTitle='采购数据管理中心'></ReportDetail>
        </React.Fragment>
    }
}