import { BorderBox11, Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
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
    steelRow: DataRow
    listTypeArr: listType[],
    stopRow: DataRow,
    stopArr: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number
}
type PropsType = {
}

export default class FrmManufactureChart extends React.Component<PropsType, stateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {},
            option: {},
            wireRow: new DataRow(),
            coilRow: new DataRow(),
            hSteelRow: new DataRow(),
            steelRow: new DataRow(),
            listTypeArr: [{
                name: '本周入库数量',
                key: 'weekStock'
            }, {
                name: '本月入库数量',
                key: 'monthStock'
            }, {
                name: '本年入库数量',
                key: 'yearStock'
            }],
            stopRow: new DataRow(),
            stopArr: [{
                name: '今日异常停机',
                key: 'todayError'
            }, {
                name: '本周异常停机',
                key: 'weekError'
            }, {
                name: '本月异常停机',
                key: 'monthError'
            }, {
                name: '本年异常停机',
                key: 'yearError'
            }],
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: 'http://192.168.1.138/forms/images/view/kanban1.png',
                href: '#'
            }], ['制造数据管理中心', {
                imgSrc: 'http://192.168.1.138/forms/images/view/kanban2.png',
                href: '321'
            }], ['销售数据管理中心', {
                imgSrc: 'http://192.168.1.138/forms/images/view/kanban3.png',
                href: '321'
            }]]),
            showIndex: 0
        }
    }

    componentDidMount(): void {
        this.initState();
        this.initData();
        setInterval(() => {
            this.initData()
        }, 30000)
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initState() {
        let wireRow = new DataRow();
        wireRow.setValue('weekStock', 0).setValue('monthStock', 0).setValue('yearStock', 0);
        let coilRow = new DataRow();
        coilRow.setValue('weekStock', 0).setValue('monthStock', 0).setValue('yearStock', 0);
        let hSteelRow = new DataRow();
        hSteelRow.setValue('weekStock', 0).setValue('monthStock', 0).setValue('yearStock', 0);
        let steelRow = new DataRow();
        steelRow.setValue('weekStock', 0).setValue('monthStock', 0).setValue('yearStock', 0);
        let stopRow = new DataRow();
        stopRow.setValue('todayError', 0).setValue('weekError', 0).setValue('monthError', 0).setValue('yearError', 0);
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
                series: [
                    {
                        name: '2021',
                        data: [4.5, 5, 4.3, 4.8, 4, 3, 5, 8, 6, 5, 3, 4],
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
                    },
                    {
                        name: '2022',
                        data: [3, 5, 3.5],
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
                    }
                ],
                color: ['#41aebd', '#97e9d5']
            },
            option: {
                title: {
                    text: '生产现场长处动态',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                legend: {
                    data: ['生产数量', '产出数量'],
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    bottom: '5'
                },
                grid: {
                    bottom: '15',
                    left: 100,
                    right: 10
                },
                xAxis: {
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
                yAxis: {
                    data: ['线材线', '卷材线', 'H钢材线', '螺纹钢材线'],
                    axisLine: {
                        show: true,
                        style: {
                            stroke: '#fff'
                        }
                    },
                    axisTick: {
                        show: true,
                        style: {
                            stroke: '#fff'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        style: {
                            fill: '#fff',
                            fontSize: 16,
                            rotate: 0
                        }
                    }
                },
                series: [
                    {
                        name: '生产数量',
                        data: [1200, 2230, 1900, 1800],
                        type: 'bar',
                        label: {
                            show: true,
                            offset: [25, 2],
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                    {
                        name: '产出数量',
                        data: [2230, 1900, 2100, 3000],
                        type: 'bar',
                        label: {
                            show: true,
                            offset: [25, 2],
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                ],
                color: ['#66ff66', '#41aebd']
            },
            wireRow,
            coilRow,
            hSteelRow,
            steelRow,
            stopRow
        })
    }

    async initData() {
        let wireRow = new DataRow();
        wireRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let coilRow = new DataRow();
        coilRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let hSteelRow = new DataRow();
        hSteelRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let steelRow = new DataRow();
        steelRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let stopRow = new DataRow();
        stopRow.setValue('todayError', this.getRandom(10)).setValue('weekError', this.getRandom(50)).setValue('monthError', this.getRandom(200)).setValue('yearError', this.getRandom(2000));
        this.setState({
            wireRow,
            coilRow,
            hSteelRow,
            steelRow,
            stopRow
        })
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='制造数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList2}>
                                <TextList title="线材入库动态（T）" date={this.state.wireRow} listArray={this.state.listTypeArr} />
                                <TextList title="卷材入库动态（T）" date={this.state.coilRow} listArray={this.state.listTypeArr} />
                                <TextList title="H型钢材入库动态（T）" date={this.state.hSteelRow} listArray={this.state.listTypeArr} />
                                <TextList title="钢材入库动态（T）" date={this.state.steelRow} listArray={this.state.listTypeArr} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList2}>
                                <div className={styles.double}>
                                    <BorderBox11 title='生产在编在岗人员动态'>
                                        <table className={styles.table}>
                                            <tbody>
                                                <tr>
                                                    <th>分类：</th>
                                                    <th>男</th>
                                                    <th>女</th>
                                                    <th>合计</th>
                                                </tr>
                                                <tr>
                                                    <td>在编人数：</td>
                                                    <td>100</td>
                                                    <td>80</td>
                                                    <td>180</td>
                                                </tr>
                                                <tr>
                                                    <td>30岁以下：</td>
                                                    <td>50</td>
                                                    <td>45</td>
                                                    <td>95</td>
                                                </tr>
                                                <tr>
                                                    <td>30-40岁：</td>
                                                    <td>15</td>
                                                    <td>10</td>
                                                    <td>25</td>
                                                </tr>
                                                <tr>
                                                    <td>41-50岁：</td>
                                                    <td>18</td>
                                                    <td>13</td>
                                                    <td>31</td>
                                                </tr>
                                                <tr>
                                                    <td>51-60岁</td>
                                                    <td>12</td>
                                                    <td>7</td>
                                                    <td>19</td>
                                                </tr>
                                                <tr>
                                                    <td>60岁以上</td>
                                                    <td>5</td>
                                                    <td>5</td>
                                                    <td>10</td>
                                                </tr>
                                                <tr>
                                                    <td>今日出勤</td>
                                                    <td>95</td>
                                                    <td>78</td>
                                                    <td>173</td>
                                                </tr>
                                                <tr>
                                                    <td>今日请假</td>
                                                    <td>3</td>
                                                    <td>1</td>
                                                    <td>4</td>
                                                </tr>
                                                <tr>
                                                    <td>今日调休</td>
                                                    <td>2</td>
                                                    <td>1</td>
                                                    <td>3</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </BorderBox11>
                                </div>
                                <TextList title="设备停机动态（T）" date={this.state.stopRow} listArray={this.state.stopArr} />
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
