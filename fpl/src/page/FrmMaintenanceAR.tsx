import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmMaintenanceAR.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";

type FrmTaurusMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmTaurusMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    pieData2: DataSet,
    linkRow: DataRow,
    introduction: string
}

export default class FrmMaintenanceAR extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        lineData.append().setValue('Value_', 150).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 250).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 180).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 190).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 250).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 200).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 13).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 19).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 13).setValue('Name_', '1');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '2');
        pieData2.append().setValue('Value_', 19).setValue('Name_', '3');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '4');
        pieData2.append().setValue('Value_', 35).setValue('Name_', '5');
        pieData2.append().setValue('Value_', 10).setValue('Name_', '6');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '7');
        this.state = {
            lineData,
            pieData1,
            pieData2,
            linkRow,
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
                            <div className={styles.mcTitle}>比例图</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>比例图</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>趋势图</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    initBarChart() {
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
                data: ['产品部', '人事部', '营销部', '设计部', '技术部'],
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
                top: 15,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    name: '售出',
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
        ds.appendDataSet(this.state.pieData1);
        ds.first();
        let dataArr = [];
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
                    // name: '本周货运吨数占比',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
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
        ds.appendDataSet(this.state.pieData2);
        ds.first();
        let dataArr = [];
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
            },
            series: [
                {
                    // name: '本周货运车辆占比',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
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