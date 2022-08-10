import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import StaticFile from "../static/StaticFile";
import styles from "./FrmSpectaculars2.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmSpectaculars2TypeProps = {
}

type FrmSpectaculars2TypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    pieData2: DataSet,
    toggle: number
}

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
        pieData1.append().setValue('Value_', 10).setValue('Name_', '轻量');
        pieData1.append().setValue('Value_', 20).setValue('Name_', '小型');
        pieData1.append().setValue('Value_', 30).setValue('Name_', '中型');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '大型');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 11).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '重型卡车');
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            lineData,
            pieData1,
            pieData2,
            toggle
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>安全监控中心</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>
                <div>
                    <ul className={styles.top_list}>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/3.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>交易金额</div>
                                <div className={styles.topInfo}>
                                    534.24 <span>万元</span>
                                </div>
                            </div>
                        </li>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/2.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>运行时间</div>
                                <div className={styles.topInfo}>
                                    687 <span>小时</span>
                                </div>
                            </div>

                        </li>
                    </ul>
                </div>
            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.contentEcharts}>
                    <div className={styles.leftSiteEcharts}>
                        <div className={styles.leftBox1}>
                            <div className={styles.mcTitle}>安全学习</div>
                            <div className={styles.leftScrollList}>
                                <div className={styles.leftScrollListItem}>
                                    <img src={StaticFile.getImage('images/MCimg/1.png')} alt="" />
                                    道路交通安全知识小课堂
                                </div>
                                <div className={styles.leftScrollListItem}>
                                    <img src={StaticFile.getImage('images/MCimg/1.png')} alt="" />
                                    这些交通安全知识要知道
                                </div>
                                <div className={styles.leftScrollListItem}>
                                    <img src={StaticFile.getImage('images/MCimg/1.png')} alt="" />
                                    道路安全交通小常识
                                </div>
                            </div>
                        </div>
                        <div className={styles.leftBox2}>
                            <div className={styles.mcTitle}>违章率</div>
                            <div className={styles.FrmSpectaculars2MCPie2}></div>
                        </div>
                        <div className={styles.leftBox3}>
                            <div className={styles.mcTitle}>事故率</div>
                            <div className={styles.FrmSpectaculars2MCPie3}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        <div className={styles.centerBox1}>
                            <div className={styles.mcMap}>
                                <ul>
                                    <li className={styles.imgItem}>
                                        <img src={StaticFile.getImage('images/MCimg/bg-1.jpg')} alt="" />
                                        <p className={styles.imgBottomText}> <span>2022/06/20 00:00:00</span> <span>前</span></p>
                                    </li>
                                    <li className={styles.imgItem}>
                                        <img src={StaticFile.getImage('images/MCimg/bg-2.jpg')} alt="" />
                                        <p className={styles.imgBottomText}> <span>后</span> <span></span></p>
                                    </li>
                                </ul>
                                <ul>
                                    <li className={styles.imgItem}>
                                        <img src={StaticFile.getImage('images/MCimg/bg-3.png')} alt="" />
                                        <p className={styles.imgBottomText}> <span></span> <span>左</span></p>
                                    </li>
                                    <li className={styles.imgItem}>
                                        <img src={StaticFile.getImage('images/MCimg/bg-4.png')} alt="" />
                                        <p className={styles.imgBottomText}> <span>右</span> <span></span></p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>本周异常情况</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>异常情况</div>
                            <div className={styles.FrmSpectaculars2MCPie1}></div>
                        </div>
                        <div className={styles.rightBox2}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 08.36 <span className={styles.colorSkin}>湘AH6344</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 10:56 <span className={styles.colorSkin}>粤AK3316</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 11:22 <span className={styles.colorSkin}>粤BW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 11:54 <span className={styles.colorSkin}>桂A32X31</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 14:10 <span className={styles.colorSkin}>闽B346D5</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 16:41 <span className={styles.colorSkin}>赣B33C24</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        07-11 18:30 <span className={styles.colorSkin}>粤AC6666</span> 行驶超速
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
                    data: [58, 140, 121, 130, 181, 190, 129],
                    type: 'line',
                    smooth: 0.6,
                    symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1],
                        width: 2
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
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars2MCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.pieData1);
        ds.first();
        let dataArr: any = [];
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
                left: '60%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                itemGap: 5,
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value +'辆';
                },
                textStyle: {
                    lineHeight: 10,
                }
            },
            grid: {
                top: '20%',
                left: 5,
                bottom: 5,
                right: '20%',
                containLabel: true,
            },
            series: [
                {
                    type: 'pie',
                    center: ['30%', '53%'],
                    radius: ['50%', '75%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
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
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars2MCPie2}`) as HTMLDivElement;
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
                    color: ['#63DAAB'],
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#63DAAB'
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

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars2MCPie3}`) as HTMLDivElement;
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
                    color: ['#E6806C'],
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#E6806C'
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

        //@ts-ignore
        myChart.setOption(option);
    }

    toggleFun() {
        if (this.state.toggle == 2) {
            location.href = `${location.origin}${location.pathname}?device=pc`;
            this.setState({
                toggle: 1
            })
        } else {
            location.href = `${location.origin}${location.pathname}?device=kanban`;
            this.setState({
                toggle: 2
            })
        }
    }
}