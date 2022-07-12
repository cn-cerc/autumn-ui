import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmMaintenanceBook.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import FplPageApi from "./FplPageApi";
import Introduction from "./Introduction";

type FrmMaintenanceBookTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmMaintenanceBookTypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    pieData2: DataSet,
    dataJson: DataRow,
    introduction: string,
    topFiveAmountReport: DataSet,
    settlementType: DataSet,
    cusRepairingVehicle: DataSet,
    cusOneMonthReport: DataSet,
}

export default class FrmMaintenanceBook extends WebControl<FrmMaintenanceBookTypeProps, FrmMaintenanceBookTypeState> {
    constructor(props: FrmMaintenanceBookTypeProps) {
        super(props);
        let lineData = new DataSet();
        let dataJson = new DataRow();
        dataJson.setJson(this.props.dataJson);
        lineData.append().setValue('Value_', 300).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 285).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 220).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 360).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 28).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 12).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 8).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 12).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '重型卡车');
        this.state = {
            lineData,
            pieData1,
            pieData2,
            dataJson: dataJson,
            introduction: this.props.introduction,
            topFiveAmountReport: new DataSet(),
            settlementType: new DataSet(),
            cusRepairingVehicle: new DataSet(),
            cusOneMonthReport: new DataSet(),
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
                            <div className={`${this.state.dataJson.getBoolean(`客户管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '客户管理')}>
                                <span>客户管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`扫一扫_Dis`) ? styles.other_disable : styles.other} ${styles.stock7}`} onClick={this.linkTo.bind(this, '扫一扫')}>
                                <span>扫一扫</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`新增维修单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '新增维修单')}>
                                <span>新增维修单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`零配件管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '零配件管理')}>
                                <span>零配件管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`维修单管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock11}`} onClick={this.linkTo.bind(this, '维修单管理')}>
                                <span>维修单管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`月结收款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock12}`} onClick={this.linkTo.bind(this, '月结收款单')}>
                                <span>月结收款单</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcPieChart1}>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                        <div className={styles.mcPieBox4}>
                            <div className={styles.mcTitle}>比例图（开发中）</div>
                            <div className={styles.FrmTaurusMCPie4}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let settlementType = new DataSet();
        settlementType = await FplPageApi.getStatisticsByMonth();
        let topFiveAmountReport = new DataSet();
        topFiveAmountReport = await FplPageApi.getCusByAmountReport();
        let cusRepairingVehicle = new DataSet();
        cusRepairingVehicle = await FplPageApi.getCusByCodeToCountReport();
        let cusOneMonthReport = new DataSet();
        cusOneMonthReport = await FplPageApi.getMoreThanOneMonthReport();

        this.setState({
            settlementType,
            topFiveAmountReport,
            cusRepairingVehicle,
            cusOneMonthReport
        })

        this.initPieChart1();
        this.initPieChart2();
        this.initPieChart3();
        this.initPieChart4();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
    }

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.settlementType;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
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
        ds = this.state.cusRepairingVehicle;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('ShortName_'),
                value: ds.getDouble('maint_count_')
            })
        }
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
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.topFiveAmountReport;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
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

    initPieChart4() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie4}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.cusOneMonthReport;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('ShortName_'),
                value: ds.getDouble('Value_')
            })
        }
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
                // formatter: (name: any) => {
                //     let singleData = dataArr.filter(function (item: any) {
                //         return item.name == name
                //     })
                //     return name + ' : ' + singleData[0].value;
                // },
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
                    coords: [ //客户管理 往下线条
                        [169, 79],
                        [169, 120],
                    ]
                },
                {
                    coords: [ //车辆管理 往下线条
                        [169, 180],
                        [169, 220],
                    ]
                },
                {
                    coords: [ //扫一扫 往右线条
                        [70, 242],
                        [150, 242],
                    ]
                }, {
                    coords: [ //零配件管理 往左线条
                        [256, 242],
                        [190, 242],
                    ]
                }, {
                    coords: [ //新增维修单 往下线条
                        [169, 280],
                        [169, 320],
                    ]
                },
                {
                    coords: [ //维修单管理 往右线条
                        [190, 341],
                        [256, 341],
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