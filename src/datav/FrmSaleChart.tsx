import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
type stateType = {
    polylineOption: any,
    option: any,
    wireRow: DataRow,
    coilRow: DataRow,
    hSteelRow: DataRow,
    steelRow: DataRow,
    listTypeArr1: listType[],
    listTypeArr2: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number
}
type PropsType = {
}

export default class FrmSaleChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {},
            option: {},
            wireRow: new DataRow(),
            coilRow: new DataRow(),
            hSteelRow: new DataRow(),
            steelRow: new DataRow(),
            listTypeArr1: [{
                name: '今日接单数量',
                key: 'todayOrder',
                href: 'javascript:aui.showPage("FrmReport9", "线材接单今日动态（T）")'
            }, {
                name: '本周接单数量',
                key: 'weekOrder',
                href: 'javascript:aui.showPage("FrmReport10", "线材本周接单动态（T）")'
            }, {
                name: '本月接单数量',
                key: 'monthOrder',
                href: 'javascript:aui.showPage("FrmReport11", "线材本月接单动态（T）")'
            }, {
                name: '本年接单数量',
                key: 'yearOrder',
                href: 'javascript:aui.showPage("FrmReport12", "线材本年接单动态（T）")'
            },{
                name: '今日出库数量',
                key: 'weekOutStock',
                href: 'javascript:aui.showPage("FrmReport13", "线材今日出库动态（T）")'
            },{
                name: '本周出库数量',
                key: 'weekOutStock',
                href: 'javascript:aui.showPage("FrmReport14", "线材本周出库动态（T）")'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock',
                href: 'javascript:aui.showPage("FrmReport15", "线材本月出库动态（4月）")'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock',
                href: 'javascript:aui.showPage("FrmReport16", "线材本年出货动态（2022年）")'
            }, {
                name: '当前未出库数',
                key: 'onOutStock',
                href: 'javascript:aui.showPage("FrmReport17", "线材未出货订单与库存动态（T）")'
            }, {
                name: '当前库存数量',
                key: 'inStock',
            }],
            listTypeArr2: [{
                name: '今日接单数量',
                key: 'todayOrder'
            }, {
                name: '本周接单数量',
                key: 'weekOrder'
            }, {
                name: '本月接单数量',
                key: 'monthOrder'
            }, {
                name: '本年接单数量',
                key: 'yearOrder'
            }, {
                name: '今日出库数量',
                key: 'weekOutStock',
            }, {
                name: '本周出库数量',
                key: 'weekOutStock'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock'
            }, {
                name: '当前未出库数',
                key: 'onOutStock'
            }, {
                name: '当前库存数量',
                key: 'inStock'
            }],
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmSaleChart")'
            }]]),
            showIndex: 0
        }
    }

    componentDidMount(): void {
        this.initState();
        this.initData();
        this.timer = setInterval(() => {
            this.initData()
        }, 30000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initState() {
        let wireRow = new DataRow();
        wireRow.setValue('todayOrder', 0).setValue('weekOrder', 0).setValue('monthOrder', 0).setValue('yearOrder', 0).setValue('weekOutStock', 0).setValue('monthOutStock', 0).setValue('yearOutStock', 0).setValue('onOutStock', 0).setValue('inStock', 0);
        let coilRow = new DataRow();
        coilRow.setValue('todayOrder', 0).setValue('weekOrder', 0).setValue('monthOrder', 0).setValue('yearOrder', 0).setValue('weekOutStock', 0).setValue('monthOutStock', 0).setValue('yearOutStock', 0).setValue('onOutStock', 0).setValue('inStock', 0);
        let hSteelRow = new DataRow();
        hSteelRow.setValue('todayOrder', 0).setValue('weekOrder', 0).setValue('monthOrder', 0).setValue('yearOrder', 0).setValue('weekOutStock', 0).setValue('monthOutStock', 0).setValue('yearOutStock', 0).setValue('onOutStock', 0).setValue('inStock', 0);
        let steelRow = new DataRow();
        steelRow.setValue('todayOrder', 0).setValue('weekOrder', 0).setValue('monthOrder', 0).setValue('yearOrder', 0).setValue('weekOutStock', 0).setValue('monthOutStock', 0).setValue('yearOutStock', 0).setValue('onOutStock', 0).setValue('inStock', 0);
        this.setState({
            polylineOption: {
                title: {
                    text: '年度销售动态分析',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                grid: {
                    bottom: 80,
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
                        show: false
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
                legend: {
                    data: ['目标', '销售', '库存'],
                    textStyle: {
                        fill: '#fff'
                    },
                    bottom: 20
                },
                series: [
                    {
                        name: '目标',
                        data: [4.3, 2.5, 3.5, 4.5, 4.3, 2.5, 3.5, 4.5, 4.3, 2.5, 3.5, 4.5],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            }
                        },
                    },
                    {
                        name: '销售',
                        data: [2.4, 4.4, 1.8, 2.8, 2.4, 4.4, 1.8, 2.8, 2.4, 4.4, 1.8, 2.8],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            }
                        },
                    },
                    {
                        name: '库存',
                        data: [2, 2, 3, 5, 2, 2, 3, 5, 2, 2, 3, 5],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            }
                        },
                    }
                ],
                color: ['#41aebd', '#97e9d5', '#a2cf49']
            },
            option: {
                title: {
                    text: '销售商品结构比例分析',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                grid: {
                    bottom: '15',
                    left: 10,
                    right: 10
                },
                series: [
                    {
                        data: [{
                            name: '线材',
                            value: 290
                        }, {
                            name: '卷材',
                            value: 120
                        }, {
                            name: 'H型钢材',
                            value: 200
                        }, {
                            name: '螺纹钢材',
                            value: 390
                        }],
                        type: 'pie',
                        radius: '60%',
                        outsideLabel: {
                            style: {
                                fontSize: 20,
                            },
                            formatter: '{name}{percent}%'
                        }
                    }
                ],
                color: ['#42C1D2', '#4AF8E4', '#62B530', '#14A338']
            },
            wireRow,
            coilRow,
            hSteelRow,
            steelRow
        })
    }

    async initData() {
        let wireRow = new DataRow();
        wireRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let coilRow = new DataRow();
        coilRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let hSteelRow = new DataRow();
        hSteelRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let steelRow = new DataRow();
        steelRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        this.setState({
            wireRow,
            coilRow,
            hSteelRow,
            steelRow
        })
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='销售数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList4}>
                                <TextList title="线材出库动态（T）" date={this.state.wireRow} listArray={this.state.listTypeArr1} />
                                <TextList title="卷材出库动态（T）" date={this.state.coilRow} listArray={this.state.listTypeArr2} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList4}>
                                <TextList title="H钢材出库动态（T）" date={this.state.hSteelRow} listArray={this.state.listTypeArr2} />
                                <TextList title="螺纹钢材出库动态（T）" date={this.state.steelRow} listArray={this.state.listTypeArr2} />
                            </div>
                        </div>
                        <div className={styles.polylineOption2} >
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
        if(this.state.showIndex > 0)
            style = this.state.showIndex % 2 == 0 ? styles.hideMenu : styles.showMenu
        return style
    }
}
