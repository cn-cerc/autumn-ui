import { BorderBox9, Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React, { ReactNode } from 'react';
import { Column, ColumnIt, DataRow, DataSet, DBGrid } from 'autumn-ui';
import { excelData, Excel } from '../tool/Utils';
import "../tool/Summer.css";
import styles from './FrmPurchaseChart3.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";
import { ids } from 'webpack';
// import ReportDetail from "./ReportDetail";

type stateType = {
    ltype: number,
    rtype: number,
    // ltable: number,
    // rtable: number,
    // mainData: object,
    // main1Data: object,
    main2Data: Array<object>,
    main3Data: Array<object>,
    showIndex: number,
    ironOreList: DataSet,
    mineralList: DataSet,
    alloyList: DataSet,
    steellList: DataSet,
    lengedState: boolean[],
    lengedState1: boolean[],
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
                    label: {
                        show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    }
                },
                {
                    name: 'B站',
                    data: [2.4, 4.4, 1.8, 2.8, 1],
                    type: 'line',
                    symbolSize: 8,
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
        })
        await fetch('./铁矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ mineralList: dataList[0].data });
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
            let currentDataRow: DataRow = new DataRow();
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.alloyList);
            let arr = ['今日入库数量（T）', '本月入库数量（T）', '今日入库数量（T）', '本月入库数量（T）', '年度入库数量（T）',
                '当前库存数量（T）', '本月采购数量（T）', '年度采购数量（T）', '采购在途数量（T）', '当前库存均价（T）'];

            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                calcData.first();

                while (calcData.fetch()) {
                    if (new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)) {
                        //如果等于今天
                        tempDataSet.setValue(calcData.getString('种类'), calcData.getString('数量'));
                        // currentDataRow.setValue(calcData.getString('种类'),calcData.getString('数量'));
                        // console.log(currentDataRow);
                    }
                }
                // tempDataSet
                this.setState({
                    alloyList: tempDataSet
                })
                // console.log(tempDataSet);
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
        })
        setTimeout(() => {
            this.initEchart();
        }, 1000)
    }

    componentDidMount() {
        this.initData();
        // setTimeout(() => {
        //     this.initEchart();
        // }, 1000)
    }

    componentWillUnmount() {
    }

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' />
                    {/* <TopHeader title='采购数据管理中心' handleCick={this.titleClick.bind(this)} /> */}
                    <div className={styles.mainContent}>
                        <div className={styles.page}>
                            {/* <h1 className={styles.title}>采购数据中</h1> */}
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
                </FullScreenContainer>
            </div>
        )
    }

    getColumns(reportHead: DataRow) {
        let list: ReactNode[] = [];
        reportHead.forEach((key: string, value: any) => {
            list.push(<Column code={value.name} name={key} width={value.width} textAlign='center' key={key}></Column>)
        })
        return list;
    }

    getLDom() {
        if (this.state.ltype == 1) {
            return this.getBarDataShow();
        } else if (this.state.ltype == 2) {
            return this.getBar2DataShow();
        }
    }
    getRDom() {
        if (this.state.ltype == 1) {
            return this.getPieDataShow();
        } else if (this.state.ltype == 2) {
            return this.getLineDataShow();
        }
    }
    getLTable() {
        if (this.state.ltype == 1) {
            return this.getTable1();
        } else if (this.state.ltype == 2) {
            return this.getTable2();
        }
    }
    getRTable() {
        if (this.state.ltype == 1) {
            return this.getTable3();
        } else if (this.state.ltype == 2) {
            return this.getTable4();
        }
    }
    initEchart() {
        if (this.state.ltype == 1) {
            this.initMain();
            this.initMain2();
        } else if (this.state.ltype == 2) {
            this.initMain1();
            this.initMain3();
        }
    }

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
                symbolOffset: [site, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site, 8], // 下部椭圆
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
                show:false,
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
                show:false,
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

        var myChart = echarts.init(document.getElementById('main1'));
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
                show:false,
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
    initMain2() {
        var myChart = echarts.init(document.getElementById('main2'));
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589', '#ff8ebf', '#ffdc57'],
            textStyle: {
                color: '#fff'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                width: '50px',
                top: 'center',
                right: '6%',
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            series: [
                {
                    // name: 'Access From',
                    type: 'pie',
                    center: ['40%', '50%'],
                    radius: ['50%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                // formatter: '{c} ({d}%)'
                                formatter: '{b}: {c} ( {d}% )',
                                color: '#fff'
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'center',
                        color: '#fff'
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#fff'
                        }
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
        // if (type == 1) {
            this.setState({
                lengedState: [true, true, true, true],
                lengedState1: [true, true, true, true]
            }, () => {
                this.setState({ ltype }, () => {
                    this.initEchart();
                });
                // this.setState({ ltype }, () => { });
            })
        // }
        // if (type == 3 || type == 4) {
        //     this.setState({ rtype }, () => {
        //         this.initEchart()
        //     });
        //     this.setState({ rtype }, () => { });
        // }
    }

    getBarDataShow() {
        return <li className={styles.echartItem} key={1}>
            {/* <div className={styles.eName}>
                煤炭数据统计 */}
            {/* <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p> */}
            {/* </div> */}
            <div>
                <div id='main' className={styles.main}></div>
            </div>
        </li>
    }
    getBar2DataShow() {
        return <li className={`${styles.echartItem}`} key={2}>
            {/* <div className={styles.eName}>
                铁矿石数据统计 */}
            {/* <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p> */}
            {/* </div> */}
            <div>
                <div id='main1' className={styles.main}>图表</div>
            </div>
        </li>
    }
    getPieDataShow() {
        return <li className={styles.echartItem} key={3}>
            {/* <div className={styles.eName}>
                合金数据统计 */}
            {/* <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p> */}
            {/* </div> */}
            <div>
                <div id="main2" className={styles.main}></div>
            </div>
        </li>
    }
    getLineDataShow() {
        return <li className={`${styles.echartItem}`} key={4}>
            {/* <div className={styles.eName}>
                废钢数据统计 */}
            {/* <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p> */}
            {/* </div> */}
            <div>
                <div id='main3' className={styles.main}>图表</div>
            </div>
        </li>
    }

    getTable1() { //煤炭采购动态
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '40%' }).setValue('煤炭', { name: '煤炭', width: '20%' }).setValue('焦煤', { name: '焦煤', width: '20%' });
        return this.getHtmlFun(reportHead, this.state.ironOreList);
    }
    getTable2() { //铁矿石采购动态
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '20%' }).setValue('磁铁矿', { name: '磁铁矿', width: '13%' })
            .setValue('赤铁矿', { name: '赤铁矿', width: '13%' }).setValue('褐铁矿', { name: '褐铁矿', width: '13%' }).setValue('菱铁矿', { name: '菱铁矿', width: '13%' });
        return this.getHtmlFun(reportHead, this.state.mineralList);
    }
    getTable3() { //合金采购动态
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '24%' }).setValue('锰', { name: '锰', width: '19%' }).setValue('硅', { name: '硅', width: '19%' })
            .setValue('钒', { name: '钒', width: '19%' }).setValue('钨', { name: '钨', width: '19%' }).setValue('钛', { name: '钛', width: '19%' })
            .setValue('钼', { name: '钼', width: '19%' });
        return this.getHtmlFun(reportHead, this.state.alloyList);
    }
    getTable4() { //废钢采购动态
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '24%' }).setValue('A站', { name: 'A站', width: '19%' }).setValue('B站', { name: 'B站', width: '19%' })
            .setValue('C站', { name: 'C站', width: '19%' }).setValue('D站', { name: 'D站', width: '19%' });
        return this.getHtmlFun(reportHead, this.state.steellList);
    }

    getHtmlFun(reportHead: DataRow, dataList: DataSet) {
        let currentData = new DataSet();
        dataList.first();
        while (dataList.fetch()) {
            currentData.append().copyRecord(dataList.current);
        }
        return <div className={styles.box}>
            <BorderBox9>
                <div className={styles.grid}>
                    <DBGrid dataSet={currentData} key={this.getColumns(reportHead).toString()}>
                        {this.getColumns(reportHead)}
                    </DBGrid>
                </div>
            </BorderBox9>
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