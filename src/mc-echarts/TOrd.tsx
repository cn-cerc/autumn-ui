import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./TOrd.css";

type TOrdTypeProps = {

}

type TOrdTypeState = {
    pieData1: DataSet
    pieData2: DataSet,
    dataRow: DataRow,
    introduction:string
}

export default class TOrd extends WebControl<TOrdTypeProps, TOrdTypeState> {
    constructor(props: TOrdTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 10).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 30).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 11).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '重型卡车');
        let dataRow: DataRow = lineRow.setValue("客户资料_URL", "TBase")
        .setValue("客户资料_Dis", false)
        .setValue("信用额度_URL", "TFrmCusCreditLimit")
        .setValue("信用额度_Dis", false)
        .setValue("客户报价_URL", "TFrmTranCC")
        .setValue("客户报价_Dis", false)
        .setValue("销售计划_URL", "FrmSaleForecast")
        .setValue("销售计划_Dis", false)
        .setValue("销售订单_URL", "TFrmTranOD")
        .setValue("销售订单_Dis", false)
        .setValue("线上订单_URL", "TFrmTranOD")
        .setValue("线上订单_Dis", false)
        .setValue("销售单_URL", "TFrmTranBC")
        .setValue("销售单_Dis", false)
        .setValue("出货退回单_URL", "TFrmTranAG")
        .setValue("出货退回单_Dis", false)
        .setValue("应收账款_URL", "TFrmCheckAR")
        .setValue("应收账款_Dis", false);
        let introduction = "此模组主要用于工厂销售或批发销售管理，根据客户的作业模式不同，可以允许客户手动下单并录入【销售订单】，也可以要求客户直接在线下单，然后审核【在线订货单】，仓库根据【销售订单】进行备货，并生成相应的【销售单】。";

        this.state = {
            pieData1,
            pieData2,
            dataRow,
            introduction
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataRow.getBoolean('客户资料_Dis') ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '客户资料')}>
                                <span>客户资料</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('信用额度_Dis') ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '信用额度')}>
                                <span>信用额度</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('客户报价_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '客户报价')}>
                                <span>客户报价</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('销售计划_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '销售计划')}>
                                <span>销售计划</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('销售订单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '销售订单')}>
                                <span>销售订单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('线上订单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '线上订单')}>
                                <span>线上订单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('销售单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '销售单')}>
                                <span>销售单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('出货退回单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '出货退回单')}>
                                <span>出货退回单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('应收账款_Dis') ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '应收账款')}>
                                <span>应收账款</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>数据概览（对接中）</div>
                        <div className={styles.content}>
                            <ul>
                                <li>
                                    <p>在线订货单</p>
                                    <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '在线订货单')}>
                                        <span>358</span>
                                    </div>
                                </li>
                                <li>
                                    <p>销售订单</p>
                                    <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '销售订单')}>
                                        <span>69</span>
                                    </div>
                                </li>
                                <li>
                                    <p>销售单</p>
                                    <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '销售单')}>
                                        <span>983</span>
                                    </div>
                                </li>
                                <li>
                                    <p>销售退货单</p>
                                    <div>
                                        <span>60</span>
                                    </div>
                                </li>
                                <li>
                                    <p>3天未发货</p>
                                    <div>
                                        <span>58</span>
                                    </div>
                                </li>
                                <li>
                                    <p>出货通知</p>
                                    <div>
                                        <span>2</span>
                                    </div>
                                </li>
                                <li>
                                    <p>未下单</p>
                                    <div>
                                        <span>5</span>
                                    </div>
                                </li>
                                <li>
                                    <p>已下单</p>
                                    <div>
                                        <span>785</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>趋势图（对接中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>趋势图（对接中）</div>
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
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }

    gotoFun(name: string) {
        // location.href = this.state.btnUrl.getString(`${name}_URL`);
    }
}