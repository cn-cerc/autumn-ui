import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TStockMC.css";
import * as echarts from "echarts";

type TStockMCTypeProps = {
    dataJson:string
}

type TStockMCTypeState = {
    lineData: DataSet,
    barData: DataSet,
    dataJson:DataRow
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class TStockMC extends WebControl<TStockMCTypeProps, TStockMCTypeState> {
    constructor(props: TStockMCTypeProps) {
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
        let dataJson:DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            lineData,
            barData,
            dataJson:dataJson
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
                            <div className={`${this.state.dataJson.getBoolean(`进货单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock1}`} onClick={this.linkTo.bind(this, '进货单')}>
                                <span>进货单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`商品品牌设置_Dis`)?styles.register_disable:styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '商品品牌设置')}>
                                <span>商品品牌设置</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`商品资料登记_Dis`)?styles.register_disable:styles.register} ${styles.stock3}`} onClick={this.linkTo.bind(this, '商品资料登记')}>
                                <span>商品资料登记</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`进货退回单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '进货退回单')}>
                                <span>进货退回单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存盘点单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '库存盘点单')}>
                                <span>库存盘点单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存报废单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '库存报废单')}>
                                <span>库存报废单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`销售单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '销售单')}>
                                <span>销售单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库存总表_Dis`)?styles.control_disable:styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '库存总表')}>
                                <span>库存总表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`进出库明细_Dis`)?styles.control_disable:styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '进出库明细')}>
                                <span>进出库明细</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`出货退回单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock10}`} onClick={this.linkTo.bind(this, '出货退回单')}>
                                <span>出货退回单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`库别调拨单_Dis`)?styles.receipt_disable:styles.receipt} ${styles.stock11}`} onClick={this.linkTo.bind(this, '库别调拨单')}>
                                <span>库别调拨单</span>
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
                    coords: [ //进货单 往右下 出货退回单
                        [78, 40],
                        [105, 40],
                        [105, 340],
                        [78, 340],
                    ]
                }, {
                    coords: [ //商品品牌设置 往右 商品资料登记
                        [183, 40],
                        [248, 40],
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
                        [143, 242],
                    ]
                }, {
                    coords: [ //库存总表 往右 进出库明细
                        [183, 242],
                        [248, 242],
                    ]
                }, {
                    coords: [ //库别调拨单 往上 库存总表
                        [169, 323],
                        [169, 290],
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
        if(!this.state.dataJson.getBoolean(`${name}_Dis`)){
            location.href = this.state.dataJson.getString(`${name}_URL`);
        }
    }
}