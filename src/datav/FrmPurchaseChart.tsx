import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import DataSet from '../db/DataSet';
import { Excel, excelData } from '../db/Utils';
import "../diteng/Summer.css";
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";
type stateType = {
    polylineOption: any,
    option: any,
    ironOreRow: DataRow,
    scrapRow: DataRow,
    cCoalRow: DataRow,
    pCoalRow: DataRow,
    listTypeArr1: listType[],
    listTypeArr2: listType[],
    listTypeArr3: listType[],
    listTypeArr4: listType[],
    menuOptions: ViewMenuMap,
    dynamicDataArr: any[],
    lengedState: boolean[],
    showIndex: number,
}
type PropsType = {
}

export default class FrmPurchaseChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private lineLenged: string[] = ['安全库存', '当前库存', '在途库存'];
    private isLengedEvent: boolean = false;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {},
            option: {},
            ironOreRow: new DataRow(),
            scrapRow: new DataRow(),
            cCoalRow: new DataRow(),
            pCoalRow: new DataRow(),
            listTypeArr1: [{
                name: '年度采购数量',
                key: 'purchase',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度入库数量（T）", {index : 0})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度采购数量（T）", {index : 0})'
            }, {
                name: '年度在途数量',
                key: 'inTransit',
                href: 'javascript:aui.showPage("FrmReport3", "铁矿石当前在途数量（T）", {index : 0})'
            }, {
                name: '年度在库数量',
                key: 'stock',
            }],
            listTypeArr2: [{
                name: '年度采购数量',
                key: 'purchase',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度入库数量（T）", {index : 1})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度采购数量（T）", {index : 1})'
            }, {
                name: '年度在途数量',
                key: 'inTransit',
                href: 'javascript:aui.showPage("FrmReport3", "铁矿石当前在途数量（T）", {index : 1})'
            }, {
                name: '年度在库数量',
                key: 'stock',
            }],
            listTypeArr3: [{
                name: '年度采购数量',
                key: 'purchase',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度入库数量（T）", {index : 2})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度采购数量（T）", {index : 2})'
            }, {
                name: '年度在途数量',
                key: 'inTransit',
                href: 'javascript:aui.showPage("FrmReport3", "铁矿石当前在途数量（T）", {index : 2})'
            }, {
                name: '年度在库数量',
                key: 'stock',
            }],
            listTypeArr4: [{
                name: '年度采购数量',
                key: 'purchase',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度入库数量（T）", {index : 3})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度采购数量（T）", {index : 3})'
            }, {
                name: '年度在途数量',
                key: 'inTransit',
                href: 'javascript:aui.showPage("FrmReport3", "铁矿石当前在途数量（T）", {index : 3})'
            }, {
                name: '年度在库数量',
                key: 'stock',
            }],
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmSaleChart", "销售数据管理中心")'
            }]]),
            showIndex: 0,
            lengedState: [true, true, true],
            dynamicDataArr: [],
        }
    }

    componentDidMount(): void {
        this.initData();
        this.timer = setInterval(() => {
            this.initData()
        }, 30000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initData() {
        let dataList: excelData[] = [];
        await fetch('./kanban1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataArr = [{ purchase: 0, yearInStock: 0, inTransit: 0, stock: 0 },
        { purchase: 0, yearInStock: 0, inTransit: 0, stock: 0 },
        { purchase: 0, yearInStock: 0, inTransit: 0, stock: 0 },
        { purchase: 0, yearInStock: 0, inTransit: 0, stock: 0 }];
        let year_ = new Date().getFullYear();
        dataArr.forEach((obj, index) => {
            let data = dataList[index].data;
            data.first();
            while (data.fetch()) {
                let year = new Date(data.getString('入库日期')).getFullYear();
                if (year == year_) {
                    dataArr[index].purchase += data.getDouble('采购数量');
                    dataArr[index].yearInStock += data.getDouble('入库数量');
                    dataArr[index].inTransit += data.getDouble('在途数量');
                    dataArr[index].stock += data.getDouble('入库数量');
                }
            }
        })
        let ironOreRow = new DataRow();
        // if (dataSet.head.getString('ironOreRow'))
        //     ironOreRow.setJson(dataSet.head.getString('ironOreRow'));
        let scrapRow = new DataRow();
        // if (dataSet.head.getString('scrapRow'))
        //     scrapRow.setJson(dataSet.head.getString('scrapRow'));
        let cCoalRow = new DataRow();
        // if (dataSet.head.getString('cCoalRow'))
        //     cCoalRow.setJson(dataSet.head.getString('cCoalRow'));
        let pCoalRow = new DataRow();
        // if (dataSet.head.getString('pCoalRow'))
        //     pCoalRow.setJson(dataSet.head.getString('pCoalRow'));
        let rowArr = [ironOreRow, scrapRow, cCoalRow, pCoalRow];
        let dynamicData = new DataSet();
        // if (dataSet.head.getString('DynamicWarning'))
        //     dynamicData.setJson(dataSet.head.getString('DynamicWarning'));
        let dynamicXArr = [];
        let dynamicDataArr = new Array(this.lineLenged.length);
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicDataArr[i] = new Array();
        }
        rowArr.forEach((row: DataRow, index) => {
            row.setValue('purchase', dataArr[index].purchase).setValue('yearInStock', dataArr[index].yearInStock).setValue('inTransit', dataArr[index].inTransit).setValue('stock', dataArr[index].stock);
            dynamicDataArr[0].push((Math.ceil(Math.random() * 10)) * 100);
            dynamicDataArr[1].push(dataArr[index].stock);
            dynamicDataArr[2].push(dataArr[index].inTransit);
        })
        dynamicData.first();
        while (dynamicData.fetch()) {
            dynamicXArr.push(dynamicData.getString('name'));
            dynamicDataArr[0].push((Math.ceil(Math.random() * 10)) * 100);
            dynamicDataArr[1].push(dynamicData.getDouble('currentStock'));
            dynamicDataArr[2].push(dynamicData.getDouble('inTransit'));
        }
        let dynamicSeries = [];
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                data: dynamicDataArr[i],
                type: 'bar',
                label: {
                    show: true,
                    style: {
                        fontSize: 18,
                        fill: '#fff'
                    },
                },
                barGap: 0
            })
        }
        this.initLineChart(dynamicDataArr)
        let purchaseData = new DataSet();
        // if (dataSet.head.getString('YearPurchase'))
        //     purchaseData.setJson(dataSet.head.getString('YearPurchase'));
        purchaseData.appendDataSet(dataList[1].data);
        let purchaseLenged: string[] = [];
        purchaseData.first();
        while (purchaseData.fetch()) {
            let year = new Date(purchaseData.getString('入库日期')).getFullYear().toString();
            if (purchaseLenged.indexOf(year) == -1) {
                purchaseLenged.push(year)
            }
        }
        let purchaseDataArr = new Array(purchaseLenged.length);
        for (let i = 0; i < purchaseLenged.length; i++) {
            purchaseDataArr[i] = new Array(12).fill('');
        }
        purchaseData.first();
        while (purchaseData.fetch()) {
            let date = new Date(purchaseData.getString('入库日期'));
            let year = date.getFullYear().toString();
            let month = date.getMonth();
            let index = purchaseLenged.indexOf(year);
            if (purchaseDataArr[index][month] == '') {
                purchaseDataArr[index][month] = 0;
            }
            let num = purchaseData.getDouble('采购数量');
            purchaseDataArr[index][month] += num;
        }
        let pruchaseSeries = [];
        for (let i = 0; i < purchaseLenged.length; i++) {
            pruchaseSeries.push({
                name: purchaseLenged[i],
                data: purchaseDataArr[i],
                type: 'line',
                label: {
                    show: true,
                    style: {
                        fontSize: 18
                    }
                },
                lineStyle: {
                    lineWidth: 3
                }
            })
        }
        this.setState({
            polylineOption: {
                title: {
                    text: '废钢采购年度对比动态',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                legend: {
                    data: purchaseLenged,
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    top: 30,
                    right: 100

                },
                grid: {
                    bottom: 50,
                    left: 20,
                    right: 20
                },
                xAxis: {
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        style: {
                            fill: '#fff',
                            fontSize: 20,
                            rotate: 0
                        },
                    },
                    axisLine: {
                        style: {
                            stroke: '#fff'
                        }
                    }
                },
                yAxis: {
                    data: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: pruchaseSeries,
                color: ['#41aebd', '#97e9d5']
            },
            option: {
                title: {
                    text: '库存动态预警',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                legend: {
                    data: this.lineLenged,
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    bottom: '5'
                },
                grid: {
                    bottom: '15',
                    left: 30,
                    right: 30
                },
                xAxis: {
                    data: ['铁矿石', '废钢', '焦煤', '粉煤'],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        style: {
                            fill: '#fff',
                            fontSize: 20,
                            rotate: 0
                        }
                    }
                },
                yAxis: {
                    data: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                series: dynamicSeries,
                color: ['#1CB53C', '#1C71D4', '#EBBB06']
            },
            ironOreRow,
            scrapRow,
            cCoalRow,
            pCoalRow,
            dynamicDataArr
        })
    }

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='采购数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList}>
                                <TextList title="铁矿石采购动态（T）" date={this.state.ironOreRow} listArray={this.state.listTypeArr1} />
                                <TextList title="废钢采购动态（T）" date={this.state.scrapRow} listArray={this.state.listTypeArr2} />
                            </div>
                            <div className={styles.blockTopBottomContent} id='echarts'>
                                {/* <Charts option={this.state.option} /> */}
                            </div>
                            <div className={styles.textList}>
                                <TextList title="焦煤采购动态（T）" date={this.state.cCoalRow} listArray={this.state.listTypeArr3} />
                                <TextList title="粉煤采购动态（T）" date={this.state.pCoalRow} listArray={this.state.listTypeArr4} />
                            </div>
                        </div>
                        <div className={styles.polylineOption} >
                            <Charts option={this.state.polylineOption} />
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
            style = this.state.showIndex % 2 == 0 ? styles.hideMenu : styles.showMenu
        return style
    }

    initLineChart(dynamicDataArr?: any[]) {
        let dataArr = this.state.dynamicDataArr;
        if (dynamicDataArr)
            dataArr = dynamicDataArr;
        let siteSize = -1;
        let dynamicSeries = [];
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let site = (siteSize * -55) / 2;
        let colorArr = [{
            topColor: '#1CB53C',
            bottomColor: '#1b963b61',
            lineColor: ['#1CB53C', '#1b963b61']
        }, {
            topColor: '#1C71D4',
            bottomColor: '#1C71D440',
            lineColor: ['#1C71D4', '#1C71D440']
        }, {
            topColor: '#EBBB06',
            bottomColor: '#ebbb0642',
            lineColor: ['#EBBB06', '#ebbb0642']
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, 8], // 下部椭圆
                z: 12,
                color: colorArr[i].bottomColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: '50',
                barGap: '10%', // Make series be overlap
                barCateGoryGap: '10%',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                            {
                                offset: 0,
                                color: colorArr[i].lineColor[0],
                            },
                            {
                                offset: 1,
                                color: colorArr[i].lineColor[1],
                            },
                        ]),
                        opacity: 0.8,
                    },
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 20,
                        color: '#fff',
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState[i])
                site += 55;
        }
        let myChart = echarts.init(document.getElementById('echarts'));
        //@ts-ignore
        myChart.setOption({
            legend: {
                bottom: 20,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                },
                itemWidth: 18,
                itemHeight: 18,
                itemGap: 20,
                symbolRotate: 10,
                icon: 'rect'

            },
            grid: {
                top: 40,
                left: 40,
                bottom: 60,
                right: 40,
                containLabel: true,
            },
            tooltip: {
                show: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: [{
                        value: '铁矿石',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '废钢',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '焦煤',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '粉煤',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }],
                    textStyle: {
                        fontSize: 20
                    },
                    axisTick: {
                        alignWithLabel: true,
                    },
                    nameTextStyle: {
                        color: '#82b0ec',
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#82b0ec',
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                        margin: 30,
                    },
                },
            ],
            yAxis: [
                {
                    show: false,
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#0c2c5a',
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                },
            ],
            series: dynamicSeries,
        });
        if (!this.isLengedEvent) {
            this.isLengedEvent = true;
            myChart.on('legendselectchanged', (obj: {
                name: string,
                selected: object,
                type: string
            }) => {
                this.lengedChanage(obj)
            })
        }
    }

    lengedChanage(obj: {
        name: string,
        selected: object,
        type: string
    }) {
        let lengedState: boolean[] = []
        Object.values(obj.selected).forEach((bool: boolean, index: number) => {
            lengedState.push(bool);
        })
        this.setState({
            lengedState
        }, () => {
            this.initLineChart();
        })
    }
}
