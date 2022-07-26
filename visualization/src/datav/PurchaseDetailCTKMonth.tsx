import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import ReportDetail from "./ReportDetail";
import { Excel, excelData } from '../tool/Utils';
import FrmPurchaseChart3 from "./FrmPurchaseChart3";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet
}

type FrmReportTypeProps = {

}

export default class PurchaseDetailCTKMonth extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
            setValue('到港数量', { name: '到港数量(T)', width: '16' }).
            setValue('出港数量', { name: '出港数量(T)', width: '16' }).
            setValue('出港耗损数量', { name: '出港耗损数量(T)', width: '20' }).
            setValue('出港耗损比例', { name: '出港耗损比例', width: '20' }).
            setValue('到厂数量', { name: '到厂数量(T)', width: '16' }).
            setValue('到厂耗损数量', { name: '到厂耗损数量(T)', width: '20' }).
            setValue('到厂耗损比例', { name: '到厂耗损比例', width: '20' }).
            setValue('总耗损数量', { name: '总耗损数量(T)', width: '18' }).
            setValue('总耗损比例', { name: '总耗损比例', width: '18' }).
            setValue('采购合同', { name: '采购合同', width: '18' }).
            setValue('备注', { name: '备注', width: '16' });
        await fetch('./铁矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            let ks: DataSet = dataList[1].data
            ks.first();
            let date = new Date;
            let month = date.getMonth() + 1;
            let day = date.getDate()
            let arr = 1
            let dg: any = new Array(month).fill(0);
            let cg: any = new Array(month).fill(0);
            let sh: any = new Array(month).fill(0);
            let dc: any = new Array(month).fill(0);
            let hs: any = new Array(month).fill(0);
            while (ks.fetch()) {
                let DateDate = new Date(ks.getString('到货日期'))
                let m = DateDate.getMonth() + 1;
                let d = DateDate.getDate()
                if (ks.getString('种类') == '磁铁矿') {
                    if (month == m) {
                        if (day >= d) {
                            dg[m - 1] += ks.getDouble('到港数量')
                            sh[m - 1] += ks.getDouble('耗损数量')
                            cg[m - 1] += ks.getDouble('出港数量')
                            dc[m - 1] += ks.getDouble('到货数量')
                            hs[m - 1] += ks.getDouble('耗损比例')
                        }
                    } else {
                        dg[m - 1] += ks.getDouble('到港数量')
                        sh[m - 1] += ks.getDouble('耗损数量')
                        cg[m - 1] += ks.getDouble('出港数量')
                        dc[m - 1] += ks.getDouble('到货数量')
                        hs[m - 1] += ks.getDouble('耗损比例')
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
                    setValue('到厂数量', dc[arr2].toFixed(2)).
                    setValue('到厂耗损数量', sh[arr2].toFixed(2)).
                    setValue('到厂耗损比例', hs[arr2].toFixed(3)).
                    setValue('总耗损数量', sh[arr2].toFixed(2)).
                    setValue('总耗损比例', ((cg[arr2] - dg[arr2]) / 5).toFixed(3)).
                    setValue('采购合同', 'DA20220' + (arr2 + 1) + '01').
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
        return <ReportDetail params={{ index: 1 }} dataSet={this.state.reportData} hideIt={true} head={this.state.reportHead} title='磁铁矿月度入库数量（T）' key={this.state.reportData.json} backHref={FrmPurchaseChart3} backTitle='工业4.0-数字化供应链管理中心V1.0'></ReportDetail>
    }
}