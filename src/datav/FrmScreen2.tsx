import React from "react";
import { FullScreenContainer, Charts, Decoration1 } from '@jiaminghi/data-view-react'
import TopHeader from './TopHeader'
import DigitalFlop from './DigitalFlop'
import RankingBoard from './RankingBoard'
import RoseChart from './RoseChart'
import WaterLevelChart from './WaterLevelChart'
import ScrollBoard from './ScrollBoard'
import Cards from "./Cards"
import TextList from "./TextList";
import DataRow from "../db/DataRow";
import styles from './FrmScreen2.css'
type stateType = {
    polylineOption: any,
    option: any
}
type PropsType = {
}

export default class FrmScreen extends React.Component<PropsType, stateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {
                title: {
                    text: '废钢采购年度对比动态',
                    style: {
                        fill: '#fff',
                        fontSize: 25
                    }
                },
                legend: {
                    data: ['2021', '2022'],
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    top: '9',
                    right: '35%'

                },
                grid: {
                    bottom: '20',
                    left:'0',
                    right:'0'
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
                color: ['#66ff66', '#49bbd1']
            },
            option: {
                title: {
                    text: '库存动态预警',
                    style: {
                        fill: '#fff',
                        fontSize: 25
                    }
                },
                legend: {
                    data: ['安全库存', '当前库存', '在途库存'],
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    bottom: '5',
                },
                grid: {
                    bottom: '15',
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
                                fontSize: 18
                            }
                        }
                    },
                    {
                        name: '当前库存',
                        data: [2230, 1900, 2100, 3000],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18
                            }
                        }
                    },
                    {
                        name: '在途库存',
                        data: [1200, 2230, 4200, 2567],
                        type: 'bar',
                        label: {
                            show: true,
                            style: {
                                fontSize: 18
                            }
                        }
                    }
                ],
                color: ['#66ff66', '#49bbd1', '#ffff00']
            }
        }
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList}>
                                <TextList title="铁矿石采购动态（T）" date={new DataRow().setValue('purchase', 3000).setValue('storage', 2400).setValue('onOrder', 500).setValue('inStock', 2500)} />
                                <TextList title="废钢采购动态（T）" date={new DataRow().setValue('purchase', 3000).setValue('storage', 2400).setValue('onOrder', 500).setValue('inStock', 2500)} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList}>
                                <TextList title="焦煤采购动态（T）" date={new DataRow().setValue('purchase', 3000).setValue('storage', 2400).setValue('onOrder', 500).setValue('inStock', 2500)} />
                                <TextList title="粉煤采购动态（T）" date={new DataRow().setValue('purchase', 3000).setValue('storage', 2400).setValue('onOrder', 500).setValue('inStock', 2500)} />
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
