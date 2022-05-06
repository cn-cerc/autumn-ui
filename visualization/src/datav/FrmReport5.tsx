import React from "react";
import { DataRow, DataSet } from "autumn-ui";
import { Excel, excelData } from "../tool/Utils";
import { AuiMath } from "../tool/Summer";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number
}

export default class FrmReport5 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        let math = new AuiMath();
        let dataSet = dataList[this.props.index].data;
        let reportName = dataList[this.props.index].name;
        reportHead.setValue('A0', { name: '周次', width: '15' }).setValue('A1', { name: '产能目标/月', width: '20' }).setValue('A2', { name: '入库数量（T）', width: '25' }).setValue('A3', { name: '产能目标达成率', width: '16' }).setValue('A4', { name: '超产数量（T）', width: '14' }).setValue('A5', { name: '超产率', width: '18' }).setValue('A6', { name: '备注', width: '18' });
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let days = new Date(year, month, 0).getDate();
        let startWeek = new Date(year, month, 1).getDay();
        let startWeekLine = 7 - startWeek + 1;
        let weekLineArr = [startWeekLine];
        let weekArr = [{ A0: '第一周', A1: 0, A2: 0, A3: '0%', A4: 0, A5: '', A6: '' }];
        let length = Math.ceil((days - startWeek) / 7);
        for (let i = 0; i < length; i++) {
            let num;
            switch (i) {
                case 0:
                    num = '第二周';
                    break;
                case 1:
                    num = '第三周';
                    break;
                case 2:
                    num = '第四周';
                    break;
                case 3:
                    num = '第五周';
                    break;
                case 4:
                    num = '第六周';
                    break;
                default:
                    num = '第二周';
                    break
            }
            weekArr.push({ A0: num, A1: 0, A2: 0, A3: '0%', A4: 0, A5: '', A6: '' })
            weekLineArr.push(startWeekLine + ((i + 1) * 7));
        }
        dataSet.first();
        while (dataSet.fetch()) {
            let date_ = new Date(dataSet.getString('接单日期'));
            let year_ = date_.getFullYear();
            let month_ = date.getMonth();
            let day_ = date_.getDate();
            if (year_ == year && month_ == month) {
                let index = 0;
                for (let i = 0; i < weekLineArr.length; i++) {
                    if (day_ <= weekLineArr[0]) {
                        index = 0;
                        break;
                    }
                    if (day_ > weekLineArr[weekLineArr.length - 2]) {
                        index = weekLineArr.length - 1;
                        break
                    }
                    if (day_ > weekLineArr[i] && day_ <= weekLineArr[i + 1]) {
                        index = i + 1;
                        break;
                    }
                }
                let sellNum1 = dataSet.getDouble('销售目标（吨）');
                let sellNum2 = dataSet.getDouble('出货数量（吨）');
                weekArr[index].A1 += sellNum1;
                weekArr[index].A2 += sellNum2;
                weekArr[index].A6 = dataSet.getString('备注');
            }
        }
        weekArr.forEach((obj, index) => {
            let overproduct_ = obj.A2 - obj.A1;
            obj.A3 = `${math.toFixed(obj.A2 / obj.A1 * 100, 2)}%`;
            obj.A4 = overproduct_ > 0 ? overproduct_ : 0;
            obj.A5 = overproduct_ > 0 ? `${math.toFixed(overproduct_ / obj.A1 * 100, 2)}%` : '0%';
            reportData.append().setValue('A0', obj.A0).setValue('A1', obj.A1).setValue('A2', obj.A2).setValue('A3', obj.A3).setValue('A4', obj.A4).setValue('A5', obj.A5).setValue('A6', obj.A6);
        });
        // reportData.append().setValue('A0', '第一周').setValue('A1', 500).setValue('A2', 510).setValue('A3', '100%').setValue('A4', 10).setValue('A5', '5%').setValue('A6', '备注1');
        // reportData.append().setValue('A0', '第二周').setValue('A1', 600).setValue('A2', 550).setValue('A3', '91.6%').setValue('A4', 0).setValue('A5', '0%').setValue('A6', '备注2');
        // reportData.append().setValue('A0', '第三周').setValue('A1', 300).setValue('A2', 400).setValue('A3', '100%').setValue('A4', 100).setValue('A5', '33.33%').setValue('A6', '备注3');
        // reportData.append().setValue('A0', '第四周').setValue('A1', 800).setValue('A2', 600).setValue('A3', '75%').setValue('A4', 0).setValue('A5', '0%').setValue('A6', '备注4');
        this.setState({
            reportHead,
            reportData,
            reportName
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`本月${this.state.reportName}入库动态（T）`} hideIt={true} key={this.state.reportData.json} backHref='FrmManufactureChart' backTitle='制造数据管理中心'></ReportDetail>
    }
}