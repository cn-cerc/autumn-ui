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

export default class FrmReport13 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('订单编号', { name: '订单编号', width: '15' }).setValue('客户名称', { name: '客户名称', width: '20' }).setValue('单价（元/吨）', { name: '单价（元/吨）', width: '25' }).setValue('数量（吨）', { name: '数量（吨）', width: '16' }).setValue('金额（元）', { name: '金额（元）', width: '14' }).setValue('备注', { name: '备注', width: '18' });
        dataSet.first();
        let date = new Date();
        while(dataSet.fetch()) {
            let date_ = new Date(dataSet.getString('出货日期'));
            if(date_.getDate() == date.getDate() && date_.getFullYear() == date.getFullYear() && date_.getMonth() == date.getMonth()) {
                reportData.append().copyRecord(dataSet.current);
            }
        }
        reportHead
            .setValue('出货单号', { name: '出货单号', width: '10' })
            .setValue('客户名称', { name: '客户名称', width: '15' })
            .setValue('单价（元/吨）', { name: '单价（元/吨）', width: '10' })
            .setValue('数量（吨）', { name: '数量（吨）', width: '8' })
            .setValue('金额（元）', { name: '金额（元）', width: '8' })
            .setValue('备注', { name: '备注', width: '10' });


            // reportData.append().setValue('A1', 'BC22010001').setValue('A2', '张三').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            // reportData.append().setValue('A1', 'BC22010002').setValue('A2', '李四').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            // reportData.append().setValue('A1', 'BC22010003').setValue('A2', '王五').setValue('A3', '1000').setValue('A4', 40).setValue('A5', 40000);
            // reportData.append().setValue('A1', 'BC22010004').setValue('A2', '赵六').setValue('A3', '1000').setValue('A4', 30).setValue('A5', 30000);
            // reportData.append().setValue('A1', 'BC22010005').setValue('A2', '孙七').setValue('A3', '1000').setValue('A4', 40).setValue('A5', 40000);
            // reportData.append().setValue('A1', 'BC22010006').setValue('A2', '洪八').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            // reportData.append().setValue('A1', 'BC22010007').setValue('A2', '赵六').setValue('A3', '1000').setValue('A4', 30).setValue('A5', 30000);
            // reportData.append().setValue('A1', 'BC22010008').setValue('A2', '孙七').setValue('A3', '1001').setValue('A4', 30).setValue('A5', 30030);
            // reportData.append().setValue('A1', 'BC22010009').setValue('A2', '洪八').setValue('A3', '1002').setValue('A4', 20).setValue('A5', 20040);
            // reportData.append().setValue('A1', 'BC22010010').setValue('A2', '赵六').setValue('A3', '1003').setValue('A4', 10).setValue('A5', 10030);
            // reportData.append().setValue('A1', 'BC22010011').setValue('A2', '孙七').setValue('A3', '1004').setValue('A4', 20).setValue('A5', 20080);
            // reportData.append().setValue('A1', 'BC22010012').setValue('A2', '洪八').setValue('A3', '1005').setValue('A4', 20).setValue('A5', 20100);
            // reportData.append().setValue('A1', 'BC22010013').setValue('A2', '赵六').setValue('A3', '1006').setValue('A4', 30).setValue('A5', 30180);
            
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}今日出货动态（${new Date().getMonth() + 1}月${new Date().getDate()}日）`} key={this.state.reportData.json} backHref='FrmSaleChart' backTitle='销售数据管理中心'></ReportDetail>
    }
}