import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
type stateType = {
    polylineOption: any,
    option: any,
    ironOreRow: DataRow,
    scrapRow: DataRow,
    cCoalRow: DataRow,
    pCoalRow: DataRow
    listTypeArr: listType[],
}
type PropsType = {
}

export default class FrmPurchaseChart extends React.Component<PropsType, stateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {},
            option: {},
            ironOreRow: new DataRow(),
            scrapRow: new DataRow(),
            cCoalRow: new DataRow(),
            pCoalRow: new DataRow(),
            listTypeArr: [],
        }
    }

    componentDidMount(): void {
        this.initState();
        setInterval(() => {
            this.initData()
        }, 5000)
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initState() {
        let ironOreRow = new DataRow();
        ironOreRow.setValue('purchase', 0).setValue('storage', 0).setValue('onOrder', 0).setValue('inStock', 0);
        let scrapRow = new DataRow();
        scrapRow.setValue('purchase', 0).setValue('storage', 0).setValue('onOrder', 0).setValue('inStock', 0);
        let cCoalRow = new DataRow();
        cCoalRow.setValue('purchase', 0).setValue('storage', 0).setValue('onOrder', 0).setValue('inStock', 0);
        let pCoalRow = new DataRow();
        let listTypeArr: listType[] = [];
        listTypeArr.push({
            name: '年度采购数量',
            key: 'purchase'
        });
        listTypeArr.push({
            name: '年度入库数量',
            key: 'storage'
        });
        listTypeArr.push({
            name: '年度在途数量',
            key: 'onOrder'
        });
        listTypeArr.push({
            name: '年度在库数量',
            key: 'inStock'
        });
        pCoalRow.setValue('purchase', 0).setValue('storage', 0).setValue('onOrder', 0).setValue('inStock', 0);
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
                    data: ['2021', '2022'],
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
                    text: '库存动态预警',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                legend: {
                    data: ['安全库存', '当前库存', '在途库存'],
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
                series: [
                    {
                        name: '安全库存',
                        data: [1200, 2230, 1900, 1800],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                    {
                        name: '当前库存',
                        data: [2230, 1900, 2100, 3000],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                    {
                        name: '在途库存',
                        data: [1200, 2230, 4200, 2567],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    }
                ],
                color: ['#66ff66', '#49bbd1', '#ffff00']
            },
            ironOreRow,
            scrapRow,
            cCoalRow,
            pCoalRow,
            listTypeArr
        })
    }

    async initData() {
        let ironOreRow = new DataRow();
        ironOreRow.setValue('purchase', this.getRandom(10000)).setValue('storage', this.getRandom(10000)).setValue('onOrder', this.getRandom(1000)).setValue('inStock', this.getRandom(1000));
        let scrapRow = new DataRow();
        scrapRow.setValue('purchase', this.getRandom(10000)).setValue('storage', this.getRandom(10000)).setValue('onOrder', this.getRandom(1000)).setValue('inStock', this.getRandom(1000));
        let cCoalRow = new DataRow();
        cCoalRow.setValue('purchase', this.getRandom(10000)).setValue('storage', this.getRandom(10000)).setValue('onOrder', this.getRandom(1000)).setValue('inStock', this.getRandom(1000));
        let pCoalRow = new DataRow();
        pCoalRow.setValue('purchase', this.getRandom(10000)).setValue('storage', this.getRandom(10000)).setValue('onOrder', this.getRandom(1000)).setValue('inStock', this.getRandom(1000));
        this.setState({
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
                    <TopHeader title='制造数据管理中心' />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList}>
                                <TextList title="铁矿石采购动态（T）" date={this.state.ironOreRow} listArray={this.state.listTypeArr} />
                                <TextList title="废钢采购动态（T）" date={this.state.scrapRow} listArray={this.state.listTypeArr} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList}>
                                <TextList title="焦煤采购动态（T）" date={this.state.cCoalRow} listArray={this.state.listTypeArr} />
                                <TextList title="粉煤采购动态（T）" date={this.state.pCoalRow} listArray={this.state.listTypeArr} />
                            </div>
                        </div>
                        <div className={styles.polylineOption} >
                            <Charts option={this.state.polylineOption} />
                        </div>
                    </div>
                </FullScreenContainer>
            </div>
        )
    }
}
