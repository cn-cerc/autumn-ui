import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import styles from "./FrmChargeManage.css";
import { MCChartColors } from "./FrmTaurusMC";

// diteng-finance
type FrmChargeManageTypeProps = {

}

type FrmChargeManageTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataRow: DataRow,
    introduction: string
}

export default class FrmChargeManage extends WebControl<FrmChargeManageTypeProps, FrmChargeManageTypeState> {
    constructor(props: FrmChargeManageTypeProps) {
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
        let dataRow: DataRow = lineRow.setValue("费用请购单_URL", "")
            .setValue("费用请购单_Dis", false)
            .setValue("费用报销单_URL", "")
            .setValue("费用报销单_Dis", false)
            .setValue("费用进货单_URL", "")
            .setValue("费用进货单_Dis", false)
            .setValue("付款(申请)单_URL", "")
            .setValue("付款(申请)单_Dis", false)
            .setValue("报废单_URL", "")
            .setValue("报废单_Dis", false)
            .setValue("办公用品库存表_URL", "")
            .setValue("办公用品库存表_Dis", false)
            .setValue("会计凭证_URL", "TFrmAccBook")
            .setValue("会计凭证_Dis", false)
            .setValue("还库单_URL", "")
            .setValue("还库单_Dis", false)
            .setValue("领用单_URL", "")
            .setValue("领用单_Dis", false)
            .setValue("个人领用报表_URL", "")
            .setValue("个人领用报表_Dis", false);
        let introduction = "本模组主要提供人事资料的管理，由于每一家企业的性质与规模不同，此模组在实际使用时，会根据每家企业的特点与需求进行定制开发。当前模组默认的只是提供了最为基础的数据管理，并为定制开发做好了准备。";

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
                            <div className={`${this.state.dataRow.getBoolean('费用请购单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '费用请购单')}>
                                <span>费用请购单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('费用报销单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '费用报销单')}>
                                <span>费用报销单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('费用进货单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '费用进货单')}>
                                <span>费用进货单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('付款(申请)单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '付款(申请)单')}>
                                <span>付款(申请)单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('报废单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '报废单')}>
                                <span>报废单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('办公用品库存表_Dis') ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '办公用品库存表')}>
                                <span>办公用品库存表</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('会计凭证_Dis') ? styles.other_disable : styles.other} ${styles.stock9}`} onClick={this.linkTo.bind(this, '会计凭证')}>
                                <span>会计凭证</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('还库单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock10}`} onClick={this.linkTo.bind(this, '还库单')}>
                                <span>还库单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('领用单_Dis') ? styles.receipt_disable : styles.receipt} ${styles.stock11}`} onClick={this.linkTo.bind(this, '领用单')}>
                                <span>领用单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean('个人领用报表_Dis') ? styles.control_disable : styles.control} ${styles.stock14}`} onClick={this.linkTo.bind(this, '个人领用报表')}>
                                <span>个人领用报表</span>
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

    async init() {
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
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
                    coords: [ //费用请购单 往下线条
                        [168, 75],
                        [168, 108]
                    ]
                },
                {
                    coords: [ //费用报销单 往下线条
                        [278, 75],
                        [278, 108]
                    ]
                },
                {
                    coords: [ //费用进货单 往右线条
                        [190, 123],
                        [256, 123],
                    ]
                },
                {
                    coords: [ //费用进货单 往下线条
                        [168, 160],
                        [168, 189]
                    ]
                },
                {
                    coords: [ //付款（申请）单 往下线条
                        [278, 160],
                        [278, 189]
                    ]
                },
                {
                    coords: [ //办公用品库存表 往左线条
                        [150, 210],
                        [73, 210],
                    ]
                },
                {
                    coords: [ //办公用品库存表 往下线条
                        [168, 247],
                        [168, 271]
                    ]
                },
                {
                    coords: [ //领用单 往左线条
                        [150, 290],
                        [73, 290]
                    ]
                },
                {
                    coords: [ //领用单 往下线条
                        [168, 328],
                        [168, 349]
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
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }
}