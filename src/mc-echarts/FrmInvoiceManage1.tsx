import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmInvoiceManage1.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmInvoiceManage1TypeProps = {
    dataJson: string,
    introduction: string
}

type FrmInvoiceManage1TypeState = {
    dataJson: DataRow,
    invoiceStatusData: DataSet,
    invoiceReviewStatus: DataSet,
    applicationInvoiceData: DataSet,
}

export default class FrmInvoiceManage1 extends WebControl<FrmInvoiceManage1TypeProps, FrmInvoiceManage1TypeState> {
    constructor(props: FrmInvoiceManage1TypeProps) {
        super(props);
        let lineRow = new DataRow();
      
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            invoiceStatusData: new DataSet(),
            invoiceReviewStatus: new DataSet(),
            applicationInvoiceData: new DataSet(),
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
                            <div className={`${styles.MCtext} ${styles.stock10}`}>
                                <span>可用余额</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock1}`} onClick={this.linkTo.bind(this, '合同管理')}>
                                <span>合同管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应收对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '应收对账单')}>
                                <span>应收对账单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`物流订单管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock3}`} onClick={this.linkTo.bind(this, '物流订单管理')}>
                                <span>物流订单管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`物流运单管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock4}`} onClick={this.linkTo.bind(this, '物流运单管理')}>
                                <span>物流运单管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`发票管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '发票管理')}>
                                <span>发票管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`发票及支付申请_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '发票及支付申请')}>
                                <span>发票及支付申请</span>
                            </div>
                            <div className={styles.bdSkin}>
                                <div className={`${this.state.dataJson.getBoolean(`支付处理_Dis`) ? styles.other_disable : styles.other} ${styles.stock7}`} onClick={this.linkTo.bind(this, '支付处理')}>
                                    <span>支付处理</span>
                                </div>
                                <div className={`${this.state.dataJson.getBoolean(`发票申请审核_Dis`) ? styles.other_disable : styles.other} ${styles.stock8}`} onClick={this.linkTo.bind(this, '发票申请审核')}>
                                    <span>发票申请审核</span>
                                </div>
                                <div className={`${styles.MCtext} ${styles.stock9}`}>
                                    <span>网络货运公司</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>发票状态数据</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>发票审核状态</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>当周申请发票数据</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let invoiceStatusData = new DataSet();
        invoiceStatusData = await FplApi.statisticalInvoice();
        let invoiceReviewStatus = new DataSet();
        invoiceReviewStatus = await FplApi.reviewStatusInvoice();
        let applicationInvoiceData = new DataSet();
        applicationInvoiceData = await FplApi.thisWeekDataInvoice();
        this.setState({
            invoiceStatusData,
            invoiceReviewStatus,
            applicationInvoiceData
        })
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init()
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds = this.state.applicationInvoiceData;
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            sData.push(ds.getDouble('num'));
        }
        let option = {
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
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
        ds = this.state.invoiceReviewStatus;
        let dataArr = [
            { name: '已接受', value: ds.getDouble('record_data_') },
            { name: '已支付', value: ds.getDouble('pay_data_') },
            { name: '申请中', value: ds.getDouble('no_pay_data_') },
        ];
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: 'center',
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
        ds = this.state.invoiceStatusData;
        let dataArr = [
            { name: '已申请', value: ds.getDouble('apply_data_') },
            { name: '已接收', value: ds.getDouble('receive_data_') },
            { name: '已拒绝', value: ds.getDouble('refuse_data_') },
        ];
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: 'center',
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
                    coords: [ //合同管理往右线条
                        [135, 35],
                        [210, 35]
                    ]
                },
                {
                    coords: [ //合同管理往下线条
                        [111, 75],
                        [111, 120]
                    ]
                },
                {
                    coords: [ //物流订单管理往右线条
                        [135, 137],
                        [210, 137]
                    ]
                },
                {
                    coords: [ //物流订单管理往下线条
                        [111, 175],
                        [111, 220]
                    ]
                },
                {
                    coords: [ //物流运单管理往下线条
                        [234, 175],
                        [234, 220]
                    ]
                },
                {
                    coords: [ //发票及支付申请往下线条
                        [234, 290],
                        [234, 320]
                    ]
                },
                {
                    coords: [ //支付处理往上线条
                        [111, 320],
                        [111, 290]
                    ]
                },
                {
                    coords: [ //发票申请审核往左线条
                        [210, 345],
                        [135, 345]
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