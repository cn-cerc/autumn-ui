import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import { Excel, excelData } from "../tool/Utils";
import FrmPurchaseChart4 from "./FrmPurchaseChart4";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string,
    showOut: boolean
}

type FrmReportTypeProps = {
    index: number,
    pageType1: number
}

export default class SaleDetail1 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    private titleList: string[] = ['螺纹钢', '型钢', '带钢', '板材', '线材', '管材']
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: this.titleList[this.props.index],
            showOut: false
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        reportHead.setValue('订单编号', { name: '订单编号', width: '10' }).setValue('客户名称', { name: '客户名称', width: '8' }).setValue('单价', { name: '单价（元/吨）', width: '8' }).setValue('销售数量', { name: '数量（吨）', width: '8' }).setValue('销售额', { name: '金额（元）', width: '8' }).setValue('备注', { name: '备注', width: '12' });
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
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        dataArr.forEach((ds: DataSet, index: number) => {
            ds.first();
            while (ds.fetch()) {
                if (ds.getString('类型') == this.titleList[this.props.index]) {
                    let date_ = new Date(this.state.showOut ? ds.getString('出货日期') : ds.getString('接单日期'));
                    let year_ = date_.getFullYear();
                    let month_ = date_.getMonth();
                    let day_ = date_.getDate();
                    if (year_ == year && month_ == month && day_ == day) {
                        reportData.append().setValue('订单编号', ds.getString('订单编号')).setValue('客户名称', ds.getString('客户名称')).setValue('单价', ds.getString('单价')).setValue('销售数量', ds.getString('销售数量')).setValue('销售额', ds.getString('销售额')).setValue('备注', ds.getString('备注'));
                    }
                }
            }
        })
        while (reportData.size < 10) {
            reportData.append().setValue('订单编号', '').setValue('客户名称', '').setValue('单价', '').setValue('销售数量', '').setValue('销售额', '').setValue('备注', '');
        }
        this.setState({
            reportHead,
            reportData,
        })
    }

    render(): React.ReactNode {
        let date = new Date();
        let month: string | number = date.getMonth() + 1;
        let day: string | number = date.getDate();
        if (month < 10)
            month = `0${month}`;
        if (day < 10)
            day = `0${day}`;
        return <React.Fragment>
            <div style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center', 'position': 'fixed', 'top': '120px', 'left': '0', 'right': '0', 'zIndex': '1000', 'fontSize': '24px' }}>
                <span style={{ 'color': this.state.showOut ? '#fff' : '#58f7ff', 'cursor': 'pointer' }} onClick={() => this.setShowOut(false)}>接单</span>
                <span style={{ 'paddingLeft': '35px', 'color': this.state.showOut ? '#58f7ff' : '#fff', 'cursor': 'pointer', 'fontSize': '24px' }} onClick={this.setShowOut.bind(this, true)}>出货</span>
            </div>
            <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}今日${this.state.showOut ? '出货' : '接单'}动态（${month}月${day}日）`} key={String(this.state.showOut)} backHref={FrmPurchaseChart4} backTitle='工业4.0-数字化供应链管理中心V1.0' params={{ pageType1: this.props.pageType1 }}></ReportDetail>
        </React.Fragment>
    }

    setShowOut(bool: boolean) {
        if (this.state.showOut != bool)
            this.setState({
                showOut: bool
            }, () => {
                this.init();
            })
    }
}