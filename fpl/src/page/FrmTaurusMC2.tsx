import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmTaurusMC2.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import FplPageApi from "./FplPageApi";
import Introduction from "./Introduction";

type FrmTaurusMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmTaurusMCTypeState = {
    linkRow: DataRow,
    vehicleState: DataSet,
    invoiceStatistics: DataSet,
    waybillDtatistics: DataSet,
}

export default class FrmTaurusMC2 extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        this.state = {
            linkRow,
            vehicleState: new DataSet(),
            invoiceStatistics: new DataSet(),
            waybillDtatistics: new DataSet(),
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <Introduction introduction={this.props.introduction}></Introduction>
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
                            <div className={`${this.state.linkRow.getBoolean('货主线下委托_Dis') ? styles.register_disable : styles.register} ${styles.stock6}`} onClick={this.linkTo.bind(this, '货主线下委托')}>
                                <span>货主线下委托</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货单管理_Dis') ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '货单管理')}>
                                <span>货单管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('自行派车运单登记_Dis') ? styles.register_disable : styles.register} ${styles.stock10}`} onClick={this.linkTo.bind(this, '自行派车运单登记')}>
                                <span>自行派车运单登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('委托第三方物流运输_Dis') ? styles.other_disable : styles.other} ${styles.stock11}`} onClick={this.linkTo.bind(this, '委托第三方物流运输')}>
                                <span>委托第三方物流运输</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('网络货运平台撮合_Dis') ? styles.other_disable : styles.other} ${styles.stock12}`} onClick={this.linkTo.bind(this, '网络货运平台撮合')}>
                                <span>网络货运平台撮合</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('司机端_Dis') ? styles.other_disable : styles.other} ${styles.stock14}`} onClick={this.linkTo.bind(this, '司机端')}>
                                <span>司机端</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>车辆状态统计</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>货单统计</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>货运车辆统计（对接中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let vehicleState = new DataSet();
        vehicleState = await FplPageApi.getMoreThanOneWeekReport();
        let invoiceStatistics = new DataSet();
        invoiceStatistics = await FplPageApi.queryCargoReport();
        let waybillDtatistics = new DataSet();
        waybillDtatistics = await FplPageApi.getWaybillDtatistics();

        this.setState({
            vehicleState,
            invoiceStatistics,
            waybillDtatistics
        })
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds = this.state.waybillDtatistics;
        ds.first();
        let xArr = [
            '未发货',
            '已发货',
            '已卸货',
            '审核中',
            '已结案'
        ];
        let sData = [
            ds.getDouble('notYetShipped'),
            ds.getDouble('hasBeenShipped'),
            ds.getDouble('cargoUnloaded'),
            ds.getDouble('checkPending'),
            ds.getDouble('caseClosed'),
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
                    barWidth: 60,
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
        ds = this.state.vehicleState;
        ds.first();
        let dataArr: any = [
            { name: '在途中', value: ds.getDouble('empty_car_sum_') },
            { name: '空车', value: ds.getDouble('carry_sum_') },
            { name: '待发货', value: ds.getDouble('to_be_shipped_sum_') },
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
                    return name + ' : ' + singleData[0].value;
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
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.invoiceStatistics;
        ds.first();
        let dataArr: any = [
            // {name:'总货单数',value:ds.getDouble('sum')},
            { name: '未开始', value: ds.getDouble('status1') },
            { name: '执行中', value: ds.getDouble('status2') },
            { name: '完成', value: ds.getDouble('status3') }
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
                    return name + ' : ' + singleData[0].value;
                },
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
                }, {
                    coords: [
                        [50, 160],
                        [50, 208],
                        [143, 208]
                    ]
                }, {
                    coords: [
                        [278, 160],
                        [278, 208],
                        [190, 208]
                    ]
                }, {
                    coords: [
                        [168, 242],
                        [168, 271]
                    ]
                }, {
                    coords: [
                        [168, 250],
                        [50, 250],
                        [50, 271]
                    ]
                }, {
                    coords: [
                        [168, 250],
                        [278, 250],
                        [278, 271]
                    ]
                },
                {
                    coords: [ //自行派车运单登记 往右下线条
                        [50, 333],
                        [50, 346],
                        [168, 346]
                    ]
                },
                {
                    coords: [ //网络货运平台撮合 往左下线条
                        [278, 333],
                        [278, 346],
                        [168, 346],
                    ]
                },
                {
                    coords: [
                        [168, 335],
                        [168, 360]
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
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }
}