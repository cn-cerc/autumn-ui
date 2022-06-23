import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmSpectaculars3.css";
import * as echarts from "echarts";

type FrmSpectaculars3TypeProps = {
}

type FrmSpectaculars3TypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class FrmSpectaculars2 extends WebControl<FrmSpectaculars3TypeProps, FrmSpectaculars3TypeState> {
    constructor(props: FrmSpectaculars3TypeProps) {
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
                <p>数据总览</p>
            </div>
            <div className={styles.mcMain}>
                <ul className={styles.top_list}>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>交易金额</div>
                            <div className={styles.topInfo}>
                                666.66 <span>万元</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/6.png" alt="" />
                        </div>
                    </li>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>运单数</div>
                            <div className={styles.topInfo}>
                                687466 <span>单</span>
                            </div>
                        </div>
                        <div>
                            <img src="images/MCimg/5.png" alt="" />
                        </div>
                    </li>
                    <li className={styles.li_3}>
                        <div>
                            <div className={styles.topTitle}>总里程</div>
                            <div className={styles.topInfo}>
                                8576.66 <span>万公里</span>
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
                            <div className={styles.mcTitle}>实时统计</div>
                            <div className={styles.FrmSpectaculars3LeftTop1}>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src="images/MCimg/7.png" alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>停车数</div>
                                        <div>120</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src="images/MCimg/7.png" alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>司机数</div>
                                        <div>120</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src="images/MCimg/7.png" alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>异常率</div>
                                        <div>20%</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src="images/MCimg/7.png" alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>回款率</div>
                                        <div>20%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>交易状态</div>
                            <div className={styles.FrmSpectaculars3MCPie2}></div>
                        </div>
                        <div className={styles.mcPieBox3}>
                            <div className={styles.mcTitle}>货物分类</div>
                            <div className={styles.FrmSpectaculars3MCBar1}></div>
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
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>区域排名TOPS</div>
                            <div className={styles.rightSiteEchat1BoxPie1}></div>
                        </div>
                        <div className={styles.mcBarBox2}>
                            <div className={styles.mcTitle}>运单量</div>
                            <div className={styles.mcBar2}></div>
                        </div>
                        <div className={styles.mcLinkBox1}>
                            <div className={styles.mcTitle}>运单重量</div>
                            <div className={styles.mcLink1}></div>
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
        this.initBarChart1();
        this.initPieChart2();
        // this.initMapechart();
        this.initBarchart2();
    }

    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink1}`) as HTMLDivElement;
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
                top: 10,
                left: 10,
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
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                type: 'plain',
                bottom:15,
                orient:'vertical',
                right: 0,
                itemWidth: 5,
                itemHeight:5,
                itemGap:2,
                fontSize:8
            },
            series: [
                {
                    type: 'pie',
                    radius: ['55%', '75%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
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
    initBarChart1() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCBar1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            legend: {},
            tooltip: {},
            dataset: {
              source: [
                ['product', '2015', '2016'],
                ['Matcha Latte', 43.3, 85.8,],
                ['Milk Tea', 83.1, 73.4],
                ['Cheese Cocoa', 86.4, 65.2],
                ['Walnut Brownie', 72.4, 53.9]
              ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            grid: [{ top:25,left:40,right:10,bottom:30}],
            series: [{ type: 'bar' }, { type: 'bar' }]
          };

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.rightSiteEchat1BoxPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                type: 'plain',
                bottom:15,
                orient:'vertical',
                right: 0,
                itemWidth: 5,
                itemHeight:5,
                itemGap:2,
                fontSize:8
            },
            series: [
                {
                    type: 'pie',
                    radius: ['55%', '75%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
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
  
    initBarchart2(){
        let peiChart = document.querySelector(`.${styles.mcBar2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            grid:[{
                left: 10,
                top: 15,
                right: 5,
                bottom: 10,
                containLabel: true,
            }],
            xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
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