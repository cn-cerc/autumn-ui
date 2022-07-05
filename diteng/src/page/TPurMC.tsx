import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TPurMC.css";
import * as echarts from "echarts";

type TPurMCTypeProps = {
    dataJson: string,
    introduction: string,
    dataDayAB: string,
    dataMonth: string,
    dataYear: string
}

type TPurMCTypeState = {
    dataJson: DataRow,
    introduction: string
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmTaurusMC extends WebControl<TPurMCTypeProps, TPurMCTypeState> {
    constructor(props: TPurMCTypeProps) {
        super(props);
        let lineRow = new DataRow();

        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            introduction: this.props.introduction
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.mcTitle}>简介</div>
                <p>{this.state.introduction}</p>
            </div>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataJson.getBoolean(`厂商资料_Dis`) ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '厂商资料')}>
                                <span>厂商资料</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`销售订单_Dis`) ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '销售订单')}>
                                <span>销售订单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`厂商报价_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '厂商报价')}>
                                <span>厂商报价</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`生产订单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '生产订单')}>
                                <span>生产订单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`采购订单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '采购订单')}>
                                <span>采购订单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`安全库存_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '安全库存')}>
                                <span>安全库存</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`进货单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '进货单')}>
                                <span>进货单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`出货退回单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '出货退回单')}>
                                <span>出货退回单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应付账款_Dis`) ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '应付账款')}>
                                <span>应付账款</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>数据概览</div>
                        <div className={styles.FrmTaurusMCLine}>
                            <div className={styles.boxConten}>
                                <p>在线订货</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>销售订单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>生产订单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>采购订单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>进货单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>进货退回单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>出货退回单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>安全库存</p>
                                <span>358</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>昨日进货分析</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>本月进货分析</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            color: ['#0caff0'],
            legend: {
                data: ['昨日(元)']
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0)',
                textStyle: {
                    color: 'red',
                    fontSize: 11
                },
                position: [10, 5]
            },
            grid: {
                x: '10px',
                x2: '10px',
                y2: '25px',
                borderWidth: 0
            },
            calculable: false,
            xAxis: [{
                splitLine: {
                    show: false
                },
                type: 'category',
                axisTick: {
                    show: false
                },
                data: ['进货', '进货退回', '付款']
            }],
            yAxis: [{
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                type: 'value',
                axisLabel: {
                    formatter: function () {
                        return "";
                    }
                }
            }],
            series: [{
                name: '昨日(元)',
                type: 'bar',
                barWidth: 30,
                itemStyle: {
                    normal: {
                        label: {
                            formatter: function () {
                                return "";
                            }
                        }
                    }
                },
                data: this.props.dataDayAB
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            color: ['#0caff0', '#e5323e'],
            legend: {
                data: ['本月(元)', '年度(元)']
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0)',
                textStyle: {
                    color: 'red',
                    fontSize: 11
                },
                position: [10, 5]
            },
            grid: {
                x: '10px',
                x2: '10px',
                y2: '25px',
                borderWidth: 0
            },
            calculable: false,
            xAxis: [{
                splitLine: {
                    show: false
                },
                type: 'category',
                axisTick: {
                    show: false
                },
                data: ['进货', '进货退回', '付款']
            }],
            yAxis: [{
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                type: 'value',
                axisLabel: {
                    formatter: function () {
                        return "";
                    }
                }
            }],
            series: [{
                name: '本月(元)',
                type: 'bar',
                barWidth: 30,
                itemStyle: {
                    normal: {
                        label: {
                            formatter: function () {
                                return "";
                            }
                        }
                    }
                },
                data: this.props.dataMonth
            }, {
                name: '年度(元)',
                type: 'bar',
                barWidth: 30,
                itemStyle: {
                    normal: {
                        label: {
                            formatter: function () {
                                return "";
                            }
                        }
                    }
                },
                data: this.props.dataYear
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //销售订单 往左下线条
                        [200, 35],
                        [165, 35],
                        [165, 125],
                    ]
                }, {
                    coords: [ //厂商资料 往下线条
                        [111, 75],
                        [111, 105],
                    ]
                },
                {
                    coords: [ //厂商报价 往下线条
                        [111, 160],
                        [111, 185],
                    ]
                },
                {
                    coords: [ //生产订单 往右下线条
                        [198, 125],
                        [165, 125],
                        [165, 207]
                    ]
                }, {
                    coords: [ //安全库存 往左线条
                        [198, 207],
                        [133, 207]
                    ]
                }, {
                    coords: [ //采购订单 往下线条
                        [111, 244],
                        [111, 275]
                    ]
                }, {
                    coords: [ //进货单 往下线条
                        [111, 330],
                        [111, 360]
                    ]
                }, {
                    coords: [ //进货单 往右线条
                        [133, 293],
                        [200, 293]
                    ]
                }, {
                    coords: [ //出货退回单 往左下线条
                        [219, 330],
                        [219, 375],
                        [140, 375]
                    ]
                }
            ]
        }

        let option = {
            backgroundColor: "",
            xAxis: {
                min: 0,
                max: 328,
                show: false,
                type: 'value',
                position: 'top',
            },
            yAxis: {
                min: 0,
                max: function (val: number) {
                    return flowChart.offsetHeight
                },
                show: false,
                type: 'value',
                inverse: true,
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: '#fff',
                    formatter: function (item: any) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'line',
                    width: 2,
                    color: '#ccc',
                    curveness: 0.3
                },
                effect: {
                    show: true,
                    trailLength: 0,
                    constantSpeed: 10,
                    symbol: 'arrow',
                    color: '#ccc',
                    symbolSize: 6
                },
                data: charts.linesData,
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    linkTo(name: string) {
        if (!this.state.dataJson.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataJson.getString(`${name}_URL`);
        }
    }
}