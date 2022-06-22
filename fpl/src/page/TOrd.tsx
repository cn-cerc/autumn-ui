import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TOrd.css";
import * as echarts from "echarts";

type FrmTaurusMCTypeProps = {
    dataJson: string
}

type FrmTaurusMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    pieData2: DataSet,
    linkRow: DataRow
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmTaurusMC extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        lineData.append().setValue('Value_', 200).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 285).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 250).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 290).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 380).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 290).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 30).setValue('Name_', '退货单');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '销售单');
        pieData1.append().setValue('Value_', 10).setValue('Name_', '销售订单');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 11).setValue('Name_', '1');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '2');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '3');
        pieData2.append().setValue('Value_', 30).setValue('Name_', '4');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '5');
        pieData2.append().setValue('Value_', 10).setValue('Name_', '6');
        pieData2.append().setValue('Value_', 15).setValue('Name_', '7');
        this.state = {
            lineData,
            pieData1,
            pieData2,
            linkRow
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.mcTitle}>简介</div>
                <p>此模组主要用于工厂销售或批发销售管理，根据与客户的作业模式不同，可以允许客户手动下单并录入【销售订单】，也可以要求客户直接在线下单，然后审核【在线订货单】，仓库根据【销售订单】进行备案，并生成相应的【销售单】。</p>
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
                            <div className={`${this.state.linkRow.getBoolean('应帐回收_Dis') ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '应帐回收')}>
                                <span>应帐回收</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>趋势图</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>比例图</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>比例图</div>
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
            dataArr.push(ds.getDouble('Value_'))
        }
        let option = {
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
            xAxis: {
                type: 'category',
                data: ['销售订单', '销售单', '退货单']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: dataArr,
                    type: 'bar',
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
            dataArr.push(ds.getDouble('Value_'))
        }
        let option = {
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
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: dataArr,
                    type: 'bar',
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
        if(!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }
}