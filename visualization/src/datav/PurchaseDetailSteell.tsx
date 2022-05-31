import { DataRow, DataSet } from "autumn-ui";
import React, { ReactNode } from "react";
import { AuiMath } from "../tool/Summer";
import { Excel, excelData } from "../tool/Utils";
import ReportDetail from "./ReportDetail";
import styles from "./ReportDetail.css";
import { BorderBox9, FullScreenContainer } from "@jiaminghi/data-view-react";
import TopHeader from "./TopHeader";


export type FrmReportTypeState = {
    reportHead: DataRow,
    reportData: DataSet,
    reportName: string,
    dataArr:any[]
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
            reportName: '废铁',
            dataArr:[]
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
        let dataList1: excelData[] = [];
        await fetch('./废钢.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        
        let dataSet = dataList[2].data;
        let dataSet1 = dataList[1].data;
        let now = new Date();
        let nowYear = now.getFullYear();
        let nowMonth = now.getMonth();
        let arr = ['重废','中废','小废','统料'];
        let dataArr:any[] = [];
        arr.forEach((item,arrIndex)=>{
            let temp:number[][] = [];
            for(var i = 0;i<31;i++){
                temp.push([]);
                dataSet.first();
                while (dataSet.fetch()) {
                    var timeDay = new Date(dataSet.getString('日期')).getDate();
                    var monthTime = new Date(dataSet.getString('日期')).getMonth();
                    if( monthTime == nowMonth && timeDay == (i+1)){
                        if(item == '重废'){
                            if(!temp[i][0]){
                                temp[i][0] = 0;
                            }
                            if(!temp[i][1]){
                                temp[i][1] = 0;
                            }
                            if(!temp[i][2]){
                                temp[i][2] = 0;
                            }
                            if(!temp[i][3]){
                                temp[i][3] = 0;
                            }
                            if(!temp[i][4]){
                                temp[i][4] = 0;
                            }
                            dataSet1.first();
                            while (dataSet1.fetch()) {
                                if(new Date(dataSet1.getString('发货日期')).setHours(0,0,0,0) == now.setHours(0,0,0,0)){
                                    temp[i][0] = dataSet1.getDouble('单价');
                                    temp[i][1] = dataSet1.getDouble('单价');
                                    temp[i][2] = math.toFixed(temp[i][2] + dataSet1.getDouble('数量'),1);
                                    temp[i][3] = math.toFixed(temp[i][3] + dataSet1.getDouble('数量'),1);
                                }
                                if(new Date(dataSet1.getString('到货日期')) <= now){
                                    temp[i][4] = math.toFixed(temp[i][4] + dataSet1.getDouble('数量'),1);
                                }
                            }
                        }
                        if(item == '中废'){
                            if(!temp[i][0]){
                                temp[i][0] = 0;
                            }
                            if(!temp[i][1]){
                                temp[i][1] = 0;
                            }
                            if(!temp[i][2]){
                                temp[i][2] = 0;
                            }
                            if(!temp[i][3]){
                                temp[i][3] = 0;
                            }
                            if(!temp[i][4]){
                                temp[i][4] = 0;
                            }
                            dataSet1.first();
                            while (dataSet1.fetch()) {
                                if(new Date(dataSet1.getString('发货日期')).setHours(0,0,0,0) == now.setHours(0,0,0,0)){
                                    temp[i][0] = temp[i][0] + dataSet1.getDouble('单价');
                                    temp[i][1] = math.toFixed(temp[i][1] + dataSet1.getDouble('单价'),1);
                                    temp[i][2] = math.toFixed(temp[i][2] + dataSet1.getDouble('数量'),1);
                                    temp[i][3] = math.toFixed(temp[i][3] + dataSet1.getDouble('数量'),1);
                                }
                                if(new Date(dataSet1.getString('到货日期')) <= now){
                                    temp[i][4] = math.toFixed(temp[i][4] + dataSet1.getDouble('数量'),1);
                                }
                            }
                        }
                        if(item == '小废'){
                            if(!temp[i][0]){
                                temp[i][0] = 0;
                            }
                            if(!temp[i][1]){
                                temp[i][1] = 0;
                            }
                            if(!temp[i][2]){
                                temp[i][2] = 0;
                            }
                            if(!temp[i][3]){
                                temp[i][3] = 0;
                            }
                            if(!temp[i][4]){
                                temp[i][4] = 0;
                            }
                            dataSet1.first();
                            while (dataSet1.fetch()) {
                                if(new Date(dataSet1.getString('发货日期')).setHours(0,0,0,0) == now.setHours(0,0,0,0)){
                                    temp[i][0] = temp[i][0] + dataSet1.getDouble('单价');
                                    temp[i][1] = math.toFixed(temp[i][1] + dataSet1.getDouble('单价'),1);
                                    temp[i][2] = math.toFixed(temp[i][2] + dataSet1.getDouble('数量'),1);
                                    temp[i][3] = math.toFixed(temp[i][3] + dataSet1.getDouble('数量'),1);
                                }
                                if(new Date(dataSet1.getString('到货日期')) <= now){
                                    temp[i][4] = math.toFixed(temp[i][4] + dataSet1.getDouble('数量'),1);
                                }
                            }
                        }
                        if(item == '统料'){
                            if(!temp[i][0]){
                                temp[i][0] = 0;
                            }
                            if(!temp[i][1]){
                                temp[i][1] = 0;
                            }
                            if(!temp[i][2]){
                                temp[i][2] = 0;
                            }
                            if(!temp[i][3]){
                                temp[i][3] = 0;
                            }
                            if(!temp[i][4]){
                                temp[i][4] = 0;
                            }
                            dataSet1.first();
                            while (dataSet1.fetch()) {
                                if(new Date(dataSet1.getString('发货日期')).setHours(0,0,0,0) == now.setHours(0,0,0,0)){
                                    temp[i][0] = temp[i][0] + dataSet1.getDouble('单价');
                                    temp[i][1] = math.toFixed(temp[i][1] + dataSet1.getDouble('单价'),1);
                                    temp[i][2] = math.toFixed(temp[i][2] + dataSet1.getDouble('数量'),1);
                                    temp[i][3] = math.toFixed(temp[i][3] + dataSet1.getDouble('数量'),1);
                                }
                                if(new Date(dataSet1.getString('到货日期')) <= now){
                                    temp[i][4] = math.toFixed(temp[i][4] + dataSet1.getDouble('数量'),1);
                                }
                            }
                        }
                    }
                }
            }
            dataArr.push(temp);
        })
        // console.log(dataArr);
        var arr1:any[]= [
            [[],[],[],[],[]],
            [[],[],[],[],[]],
            [[],[],[],[],[]],
            [[],[],[],[],[]],
        ];
        var dataArr1:any = []
        for(var i=0;i<dataArr.length;i++){
            for(var k=0;k<dataArr[i].length;k++){
                arr1[i][0].push(dataArr[i][k][0]>0?dataArr[i][k][0]:0);
                arr1[i][1].push(dataArr[i][k][1]>0?dataArr[i][k][1]:0);
                arr1[i][2].push(dataArr[i][k][2]>0?dataArr[i][k][2]:0);
                arr1[i][3].push(dataArr[i][k][3]>0?dataArr[i][k][3]:0);
                arr1[i][4].push(dataArr[i][k][4]>0?dataArr[i][k][4]:0);
            }
        }

        this.setState({
            dataArr:arr1
        })
        // console.log(arr1);
    }

    render(): JSX.Element {
        return (
            <div className={styles.main}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='废铁今日收料数量（T）' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.box}>
                        <BorderBox9>
                            <div className={styles.grid}>
                            <div className={'aui-dbgrid-main'} role="dbgrid">
                                {this.getTable(this.state.dataArr)}
                            </div>
                            </div>
                        </BorderBox9>
                    </div>
                </FullScreenContainer>
            </div>
        )
    }

    getTable(data:any){
        return <React.Fragment>
            <table>
                <tbody>
                    <tr>
                        <th>序</th>
                        <th>类</th>
                        <th>项目</th>
                        {this.getHeadTd(31,true)}
                        <th>合计</th>
                    </tr>
                    {this.getBodyItem(data)}
                </tbody>
            </table>
        </React.Fragment>
    }

    getBodyItem(data:any){
        // console.log(data[0]);
        return <React.Fragment>
            <tr>
                <td rowSpan={5}>1</td>
                <td rowSpan={5}>重废</td>
                <td>今日挂牌价</td>
                {this.getHeadTd(31,false,data[0])}
                <td></td>
            </tr>
            <tr>
                <td>收购价格</td>
                {this.getHeadTd(31,false,data[1])}
                <td></td>
            </tr>
            <tr>
                <td>收购数量</td>
                {this.getHeadTd(31,false,data[2])}
                <td></td>
            </tr>
            <tr>
                <td>今日发货</td>
                {this.getHeadTd(31,false,data[3])}
                <td></td>
            </tr>   
            <tr>
                <td>今日库存</td>
                {this.getHeadTd(31,false,data[4])}
                <td></td>
            </tr>
        </React.Fragment>
    }
    getHeadTd(count:number,type:boolean,data?:any){
        console.log(data)
        let list: ReactNode[] = [];
        for(var i=1;i<=count;i++){
            if(type){
                list.push(<th key={i}>{i}</th>);
            }else{
                // list.push(<td key={i}>{data[i]}</td>);
            }
        }
        return list;
    }

    titleClick() {
        // let showIndex = this.state.showIndex + 1;
        // this.setState({
        //     showIndex
        // })
    }
    // return <ReportDetail dataSet={this.state.reportData} head={this.state.reportHead} title={`${this.state.reportName}${this.props.title}`} key={this.state.reportData.json} backHref='FrmPurchaseChart3' backTitle='采购数据管理中心'></ReportDetail>

}