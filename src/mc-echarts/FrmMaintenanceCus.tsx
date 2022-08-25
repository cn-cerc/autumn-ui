import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmMaintenanceCus.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmMaintenanceCusTypeProps = {

}

type FrmMaintenanceCusTypeState = {
    dataRow: DataRow,
    topFiveAmountReport: DataSet,
    settlementType: DataSet,
    cusRepairingVehicle: DataSet,
    cusOneMonthReport: DataSet,
    introduction: string
}

export default class FrmMaintenanceCus extends WebControl<FrmMaintenanceCusTypeProps, FrmMaintenanceCusTypeState> {
    constructor(props: FrmMaintenanceCusTypeProps) {
        super(props);
        let dataRow = new DataRow();
        dataRow.setValue("新增客户_URL", "FrmCusInfo.append")
        .setValue("新增客户_Dis", false)
        .setValue("客户管理_URL", "FrmCusInfo")
        .setValue("客户管理_Dis", false)
        .setValue("申请互联管理_URL", "FrmLinkApplyList")
        .setValue("申请互联管理_Dis", true)
        .setValue("车辆管理_URL", "FrmVehicle")
        .setValue("车辆管理_Dis", false)
        .setValue("互联申请_URL", "")
        .setValue("互联申请_Dis", true)
        .setValue("扫一扫_URL", "")
        .setValue("扫一扫_Dis", true)
        .setValue("新增维修单_URL", "FrmMaintainMA.selectNumPlate")
        .setValue("新增维修单_Dis", false)
        .setValue("零配件管理_URL", "FrmPartInfo")
        .setValue("零配件管理_Dis", false)
        .setValue("维修单管理_URL", "FrmMaintainMA")
        .setValue("维修单管理_Dis", false)
        .setValue("月结收款单_URL", "FrmAccountsMS")
        .setValue("月结收款单_Dis", false);
        let introduction = "主要是对维修厂的客户进行维护，可以进行客户添加，修改、停用以及互联等功能，是其它功能正常作业的基础。";
        
        this.state = {
            dataRow,
            topFiveAmountReport: new DataSet(),
            settlementType: new DataSet(),
            cusRepairingVehicle: new DataSet(),
            cusOneMonthReport: new DataSet(),
            introduction
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataRow.getBoolean(`新增客户_Dis`) ? styles.other_disable : styles.other} ${styles.stock1}`} onClick={this.linkTo.bind(this, '新增客户')}>
                                <span>新增客户</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`客户管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '客户管理')}>
                                <span>客户管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`申请互联管理_Dis`) ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '申请互联管理')}>
                                <span>申请互联管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`车辆管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`互联申请_Dis`) ? styles.other_disable : styles.other} ${styles.stock6}`} onClick={this.linkTo.bind(this, '互联申请')}>
                                <span>互联申请</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`扫一扫_Dis`) ? styles.other_disable : styles.other} ${styles.stock7}`} onClick={this.linkTo.bind(this, '扫一扫')}>
                                <span>扫一扫</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`新增维修单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '新增维修单')}>
                                <span>新增维修单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`零配件管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock9}`} onClick={this.linkTo.bind(this, '零配件管理')}>
                                <span>零配件管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`维修单管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock11}`} onClick={this.linkTo.bind(this, '维修单管理')}>
                                <span>维修单管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`月结收款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock12}`} onClick={this.linkTo.bind(this, '月结收款单')}>
                                <span>月结收款单</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>结算类型</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>客户维修车辆统计</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcPieChart1}>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>客户维修金额统计</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                        <div className={styles.mcPieBox4}>
                            <div className={styles.mcTitle}>近一月未维修客户</div>
                            <div className={styles.FrmTaurusMCPie4}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let settlementType = new DataSet();
        settlementType = await FplApi.getCusByMonthReport();
        let topFiveAmountReport = new DataSet();
        topFiveAmountReport = await FplApi.getCusByAmountReport();
        let cusRepairingVehicle = new DataSet();
        cusRepairingVehicle = await FplApi.getCusByCodeToCountReport();
        let cusOneMonthReport = new DataSet();
        cusOneMonthReport = await FplApi.getMoreThanOneMonthReport();

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
        let dataArr: any = [
            { name: '月结', value: ds.getDouble('monthly_total_') },
            { name: '现结', value: ds.getDouble('cash_total_') }
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
        let ds = new DataSet();
        ds = this.state.cusRepairingVehicle;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('ShortName_'),
                value: ds.getDouble('maint_total_')
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

        myChart.on('click', function (params: any) {
            alert(params.name);
        })
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
                name: ds.getString('ShortName_'),
                value: ds.getDouble('amount_total_')
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

        myChart.on('click', function (params: any) {
            alert(params.name);
        })
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //新增客户 往右线条
                        [70, 40],
                        [150, 40],
                    ]
                }, {
                    coords: [ //客户管理 往右线条
                        [190, 40],
                        [256, 40],
                    ]
                },
                {
                    coords: [ //客户管理 往下线条
                        [169, 79],
                        [169, 120],
                    ]
                },
                {
                    coords: [ //申请互联网管理 往下线条
                        [278, 79],
                        [278, 120],
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
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }
}