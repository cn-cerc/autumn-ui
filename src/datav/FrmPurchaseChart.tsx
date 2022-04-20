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
import { Excel, excelData, importsExcel } from '../db/Utils';
//@ts-ignore
import XLSX from "xlsx";
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
                if(year == year_) {
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
        let dynamicLegend = ['安全库存', '当前库存', '在途库存']
        let dynamicDataArr = new Array(dynamicLegend.length);
        for (let i = 0; i < dynamicLegend.length; i++) {
            dynamicDataArr[i] = new Array();
        }
        rowArr.forEach((row: DataRow, index) => {
            row.setValue('purchase', dataArr[index].purchase).setValue('yearInStock', dataArr[index].yearInStock).setValue('inTransit', dataArr[index].inTransit).setValue('stock', dataArr[index].stock);
            dynamicDataArr[0].push((Math.floor(Math.random() * 10)) * 100);
            dynamicDataArr[1].push(dataArr[index].stock);
            dynamicDataArr[2].push(dataArr[index].inTransit);
        })
        dynamicData.first();
        while (dynamicData.fetch()) {
            dynamicXArr.push(dynamicData.getString('name'));
            dynamicDataArr[0].push((Math.floor(Math.random() * 10)) * 100);
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
        // if (dataSet.head.getString('YearPurchase'))
        //     purchaseData.setJson(dataSet.head.getString('YearPurchase'));
        purchaseData.appendDataSet(dataList[1].data);
        let purchaseLenged:string[] = [];
        purchaseData.first();
        while (purchaseData.fetch()) {
            let year = new Date(purchaseData.getString('入库日期')).getFullYear().toString();
            if(purchaseLenged.indexOf(year) == -1) {
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
            if(purchaseDataArr[index][month] == '') {
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
}
