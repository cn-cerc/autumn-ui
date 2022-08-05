import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmPayee.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import UIIntroduction from "../module/UIIntroduction";

type FrmPayeeTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmPayeeTypeState = {
    dataJson: DataRow,
}

export default class FrmPayee extends WebControl<FrmPayeeTypeProps, FrmPayeeTypeState> {
    constructor(props: FrmPayeeTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            {/* <UIIntroduction introduction={this.props.introduction}></UIIntroduction> */}
            <UIIntroduction introduction={'车队长（收款人）应收冲应付,债权和债务进行冲销,也就是应收款与应付款之间的冲销,使用应收冲应付进行处理。'}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataJson.getBoolean(`收款人资料_Dis`) ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '收款人资料')}>
                                <span>收款人资料</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`钱包_Dis`) ? styles.control_disable : styles.control} ${styles.stock3}`} onClick={this.linkTo.bind(this, '钱包')}>
                                <span>钱包</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应付_Dis`) ? styles.control_disable : styles.control} ${styles.stock4}`} onClick={this.linkTo.bind(this, '应付')}>
                                <span>应付</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应收_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '应收')}>
                                <span>应收</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机_Dis`) ? styles.other_disable : styles.other} ${styles.stock6}`} onClick={this.linkTo.bind(this, '司机')}>
                                <span>司机</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`网货_Dis`) ? styles.other_disable : styles.other} ${styles.stock7}`} onClick={this.linkTo.bind(this, '网货')}>
                                <span>网货</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`网货_Dis`) ? styles.other_disable : styles.other} ${styles.stock7}`} onClick={this.linkTo.bind(this, '网货')}>
                                <span>网货</span>
                            </div>
                            <div className={`${styles.MCtext} ${styles.MCtextStock1}`}>
                                <span>网货公司</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.content}>
                        <ul>
                            <li>
                                <p>应收款</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '应收款')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>已收款</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '已收款')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>未收款</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '未收款')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>已付款</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '已付款')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>未付款</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '未付款')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>钱包余额</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '钱包余额')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>比例图（对接中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initBarChart();
        this.initFlowChart();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds.first();
        let xArr = [
            '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'
        ];
        let sData1 = [12, 51, 41, 12, 44, 11, 44, 77, 11, 44, 45, 5];
        let sData2 = [44, 12, 44, 11, 77, 11, 44, 45, 5, 12, 51, 41];

        // while (ds.fetch()) {
        //     sData.push(ds.getDouble('Value_'));
        // }
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
                top: 15,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData1,
                    type: 'bar',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    barWidth: 20,
                    lineStyle: {
                        color: MCChartColors[0]
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    data: sData2,
                    type: 'bar',
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    barWidth: 20,
                    lineStyle: {
                        color: MCChartColors[1]
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
                    coords: [ //收款人往下线条
                        [111, 75],
                        [111, 105],
                    ]
                },
                {
                    coords: [ // 钱包往下线条
                        [111, 160],
                        [111, 185],
                    ]
                },
                {
                    coords: [  //钱包往右线条
                        [133, 123],
                        [198, 123],
                    ]
                },
                {
                    coords: [ //应付往下线条
                        [221, 160],
                        [221, 185]
                    ]
                },
                {
                    coords: [ //应收往下线条
                        [111, 244],
                        [111, 275]
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

    gotoFun(name: string) {
        // location.href = this.state.btnUrl.getString(`${name}_URL`);
    }
}