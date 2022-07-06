import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./myMC.css";
import moduleMenu from "./UIModuleMenu";

type myMCTypeProps = {
    dataJson: string,
    introduction: string
}

type myMCTypeState = {
    dataJson: DataRow,
    introduction: string,
    data: DataSet,
    title: string,
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
}

export default class myMC extends WebControl<myMCTypeProps, myMCTypeState> {
    constructor(props: myMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        let data = new DataSet();
        data.append().setValue('img_', 'images/MCimg/myManagement/ggmm.png').setValue('name_', '更改密码')
            .append().setValue('img_', 'images/MCimg/myManagement/sszl.png').setValue('name_', '设置资料')
            .append().setValue('img_', 'images/MCimg/myManagement/ssxh.png').setValue('name_', '设置喜好')
            .append().setValue('img_', 'images/MCimg/myManagement/dqdj.png').setValue('name_', '代签单据')
            .append().setValue('img_', 'images/MCimg/myManagement/cgdj.png').setValue('name_', '草稿单据')
            .append().setValue('img_', 'images/MCimg/myManagement/szdy.png').setValue('name_', '设置打印')
            .append().setValue('img_', 'images/MCimg/myManagement/yjsz.png').setValue('name_', '预警设置')
            .append().setValue('img_', 'images/MCimg/myManagement/xxgl.png').setValue('name_', '消息管理');
        let lineData = new DataSet();
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
        this.state = {
            title: '常用功能',
            data: data,
            dataJson: dataJson,
            introduction: this.props.introduction,
            lineData,
            pieData1,
            pieData2,
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
                    <div className={styles.mcFlowChartMain}>
                        {
                            React.createElement(moduleMenu, {
                                title: this.state.title,
                                data: this.state.data,
                                dataJson: this.state.dataJson
                            })
                        }
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>操作日志（开发中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>今日处理工作（开发中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>在线时间（开发中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                        <div className={styles.btnBox}>
                            本月 <img src="images/barArrow.png" alt="" className={styles.btn_arrow} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
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
                right: '20%',
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
                top: 25,
                right: 10,
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
                top: 25,
                right: 10,
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
}