import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmCashManage.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmCashManageTypeProps = {

}

type FrmCashManageTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataRow: DataRow,
    introduction: string
}

export default class FrmCashManage extends WebControl<FrmCashManageTypeProps, FrmCashManageTypeState> {
    constructor(props: FrmCashManageTypeProps) {
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
        let dataRow: DataRow = lineRow.setValue("应收结账单_URL", "FrmTranCRBill")
            .setValue("应收结账单_Dis", false)
            .setValue("请款单_URL", "")
            .setValue("请款单_Dis", true)
            .setValue("收款单_URL", "TFrmPaidAR")
            .setValue("收款单_Dis", false)
            .setValue("应付结账单_URL", "FrmTranCPBill")
            .setValue("应付结账单_Dis", false)
            .setValue("付款申请单_URL", "TFrmPaidAP")
            .setValue("付款申请单_Dis", false)
            .setValue("付款单_URL", "TFrmPaidAP")
            .setValue("付款单_Dis", false)
            .setValue("转账单_URL", "TFrmPaidBM")
            .setValue("转账单_Dis", false)
            .setValue("银行账户表_URL", "TFrmBankInfo")
            .setValue("银行账户表_Dis", false)
            .setValue("对账单_URL", "")
            .setValue("对账单_Dis", true);
        let introduction = "资金管理是社会主义国家对国营企业资金来源和资金使用进行计划、控制、监督、考核等项工作的总称。财务管理的重要组成部分。资金管理包括固定资金管理、流动资金管理和专项资金管理。";

        this.state = {
            lineData,
            pieData1,
            pieData2,
            dataRow,
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
                            <div className={`${this.state.dataRow.getBoolean(`应收结账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock1}`} onClick={this.linkTo.bind(this, '应收结账单')}>
                                <span>应收结账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`请款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '请款单')}>
                                <span>请款单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`收款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '收款单')}>
                                <span>收款单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应付结账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '应付结账单')}>
                                <span>应付结账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`付款申请单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '付款申请单')}>
                                <span>付款申请单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`付款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '付款单')}>
                                <span>付款单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`转账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '转账单')}>
                                <span>转账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`银行账户表_Dis`) ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '银行账户表')}>
                                <span>银行账户表</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock9}`} onClick={this.linkTo.bind(this, '对账单')}>
                                <span>对账单</span>
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
                top: 'center',
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
                top: 'center',
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //应收结账单 往右线条
                        [73, 38],
                        [150, 38],
                    ]
                },
                {
                    coords: [ //请款单 往右线条
                        [190, 38],
                        [256, 38],
                    ]
                },
                {
                    coords: [ //应付结账单 往右线条
                        [73, 123],
                        [150, 123],
                    ]
                },
                {
                    coords: [ //付款申请单 往右线条
                        [190, 123],
                        [256, 123],
                    ]
                },
                {
                    coords: [ //转账单 往右线条
                        [73, 210],
                        [150, 210],
                    ]
                },
                {
                    coords: [ //银行账户表 往右线条
                        [190, 210],
                        [256, 210],
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
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }
}