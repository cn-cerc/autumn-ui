import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TAccMC.css";
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
                            <div className={`${this.state.dataJson.getBoolean(`会计科目表_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '会计科目表')}>
                                <span>会计科目表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`抛转规则设置_Dis`) ? styles.other_disable : styles.other} ${styles.stock3}`} onClick={this.linkTo.bind(this, '抛转规则设置')}>
                                <span>抛转规则设置</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`手工录入凭证_Dis`) ? styles.other_disable : styles.other} ${styles.stock4}`} onClick={this.linkTo.bind(this, '手工录入凭证')}>
                                <span>手工录入凭证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`会计凭证_Dis`) ? styles.other_disable : styles.other} ${styles.stock5}`} onClick={this.linkTo.bind(this, '会计凭证')}>
                                <span>会计凭证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`原始凭证_Dis`) ? styles.primeval_disable : styles.primeval} ${styles.stock6}`} onClick={this.linkTo.bind(this, '原始凭证')}>
                                <span>原始凭证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`期初开账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '期初开账单')}>
                                <span>期初开账单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`科目余额表_Dis`) ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '科目余额表')}>
                                <span>科目余额表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`资产负债表_Dis`) ? styles.control_disable : styles.control} ${styles.stock10}`} onClick={this.linkTo.bind(this, '资产负债表')}>
                                <span>资产负债表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`损益表_Dis`) ? styles.control_disable : styles.control} ${styles.stock11}`} onClick={this.linkTo.bind(this, '损益表')}>
                                <span>损益表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`现金流量表_Dis`) ? styles.control_disable : styles.control} ${styles.stock12}`} onClick={this.linkTo.bind(this, '现金流量表')}>
                                <span>现金流量表</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`银行存款余额_Dis`) ? styles.other_disable : styles.other} ${styles.stock13}`} onClick={this.linkTo.bind(this, '银行存款余额')}>
                                <span>银行存款余额</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`会计凭证_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock14}`} onClick={this.linkTo.bind(this, '会计凭证')}>
                                <span>会计凭证</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应付结账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock15}`} onClick={this.linkTo.bind(this, '应付结账单')}>
                                <span>应付结账单</span>
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
                    coords: [ //会计科目表 往下线条
                        [168, 75],
                        [168, 108]
                    ]
                },
                {
                    coords: [ //抛转规则设置 往下线条
                        [279, 75],
                        [279, 108]
                    ]
                },
                {
                    coords: [ //手工录入凭证 往右线条
                        [73, 123],
                        [150, 123],
                    ]
                },
                {
                    coords: [ //原始凭证 往右线条
                        [256, 123],
                        [190, 123],
                    ]
                },
                {
                    coords: [ //会计凭证 往下线条
                        [168, 160],
                        [168, 189]
                    ]
                },
                {
                    coords: [ //期初开账单 往右线条
                        [73, 210],
                        [150, 210],
                    ]
                },
                {
                    coords: [ //科目余额表 往左下线条
                        [168, 255],
                        [50, 255],
                        [50, 271]
                    ]
                },
                {
                    coords: [ //科目余额表 往下线条
                        [168, 247],
                        [168, 271]
                    ]
                },
                {
                    coords: [ //应付结账单 往上线条
                        [279, 349],
                        [279, 328],
                    ]
                },
                {
                    coords: [ //应付结账单 往上线条
                        [279, 338],
                        [168, 338],
                        [168, 349],
                    ]
                },
                {
                    coords: [ //应付结账单 往上线条
                        [168, 338],
                        [50, 338],
                        [50, 349],
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