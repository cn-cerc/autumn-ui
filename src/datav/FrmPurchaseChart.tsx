import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import "../diteng/Summer.css";
import DataVApi from './DataVApi';
import DataSet from '../db/DataSet';
type stateType = {
    polylineOption: any,
    option: any,
    ironOreRow: DataRow,
    scrapRow: DataRow,
    cCoalRow: DataRow,
    pCoalRow: DataRow,
    listTypeArr1: listType[],
    listTypeArr2: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number
}
type PropsType = {
}

export default class FrmPurchaseChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
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
                href: 'javascript:aui.showPage("FrmReport1", "铁矿石年度入库数量（T）")'
            }, {
                name: '年度入库数量',
                key: 'yearInStock',
                href: 'javascript:aui.showPage("FrmReport2", "铁矿石年度采购数量（T）")'
            }, {
                name: '年度在途数量',
                key: 'inTransit',
                href: 'javascript:aui.showPage("FrmReport3", "铁矿石当前在途数量（T）")'
            }, {
                name: '年度在库数量',
                key: 'stock',
            }],
            listTypeArr2: [{
                name: '年度采购数量',
                key: 'purchase'
            }, {
                name: '年度入库数量',
                key: 'yearInStock'
            }, {
                name: '年度在途数量',
                key: 'inTransit'
            }, {
                name: '年度在库数量',
                key: 'stock'
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
            showIndex: 0
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
        let dataSet = await DataVApi.getSvrPurchase();
        let ironOreRow = new DataRow();
        if (dataSet.head.getString('ironOreRow'))
            ironOreRow.setJson(dataSet.head.getString('ironOreRow'));
        let scrapRow = new DataRow();
        if (dataSet.head.getString('scrapRow'))
            scrapRow.setJson(dataSet.head.getString('scrapRow'));
        let cCoalRow = new DataRow();
        if (dataSet.head.getString('cCoalRow'))
            cCoalRow.setJson(dataSet.head.getString('cCoalRow'));
        let pCoalRow = new DataRow();
        if (dataSet.head.getString('pCoalRow'))
            pCoalRow.setJson(dataSet.head.getString('pCoalRow'));
        let dynamicData = new DataSet();
        if (dataSet.head.getString('DynamicWarning'))
            dynamicData.setJson(dataSet.head.getString('DynamicWarning'));
        let dynamicXArr = [];
        let dynamicLegend = ['安全库存', '当前库存', '在途库存']
        let dynamicDataArr = new Array(dynamicLegend.length);
        for (let i = 0; i < dynamicLegend.length; i++) {
            dynamicDataArr[i] = new Array();
        }
        dynamicData.first();
        while (dynamicData.fetch()) {
            dynamicXArr.push(dynamicData.getString('name'));
            dynamicDataArr[0].push(dynamicData.getDouble('safetyStock'));
            dynamicDataArr[1].push(dynamicData.getDouble('currentStock'));
            dynamicDataArr[2].push(dynamicData.getDouble('inTransit'));
        }
        let dynamicSeries = [];
        for (let i = 0; i < dynamicLegend.length; i++) {
            dynamicSeries.push({
                name: dynamicLegend[i],
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
        if (dataSet.head.getString('YearPurchase'))
            purchaseData.setJson(dataSet.head.getString('YearPurchase'));
        let purchaseLenged = [];
        purchaseData.first();
        while (purchaseData.fetch()) {
            purchaseLenged.push(purchaseData.getString('year'))
        }
        let purchaseDataArr = new Array(purchaseLenged.length);
        for (let i = 0; i < purchaseLenged.length; i++) {
            purchaseDataArr[i] = new Array();
        }
        purchaseData.first();
        let _year = new Date().getFullYear();
        let _month = new Date().getMonth() + 1;
        while (purchaseData.fetch()) {
            let recNo = purchaseData.recNo - 1
            let year = purchaseData.getDouble('year');
            if (year >= _year) {
                for (let i = 1; i < _month + 1; i++) {
                    purchaseDataArr[recNo].push(purchaseData.getDouble(`month${i}`));
                }
            } else {
                purchaseDataArr[recNo].push(purchaseData.getDouble('month1'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month2'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month3'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month4'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month5'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month6'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month7'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month8'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month9'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month10'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month11'));
                purchaseDataArr[recNo].push(purchaseData.getDouble('month12'));
            }

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
                    left: 30,
                    right: 30
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
                    data: dynamicLegend,
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    bottom: '5'
                },
                grid: {
                    bottom: '15',
                    left: 10,
                    right: 10
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
            pCoalRow
        })
    }

    render() {
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
                            <div className={styles.blockTopBottomContent}>
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList}>
                                <TextList title="焦煤采购动态（T）" date={this.state.cCoalRow} listArray={this.state.listTypeArr2} />
                                <TextList title="粉煤采购动态（T）" date={this.state.pCoalRow} listArray={this.state.listTypeArr2} />
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
}
