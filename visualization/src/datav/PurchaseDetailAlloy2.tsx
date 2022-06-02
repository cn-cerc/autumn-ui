import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import { AuiMath } from "../tool/Summer";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";

export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string
}

type FrmReportTypeProps = {
    index: number,
    title:string
}

export default class ReportDetail1 extends React.Component<FrmReportTypeProps, FrmReportTypeState> {
    constructor(props: FrmReportTypeProps) {
        super(props);
        this.state = {
            reportHead: new DataRow(),
            reportData: new DataSet(),
            reportName: '合金'
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let reportHead = new DataRow();
        let reportData = new DataSet();
        let math = new AuiMath();
        let dataList: excelData[] = [];
        await fetch('./合金.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })

        reportHead.setValue('月份', { name: '月份', width: '8' }).setValue('到港数量', { name: '到港数量(T)', width: '14' })
        .setValue('出港数量', { name: '出港数量(T)', width: '14' }).setValue('出港损耗数量', { name: '出港损耗数量(T)', width: '14' }).setValue('到厂数量', { name: '到厂数量(T)', width: '15' })
        .setValue('到厂损耗数量', { name: '到厂损耗数量(T)', width: '14' }).setValue('到厂损耗比例', { name: '到厂损耗比例(T)', width: '14' }).setValue('总损耗数量', { name: '总损耗数量(T)', width: '14' })
        .setValue('总损耗比例', { name: '总损耗比例(T)', width: '14' }).setValue('采购合同', { name: '采购合同号', width: '14' }).setValue('备注', { name: '备注', width: '10' });
       
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth();
        let monthArr:number[] = [];
        for(var i=1;i<=12;i++){
            monthArr[i-1] = i;
        }

        let tempData : DataSet = new DataSet();
        let dataSet = dataList[this.props.index].data;
        monthArr.forEach((item,index)=>{
            tempData.append().setValue('月份', item);
            dataSet.first();
            while (dataSet.fetch()) {
                let dataTextTimeMonth = new Date(dataSet.getString('到货日期')).getMonth();
                if(dataTextTimeMonth == index){
                    if(dataTextTimeMonth != nowMonth){
                        tempData.setValue('到港数量',math.toFixed(dataSet.getDouble('到港数量') + tempData.getDouble('到港数量'),2))
                        .setValue('出港数量',math.toFixed(dataSet.getDouble('出港数量') + tempData.getDouble('出港数量'),2))
                        .setValue('出港损耗数量',math.toFixed(dataSet.getDouble('出港损耗数量') + tempData.getDouble('出港损耗数量'),2))
                        .setValue('到厂数量',math.toFixed(dataSet.getDouble('到厂数量') + tempData.getDouble('到厂数量'),2))
                        .setValue('到厂损耗数量',math.toFixed(dataSet.getDouble('损耗数量') + tempData.getDouble('损耗数量'),2))
                        .setValue('到厂损耗比例',math.toFixed( (dataSet.getDouble('到厂损耗比例')>0?dataSet.getDouble('到厂损耗比例'):0) + (tempData.getDouble('到厂损耗比例')>0?tempData.getDouble('到厂损耗比例'):0),2))
                        .setValue('总损耗数量',math.toFixed(dataSet.getDouble('总损耗数量') + tempData.getDouble('总损耗数量'),2))
                        .setValue('总损耗比例',math.toFixed(dataSet.getDouble('总损耗比例') + tempData.getDouble('总损耗比例'),2))
                        .setValue('采购合同', dataSet.getString('采购合同号')).setValue('备注', dataSet.getString('备注'))
                    }else{
                        if(new Date(dataSet.getString('到货日期')).getDate() <= now.getDate()){
                            tempData.setValue('到港数量',math.toFixed(dataSet.getDouble('到港数量') + tempData.getDouble('到港数量'),2))
                            .setValue('出港数量',math.toFixed(dataSet.getDouble('出港数量') + tempData.getDouble('出港数量'),2))
                            .setValue('出港损耗数量',math.toFixed(dataSet.getDouble('出港损耗数量') + tempData.getDouble('出港损耗数量'),2))
                            .setValue('到厂数量',math.toFixed(dataSet.getDouble('到厂数量') + tempData.getDouble('到厂数量'),2))
                            .setValue('到厂损耗数量',math.toFixed(dataSet.getDouble('损耗数量') + tempData.getDouble('损耗数量'),2))
                            .setValue('到厂损耗比例',math.toFixed( (dataSet.getDouble('到厂损耗比例')>0?dataSet.getDouble('到厂损耗比例'):0) + (tempData.getDouble('到厂损耗比例')>0?tempData.getDouble('到厂损耗比例'):0),2))
                            .setValue('总损耗数量',math.toFixed(dataSet.getDouble('总损耗数量') + tempData.getDouble('总损耗数量'),2))
                            .setValue('总损耗比例',math.toFixed(dataSet.getDouble('总损耗比例') + tempData.getDouble('总损耗比例'),2))
                            .setValue('采购合同', dataSet.getString('采购合同号')).setValue('备注', dataSet.getString('备注'))
                        }
                    }
                }
            }
            reportData.append().setValue('月份', item).setValue('到港数量', tempData.current.getDouble('到港数量'))
            .setValue('出港数量', tempData.current.getDouble('出港数量')).setValue('出港损耗数量', tempData.current.getDouble('出港损耗数量'))
            .setValue('到厂数量', tempData.current.getDouble('到厂数量')).setValue('到厂损耗数量', tempData.current.getDouble('到厂损耗数量'));
            if(tempData.current.getDouble('到厂损耗数量') == 0 && tempData.current.getDouble('到厂数量') == 0){
                reportData.setValue('到厂损耗比例', 0 + '%');
            }else{
                reportData.setValue('到厂损耗比例', math.toFixed( tempData.current.getDouble('到厂损耗数量') / tempData.current.getDouble('到厂数量') , 4) + '%');
            }
            reportData.setValue('总损耗数量', math.toFixed( tempData.current.getDouble('出港损耗数量') + tempData.current.getDouble('到厂损耗数量'), 2));
            if(tempData.current.getDouble('总损耗数量') == 0 && tempData.current.getDouble('到港数量') == 0){
                reportData.setValue('总损耗比例', 0 + '%');
            }else{
                reportData.setValue('总损耗比例', math.toFixed( reportData.getDouble('总损耗数量') / reportData.getDouble('到港数量'), 4 ) + '%');
            }
            reportData.setValue('采购合同', tempData.getString('采购合同')).setValue('备注', tempData.getString('备注'));
        })
        this.setState({
            reportHead,
            reportData,
        })
    }

    render(): React.ReactNode {
        return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}${this.props.title}`} key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心' hideIt={true} params={{index:2}}></ReportDetail>
    }
}