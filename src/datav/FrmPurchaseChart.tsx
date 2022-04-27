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
            ironOreRow: new DataRow(),
            scrapRow: new DataRow(),
            cCoalRow: new DataRow(),
            pCoalRow: new DataRow(),
            listTypeArr1: [{
                name: '年度采购数量',
                key: 'purchase',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度入库数量（T）", {index : 0})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度采购数量（T）", {index : 0})'
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
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度入库数量（T）", {index : 1})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度采购数量（T）", {index : 1})'
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
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度入库数量（T）", {index : 2})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度采购数量（T）", {index : 2})'
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
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度入库数量（T）", {index : 3})'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度采购数量（T）", {index : 3})'
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
        let lineSeries = [];
        let lineColir = ['#41aebd', '#EBBB06'];
        for (let i = 0; i < purchaseLenged.length; i++) {
            lineSeries.push({
                name: purchaseLenged[i],
                type: 'line',
                data: purchaseDataArr[i],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: lineColir[i],
                                fontSize: 16,
                            }
                        }
                    }
                },
                lineStyle: {
                    width: 4
                },
                symbol: 'circle',
                symbolSize: 12
            })
        }
        let lineOption = {
            // 标题
            title: [
                {
                    text: '废钢采购年度对比动态',
                    textStyle: {
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    },
                    top: 20,
                    left: 'center'
                }
            ],
            color: lineColir,
            textStyle: {
                color: '#fff'
            },
            // 图例
            legend: {
                textStyle: {
                    color: '#fff'
                },
                top: 60
            },
            tooltip: {},
            // 内容区域位置
            grid: {
                left: 40,
                right: 40,
                bottom: 40,
                top: 100,
                containLabel: true
            },
            xAxis: {
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    fontSize: 18
                }
            },
            yAxis: {
                show: false
            },
            series: lineSeries
        }
        this.initLineChart(lineOption)
        this.initBarChart(dynamicDataArr)
        this.setState({
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
                                <TextList title="煤炭采购动态（T）" date={this.state.cCoalRow} listArray={this.state.listTypeArr3} />
                                <TextList title="合金采购动态（T）" date={this.state.pCoalRow} listArray={this.state.listTypeArr4} />
                            </div>
                        </div>
                        <div className={styles.polylineOption} id='lineChart'></div>
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

    initBarChart(dynamicDataArr?: any[]) {
        let dataArr = this.state.dynamicDataArr;
        if (dynamicDataArr)
            dataArr = dynamicDataArr;
        let siteSize = -1;
        let dynamicSeries = [];
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        if(siteSize == -1)
            siteSize = 0;
        let site = (siteSize * -60) / 2;
        let colorArr = [{
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
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: '50',
                barGap: '20%',
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
                        fontSize: 20,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState[i])
                site += 60;
        }
        let myChart = echarts.init(document.getElementById('echarts'));
        //@ts-ignore
        myChart.setOption({
            title: [{
                text: '库存动态预警',
                textStyle: {
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 500
                },
                top: 20,
                left: 'center'
            }],
            legend: {
                top: 60,
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
                top: 140,
                left: 0,
                bottom: 10,
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
                        value: '煤炭',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '合金',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }],
                    textStyle: {
                        fontSize: 20
                    },
                    axisTick: {
                        show: false
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
                        margin: 20,
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

    initLineChart(option: any) {
        let myChart = echarts.init(document.getElementById('lineChart'));
        myChart.setOption(option);
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
            this.initBarChart();
        })
    }
}
