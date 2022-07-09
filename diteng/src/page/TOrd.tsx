import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TOrd.css";
import * as echarts from "echarts";

type FrmTaurusMCTypeProps = {
    dataJson: string,
    introduction: string,
    jsonMonth: string,
    jsonYear: string,
    jsonAmount: string,
    jsonClass: string
}

type FrmTaurusMCTypeState = {
    linkRow: DataRow,
    introduction: string
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmTaurusMC extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        this.state = {
            linkRow,
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
                            <div className={`${this.state.linkRow.getBoolean('客户资料_Dis') ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '客户资料')}>
                                <span>客户资料</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('信用额度_Dis') ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '信用额度')}>
                                <span>信用额度</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('客户报价_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '客户报价')}>
                                <span>客户报价</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('销售计划_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '销售计划')}>
                                <span>销售计划</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('销售订单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '销售订单')}>
                                <span>销售订单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('线上订单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '线上订单')}>
                                <span>线上订单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('销售单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '销售单')}>
                                <span>销售单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('出货退回单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '出货退回单')}>
                                <span>出货退回单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('应收账款_Dis') ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '应收账款')}>
                                <span>应收账款</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>数据概览</div>
                        <div className={styles.FrmTaurusMCLine}>
                            <div className={styles.boxConten}>
                                <p>在线订货单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>销售订单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>销售单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>销售退货单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>3天未发货</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>出货通知</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>未下单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>已下单</p>
                                <span>358</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>本月销售分析</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>本月销售大类汇总分析</div>
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
        let m = this.props.jsonMonth;
        let y = this.props.jsonYear;
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
                data: ['接单', '销售', '退货', '收款']
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
                data: m
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
                data: y
            }]
        }
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            color: ['#0caff0'],
            legend: {
                data: ['销售金额(元)']
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
            calculable: false,
            grid: {
                x: '10px',
                x2: '10px',
                y2: '35px',
                borderWidth: 0
            },
            xAxis: [{
                splitLine: {
                    show: false
                },
                type: 'category',
                axisTick: {
                    show: false
                },
                data: this.props.jsonClass
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
                name: '销售金额(元)',
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
                data: this.props.jsonAmount
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
                    coords: [
                        [130, 35],
                        [200, 35],
                    ]
                }, {
                    coords: [
                        [110, 75],
                        [110, 105],
                    ]
                }, {
                    coords: [
                        [198, 125],
                        [165, 125],
                        [165, 207]
                    ]
                }, {
                    coords: [
                        [198, 207],
                        [130, 207]
                    ]
                }, {
                    coords: [
                        [110, 244],
                        [110, 275]
                    ]
                }, {
                    coords: [
                        [110, 330],
                        [110, 360]
                    ]
                }, {
                    coords: [
                        [130, 293],
                        [200, 293]
                    ]
                }, {
                    coords: [
                        [219, 330],
                        [219, 375],
                        [130, 375]
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
                position: 'top'
            },
            yAxis: {
                min: 0,
                max: function (val: number) {
                    return flowChart.offsetHeight
                },
                show: false,
                type: 'value',
                inverse: true
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
                data: charts.linesData
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    linkTo(name: string) {
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }
}