import React from "react";
import { DataRow, DataSet } from "autumn-ui";
import { Excel, excelData } from "../tool/Utils";
import { AuiMath } from "../tool/Summer";
import ReportDetail from "./ReportDetail";
import FrmSaleChart from "./FrmSaleChart";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class FrmReport18 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        let dataList: excelData[] = [];
        await fetch('./区域月度.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataSet = dataList[0].data;
        reportHead
            .setValue('销售区域', { name: '销售区域', width: '10' })
            .setValue('产品类别', { name: '产品类别', width: '5' })
            .setValue('销售目标', { name: '销售目标', width: '5' })
            .setValue('实际销售', { name: '实际销售', width: '8' })
            .setValue('A5', { name: '目标达成率', width: '6' })
        dataSet.first();
        let math = new AuiMath();
        while (dataSet.fetch()) {
            reportData.append().copyRecord(dataSet.current);
            reportData.setValue('A5', `${math.toFixed(dataSet.getDouble('销售目标') / dataSet.getDouble('实际销售') * 100, 2)}%`)
        }

        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='区域销售月底动态分析表' key={this.state.reportData.json} backHref={FrmSaleChart} backTitle='工业4.0-数字化销售管理中心V1.0'></ReportDetail>
    }
}