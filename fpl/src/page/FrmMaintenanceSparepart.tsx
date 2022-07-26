import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmMaintenanceSparepart.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import FplPageApi from "./FplPageApi";
import Introduction from "./Introduction";

type FrmMaintenanceSparepartTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmMaintenanceSparepartTypeState = {
    dataJson: DataRow,
    topFiveBrand: DataSet,
    topFiveMountings: DataSet,
    topFiveClassifyMountings: DataSet,
    nowExistMountings: DataSet
}

export default class FrmMaintenanceSparepart extends WebControl<FrmMaintenanceSparepartTypeProps, FrmMaintenanceSparepartTypeState> {
    constructor(props: FrmMaintenanceSparepartTypeProps) {
        super(props);
        let lineData = new DataSet();
        let dataJson = new DataRow();
        dataJson.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            topFiveBrand: new DataSet(),
            topFiveMountings: new DataSet(),
            topFiveClassifyMountings: new DataSet(),
            nowExistMountings: new DataSet(),

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
                            <div className={`${this.state.dataJson.getBoolean(`品牌维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '品牌维护')}>
                                <span>品牌维护</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`车辆管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '车辆管理')}>
                                <span>车辆管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`分类维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock6}`} onClick={this.linkTo.bind(this, '分类维护')}>
                                <span>分类维护</span>
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
                            <div className={styles.mcTitle}>品牌数据</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>零配件使用统计</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcPieChart1}>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>配件分类统计</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                        <div className={styles.mcPieBox4}>
                            <div className={styles.mcTitle}>当前零配件存在统计</div>
                            <div className={styles.FrmTaurusMCPie4}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let topFiveBrand = new DataSet();
        topFiveBrand = await FplPageApi.getPartByBrandReport();
        let topFiveMountings = new DataSet();
        topFiveMountings = await FplPageApi.getPartToUse();
        let topFiveClassifyMountings = new DataSet();
        topFiveClassifyMountings = await FplPageApi.getPartByClass1Report();
        let nowExistMountings = new DataSet();
        nowExistMountings = await FplPageApi.getPartReport();


        this.setState({
            topFiveBrand,
            topFiveMountings,
            topFiveClassifyMountings,
            nowExistMountings
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
        let ds: DataSet = this.state.topFiveBrand;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Brand_'),
                value: ds.getDouble('brand_total_')
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

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds: DataSet = this.state.topFiveMountings;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('desc_'),
                value: ds.getDouble('use_total_')
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
        ds = this.state.topFiveClassifyMountings;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Class1_'),
                value: ds.getDouble('class_total_')
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
        ds = this.state.nowExistMountings;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Desc_'),
                value: ds.getDouble('AvaiStock_')
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //客户管理 往右线条
                        [190, 40],
                        [256, 40],
                    ]
                },
                {
                    coords: [ //品牌维护 往右下线条
                        [295, 40],
                        [320, 40],
                        [320, 242],
                        [295, 242],
                    ]
                },
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
                    coords: [ //分类维护 往下线条
                        [278, 180],
                        [278, 220],
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