import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmCarManagerMC.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import Introduction from "./Introduction";

type FrmCarManagerMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmCarManagerMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataJson: DataRow,
}
//车辆管理控制台 货主

export default class FrmCarManagerMC extends WebControl<FrmCarManagerMCTypeProps, FrmCarManagerMCTypeState> {
    constructor(props: FrmCarManagerMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let lineRow = new DataRow();
        lineData.append().setValue('Value_', 258).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 240).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 350).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 11).setValue('Name_', '品牌名1');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名2');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名3');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名4');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 10).setValue('Name_', '湖北省');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '广西省');
        pieData2.append().setValue('Value_', 30).setValue('Name_', '湖南省');
        pieData2.append().setValue('Value_', 15).setValue('Name_', '广东省');
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            lineData,
            pieData1,
            pieData2,
            dataJson: dataJson,
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
                            <div className={styles.mcTitle}>比例图（对接中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>比例图（对接中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>比例图（对接中）</div>
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

    initBarChart() {
        let barChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(barChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.lineData);
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