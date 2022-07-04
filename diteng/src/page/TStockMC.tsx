import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TStockMC.css";
import * as echarts from "echarts";

type TStockMCTypeProps = {
    dataJson: string,
    introduction: string,
    jsonMonth: string,
    jsonYear: string
}

type TStockMCTypeState = {
    pieData1: DataSet,
    pieData2: DataSet,
    dataJson: DataRow,
    introduction: string
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class TStockMC extends WebControl<TStockMCTypeProps, TStockMCTypeState> {
    constructor(props: TStockMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let pieData1 = new DataSet();

        let pieData2 = new DataSet();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            pieData1,
            pieData2,
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
                            <div className={`${this.state.dataJson.getBoolean(`进货单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock1}`} onClick={this.linkTo.bind(this, '进货单')}>
                                <span>进货单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`商品品牌设置_Dis`) ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '商品品牌设置')}>
                                <span>商品品牌设置</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`商品资料登记_Dis`) ? styles.register_disable : styles.register} ${styles.stock3}`} onClick={this.linkTo.bind(this, '商品资料登记')}>
                                <span>商品资料登记</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`进货退回单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '进货退回单')}>
                                <span>进货退回单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存盘点单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '库存盘点单')}>
                                <span>库存盘点单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存报废单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '库存报废单')}>
                                <span>库存报废单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`销售单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '销售单')}>
                                <span>销售单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存总表_Dis`) ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '库存总表')}>
                                <span>库存总表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`进出库明细_Dis`) ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '进出库明细')}>
                                <span>进出库明细</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`出货退回单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock10}`} onClick={this.linkTo.bind(this, '出货退回单')}>
                                <span>出货退回单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库别调拨单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock11}`} onClick={this.linkTo.bind(this, '库别调拨单')}>
                                <span>库别调拨单</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>数据概览</div>
                        <div className={styles.FrmTaurusMCLine}>
                            <div className={styles.boxConten}>
                                <p>商品库存</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>生产领料单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>完工入库单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>库别调拨单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>商品拆装单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>库存盘点单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>库存报损单</p>
                                <span>358</span>
                            </div>
                            <div className={styles.boxConten}>
                                <p>备货单</p>
                                <span>358</span>
                            </div>
                        </div>
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
        // this.initLineChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    // initLineChart() {
    //     let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
    //     let myChart = echarts.init(lineChart);
    //     let ds = new DataSet();
    //     ds.appendDataSet(this.state.lineData);
    //     ds.first();
    //     let xArr = [];
    //     let sData = [];
    //     while (ds.fetch()) {
    //         xArr.push(ds.getString('XName_'));
    //         sData.push(ds.getDouble('Value_'));
    //     }
    //     let option = {
    //         xAxis: {
    //             type: 'category',
    //             data: xArr,
    //             axisLabel: {
    //                 color: '#333333'
    //             },
    //             axisLine: {
    //                 lineStyle: {
    //                     color: '#333333'
    //                 }
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             axisLabel: {
    //                 color: '#333333'
    //             }
    //         },
    //         lengend: {},
    //         tooltip: {},
    //         grid: {
    //             top: 10,
    //             left: 0,
    //             bottom: 0,
    //             right: 10,
    //             containLabel: true,
    //         },
    //         series: [
    //             {
    //                 data: sData,
    //                 type: 'line',
    //                 itemStyle: {
    //                     color: MCChartColors[0]
    //                 },
    //                 lineStyle: {
    //                     color: MCChartColors[0]
    //                 },
    //                 label: {
    //                     show: true,
    //                     position: 'top'
    //                 },
    //             }
    //         ]
    //     };

    //     //@ts-ignore
    //     myChart.setOption(option);
    // }

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
                    coords: [ //进货单 往右下 出货退回单
                        [78, 40],
                        [105, 40],
                        [105, 340],
                        [78, 340],
                    ]
                },
                {
                    coords: [ //进货单 往下 进货退回单
                        [50, 79],
                        [50, 120],
                    ]
                },
                {
                    coords: [ //商品品牌设置 往右 商品资料登记
                        [183, 40],
                        [256, 40],
                    ]
                },
                {
                    coords: [ //进货退回单 往右线条
                        [78, 142],
                        [105, 142],
                    ]
                },
                {
                    coords: [ //库存盘点单 往下 库存总表
                        [169, 180],
                        [169, 220],
                    ]
                },
                {
                    coords: [ //库存报废单 往左下线条
                        [276, 180],
                        [276, 200],
                        [169, 200],
                    ]
                },
                {
                    coords: [ //销售单 往右 库存总表
                        [78, 242],
                        [150, 242],
                    ]
                }, {
                    coords: [ //库存总表 往右 进出库明细
                        [183, 242],
                        [256, 242],
                    ]
                }, {
                    coords: [ //库别调拨单 往上 库存总表
                        [169, 320],
                        [169, 280],
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