import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmSpectaculars1.css";
import * as echarts from "echarts";

type FrmSpectaculars1TypeProps = {
}

type FrmSpectaculars1TypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmSpectaculars2 extends WebControl<FrmSpectaculars1TypeProps, FrmSpectaculars1TypeState> {
    constructor(props: FrmSpectaculars1TypeProps) {
        super(props);
        let lineData = new DataSet();
        lineData.append().setValue('Value_', 258).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 240).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 350).setValue('XName_', '周六');
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
                <p>运作数据中心</p>
            </div>
            <div className={styles.mcMain}>
                <ul className={styles.top_list}>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>车辆数</div>
                            <div className={styles.topInfo}>
                                666 <span>辆</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/6.png" alt="" />
                        </div>
                    </li>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>今日里程</div>
                            <div className={styles.topInfo}>
                                687466 <span>万公里</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/5.png" alt="" />
                        </div>
                    </li>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>司机数</div>
                            <div className={styles.topInfo}>
                                857666 <span>名</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/4.png" alt="" />
                        </div>
                    </li>
                </ul>
                <div className={styles.contentEcharts}>
                    <div className={styles.leftSiteEcharts}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>在线率</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>满载率</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>货损率</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        <div className={styles.mcMapBox}>
                            <div className={styles.mcMap}>这里暂时放置图片，但是没有地图图片</div>
                        </div>
                        <div className={styles.mcLinkBox}>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightSiteEchat1}>
                            <div className={styles.rightSiteEchat1Box}>
                                <div className={styles.mcTitle}>司机年龄</div>
                                <div className={styles.rightSiteEchat1BoxPie1}></div>
                            </div>
                            <div className={styles.rightSiteEchat1Box}>
                                <div className={styles.mcTitle}>区域分布</div>
                                <div className={styles.rightSiteEchat1BoxPie2}></div>
                            </div>
                        </div>
                        <div className={styles.mcLinkBox2}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.mcLink2}></div>
                        </div>
                        <div className={styles.srcollListBox}>
                            <div className={styles.mcTitle}>实时动态</div>
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
        this.initLineChart1();
        this.initPieChart1();
        this.initPieChart2();
        this.initPieChart3();
        this.initPieChart4();
        this.initPieChart5();
        // this.initMapechart();
    }

    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink2}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let xArr = [];
        let sData = [[2000, 200], [2008, 180], [2013, 250], [2022, 291]];
        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 20,
                left: 0,
                bottom: 10,
                right: 16,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0],
                        width: 1
                    },
                    areaStyle: {},
                },
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
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
        const gaugeData = [
            {
                value: 60,
                //   name: 'Commonly',
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '10%']
                }
            }
        ];
        let option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#464646'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 4
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 20
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 5,
                        height: 14,
                        fontSize: 14,
                        color: 'auto',
                        borderColor: 'auto',
                        //   borderRadius: 20,
                        //   borderWidth: 1,
                        formatter: '{value}%'
                    }
                }
            ]
        };

        setInterval(function () {
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
                series: [
                    {
                        data: gaugeData,
                        pointer: {
                            show: false
                        }
                    }
                ]
            });
        }, 2000);

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        const gaugeData = [
            {
                value: 60,
                //   name: 'Commonly',
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '10%']
                }
            }
        ];
        let option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#464646'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 4
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 20
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 5,
                        height: 14,
                        fontSize: 14,
                        color: 'auto',
                        borderColor: 'auto',
                        //   borderRadius: 20,
                        //   borderWidth: 1,
                        formatter: '{value}%'
                    }
                }
            ]
        };

        setInterval(function () {
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
                series: [
                    {
                        data: gaugeData,
                        pointer: {
                            show: false
                        }
                    }
                ]
            });
        }, 2000);

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        const gaugeData = [
            {
                value: 60,
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '10%']
                }
            }
        ];
        let option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#464646'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 4
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 20
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 5,
                        height: 14,
                        fontSize: 14,
                        color: 'auto',
                        borderColor: 'auto',
                        formatter: '{value}%'
                    }
                }
            ]
        };
        setInterval(function () {
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
                series: [
                    {
                        data: gaugeData,
                        pointer: {
                            show: false
                        }
                    }
                ]
            });
        }, 2000);

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart4() {
        let legend = {
            type: 'plain',
            top: '3%',
            left: 'left',
            itemWidth: 0,
            orient: 'vertical',
            padding: 1,
            itemGap: 2,
        }
        let radius = ['25%', '40%'],
            center = ['20%', '80%'];
        if (this.isPhone) {
            legend = {
                type: 'plain',
                top: '30%',
                left: 'left',
                itemWidth: 0,
                orient: 'vertical',
                padding: 1,
                itemGap: 2,
            }
            radius = ['25%', '40%'],
            center = ['70%', '50%'];
        }
        let peiChart = document.querySelector(`.${styles.rightSiteEchat1BoxPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: legend,
            series: [
                {
                    type: 'pie',
                    radius: radius,
                    center: center,
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart5() {
        let legend = {
            type: 'plain',
            top: '3%',
            left: 'left',
            itemWidth: 0,
            orient: 'vertical',
            padding: 1,
            itemGap: 2,
        }
        let radius = ['25%', '40%'],
            center = ['20%', '80%'];
        if (this.isPhone) {
            legend = {
                type: 'plain',
                top: '30%',
                left: 'left',
                itemWidth: 0,
                orient: 'vertical',
                padding: 1,
                itemGap: 2,
            }
            radius = ['25%', '40%'];
            center = ['70%', '50%'];
        }
        let peiChart = document.querySelector(`.${styles.rightSiteEchat1BoxPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: legend,
            series: [
                {
                    type: 'pie',
                    radius: radius,
                    center: center,
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }
    // initMapechart(){
    //     let peiChart = document.querySelector(`.${styles.mcMap}`) as HTMLDivElement;
    //     let myChart = echarts.init(peiChart);


    // }
    // linkTo(name: string) {
    // if(!this.state.dataJson.getBoolean(`${name}_Dis`)){
    //     location.href = this.state.dataJson.getString(`${name}_URL`);
    // }
    // }
}