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

export default class PurchaseDetailCHITKDay extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
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
        reportHead.setValue('采购合同号', { name: '采购合同号', width: '22' }).
        setValue('采购数量', { name: '采购数量(T)', width: '13' }).
        setValue('单价', { name: '单价(元)', width: '12' }).
        setValue('合同金额', { name: '合同金额(元)', width: '14' }).
        setValue('采购品位', { name: '采购品位', width: '13' }).
        setValue('到港数量', { name: '到港数量(T)', width: '13' }).
        setValue('出港数量', { name: '出港数量(T)', width: '13' }).
        setValue('到厂数量', { name: '到厂数量(T)', width: '13' }).
        setValue('耗损数量', { name: '耗损数量(T)', width: '13' }).
        setValue('耗损比例', { name: '耗损比例(%)', width: '14' }).
        setValue('湿度检验', { name: '湿度检验(%)', width: '14' }).
        setValue('品位检验', { name: '品位检验(%)', width: '14' }).
        setValue('承运车辆', { name: '承运车辆', width: '15' }).
        setValue('备注', { name: '备注', width: '15' });
        await fetch('./铁矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            let ks: DataSet = dataList[1].data
            ks.first();
            let date = new Date
            let month = date.getMonth() + 1
            let day = date.getDate()
            while(ks.fetch()) {
                let DateDate = new Date(ks.getString('到货日期'))
                let m = DateDate.getMonth() + 1
                let d = DateDate.getDate()
                if(ks.getString('种类') == '赤铁矿' &&  month == m && day == d ) {
                    reportData.append().
                    setValue('采购合同号', ks.getString('采购合同号')).
                    setValue('采购数量', ks.getDouble('到厂数量').toFixed(2)).
                    setValue('单价', ks.getString('单价')).
                    setValue('合同金额', ks.getString('合同金额')).
                    setValue('采购品位', ks.getString('采购品位')).
                    setValue('到港数量', ks.getDouble('到港数量').toFixed(2)).
                    setValue('出港数量', ks.getString('出港数量')).
                    setValue('到厂数量', ks.getDouble('到厂数量').toFixed(2)).
                    setValue('耗损数量', ks.getDouble('耗损数量').toFixed(2)).
                    setValue('耗损比例', ks.getDouble('耗损比例').toFixed(3)).
                    setValue('湿度检验', ks.getString('湿度检验')).
                    setValue('品位检验', ks.getString('品位检验')).
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
        return <ReportDetail params={{index:1}} dataSet={this.state.reportData} head={this.state.reportHead} title='赤铁矿今日入库数量（T）' key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心'></ReportDetail>
    }
}