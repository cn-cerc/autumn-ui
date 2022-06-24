import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmCarManagerMC1.css";
import * as echarts from "echarts";

type FrmCarManagerMC1TypeProps = {
    dataJson: string,
    introduction: string
}

type FrmCarManagerMC1TypeState = {
    lineData: DataSet,
    barData: DataSet,
    dataJson: DataRow,
    introduction: string
}
//车辆管理控制台 货主
export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmCarManagerMC1 extends WebControl<FrmCarManagerMC1TypeProps, FrmCarManagerMC1TypeState> {
    constructor(props: FrmCarManagerMC1TypeProps) {
        super(props);
        let lineData = new DataSet();
        let lineRow = new DataRow();
        lineData.append().setValue('Value_', 327).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 295).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 218).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 232).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 371).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 316).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 336).setValue('XName_', '周日');
        let barData = new DataSet();
        barData.append().setValue('Value_', 28).setValue('Name_', '周一');
        barData.append().setValue('Value_', 15).setValue('Name_', '周二');
        barData.append().setValue('Value_', 12).setValue('Name_', '周三');
        barData.append().setValue('Value_', 8).setValue('Name_', '周四');
        barData.append().setValue('Value_', 10).setValue('Name_', '周五');
        barData.append().setValue('Value_', 14).setValue('Name_', '周六');
        barData.append().setValue('Value_', 12).setValue('Name_', '周日');
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            lineData,
            barData,
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
                            <div className={`${this.state.dataJson.getBoolean(`车队管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock1}`} onClick={this.linkTo.bind(this, '车队管理')}>
                                <span>车队管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '司机管理')}>
                                <span>司机管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机认证_Dis`) ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '司机认证')}>
                                <span>司机认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`收款人管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '收款人管理')}>
                                <span>收款人管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`收款人认证_Dis`) ? styles.control_disable : styles.control} ${styles.stock6}`} onClick={this.linkTo.bind(this, '收款人认证')}>
                                <span>收款人认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock7}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆类型维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock8}`} onClick={this.linkTo.bind(this, '车辆类型维护')}>
                                <span>车辆类型维护</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`维修记录_Dis`) ? styles.other_disable : styles.other} ${styles.stock10}`} onClick={this.linkTo.bind(this, '维修记录')}>
                                <span>维修记录</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`维修厂系统_Dis`) ? styles.other_disable : styles.other} ${styles.stock11}`} onClick={this.linkTo.bind(this, '维修厂系统')}>
                                <span>维修厂系统</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>趋势图（开发中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                    <div className={styles.mcBarChart}>
                        <div className={styles.mcTitle}>比例图（开发中）</div>
                        <div className={styles.FrmTaurusMCBar}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initLineChart();
        this.initBarChart();
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

    initBarChart() {
        let barChart = document.querySelector(`.${styles.FrmTaurusMCBar}`) as HTMLDivElement;
        let myChart = echarts.init(barChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.barData);
        ds.first();
        let dataArr = [],
            nameArr = [];
        while (ds.fetch()) {
            nameArr.push(ds.getString('Name_'));
            dataArr.push(ds.getDouble('Value_'));
        }
        let option = {
            grid: {
                top: 10,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: nameArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: dataArr,
                    type: 'bar'
                }
            ]
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
                    coords: [ //车队管理 往右线条
                        [75, 40],
                        [143, 40]
                    ]
                },
                {
                    coords: [ //车队管理 往下线条
                        [50, 80],
                        [50, 220]
                    ]
                },
                {
                    coords: [ //司机管理 往右线条
                        [190, 40],
                        [256, 40]
                    ]
                },
                {
                    coords: [ //司机管理 往下线条
                        [169, 80],
                        [169, 130]
                    ]
                },
                {
                    coords: [ //收款人管理 往右线条
                        [190, 140],
                        [256, 140]
                    ]
                },
                {
                    coords: [ //车辆类型维护 往左线条
                        [143, 240],
                        [75, 240]
                    ]
                },
                {
                    coords: [ //车辆管理 往下线条
                        [50, 280],
                        [50, 320]
                    ]
                },
                {
                    coords: [ //维修厂系统 往左线条
                        [143, 340],
                        [75, 340]
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
                    curveness: 0.3,
                },
                effect: {
                    show: true,
                    trailLength: 0,
                    constantSpeed: 10,
                    symbol: 'arrow',
                    color: '#ccc',
                    symbolSize: 6,
                },
                data: charts.linesData
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