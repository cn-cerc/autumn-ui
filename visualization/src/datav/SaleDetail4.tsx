import { DataRow, DataSet } from "autumn-ui";
import React from "react";
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

export default class SaleDetail4 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    private titleList: string[] = ['螺纹钢', '型钢', '带钢', '板材', '线材', '管材']
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: this.titleList[this.props.index]
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        reportHead.setValue('客户名称', { name: '客户名称', width: '10' }).setValue('单价', { name: '单价（元/吨）', width: '8' }).setValue('A1', { name: '未出货数量（吨）', width: '8' }).setValue('A2', { name: '当前库存（吨）', width: '8' }).setValue('销售额', { name: '金额（元）', width: '8' }).setValue('A3', { name: '销售目标', width: '12' }).setValue('A4', { name: '销售目标达成率', width: '12' });
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
                if (ds.getString('类型') == this.titleList[this.props.index]) {
                    let startTime = new Date(ds.getString('接单日期')).getTime();
                    let endTime = new Date(ds.getString('出货日期')).getTime();
                    if (startTime <= time && endTime > time) {
                        reportData.append().setValue('订单编号', ds.getString('订单编号')).setValue('客户名称', ds.getString('客户名称')).setValue('单价', ds.getString('单价')).setValue('A1', ds.getString('销售数量')).setValue('A2', '18').setValue('销售额', ds.getString('销售额')).setValue('A3', '10').setValue('A4', '88%');
                    }
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
            <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}未出货订单与库存动态（${year}年）`} key={String(this.state.reportData.json)} backHref='FrmPurchaseChart4' backTitle='采购数据管理中心'></ReportDetail>
        </React.Fragment>
    }
}