import { BorderBox1, FullScreenContainer } from '@jiaminghi/data-view-react';
import { Column, DataRow, DataSet, DBGrid } from 'autumn-ui';
import * as echarts from "echarts";
import React, { ReactNode } from 'react';
import { AuiMath } from '../tool/Summer';
import "../tool/Summer.css";
import { Excel, excelData } from '../tool/Utils';
import styles from './FrmPurchaseChart3.css';
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';

type stateType = {
    ltype: number,
    menuOptions: ViewMenuMap,
    rtype: number,
    main2Data: Array<object>,
    main3Data: Array<object>,
    showIndex: number,
    ironOreList: DataSet,
    mineralList: DataSet,
    alloyList: DataSet,
    steellList: DataSet,
    lengedState: boolean[],
    lengedState1: boolean[],
    timeFlag: any,
    timeNub:number
}
type PropsType = {
    dataSet: DataSet,
    head: DataRow,
    backHref?: string,
    backTitle?: string,
    hideIt?: boolean,
}

export default class FrmPurchaseChart3 extends React.Component<PropsType, stateType>{
    private lineLenged: string[] = ['仓库容量', '安全库存', '当前库存', '在途库存'];
    private isLengedEvent: boolean = false;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            showIndex: 0,
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart3", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart4", "销售数据管理中心")'
            }]]),
            ltype: 1,
            rtype: 3,
            main2Data: [
                { value: 3.9, name: '锰' },
                { value: 2, name: '硅' },
                { value: 1.4, name: '钒' },
                { value: 1.2, name: '钨' },
                { value: 1, name: '钛' },
                { value: 1.3, name: '钼' }
            ],
            main3Data: [
                {
                    name: 'A站',
                    data: [4.3, 2.5, 3.5, 4.5, 2],
                    type: 'line',
                    symbolSize: 8,
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    },

                },
                {
                    name: 'B站',
                    data: [2.4, 4.4, 1.8, 2.8, 1],
                    type: 'line',
                    symbolSize: 8,
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    }
                },
                {
                    name: 'C站',
                    data: [1, 2, 3, 5, 4],
                    type: 'line',
                    symbolSize: 8,
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    }
                },
                {
                    name: 'D站',
                    data: [1, 2, 2, 3, 1.8],
                    type: 'line',
                    symbolSize: 8,
                    smooth: true,
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    }
                }
            ],
            ironOreList: new DataSet(), //铁矿石=》煤炭 数据
            mineralList: new DataSet(), //矿石 数据
            alloyList: new DataSet(), //合金 数据
            steellList: new DataSet(), //废钢 数据
            lengedState: [true, true, true, true],
            lengedState1: [true, true, true, true],
            timeFlag: null,
            timeNub:30 * 1000
        }
    }

    async initData() {
        await fetch('./矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ ironOreList: dataList[2].data });

            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.ironOreList);
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let arr = ['今日挂牌价（T/元）','今日采购价（T/元）','今日损耗数量（T）','本月到厂数量（T）', '本月损耗数量（T）', '当前库存数量（T）','库存均价（T/元）',''];
            let math = new AuiMath();
           
            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp : {
                    name: string,
                    p: number,
                    c: number
                }[] = [{name:'煤炭',p: 0,c:0},{name:'焦煤',p: 0,c:0}];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if(zl != '煤炭' && zl != '焦煤') continue;
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl,calcData.current.getDouble('单价'));
                    }
                    if (item == '今日采购价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl,calcData.current.getDouble('单价'));
                    }
                    if (item == '今日损耗数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) ,1));
                    }
                    if (item == '本月到厂数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月损耗数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl) ,1));
                    }
                    if(item == '当前库存数量（T）'){
                        tempDataSet.setValue(zl, math.toFixed( calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch(zl){
                            case '煤炭':
                                temp[0].p += calcData.current.getDouble('单价');
                                temp[0].c +=1;
                            break;
                            case '焦煤':
                                temp[1].p += calcData.current.getDouble('单价');
                                temp[1].c +=1;
                            break;
                        }
                    }
                }
                if(item == '库存均价（T/元）'){
                    temp.forEach((item1,index1)=>{
                        tempDataSet.setValue(item1.name, math.toFixed(math.div((item1.p||0), (item1.c||0)), 2));
                    })
                }
                this.setState({
                    ironOreList: tempDataSet
                })
            })
        })
        await fetch('./铁矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ mineralList: dataList[0].data });

            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.mineralList);
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let arr = ['今日挂牌价（T/元）','今日发货数量（T）','今日到厂数量（T）','今日损耗数量（T）','本月到厂数量（T）', '本月损耗数量（T）', '当前库存数量（T）','库存均价（T/元）',''];
            let math = new AuiMath();
           
            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp : {
                    name: string,
                    p: number,
                    c: number
                }[] = [{name:'磁铁矿',p: 0,c:0},{name:'赤铁矿',p: 0,c:0},{name:'褐铁矿',p: 0,c:0},{name:'菱铁矿',p: 0,c:0}];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日发货数量（T）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '今日到厂数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '今日损耗数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量'))  + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月到厂数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月损耗数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl) ,1));
                    }
                    if(item == '当前库存数量（T）'){
                        tempDataSet.setValue(zl, math.toFixed( calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch(zl){
                            case '磁铁矿':
                                temp[0].p += calcData.current.getDouble('单价');
                                temp[0].c +=1;
                            break;
                            case '褐铁矿':
                                temp[1].p += calcData.current.getDouble('单价');
                                temp[1].c +=1;
                            break;
                            case '赤铁矿':
                                temp[2].p += calcData.current.getDouble('单价');
                                temp[2].c +=1;
                            break;
                            case '菱铁矿':
                                temp[3].p += calcData.current.getDouble('单价');
                                temp[3].c +=1;
                            break;
                        }
                    }
                }
                if(item == '库存均价（T/元）'){
                    temp.forEach((item1,index1)=>{
                        tempDataSet.setValue(item1.name, (item1.p||0) / (item1.c||0));
                    })
                }
                this.setState({
                    mineralList: tempDataSet
                })
            })
           
        })
        await fetch('./合金.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ alloyList: dataList[0].data });

            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.alloyList);
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let arr = ['今日挂牌价（T/元）','今日入库数量（T）', '本月入库数量（T）', '年度入库数量（T）',
                '当前库存数量（T）', '本月采购数量（T）', '年度采购数量（T）', '采购在途数量（T）', '当前库存均价（T）','','',''];
            let math = new AuiMath();
           
            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp : {
                    name: string,
                    p: number,
                    c: number
                }[] = [{name:'锰',p: 0,c:0},{name:'硅',p: 0,c:0},{name:'钒',p: 0,c:0},{name:'钨',p: 0,c:0},{name:'钛',p: 0,c:0},{name:'钼',p: 0,c:0}];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl,calcData.current.getDouble('单价'));
                    }
                    if (item == '今日入库数量（T）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月入库数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '年度入库数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear ) {
                        //如果等于年度
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量')+ tempDataSet.current.getDouble(zl),1));
                    }
                    if(item == '当前库存数量（T）'){
                        tempDataSet.setValue(zl, math.toFixed( calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月采购数量（T）' && new Date(calcData.getString('发货日期')).getFullYear() == nowYear && new Date(calcData.getString('发货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '年度采购数量（T）' && new Date(calcData.getString('发货日期')).getFullYear() == nowYear ) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1) );
                    }
                    if (item == '采购在途数量（T）' && new Date(calcData.getString('到货日期')) > now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '当前库存均价（T）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch(zl){
                            case '锰':
                                temp[0].p += calcData.current.getDouble('单价');
                                temp[0].c +=1;
                            break;
                            case '硅':
                                temp[1].p += calcData.current.getDouble('单价');
                                temp[1].c +=1;
                            break;
                            case '钒':
                                temp[2].p += calcData.current.getDouble('单价');
                                temp[2].c +=1;
                            break;
                            case '钨':
                                temp[3].p += calcData.current.getDouble('单价');
                                temp[3].c +=1;
                            break;
                            case '钛':
                                temp[4].p += calcData.current.getDouble('单价');
                                temp[4].c +=1;
                            break;
                            case '钼':
                                temp[5].p += calcData.current.getDouble('单价');
                                temp[5].c +=1;
                            break;
                        }
                    }
                }
                if(item == '当前库存均价（T）'){
                    temp.forEach((item1,index1)=>{
                        tempDataSet.setValue(item1.name, math.toFixed(math.div((item1.p||0), (item1.c||0)), 2));
                    })
                }
                this.setState({
                    alloyList: tempDataSet
                })
            })
        })
        await fetch('./废钢.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ steellList: dataList[2].data });

            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.steellList);
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let arr = ['今日收购均价（T/元）','今日收料（T）', '本月收料（T）', '年度累计收料（T）',
                '年度累计回厂（T）', '收购站当前库存（T）', '厂区当前库存（T）', '厂区当前库存均价（T/元）'];
            let math = new AuiMath();
            arr.forEach((item,index)=>{
                tempDataSet.append().setValue('项次', item);
                var temp : {
                    name: string,
                    p: number,
                    c: number
                }[] = [{name:'A站',p: 0,c:0},{name:'B站',p: 0,c:0},{name:'C站',p: 0,c:0},{name:'D站',p: 0,c:0}];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日收购均价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl,calcData.current.getDouble('单价'));
                    }
                    if (item == '今日收料（T）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '本月收料（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth ) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '年度累计收料（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '收购站当前库存（T）' && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '厂区当前库存（T）' && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl,  math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl),1));
                    }
                    if (item == '厂区当前库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch(zl){
                            case 'A站':
                                temp[0].p = math.add(temp[0].p, calcData.current.getDouble('单价'));
                                temp[0].c +=1;
                            break;
                            case 'B站':
                                temp[1].p = math.add(temp[1].p, calcData.current.getDouble('单价'));
                                temp[1].c +=1;
                            break;
                            case 'C站':
                                temp[2].p = math.add(temp[2].p, calcData.current.getDouble('单价'));
                                temp[2].c +=1;
                            break;
                            case 'D站':
                                temp[3].p = math.add(temp[3].p, calcData.current.getDouble('单价'));
                                temp[3].c +=1;
                            break;
                        }
                    }
                }
                
                if(item == '厂区当前库存均价（T/元）'){
                    temp.forEach((item1,index1)=>{
                        tempDataSet.setValue(item1.name, (item1.p || 0) / (item1.c || 0));
                    })
                }
            })

            this.setState({
                steellList: tempDataSet
            })
        })
        setTimeout(() => {
            this.initEchart();
            this.autoTogglePage();
        }, 1000);
    }

    componentDidMount() {
        this.initData();
        document.onkeydown = (e:any) => {
            e = e || window.event;
            if(e.keyCode == 32){
                this.clearIntervalFun();
                return ;
            }
            if(e.keyCode == 49 || e.keyCode == 97){
                this.setState({timeNub:30 * 1000});
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag:null
                });
                this.autoTogglePage();
            }else if(e.keyCode == 50 || e.keyCode == 98){
                this.setState({timeNub:60 * 1000});
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag:null
                });
                this.autoTogglePage();
            }
        }
    }

    componentWillUnmount() {
    }

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.page}>
                            <div className={styles.echartItems}>
                                <div className={`${styles.fEchart} ${styles.lEchart}`}>
                                    <div className=''>
                                        <a className={this.state.ltype == 1 ? styles.active : ''} onClick={this.toggleData.bind(this, 1)}>煤炭/铁矿石</a>
                                        <a className={this.state.ltype == 2 ? styles.active : ''} onClick={this.toggleData.bind(this, 2)}>合金/废钢</a>
                                    </div>
                                    <ul>
                                        {this.getLDom()}
                                    </ul>
                                </div>
                                <div className={`${styles.fEchart} ${styles.rEchart}`}>
                                    <div className=''>
                                    </div>
                                    <ul>
                                        {this.getRDom()}
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.dataTale}>
                                <div className={styles.lContainer}>
                                    <div>
                                        <div>
                                            {this.getLTable()}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.rContainer}>
                                    <div>
                                        <div>
                                            {this.getRTable()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.getMenus()}
                </FullScreenContainer>
            </div>
        )
    }

    titleClick() {
        let showIndex = this.state.showIndex + 1;
        this.setState({
            showIndex
        })
    }

    getMenus() {
        return <div className={`${styles.defaultMenu} ${this.getMenusStyle()}`}>
            <ViewMenu options={this.state.menuOptions}></ViewMenu>
        </div>
    }

    getMenusStyle() {
        let style = ''
        if (this.state.showIndex > 0)
            style = this.state.showIndex % 2 == 0 ? styles.hideMenu : styles.showMenu;
        console.log(style)
        return style
    }

    //设置自动切换界面
    autoTogglePage() {
        this.setState({
            timeFlag: setInterval(() => {
                var ltype = this.state.ltype == 1 ? 2 : 1;
                this.setState({
                    ltype
                },()=>{
                    this.initEchart();
                })
            }, this.state.timeNub)
        })
    }
    //关闭或开启界面定时切换
    clearIntervalFun(){
        if(this.state.timeFlag != null){
            clearInterval(this.state.timeFlag);
            this.setState({timeFlag:null});
        }else{
            this.autoTogglePage();
        }
    }
    //渲染数据表行
    getColumns(reportHead: DataRow) {
        let list: ReactNode[] = [];
        reportHead.forEach((key: string, value: any) => {
            if(key == '项次'){
                list.push(<Column code={value.name} name={key} width={value.width} textAlign='center' key={key} customText={(row: DataRow) => {
                    return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{color:'red', 'fontSize': '12px'}}>我的钢铁网</span></span> : row.getString('项次')
                }}></Column>);
            }else{
                list.push(<Column code={value.name} name={key} width={value.width} textAlign='center' key={key}></Column>);
            }
        })
        return list;
    }
    //获取左侧dom结构
    getLDom() {
        let id: string
        if (this.state.ltype == 1) {
            id = 'main';
        } else if (this.state.ltype == 2) {
            id = 'main1';
        }
        return this.getEchartDomShow(id);
    }
    //获取右侧dom结构
    getRDom() {
        let id: string
        if (this.state.ltype == 1) {
            id = 'main2';
        } else if (this.state.ltype == 2) {
            id = 'main3';
        }
        return this.getEchartDomShow(id);
    }
    //获取左侧数据表
    getLTable() {
        if (this.state.ltype == 1) {
            return this.getTable1();
        } else if (this.state.ltype == 2) {
            return this.getTable2();
        }
    }
    //获取右侧数据表
    getRTable() {
        if (this.state.ltype == 1) {
            return this.getTable3();
        } else if (this.state.ltype == 2) {
            return this.getTable4();
        }
    }
    //需要渲染的图表
    initEchart() {
        if (this.state.ltype == 1) {
            this.initMain();
            this.initMain1();
        } else if (this.state.ltype == 2) {
            this.initMain2();
            this.initMain3();
        }
    }
    //初始化煤炭图表
    initMain() {
        let dataArr: any[] = [
            [4.3, 2.5],
            [2.4, 4.4],
            [2, 2],
            [4, 1.4]
        ];
        let siteSize = 0;
        let dynamicSeries = [];
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let barWidth = 40;
        let site = 0;
        if (siteSize % 2 != 0)
            site = ((barWidth * (siteSize - 1) + (barWidth * 0.1 * (siteSize - 1))) / 2) * -1;
        else
            site = ((barWidth * siteSize + (barWidth * 0.1 * (siteSize - 1))) / 2 - barWidth / 2) * -1;

        let colorArr = [{
            topColor: '#00ffdb',
            bottomColor: '#00ffdb',
            lineColor: ['#00DDdb', '#00DDdb'],
            textColor: '#00DDdb'
        }, {
            topColor: '#1CD53C',
            bottomColor: '#1b963b',
            lineColor: ['#1CB53C', '#1b963b'],
            textColor: '#B9E2A5'
        }, {
            topColor: '#1CA1D4',
            bottomColor: '#1C71D4',
            lineColor: ['#1C71D4', '#1C71D4'],
            textColor: '#fff'
        }, {
            topColor: '#EBDB06',
            bottomColor: '#ebbb06',
            lineColor: ['#EBBB06', '#ebbb06'],
            textColor: '#F5DF90'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, 8], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '35%',
                itemStyle: {
                    normal: {
                        color: colorArr[i].lineColor[0]
                    },
                },
                z: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 14,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState[i])
                site = site + barWidth + barWidth * 0.1
        }

        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            // color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            tooltip: {},
            xAxis: {
                axisLine: {
                    show: false
                },
                type: 'category',
                data: [{
                    value: '煤炭',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '焦煤',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }],
                splitLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // }
            },
            yAxis: {
                show: false,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: dynamicSeries
        };
        //@ts-ignore
        myChart.setOption(option);
        myChart.on('legendselectchanged', (obj: {
            name: string,
            selected: object,
            type: string,
        }) => {
            this.lengedChanage(obj, 0)
        })
    }
    //初始化铁矿石图表
    initMain1() {
        let dataArr: any[] = [
            [4.3, 2.5, 3.5, 4.5],
            [2.4, 4.4, 1.8, 2.8],
            [2, 2, 3, 5],
            [1, 1, 2, 4]
        ];
        let siteSize = 0;
        let dynamicSeries = [];
        this.state.lengedState1.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let barWidth = 26;
        let site = 0;
        if (siteSize % 2 != 0)
            site = ((barWidth * (siteSize - 1) + (barWidth * 0.1 * (siteSize - 1))) / 2) * -1;
        else
            site = ((barWidth * siteSize + (barWidth * 0.1 * (siteSize - 1))) / 2 - barWidth / 2) * -1;

        let colorArr = [{
            topColor: '#00ffdb',
            bottomColor: '#00ffdb',
            lineColor: ['#00DDdb', '#00DDdb'],
            textColor: '#00DDdb'
        }, {
            topColor: '#1CD53C',
            bottomColor: '#1b963b',
            lineColor: ['#1CB53C', '#1b963b'],
            textColor: '#B9E2A5'
        }, {
            topColor: '#1CA1D4',
            bottomColor: '#1C71D4',
            lineColor: ['#1C71D4', '#1C71D4'],
            textColor: '#fff'
        }, {
            topColor: '#EBDB06',
            bottomColor: '#ebbb06',
            lineColor: ['#EBBB06', '#ebbb06'],
            textColor: '#F5DF90'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site, -5], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site, 5], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '10%',
                itemStyle: {
                    normal: {
                        color: colorArr[i].lineColor[0]
                    },
                },
                z: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 14,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState1[i])
                site = site + barWidth + barWidth * 0.1
        }

        var myChart = echarts.init(document.getElementById('main2'));
        var option = {
            // color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            // tooltip: {},
            xAxis: {
                // show:true,
                axisLine: {
                    show: false
                },
                type: 'category',
                data: [{
                    value: '磁铁矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '赤铁矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '褐铁矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '菱铁矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }]
            },
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: dynamicSeries
        };
        //@ts-ignore
        myChart.setOption(option);
        myChart.on('legendselectchanged', (obj: {
            name: string,
            selected: object,
            type: string
        }) => {
            this.lengedChanage(obj, 1)
        })
    }
    //初始化合金图表
    initMain2() {
        var myChart = echarts.init(document.getElementById('main1'));
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589', '#ff8ebf', '#ffdc57'],
            textStyle: {
                color: '#fff'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            series: [
                {
                    // name: 'Access From',
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['45%', '75%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                        
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}: {c} ( {d}% )',
                                color: '#fff',
                                fontSize:14,
                            }
                        }
                    },
                    label: {
                        show: false,
                        position: 'center',
                        color: '#fff',
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#fff'
                        },
                        length: 20,
                        length2: 80,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold',
                            color: '#fff'
                        },
                        labelLine: {
                            color: "#fff",
                        }
                    },
                    // labelLine: {
                    //     show: false
                    // },
                    data: this.state.main2Data,
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }
    //初始化废钢图表
    initMain3() {
        var myChart = echarts.init(document.getElementById('main3'));
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '13%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                data: ['一月', '二月', '三月', '四月', '五月', '六月']
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: this.state.main3Data,
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    //切换界面图表及数据
    toggleData(type: number) {
        let ltype: number = 1;
        switch (type) {
            case 1:
                ltype = 1;
                break;
            case 2:
                ltype = 2;
                break;
        }
        this.setState({
            lengedState: [true, true, true, true],
            lengedState1: [true, true, true, true]
        }, () => {
            this.setState({ ltype }, () => {
                this.initEchart();

                this.setState({timeNub:30 * 1000});
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag:null
                });
                this.autoTogglePage();
            });
        })
    }

    //获取图表dom结构
    getEchartDomShow(id: string) {
        return <li className={styles.echartItem} key={id}>
            <div>
                <div id={id} className={styles.main}></div>
            </div>
        </li>
    }

    getTable1() { //煤炭采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '6' }).setValue('煤炭', { name: '煤炭', width: '6' }).setValue('焦煤', { name: '焦煤', width: '6' });
        return this.getHtmlFun(reportHead, this.state.ironOreList);
    }
    getTable2() { //铁矿石采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '20' }).setValue('磁铁矿', { name: '磁铁矿', width: '13' })
            .setValue('赤铁矿', { name: '赤铁矿', width: '13' }).setValue('褐铁矿', { name: '褐铁矿', width: '13' }).setValue('菱铁矿', { name: '菱铁矿', width: '13' });
        return this.getHtmlFun(reportHead, this.state.mineralList);
    }
    getTable3() { //合金采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '40' }).setValue('锰', { name: '锰', width: '16' }).setValue('硅', { name: '硅', width: '16' })
            .setValue('钒', { name: '钒', width: '16' }).setValue('钨', { name: '钨', width: '16' }).setValue('钛', { name: '钛', width: '16' })
            .setValue('钼', { name: '钼', width: '16' });
        return this.getHtmlFun(reportHead, this.state.alloyList);
    }
    getTable4() { //废钢采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '32' }).setValue('A站', { name: 'A站', width: '18' }).setValue('B站', { name: 'B站', width: '18' })
            .setValue('C站', { name: 'C站', width: '18' }).setValue('D站', { name: 'D站', width: '18' });
        return this.getHtmlFun(reportHead, this.state.steellList);
    }

    getHtmlFun(reportHead: DataRow, dataList: DataSet) {
        let currentData = new DataSet();
        dataList.first();
        while (dataList.fetch()) {
            currentData.append().copyRecord(dataList.current);
        }
        return <div className={styles.box} key={this.state.ltype}>
            <BorderBox1>
                <div className={styles.grid}>
                    <DBGrid dataSet={currentData} key={this.getColumns(reportHead).toString()}>
                        {this.getColumns(reportHead)}
                    </DBGrid>
                </div>
            </BorderBox1>
        </div>;
    }

    lengedChanage(obj: {
        name: string,
        selected: object,
        type: string
    }, flag: number) {
        let lengedState: boolean[] = [];
        Object.values(obj.selected).forEach((bool: boolean, index: number) => {
            lengedState.push(bool);
        })
        if (flag == 1) {
            this.setState({
                lengedState1: lengedState
            }, () => {
                this.initMain1();
            })
        } else {
            this.setState({
                lengedState
            }, () => {
                this.initMain();
            })
        }
    }
}