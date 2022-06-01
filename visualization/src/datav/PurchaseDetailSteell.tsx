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
        let arr = ['A站','B站','C站','D站'];
        let dataArr:any[] = [];
        arr.forEach((item,arrIndex)=>{
            let temp:number[][] = [];
            for(var i = 0;i<31;i++){
                temp.push([]);
                temp[i][0] = 0;
                temp[i][1] = 0;
                temp[i][2] = 0;
                temp[i][3] = 0;
                temp[i][4] = 0;
                if(i >= now.getDate()){
                    continue;
                }
                dataSet.first();
                while (dataSet.fetch()) {
                    var timeDay = new Date(dataSet.getString('日期')).getDate();
                    var monthTime = new Date(dataSet.getString('日期')).getMonth();
                    if( monthTime == nowMonth && timeDay == (i+1)){
                        dataSet1.first();
                        while (dataSet1.fetch()) {
                            var zl = dataSet1.getString('种类');
                            var thatMontTime = new Date(dataSet1.getString('发货日期')).getMonth();
                            if(zl == item){
                                if(thatMontTime == nowMonth && new Date(dataSet1.getString('发货日期')).setHours(0,0,0,0) == now.setHours(0,0,0,0)){
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
                    }
                }
            }
            dataArr.push(temp);
        })
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
    }

    render(): JSX.Element {
        return (
            <div className={styles.main}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='废铁今日收料数量（T）' handleCick={() => {
                    //@ts-ignore
                    return aui.showPage('FrmPurchaseChart3', '采购数据管理中心',{index:2});
                }} />
                    <div className={styles.box} style={{width:'1700px'}}>
                        <BorderBox9>
                            <div className={styles.grid}>
                            <div className={'aui-dbgrid-main ' + `${styles.lmTable}`} role="dbgrid">
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
                    <tr key={'tr0-0-0'}>
                        <th style={{fontSize:'12px',width:'16px'}}>种类</th>
                        <th style={{fontSize:'12px',width:'70px'}}>项目</th>
                        {this.getHeadTd(31,true)}
                        <th style={{fontSize:'12px',width:'58px'}}>合计</th>
                    </tr>
                    {this.getBodyItem(data[0],'A','A站')}
                    {this.getBodyItem(data[1],'B','B站')}
                    {this.getBodyItem(data[2],'C','C站')}
                    {this.getBodyItem(data[3],'D','D站')}
                </tbody>
            </table>
        </React.Fragment>
    }

    getBodyItem(data:any,trIndex:string,text:string){
        if(!data || data.length == 0) return;
        return <React.Fragment>
            <tr key={`${trIndex}-tr1`}>
                <td rowSpan={5} style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td1`}>{text}</td>
                <td style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td2`}>今日挂牌价</td>
                {this.getHeadTd(31,false,trIndex+'-td1',data[0])}
            </tr>
            <tr key={`${trIndex}-tr2`}>
                <td style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td3`}>收购价格</td>
                {this.getHeadTd(31,false,trIndex+'-td2',data[1])}
            </tr>
            <tr key={`${trIndex}-tr3`}>
                <td style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td4`}>收购数量</td>
                {this.getHeadTd(31,false,trIndex+'-td3',data[2])}
            </tr>
            <tr key={`${trIndex}-tr4`}>
                <td style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td5`}>今日发货</td>
                {this.getHeadTd(31,false,trIndex+'-td4',data[3])}
            </tr>   
            <tr key={`${trIndex}-tr5`}>
                <td style={{fontSize:'12px',textAlign:'center'}} key={`${trIndex}_td6`}>今日库存</td>
                {this.getHeadTd(31,false,trIndex+'-td5',data[4])}
            </tr>
        </React.Fragment>
    }
    getHeadTd(count:number,type:boolean,trIndex?:string,data?:any){
        var temp = 0;
        let list: ReactNode[] = [];
        for(var i=1;i<=count;i++){
            if(type){
                list.push(<th key={`th-${i}`} style={{fontSize:'12px',width:'42px'}}>{i}</th>);
            }else{
                temp +=  data[i-1];
                list.push(<td key={`${trIndex}-${i}`} style={{fontSize:'12px',textAlign:'right'}}>{data[i-1]}</td>);
                console.log(trIndex+'-'+i)
            }
        }
        if(data && !type){
            list.push(<td key={`${trIndex}-${temp}`} style={{fontSize:'12px',textAlign:'right'}}>{temp}</td>);
        }
        return list;
    }
}