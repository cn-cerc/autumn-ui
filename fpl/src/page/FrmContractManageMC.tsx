import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmContractManageMC.css";
import * as echarts from "echarts";

type FrmContractManageMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmContractManageMCTypeState = {
    lineData: DataSet,
    barData: DataSet,
    dataJson: DataRow,
    introduction: string
}
//合同管理(中智运)
export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmContractManageMC extends WebControl<FrmContractManageMCTypeProps, FrmContractManageMCTypeState> {
    constructor(props: FrmContractManageMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let lineRow = new DataRow();
        lineData.append().setValue('Value_', 271).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 235).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 248).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 268).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 335).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 301).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 356).setValue('XName_', '周日');
        let barData = new DataSet();
        barData.append().setValue('Value_', 19).setValue('Name_', '周一');
        barData.append().setValue('Value_', 16).setValue('Name_', '周二');
        barData.append().setValue('Value_', 12).setValue('Name_', '周三');
        barData.append().setValue('Value_', 8).setValue('Name_', '周四');
        barData.append().setValue('Value_', 10).setValue('Name_', '周五');
        barData.append().setValue('Value_', 11).setValue('Name_', '周六');
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
                            <div className={`${this.state.dataJson.getBoolean(`银行维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock1}`} onClick={this.linkTo.bind(this, '银行维护')}>
                                <span>银行维护</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同类别_Dis`) ? styles.receipt : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '合同类别')}>
                                <span>合同类别</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同登记_Dis`) ? styles.register : styles.register} ${styles.stock5}`} onClick={this.linkTo.bind(this, '合同登记')}>
                                <span>合同登记</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`待接收合同_Dis`) ? styles.receipt : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '待接收合同')}>
                                <span>待接收合同</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同管理_Dis`) ? styles.control : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '合同管理')}>
                                <span>合同管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`充值管理_Dis`) ? styles.other : styles.control} ${styles.stock11}`} onClick={this.linkTo.bind(this, '充值管理')}>
                                <span>充值管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`待接收充值_Dis`) ? styles.other : styles.control} ${styles.stock12}`} onClick={this.linkTo.bind(this, '待接收充值')}>
                                <span>待接收充值</span>
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
                    coords: [ //银行维护往右线条
                        [78, 40],
                        [143, 40],
                    ]
                },
                {
                    coords: [ //合同类别往下线条
                        [169, 80],
                        [169, 120],
                    ]
                },
                {
                    coords: [ //合同登记往下线条
                        [169, 180],
                        [169, 220],
                    ]
                },
                {
                    coords: [ //待接收合同往右线条
                        [78, 242],
                        [143, 242],
                    ]
                },
                {
                    coords: [ //合同管理往下线条
                        [169, 280],
                        [169, 323],
                    ]
                },
                {
                    coords: [ //待充值往左线条
                        [248, 339],
                        [183, 339],
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

    linkTo(name: string) {
        if (!this.state.dataJson.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataJson.getString(`${name}_URL`);
        }
    }
}