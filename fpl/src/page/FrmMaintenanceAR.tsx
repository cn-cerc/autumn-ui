import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmMaintenanceAR.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import FplPageApi from "./FplPageApi";
import Introduction from "./Introduction";

type FrmMaintenanceARTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmMaintenanceARTypeState = {
    linkRow: DataRow,
    settlementStatus: DataSet,
    monthlyPaymentData: DataSet,
    yearRepairBill: DataSet,
}

export default class FrmMaintenanceAR extends WebControl<FrmMaintenanceARTypeProps, FrmMaintenanceARTypeState> {
    constructor(props: FrmMaintenanceARTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        this.state = {
            linkRow,
            settlementStatus: new DataSet(),
            monthlyPaymentData: new DataSet(),
            yearRepairBill: new DataSet(),
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
                            <div className={`${this.state.linkRow.getBoolean('客户管理_Dis') ? styles.control_disable : styles.control} ${styles.stock1}`} onClick={this.linkTo.bind(this, '客户管理')}>
                                <span>客户管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('车辆管理_Dis') ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('扫一扫_Dis') ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '扫一扫')}>
                                <span>扫一扫</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('新增维修单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '新增维修单')}>
                                <span>新增维修单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('零配件管理_Dis') ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '零配件管理')}>
                                <span>零配件管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('维修单管理_Dis') ? styles.control_disable : styles.control} ${styles.stock6}`} onClick={this.linkTo.bind(this, '维修单管理')}>
                                <span>维修单管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('新增月结收款单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '新增月结收款单')}>
                                <span>新增月结收款单</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('月结收款单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '月结收款单')}>
                                <span>月结收款单</span>
                            </div>
                            <div className={styles.bdSkin}>
                                <span>庆丰物流</span>
                                <div className={`${this.state.linkRow.getBoolean('接收收款单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock9}`} onClick={this.linkTo.bind(this, '接收收款单')}>
                                    <span>接收收款单</span>
                                </div>
                                <div className={`${this.state.linkRow.getBoolean('审核并支付_Dis') ? styles.control_disable : styles.control} ${styles.stock10}`} onClick={this.linkTo.bind(this, '审核并支付')}>
                                    <span>审核并支付</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>结算状态</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>月结款数据</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>维修单统计</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let settlementStatus = new DataSet();
        settlementStatus = await FplPageApi.getAccountReport();
        let monthlyPaymentData = new DataSet();
        monthlyPaymentData = await FplPageApi.getMaintainByMonth();
        let yearRepairBill = new DataSet();
        yearRepairBill = await FplPageApi.getMaintainByMonthsReport();

        this.setState({
            settlementStatus,
            monthlyPaymentData,
            yearRepairBill,
        });
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
        let xArr = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
        let ds = new DataSet();
        ds = this.state.yearRepairBill;
        let sData: any = [];
        ds.first();
        while (ds.fetch()) {
            sData.push(ds.getDouble('repair_order_total_'));
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
        ds = this.state.settlementStatus;
        ds.first();
        let dataArr = [{ name: '待接收', value: ds.getDouble('to_be_received_total_') },
        { name: '已清款', value: ds.getDouble('requested_total') },
        { name: '付款中', value: ds.getDouble('paying_total_') },
        { name: '已付款', value: ds.getDouble('paid_total_') }
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
        ds = this.state.monthlyPaymentData;
        ds.first();
        let dataArr = [{ name: '已生成', value: ds.getDouble('paid_total_') },
        { name: '未生成', value: ds.getDouble('no_paid_total_') }
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
                        [78, 40],
                        [143, 40],
                    ]
                }, {
                    coords: [
                        [164, 75],
                        [164, 103]
                    ]
                }, {
                    coords: [
                        [78, 123],
                        [146, 123]
                    ]
                }, {
                    coords: [
                        [253, 123],
                        [180, 123]
                    ]
                }, {
                    coords: [
                        [164, 155],
                        [164, 180],
                    ]
                }, {
                    coords: [
                        [164, 226],
                        [164, 265]
                    ]
                }, {
                    coords: [
                        [78, 282],
                        [143, 282]
                    ]
                }, {
                    coords: [
                        [183, 282],
                        [226, 282]
                    ]
                }, {
                    coords: [
                        [270, 328],
                        [270, 355]
                    ]
                }, {
                    coords: [
                        [221, 378],
                        [165, 378],
                        [165, 325]
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