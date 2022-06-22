import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmTaurusMC1.css";
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

export default class FrmTaurusMC1 extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        lineData.append().setValue('Value_', 150).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 250).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 180).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 190).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 250).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 200).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 13).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 19).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 13).setValue('Name_', '1');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '2');
        pieData2.append().setValue('Value_', 19).setValue('Name_', '3');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '4');
        pieData2.append().setValue('Value_', 35).setValue('Name_', '5');
        pieData2.append().setValue('Value_', 10).setValue('Name_', '6');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '7');
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
                            <div className={`${this.state.linkRow.getBoolean('商品资料登记_Dis') ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '商品资料登记')}>
                                <span>商品资料登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('客户登记_Dis') ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '客户登记')}>
                                <span>客户登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('车队与司机登记_Dis') ? styles.register_disable : styles.register} ${styles.stock3}`} onClick={this.linkTo.bind(this, '车队与司机登记')}>
                                <span>车队与司机登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货主线上委托_Dis') ? styles.register_disable : styles.register} ${styles.stock4}`} onClick={this.linkTo.bind(this, '货主线上委托')}>
                                <span>货主线上委托</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货主线下委托_Dis') ? styles.register_disable : styles.register} ${styles.stock5}`} onClick={this.linkTo.bind(this, '货主线下委托')}>
                                <span>货主线下委托</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货单管理_Dis') ? styles.control_disable : styles.control} ${styles.stock6}`} onClick={this.linkTo.bind(this, '货单管理')}>
                                <span>货单管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('自行派车运单登记_Dis') ? styles.register_disable : styles.register} ${styles.stock7}`} onClick={this.linkTo.bind(this, '自行派车运单登记')}>
                                <span>自行派车运单登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('委托第三方物流运输_Dis') ? styles.other_disable : styles.other} ${styles.stock8}`} onClick={this.linkTo.bind(this, '委托第三方物流运输')}>
                                <span>委托第三方物流运输</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('网络货运平台撮合_Dis') ? styles.other_disable : styles.other} ${styles.stock9}`} onClick={this.linkTo.bind(this, '网络货运平台撮合')}>
                                <span>网络货运平台撮合</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('司机端_Dis') ? styles.other_disable : styles.other} ${styles.stock10}`} onClick={this.linkTo.bind(this, '司机端')}>
                                <span>司机端</span>
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
                        [78, 40],
                        [143, 40],
                    ]
                }, {
                    coords: [
                        [183, 40],
                        [248, 40],
                    ]
                },{
                    coords: [
                        [58, 175],
                        [58, 190],
                        [145, 190]
                    ]
                },{
                    coords: [
                        [268, 175],
                        [268, 190],
                        [183, 190]
                    ]
                },{
                    coords: [
                        [164, 226],
                        [164, 265]
                    ]
                },{
                    coords: [
                        [164, 245],
                        [60, 245],
                        [60, 265]
                    ]
                },{
                    coords: [
                        [164, 245],
                        [268, 245],
                        [268, 265]
                    ]
                },{
                    coords: [
                        [78, 282],
                        [143, 282]
                    ]
                },{
                    coords: [
                        [183, 282],
                        [248, 282]
                    ]
                },{
                    coords: [
                        [164, 335],
                        [164, 360]
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