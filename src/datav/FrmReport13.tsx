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

export default class FrmReport13 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead
            .setValue('A1', { name: '出货单号', width: '10' })
            .setValue('A2', { name: '客户名称', width: '15' })
            .setValue('A3', { name: '单价（元/吨）', width: '4' })
            .setValue('A4', { name: '数量（吨）', width: '4' })
            .setValue('A5', { name: '金额（元）', width: '4' })
            .setValue('A6', { name: '备注', width: '10' });


            reportData.append().setValue('A1', 'BC22010001').setValue('A2', '张三').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            reportData.append().setValue('A1', 'BC22010002').setValue('A2', '李四').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            reportData.append().setValue('A1', 'BC22010003').setValue('A2', '王五').setValue('A3', '1000').setValue('A4', 40).setValue('A5', 40000);
            reportData.append().setValue('A1', 'BC22010004').setValue('A2', '赵六').setValue('A3', '1000').setValue('A4', 30).setValue('A5', 30000);
            reportData.append().setValue('A1', 'BC22010005').setValue('A2', '孙七').setValue('A3', '1000').setValue('A4', 40).setValue('A5', 40000);
            reportData.append().setValue('A1', 'BC22010006').setValue('A2', '洪八').setValue('A3', '1000').setValue('A4', 20).setValue('A5', 20000);
            reportData.append().setValue('A1', 'BC22010007').setValue('A2', '赵六').setValue('A3', '1000').setValue('A4', 30).setValue('A5', 30000);
            reportData.append().setValue('A1', 'BC22010008').setValue('A2', '孙七').setValue('A3', '1001').setValue('A4', 30).setValue('A5', 30030);
            reportData.append().setValue('A1', 'BC22010009').setValue('A2', '洪八').setValue('A3', '1002').setValue('A4', 20).setValue('A5', 20040);
            reportData.append().setValue('A1', 'BC22010010').setValue('A2', '赵六').setValue('A3', '1003').setValue('A4', 10).setValue('A5', 10030);
            reportData.append().setValue('A1', 'BC22010011').setValue('A2', '孙七').setValue('A3', '1004').setValue('A4', 20).setValue('A5', 20080);
            reportData.append().setValue('A1', 'BC22010012').setValue('A2', '洪八').setValue('A3', '1005').setValue('A4', 20).setValue('A5', 20100);
            reportData.append().setValue('A1', 'BC22010013').setValue('A2', '赵六').setValue('A3', '1006').setValue('A4', 30).setValue('A5', 30180);
            
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title='线材今日出货动态（T）' key={this.state.reportData.json}></ReportDetail>
    }
}