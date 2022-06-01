import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import { AuiMath } from "../tool/Summer";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number,
    title:string
}

export default class ReportDetail1 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: '合金'
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        let math = new AuiMath();
        let dataList: excelData[] = [];
        await fetch('./合金.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })

        reportHead.setValue('采购合同号', { name: '采购合同号', width: '20' }).setValue('采购数量', { name: '采购数量（T）', width: '25' })
        .setValue('单价', { name: '单价', width: '10' }).setValue('合同金额', { name: '合同金额', width: '10' }).setValue('采购品位', { name: '采购品位', width: '20' })
        .setValue('到港数量', { name: '到港数量', width: '10' }).setValue('出港数量', { name: '出港数量', width: '10' }).setValue('到厂数量', { name: '到厂数量', width: '10' })
        .setValue('损耗数量', { name: '损耗数量', width: '10' }).setValue('损耗比例', { name: '损耗比例', width: '10' }).setValue('湿度检验', { name: '湿度检验', width: '10' })
        .setValue('品位检验', { name: '品位检验', width: '20' }).setValue('承运车辆', { name: '承运车辆', width: '20' }).setValue('备注', { name: '备注', width: '20' });
        
        let dataSet = dataList[this.props.index].data;
        dataSet.first();
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth();
        while (dataSet.fetch()) {
            if (new Date(dataSet.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                reportData.append().setValue('采购合同号', dataSet.getString('采购合同号')).setValue('采购数量',dataSet.getDouble('数量')).setValue('单价',dataSet.getDouble('单价'))
                .setValue('合同金额',math.toFixed(dataSet.getDouble('合同金额'),2)).setValue('采购品位',dataSet.getDouble('采购品位')).setValue('到港数量',math.toFixed(dataSet.getDouble('到港数量'),1))
                .setValue('出港数量',math.toFixed(dataSet.getDouble('出港数量'),1)).setValue('到厂数量',math.toFixed(dataSet.getDouble('到厂数量'),1)).setValue('损耗数量',math.toFixed(dataSet.getDouble('损耗数量'),1))
                .setValue('损耗比例',math.toFixed(dataSet.getDouble('损耗比例'),4)+'%').setValue('湿度检验',dataSet.getDouble('湿度检验')).setValue('品位检验',dataSet.getDouble('品位检验'))
                .setValue('承运车辆',dataSet.getDouble('承运车辆')).setValue('备注',dataSet.getString('备注'));
            }
        }
        this.setState({
            reportHead,
            reportData,
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}${this.props.title}`} key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心' hideIt={true} params={{index:2}}></ReportDetail>
    }
}