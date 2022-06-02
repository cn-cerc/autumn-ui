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

export default class PurchaseDetailMTDay extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('采购合同号', { name: '采购合同号', width: '20' }).
        setValue('采购数量', { name: '采购数量(T)', width: '15' }).
        setValue('单价', { name: '单价(元)', width: '15' }).
        setValue('合同金额', { name: '合同金额(元)', width: '16' }).
        setValue('采购热量标准', { name: '采购热量标准', width: '16' }).
        setValue('到港数量', { name: '到港数量(T)', width: '18' }).
        setValue('出港数量', { name: '出港数量(T)', width: '15' }).
        setValue('耗损数量', { name: '耗损数量(T)', width: '15' }).
        setValue('耗损比例', { name: '耗损比例', width: '15' }).
        setValue('水分检验', { name: '水分检验', width: '15' }).
        setValue('热量检验', { name: '热量检验', width: '15' }).
        setValue('承运车辆', { name: '承运车辆', width: '20' }).
        setValue('备注', { name: '备注', width: '20' });
        await fetch('./矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            let ks: DataSet = dataList[1].data
            let date = new Date
            let day = date.getDate()
            let month = date.getMonth() + 1
            ks.first();
            while (ks.fetch()) {
                let DateDate = new Date(ks.getString('到货日期'))
                let d = DateDate.getDate()
                let m = DateDate.getMonth() + 1
                if (ks.getString('种类') == '煤炭' && month == m && day == d) {
                    reportData.append().
                    setValue('采购合同号', ks.getString('采购合同号')).
                    setValue('采购数量', ks.getString('到货数量')).
                    setValue('单价', ks.getString('单价')).
                    setValue('合同金额', ks.getString('合同金额')).
                    setValue('采购热量标准', ks.getString('采购热量标准')).
                    setValue('到港数量', ks.getDouble('到港数量').toFixed(2)).
                    setValue('出港数量', ks.getString('出港数量')).
                    setValue('耗损数量', ks.getDouble('耗损数量').toFixed(1)).
                    setValue('耗损比例', ks.getDouble('耗损比例').toFixed(2)).
                    setValue('水分检验', ks.getString('水分检验')).
                    setValue('热量检验', ks.getString('热量检验')).
                    setValue('承运车辆', ks.getString('承运车辆')).
                    setValue('备注', ks.getString('备注'));
                }
            }
        })
        this.setState({
            reportHead,
            reportData
        })
    }

    render(): React.ReactNode {
        return <ReportDetail params={{index:1}} dataSet={this.state.reportData} head={this.state.reportHead} title='煤炭今日入库数量（T）' key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心'></ReportDetail>
    }
}