import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmSpectaculars2.css";
import * as echarts from "echarts";

type FrmSpectaculars2TypeProps = {
}

type FrmSpectaculars2TypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmSpectaculars2 extends WebControl<FrmSpectaculars2TypeProps, FrmSpectaculars2TypeState> {
    constructor(props: FrmSpectaculars2TypeProps) {
        super(props);
        let lineData = new DataSet();
        lineData.append().setValue('Value_', 28).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 20).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 35).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 10).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 30).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 11).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '重型卡车');
        this.state = {
            lineData,
            pieData1,
            pieData2,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>安全监控中心</p>
            </div>
            <div className={styles.mcMain}>
                <ul className={styles.top_list}>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>交易金额</div>
                            <div className={styles.topInfo}>
                                666 <span>辆</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/3.png" alt="" />
                        </div>
                    </li>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>安全监控中心</div>
                            <div className={styles.topInfo}>
                                666 <span>辆</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/2.png" alt="" />
                        </div>
                    </li>
                </ul>
                <div className={styles.contentEcharts}>
                    <div className={styles.leftSiteEcharts}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>安全学习</div>
                            <div className={styles.leftScrollList}>
                                <div className={styles.leftScrollListItem}>
                                    <img src="images/MCimg/1.png" alt="" />
                                    事故通报A
                                </div>
                                <div className={styles.leftScrollListItem}>
                                    <img src="images/MCimg/1.png" alt="" />
                                    事故通报A
                                </div>
                                <div className={styles.leftScrollListItem}>
                                    <img src="images/MCimg/1.png" alt="" />
                                    事故通报A
                                </div>
                            </div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>违章率</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>事故率</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        <div className={styles.mcMapBox}>
                            <div className={styles.mcMap}>
                                <ul>
                                    <li className={styles.imgItem}><img src="images/easypic-phone.jpg" alt="" /></li>
                                    <li className={styles.imgItem}><img src="images/app-img2.png" alt="" /></li>
                                    <li className={styles.imgItem}><img src="images/app-img1.png" alt="" /></li>
                                    <li className={styles.imgItem}><img src="images/easypic-phone.jpg" alt="" /></li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.mcLinkBox}>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>异常情况</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.srcollListBox}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 14:56 <span className={styles.colorSkin}>粤AW22C6</span> 行驶超速
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initLineChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initPieChart3();
    }

    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
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
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0],
                        width: 5
                    },
                    label: {
                        // show: true,
                        position: 'top'
                    },
                },
                {
                    data: [58, 310, 221, 30, 281, 290, 29],
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1],
                        width: 5
                    },
                    label: {
                        // show: true,
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
                orient: 'vertical',
                top: 0,
                right: 0,
                fontSize: 12
            },
            grid: {
                top: 40,
                left: 5,
                bottom: 5,
                right: 50,
                containLabel: true,
            },
            series: [
                {
                    name: '本周货运吨数占比',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['30%', '50%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        length: 5,
                        length2: 5,
                        maxSurfaceAngle: 80
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
            // title: {
            //     text: '本周货运车辆占比',
            //     left: 'center',
            //     textStyle: {
            //         fontSize: 14
            //     },
            //     top: '16'
            // },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: '本周货运车辆占比',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {},
                    data: dataArr
                }
            ]
        }
        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        // ds.appendDataSet(this.state.pieData2);
        // ds.first();
        // let dataArr = [];
        // while (ds.fetch()) {
        //     dataArr.push({
        //         name: ds.getString('Name_'),
        //         value: ds.getDouble('Value_')
        //     })
        // }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 60,
                    splitNumber: 12,
                    itemStyle: {
                        color: '#FFAB91'
                    },
                    progress: {
                        show: true,
                        width: 10
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            width: 10
                        }
                    },
                    axisTick: {
                        distance: -17,
                        splitNumber: 3,
                        lineStyle: {
                            width: 1,
                            color: '#999'
                        }
                    },
                    splitLine: {
                        distance: -15,
                        length: 3,
                        lineStyle: {
                            width: 1,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: -10,
                        color: '#999',
                        fontSize: 8
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        valueAnimation: true,
                        width: '60%',
                        lineHeight: 4,
                        borderRadius: 4,
                        offsetCenter: [0, '3%'],
                        fontSize: 10,
                        fontWeight: 'bolder',
                        formatter: '{value} °C',
                        color: 'auto'
                    },
                    data: [
                        {
                            value: 20
                        }
                    ]
                },
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 60,
                    itemStyle: {
                        color: '#FD7347'
                    },
                    progress: {
                        show: true,
                        width: 8
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    detail: {
                        show: false
                    },
                    data: [
                        {
                            value: 20
                        }
                    ]
                }
            ]
        }

        setInterval(function () {
            const random = +(Math.random() * 60).toFixed(2);
            myChart.setOption({
                series: [
                    {
                        data: [
                            {
                                value: random
                            }
                        ]
                    },
                    {
                        data: [
                            {
                                value: random
                            }
                        ]
                    }
                ]
            });
        }, 2000);
        //@ts-ignore
        myChart.setOption(option);
    }

    linkTo(name: string) {
        // if(!this.state.dataJson.getBoolean(`${name}_Dis`)){
        //     location.href = this.state.dataJson.getString(`${name}_URL`);
        // }
    }
}