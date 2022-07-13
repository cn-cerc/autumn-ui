import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./hrMC.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import Introduction from "./Introduction";

type TPurMCTypeProps = {
    dataJson: string,
    introduction: string
}

type TPurMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataJson: DataRow,
}

export default class FrmTaurusMC extends WebControl<TPurMCTypeProps, TPurMCTypeState> {
    constructor(props: TPurMCTypeProps) {
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
        pieData1.append().setValue('Value_', 10).setValue('Name_', '湖北省');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '广西省');
        pieData1.append().setValue('Value_', 30).setValue('Name_', '湖南省');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '广东省');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 11).setValue('Name_', '女生');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '男生');
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
                            <div className={`${this.state.dataJson.getBoolean(`部门资料_Dis`) ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '部门资料')}>
                                <span>部门资料</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`员工管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock3}`} onClick={this.linkTo.bind(this, '员工管理')}>
                                <span>员工管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock4}`} onClick={this.linkTo.bind(this, '合同管理')}>
                                <span>合同管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`考勤管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '考勤管理')}>
                                <span>考勤管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`出差考勤_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '出差考勤')}>
                                <span>出差考勤</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`薪资管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock7}`} onClick={this.linkTo.bind(this, '薪资管理')}>
                                <span>薪资管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`薪资标准_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock8}`} onClick={this.linkTo.bind(this, '薪资标准')}>
                                <span>薪资标准</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`部门成本_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock9}`} onClick={this.linkTo.bind(this, '部门成本')}>
                                <span>部门成本</span>
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
        this.initLineChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    initLineChart() {
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
            lengend: {},
            tooltip: {},
            grid: {
                top: 10,
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
                orient:'vertical',
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
                orient:'vertical',
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
                    coords: [ //部门资料 往下线条
                        [111, 75],
                        [111, 105],
                    ]
                },
                {
                    coords: [ //员工管理 往下线条
                        [111, 160],
                        [111, 185],
                    ]
                },
                {
                    coords: [ //合同管理 往左线条
                        [198, 125],
                        [133, 125],
                    ]
                }, {
                    coords: [ //出差考勤 往左线条
                        [198, 207],
                        [133, 207]
                    ]
                }, {
                    coords: [ //考勤管理 往下线条
                        [111, 244],
                        [111, 275]
                    ]
                }, {
                    coords: [ //薪资管理 往下线条
                        [111, 330],
                        [111, 360]
                    ]
                }, {
                    coords: [ //薪资标准 往左线条
                        [200, 293],
                        [133, 293]
                    ]
                }, {
                    coords: [ //部门成本 往左下线条
                        [219, 330],
                        [219, 375],
                        [140, 375]
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