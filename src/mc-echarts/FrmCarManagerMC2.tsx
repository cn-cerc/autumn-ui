import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmCarManagerMC2.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmCarManagerMC2TypeProps = {
    dataJson: string,
    introduction: string
}

type FrmCarManagerMC2TypeState = {
    dataJson: DataRow,
    vehicleState: DataSet,
    fleetVehicleType: DataRow,
    fleetVehiclesSummary: DataRow,
}

//车辆管理控制台 货主
export default class FrmCarManagerMC2 extends WebControl<FrmCarManagerMC2TypeProps, FrmCarManagerMC2TypeState> {
    constructor(props: FrmCarManagerMC2TypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            vehicleState: new DataSet(),
            fleetVehicleType: new DataRow(),
            fleetVehiclesSummary: new DataRow(),
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
                            <div className={`${this.state.dataJson.getBoolean(`车队管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock1}`} onClick={this.linkTo.bind(this, '车队管理')}>
                                <span>车队管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '司机管理')}>
                                <span>司机管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`司机认证_Dis`) ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '司机认证')}>
                                <span>司机认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`收款人管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '收款人管理')}>
                                <span>收款人管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`收款人认证_Dis`) ? styles.control_disable : styles.control} ${styles.stock6}`} onClick={this.linkTo.bind(this, '收款人认证')}>
                                <span>收款人认证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock7}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆类型维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock8}`} onClick={this.linkTo.bind(this, '车辆类型维护')}>
                                <span>车辆类型维护</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`维修记录_Dis`) ? styles.other_disable : styles.other} ${styles.stock10}`} onClick={this.linkTo.bind(this, '维修记录')}>
                                <span>维修记录</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`维修厂系统_Dis`) ? styles.other_disable : styles.other} ${styles.stock11}`} onClick={this.linkTo.bind(this, '维修厂系统')}>
                                <span>维修厂系统</span>
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
                            <div className={styles.mcTitle}>车队与车辆类型</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>车队与车辆汇总</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let vehicleState = new DataSet();
        vehicleState = await FplApi.getMoreThanOneWeekReport();
        let dataRow = await FplApi.getFleetCarCountReport();
        let fleetVehicleType = new DataRow();
        fleetVehicleType.copyValues(dataRow.head);
        let dataRow1 = await FplApi.getFleetDrivrCarPayeeReport();
        let fleetVehiclesSummary = new DataRow();
        fleetVehiclesSummary.copyValues(dataRow1.head);

        this.setState({
            vehicleState,
            fleetVehicleType,
            fleetVehiclesSummary
        })

        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
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

        myChart.on('click', function (params: any) {
            alert(params.name);
        })
    }


    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataRow();
        ds = this.state.fleetVehicleType;
        let dataArr: any = [
            { name: '自营车队', value: ds.getDouble('selfFleetCount') },
            { name: '托管车队', value: ds.getDouble('trusteeshipFleetCount') },
            { name: '自营车辆', value: ds.getDouble('selfCarCount') },
            { name: '托管车辆', value: ds.getDouble('trusteeshipCarCount') },
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

    initBarChart() {
        let barChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(barChart);
        let ds = new DataRow();
        ds = this.state.fleetVehiclesSummary;
        let nameArr = ['车队数量', '司机总数量', '车辆总数量 ', '收款人总数量 '],
            dataArr = [ds.getDouble('fleetCount'), ds.getDouble('driverCount'), ds.getDouble('carCount'), ds.getDouble('payeeCount')];
        let option = {
            grid: {
                top: 25,
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //车队管理 往右线条
                        [75, 40],
                        [143, 40]
                    ]
                },
                {
                    coords: [ //车队管理 往下线条
                        [50, 80],
                        [50, 220]
                    ]
                },
                {
                    coords: [ //司机管理 往右线条
                        [190, 40],
                        [256, 40]
                    ]
                },
                {
                    coords: [ //司机管理 往下线条
                        [169, 80],
                        [169, 130]
                    ]
                },
                {
                    coords: [ //收款人管理 往右线条
                        [190, 140],
                        [256, 140]
                    ]
                },
                {
                    coords: [ //车辆类型维护 往左线条
                        [143, 240],
                        [75, 240]
                    ]
                },
                {
                    coords: [ //车辆管理 往下线条
                        [50, 280],
                        [50, 320]
                    ]
                },
                {
                    coords: [ //维修厂系统 往左线条
                        [143, 340],
                        [75, 340]
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