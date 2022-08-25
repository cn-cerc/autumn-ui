import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./Frm4PLCusManage.css";
import { MCChartColors } from "./FrmTaurusMC";

type Frm4PLCusManageypeProps = {

}

type Frm4PLCusManageypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataRow: DataRow,
    introduction: string
}

export default class Frm4PLCusManage extends WebControl<Frm4PLCusManageypeProps, Frm4PLCusManageypeState> {
    constructor(props: Frm4PLCusManageypeProps) {
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
        let dataRow: DataRow = lineRow.setValue("客户列表_URL", "TFrmCusInfo")
            .setValue("客户列表_Dis", false)
            .setValue("收款人信息审核_URL", "FrmPayeeCertification")
            .setValue("收款人信息审核_Dis", false)
            .setValue("合同登记_URL", "FrmContract.selectContractType")
            .setValue("合同登记_Dis", false)
            .setValue("应收对账单_URL", "FrmTranCRBill")
            .setValue("应收对账单_Dis", false)
            .setValue("物流运单管理_URL", "FrmArrangeCar")
            .setValue("物流运单管理_Dis", false)
            .setValue("审核发票申请_URL", "FrmInvoiceApplyNew")
            .setValue("审核发票申请_Dis", false)
            .setValue("上传发票照片_URL", "")
            .setValue("上传发票照片_Dis", false)
            .setValue("寄出发票_URL", "")
            .setValue("寄出发票_Dis", true);
        let introduction = "主要用于登记，修改客户信息，是其他功能正常作业的基础。";

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
                            <div className={`${this.state.dataRow.getBoolean(`客户列表_Dis`) ? styles.other_disable : styles.other} ${styles.stock1}`} onClick={this.linkTo.bind(this, '客户列表')}>
                                <span>客户列表</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`收款人信息审核_Dis`) ? styles.control_disable : styles.control} ${styles.stock2}`} onClick={this.linkTo.bind(this, '收款人信息审核')}>
                                <span>收款人信息审核</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`合同登记_Dis`) ? styles.register_disable : styles.register} ${styles.stock3}`} onClick={this.linkTo.bind(this, '合同登记')}>
                                <span>合同登记</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应收对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '应收对账单')}>
                                <span>应收对账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`物流运单管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock5}`} onClick={this.linkTo.bind(this, '物流运单管理')}>
                                <span>物流运单管理</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`审核发票申请_Dis`) ? styles.other_disable : styles.other} ${styles.stock6}`} onClick={this.linkTo.bind(this, '审核发票申请')}>
                                <span>审核发票申请</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`上传发票照片_Dis`) ? styles.other_disable : styles.other} ${styles.stock8}`} onClick={this.linkTo.bind(this, '上传发票照片')}>
                                <span>上传发票照片</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`寄出发票_Dis`) ? styles.other_disable : styles.other} ${styles.stock10}`} onClick={this.linkTo.bind(this, '寄出发票')}>
                                <span>寄出发票</span>
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
                    coords: [ //客户列表 往下线条
                        [111, 75],
                        [111, 105],
                    ]
                },
                {
                    coords: [ //客户列表 往右线条
                        [133, 35],
                        [198, 35],
                    ]
                },
                {
                    coords: [ //合同登记 往下线条
                        [111, 159],
                        [111, 189]
                    ]
                },
                {
                    coords: [ //合同登记 往右线条
                        [133, 120],
                        [198, 120],
                    ]
                }, {
                    coords: [ //物流运单管理 往右线条
                        [133, 207],
                        [198, 207],
                    ]
                }, {
                    coords: [ //审核发票申请 往下线条
                        [219, 244],
                        [219, 275]
                    ]
                }, {
                    coords: [ //上传发票照片 往下线条
                        [219, 330],
                        [219, 360]
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
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }
}