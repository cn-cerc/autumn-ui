import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmAuthManageMC.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import Introduction from "./Introduction";
import FplPageApi from "./FplPageApi";

type FrmAuthManageMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmAuthManageMCTypeState = {
    dataJson: DataRow,
    DriverStatistics: DataSet,
    CorpStatistics: DataSet,
    payeeStatistics: DataSet,
}

export default class FrmAuthManageMC extends WebControl<FrmAuthManageMCTypeProps, FrmAuthManageMCTypeState> {
    constructor(props: FrmAuthManageMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            DriverStatistics: new DataSet(),
            CorpStatistics: new DataSet(),
            payeeStatistics: new DataSet(),
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
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>收款人统计</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>司机人数统计</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>司机认证前五统计</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let DriverStatistics = new DataSet();
        DriverStatistics = await FplPageApi.queryDriverStatistics();
        let CorpStatistics = new DataSet();
        CorpStatistics = await FplPageApi.queryCorpStatistics();
        let payeeStatistics = new DataSet();
        payeeStatistics = await FplPageApi.queryDataStat();

        this.setState({
            DriverStatistics,
            CorpStatistics,
            payeeStatistics
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
        ds = this.state.CorpStatistics;
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('corp_no_'));
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
        ds = this.state.payeeStatistics;
        ds.first();
        let dataArr: any = [
            { name: '已登记', value: ds.getDouble('registered') },
            { name: '已认证', value: ds.getDouble('certified') }
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
        ds = this.state.DriverStatistics;
        ds.first();
        let dataArr: any = [
            { name: '未审核', value: ds.getDouble('未审核') },
            { name: '已审核', value: ds.getDouble('已审核') },
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

        // myChart.on('click', function (params: any) {
        //     alert(params.name);
        // })
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