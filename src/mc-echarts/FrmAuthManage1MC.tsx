import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmAuthManage1MC.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmAuthManage1MCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmAuthManage1MCTypeState = {
    dataJson: DataRow,
    waitYearVerify: number,
    waitVerify: number,
    automaticVerify: number,
    passVerify: number,
    statisticsVerify: DataSet,
}

export default class FrmAuthManage1MC extends WebControl<FrmAuthManage1MCTypeProps, FrmAuthManage1MCTypeState> {
    constructor(props: FrmAuthManage1MCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            waitYearVerify: 0,
            waitVerify: 0,
            automaticVerify: 0,
            passVerify: 0,
            statisticsVerify: new DataSet(),
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.props.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataJson.getBoolean(`企业认证_Dis`) ? styles.control_disable : styles.control} ${styles.stock1}`} onClick={this.linkTo.bind(this, '企业认证')}>
                                <span>企业认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`认证中心_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '认证中心')}>
                                <span>认证中心</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆认证_Dis`) ? styles.control_disable : styles.control} ${styles.stock3}`} onClick={this.linkTo.bind(this, '车辆认证')}>
                                <span>车辆认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`企业审核_Dis`) ? styles.register_disable : styles.register} ${styles.stock4}`} onClick={this.linkTo.bind(this, '企业审核')}>
                                <span>企业审核</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机认证_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '司机认证')}>
                                <span>司机认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆审核_Dis`) ? styles.register_disable : styles.register} ${styles.stock6}`} onClick={this.linkTo.bind(this, '车辆审核')}>
                                <span>车辆审核</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机审核_Dis`) ? styles.register_disable : styles.register} ${styles.stock8}`} onClick={this.linkTo.bind(this, '司机审核')}>
                                <span>司机审核</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcTitle}>数据概览</div>
                        <div className={styles.fourDiv}>
                            <div>
                                <p>等待时间最长</p>
                                <span>{this.state.waitYearVerify}</span>
                            </div>
                            <div>
                                <p>待审核</p>
                                <span>{this.state.waitVerify}</span>
                            </div>
                            <div>
                                <p>自动审核</p>
                                <span>{this.state.automaticVerify}</span>
                            </div>
                            <div>
                                <p>已审核</p>
                                <span>{this.state.passVerify}</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>一周审核数量</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    init() {
        FplApi.getAllVerify().then((allVerify) => {
            this.setState({
                waitYearVerify: allVerify.getDouble('waitYearVerify'),
                waitVerify: allVerify.getDouble('waitVerify'),
                automaticVerify: allVerify.getDouble('automaticVerify'),
                passVerify: allVerify.getDouble('passVerify'),
            })
        });
        FplApi.getStatisticsVerify().then((statisticsVerify) => {
            this.setState({
                statisticsVerify
            }, () => {
                this.initBarChart();
            })
        });

        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds = this.state.statisticsVerify;
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('num'));
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
            grid: {
                top: 25,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    itemStyle: {
                        color: MCChartColors[0],
                    },
                    barWidth: this.isPhone ? 10 : 60,
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //企业认证 往下线条
                        [50, 75],
                        [50, 108]
                    ]
                },
                {
                    coords: [ //企业认证 往右线条
                        [73, 35],
                        [150, 35],
                    ]
                },
                {
                    coords: [ //认证中心 往右线条
                        [190, 35],
                        [256, 35],
                    ]
                },
                {
                    coords: [ //认证中心 往下线条
                        [168, 75],
                        [168, 108]
                    ]
                },
                {
                    coords: [ //车辆认证 往下线条
                        [279, 75],
                        [279, 108]
                    ]
                },
                {
                    coords: [ //司机认证 往下线条
                        [168, 160],
                        [168, 189]
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