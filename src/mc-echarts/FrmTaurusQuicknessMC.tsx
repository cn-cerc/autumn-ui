import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import StaticFile from "../static/StaticFile";
import styles from "./FrmTaurusQuicknessMC.css";

type FrmTaurusQuicknessMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmTaurusQuicknessMCTypeState = {
    linkRow: DataRow,
}

export const MCChartColors = ['#578DF9', '#63DAAB', '#6B7A91', '#F0D062', '#E6806C', '#7DD17D', '#9A7BD9'];

export default class FrmTaurusQuicknessMC extends WebControl<FrmTaurusQuicknessMCTypeProps, FrmTaurusQuicknessMCTypeState> {
    constructor(props: FrmTaurusQuicknessMCTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        this.state = {
            linkRow,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.props.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    {this.getHtml()}
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>司机接单统计(前五)(对接中)</div>
                            <div className={styles.FrmTaurusQuicknessMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>运单状态(对接中)</div>
                            <div className={styles.FrmTaurusQuicknessMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>运单数量(对接中)</div>
                        <div className={styles.FrmTaurusQuicknessMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    getHtml() {
        return <div>
            <ul className={styles.btnMCBox}>
                <li onClick={this.linkTo.bind(this, '我要发货')}>
                    <div className={styles.btnMCItem}>
                        <div>
                            <img src={StaticFile.getImage('images/MCimg/orderCar.png')} alt="" />
                        </div>
                        <p>我要发货</p>
                    </div>
                </li>
                <li onClick={this.linkTo.bind(this, '司机接单')}>
                    <div className={styles.btnMCItem}>
                        <div>
                            <img src={StaticFile.getImage('images/MCimg/defualtBook.png')} alt="" />
                        </div>
                        <p>司机接单</p>
                    </div>
                </li>
                <li onClick={this.linkTo.bind(this, '我要跟踪')}>
                    <div className={styles.btnMCItem}>
                        <span>运输中</span>
                        <div>
                            <img src={StaticFile.getImage('images/MCimg/site.png')} alt="" />
                        </div>
                        <p>我要跟踪</p>
                    </div>
                </li>
                <li onClick={this.linkTo.bind(this, '运输完成')}>
                    <div className={styles.btnMCItem}>
                        <div>
                            <img src={StaticFile.getImage('images/MCimg/defualtSuss.png')} alt="" />
                        </div>
                        <p>运输完成</p>
                    </div>
                </li>
                <li onClick={this.linkTo.bind(this, '我要开票')}>
                    <div className={styles.btnMCItem}>
                        <div>
                            <img src={StaticFile.getImage('images/MCimg/openEmail.png')} alt="" />
                        </div>
                        <p>我要开票</p>
                    </div>
                </li>
            </ul>
        </div>
    }

    async init() {
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
    }

    componentDidMount(): void {
        this.init();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusQuicknessMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds.first();
        let xArr = [
            '一月',
            '二月',
            '三月',
            '四月',
            '五月',
            '六月',
            '七月',
            '八月',
            '九月',
            '十月',
            '十一月',
            '十二月',
        ];
        let sData = [
            10890, 8910, 7500, 12340, 4880, 9604, 10238, 2700, 5000, 6007, 7051, 4050
        ];
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
            tooltip: {},
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
                    barWidth: 10,
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
        let peiChart = document.querySelector(`.${styles.FrmTaurusQuicknessMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.first();
        let dataArr: any = [
            { name: '张三', value: 50 },
            { name: '李四', value: 48 },
            { name: '王五', value: 43 },
            { name: '赵六', value: 10 },
            { name: '林二', value: 5 },
        ];
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value + '单';
                },
            },
            grid: {
                top: 40,
                left: 0,
                bottom: 0,
                right: 20,
                containLabel: false,
            },
            series: [
                {
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataArr
                }
            ]
        }
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusQuicknessMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.first();
        let dataArr: any = [
            { name: '未完成', value: 30 },
            { name: '已完成', value: 70 }
        ];

        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value + '%';
                },
            },
            series: [
                {
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    zLevel: 1,
                    label: {
                        show: false,
                        position: 'center',
                        backgroudColor: '#fff',
                    },
                    color: MCChartColors,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold',
                        }
                    },
                    labelLine: {
                        show: false
                    },
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
                        [75, 35],
                        [143, 35],
                    ]
                }, {
                    coords: [
                        [190, 35],
                        [256, 35],
                    ]
                },
                {
                    coords: [
                        [279, 71],
                        [279, 105],
                    ]
                },
                {
                    coords: [
                        [256, 123],
                        [190, 123],
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
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }
}