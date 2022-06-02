import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import ReportDetail from "./ReportDetail";
import { Excel, excelData } from '../tool/Utils';

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class PurchaseDetailJMMonth extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('月份', { name: '月份', width: '15' }).
        setValue('到港数量', { name: '到港数量(T)', width: '20' }).
        setValue('出港数量', { name: '出港数量(T)', width: '20' }).
        setValue('出港耗损数量', { name: '出港耗损数量(T)', width: '25' }).
        setValue('出港耗损比例', { name: '出港耗损比例', width: '16' }).
        setValue('到厂数量', { name: '到厂数量(T)', width: '14' }).
        setValue('到厂耗损数量', { name: '到厂耗损数量(T)', width: '20' }).
        setValue('到厂耗损比例', { name: '到厂耗损比例', width: '20' }).
        setValue('总耗损数量', { name: '总耗损数量(T)', width: '20' }).
        setValue('总耗损比例', { name: '总耗损比例', width: '20' }).
        setValue('采购合同', { name: '采购合同', width: '20' }).
        setValue('备注', { name: '备注', width: '20' });
        await fetch('./矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            let ks: DataSet = dataList[1].data
            let newDateset: DataSet
            ks.first();
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let arr = 1
            let dg: any = [0, 0, 0, 0, 0, 0]
            let sh: any = [0, 0, 0, 0, 0, 0]
            let cg: any = [0, 0, 0, 0, 0, 0]
            let dh: any = [0, 0, 0, 0, 0, 0]

            while (ks.fetch()) {
                let DateDate = new Date(ks.getString('到货日期'))
                let m = DateDate.getMonth() + 1;
                let d = DateDate.getDate()
                if (ks.getString('种类') == '焦煤') {
                    if (month == m) {
                        if (day >= d) {
                            dg[5] += ks.getDouble('到港数量')
                            sh[5] += ks.getDouble('耗损数量')
                            cg[5] += ks.getDouble('出港数量')
                            dh[5] += ks.getDouble('到货数量')
                        }
                    } else {
                        dg[m - 1] += ks.getDouble('到港数量')
                        sh[m - 1] += ks.getDouble('耗损数量')
                        cg[m - 1] += ks.getDouble('出港数量')
                        dh[m - 1] += ks.getDouble('到货数量')
                    }
                }
            }
            for (let arr2 = 0; arr2 < month; arr2++) {
                reportData.append().
                    setValue('月份', arr++).
                    setValue('到港数量', dg[arr2].toFixed(2)).
                    setValue('出港数量', cg[arr2].toFixed(2)).
                    setValue('出港耗损数量', sh[arr2].toFixed(2)).
                    setValue('出港耗损比例', ((cg[arr2] - dg[arr2]) / 10).toFixed(3)).
                    setValue('到厂数量', dh[arr2].toFixed(1)).
                    setValue('到厂耗损数量', sh[arr2].toFixed(2)).
                    setValue('到厂耗损比例', ((cg[arr2] - dg[arr2]) / 10).toFixed(3)).
                    setValue('总耗损数量', sh[arr2].toFixed(2)).
                    setValue('总耗损比例', ((cg[arr2] - dg[arr2]) / 5).toFixed(3)).
                    setValue('采购合同', 'DA20220' + (arr2 + 1) + '02').
                    setValue('备注', '备注' + (arr2 + 1));
            }
        })
        for (let i = reportData.size; i < 11; i++) {
            reportData.append().setValue('月份', '').setValue('到港数量', '').setValue('出港数量', '').setValue('出港耗损数量', '').setValue('出港耗损比例', '').setValue('到厂数量', '').setValue('到厂耗损数量', '').setValue('到厂耗损比例', '').setValue('总耗损数量', '').setValue('总耗损比例', '').setValue('采购合同', '').setValue('备注', '');
        }
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail params={{index:1}} dataSet={this.state.reportData} hideIt={true} head={this.state.reportHead} title='焦煤月度入库数量（T）' key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心'></ReportDetail>
    }
}