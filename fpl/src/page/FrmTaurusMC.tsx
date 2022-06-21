import { DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmTaurusMC.css";
import * as echarts from "echarts";

type FrmTaurusMCTypeProps = {

}

type FrmTaurusMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmTaurusMC extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        lineData.append().setValue('Value_', 300).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 285).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 220).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 360).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 28).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 12).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 8).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 12).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '重型卡车');
        this.state = {
            lineData,
            pieData1,
            pieData2
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.mcTitle}>简介</div>
                <p>此模组为货运管理（货主）简介，内容待完善。此模组为货运管理（货主）简介，内容待完善。此模组为货运管理（货主）简介，内容待完善。此模组为货运管理（货主）简介，内容待完善。此模组为货运管理（货主）简介，内容待完善。此模组为货运管理（货主）简介。</p>
            </div>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, 'TFrmPartInfo')}>
                                <span>商品资料登记</span>
                            </div>
                            <div className={`${styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, 'TFrmCusInfo')}>
                                <span>客户登记</span>
                            </div>
                            <div className={`${styles.register} ${styles.stock3}`}>
                                <span>车队与司机登记</span>
                            </div>
                            <div className={`${styles.register} ${styles.stock4}`}>
                                <span>货单登记</span>
                            </div>
                            <div className={`${styles.register} ${styles.stock5}`}>
                                <span>自行派车运单登记</span>
                            </div>
                            <div className={`${styles.other} ${styles.stock6}`}>
                                <span>委托第三方物流运输</span>
                            </div>
                            <div className={`${styles.other} ${styles.stock7}`}>
                                <span>网络货运平台撮合</span>
                            </div>
                            <div className={`${styles.other} ${styles.stock8}`}>
                                <span>司机端</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>趋势图（开发中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initLineChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    initLineChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.lineData);
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('XName_'));
            sData.push(ds.getDouble('Value_'));
        }
        let option = {
            // title: {
            //     text: '本周货运总数(吨)',
            //     left: 'center',
            //     textStyle: {
            //         fontSize: 14
            //     }
            // },
            xAxis: {
                type: 'category',
                data: xArr,
                axisLabel: {
                    color: '#333333'
                },
                axisLine: {
                    lineStyle: {
                        color: '#333333'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#333333'
                }
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 10,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'line',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0]
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.pieData1);
        ds.first();
        let dataArr = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
        let option = {
            // title: {
            //     text: '本周货运吨数占比',
            //     left: 'center',
            //     textStyle: {
            //         fontSize: 14
            //     },
            //     top: '16'
            // },
            tooltip: {
                trigger: 'item'
            },
            grid: {
                top: 40,
                left: 0,
                bottom: 0,
                right: 20,
                containLabel: true,
            },
            series: [
                {
                    name: '本周货运吨数占比',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {},
                    data: dataArr
                }
            ]
        }
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.pieData2);
        ds.first();
        let dataArr = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
        let option = {
            // title: {
            //     text: '本周货运车辆占比',
            //     left: 'center',
            //     textStyle: {
            //         fontSize: 14
            //     },
            //     top: '16'
            // },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '本周货运车辆占比',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {},
                    data: dataArr
                }
            ]
        }
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
                        [78, 40],
                        [143, 40],
                    ]
                }, {
                    coords: [
                        [183, 40],
                        [248, 40],
                    ]
                }, {
                    coords: [
                        [163, 180],
                        [163, 200],
                        [163, 220],
                    ]
                }, {
                    coords: [
                        [163, 180],
                        [163, 200],
                        [59, 200],
                        [59, 220],
                    ]
                }, {
                    coords: [
                        [163, 180],
                        [163, 200],
                        [269, 200],
                        [269, 220],
                    ]
                }, {
                    coords: [
                        [78, 242],
                        [143, 242],
                    ]
                }, {
                    coords: [
                        [183, 242],
                        [248, 242],
                    ]
                }, {
                    coords: [
                        [163, 292],
                        [163, 320],
                    ]
                },
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

    linkTo(url: string) {
        location.href = url
    }
}