import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import StaticFile from "../static/StaticFile";
import styles from "./FrmSpectaculars2.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmSpectaculars2TypeProps = {
    corpName: string
}

type FrmSpectaculars2TypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    toggle: number,
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
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            lineData,
            pieData1,
            toggle,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.corpName}>
                    <img src={StaticFile.getImage('images/MCimg/corpName.png')} />
                    <span>{this.props.corpName}</span>
                </div>
                <span>安全监控中心</span>
                <div className={styles.toggleIcons}>
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </div>
            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.topBox}>
                    <div className={styles.top_list}>
                        <p className={styles.mcTitle}>数据总览</p>
                        <ul>
                            <li className={styles.li_3}>
                                <div className={styles.topTitle}>交易金额</div>
                                <div className={styles.topInfo}>
                                    534.24 <span>万元</span>
                                </div>
                            </li>
                            <li className={styles.li_3}>
                                <div className={styles.topTitle}>运行时间</div>
                                <div className={styles.topInfo}>
                                    687 <span>小时</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.toprightEacharBox}>
                        <div className={styles.topBox1}>
                            <div className={styles.mcTitle}>违章率</div>
                            <div className={styles.FrmSpectaculars2MCPie2}></div>
                        </div>
                        <div className={styles.topBox2}>
                            <div className={styles.mcTitle}>事故率</div>
                            <div className={styles.FrmSpectaculars2MCPie3}></div>
                        </div>
                    </div>
                </div>
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
                                <div className={styles.leftScrollListItem}>
                                    <img src={StaticFile.getImage('images/MCimg/1.png')} alt="" />
                                    安全警示通告
                                </div>
                            </div>
                        </div>
                        <div className={styles.leftBox2}>
                            <div className={styles.mcTitle}>异常情况</div>
                            <div className={styles.FrmSpectaculars2MCPie1}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        {this.isPhone ? '' : <div className={styles.centerBox1}>
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
                        </div>}
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>近一周车辆异常</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>08-13 08.36 <span className={styles.colorSkin}>湘AH6344</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-12 10:56 <span className={styles.colorSkin}>粤AK3316</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-12 15:22 <span className={styles.colorSkin}>粤BW22C6</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-11 07:54 <span className={styles.colorSkin}>桂A32X31</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-11 12:10 <span className={styles.colorSkin}>闽B346D5</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-10 16:41 <span className={styles.colorSkin}>赣B33C24</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-10 18:30 <span className={styles.colorSkin}>粤AC6666</span> 行驶超速
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

    //近一周车辆异常
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
                boundaryGap: false,
                data: xArr,
            },
            yAxis: {
                show: false,
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 20,
                left: 20,
                bottom: 20,
                right: 20,
            },
            series: [
                {
                    data: [58, 140, 121, 130, 181, 190, 129],
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1],
                        width: 1
                    },
                    label: {
                        show: true,
                    },
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //异常情况
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

        let legend: object = {
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
            itemGap: 16,
            formatter: (name: any) => {
                let singleData = dataArr.filter(function (item: any) {
                    return item.name == name
                })
                return name + ' : ' + singleData[0].value + '辆';
            },
            textStyle: {
                lineHeight: 10,
                fontSize: 14
            }
        }

        if (this.isPhone) {
            legend = {
                ...legend,
                top: 'center',
                left: '60%',
                orient: 'vertical',
            }
        } else {
            legend = {
                ...legend,
                bottom: '0',
                left: 'center',
            }
        }

        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend,
            grid: {
                top: 0,
                left: 0,
                bottom: 20,
                right: 0,
                containLabel: true,
            },
            series: [
                {
                    type: 'pie',
                    center: this.isPhone ? ['30%', '55%'] : ['50%', '30%'],
                    radius: this.isPhone ? ['50%', '80%'] : ['25%', '48%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '14',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataArr
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //违章率
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars2MCPie2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let value: any = 0.15;
        let option = {
            series: [
                {
                    center: this.isPhone ? ['50%', '80%'] : ['55%', '85%'],
                    radius: this.isPhone ? 90 : 55,
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 1,
                    splitNumber: 3,
                    axisLine: {
                        lineStyle: {
                            width: 4,
                            color: [
                                [0.25, MCChartColors[0]],
                                [0.5, MCChartColors[1]],
                                [0.75, MCChartColors[2]],
                                [1, MCChartColors[3]]
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-50%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'inherit',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 6,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 8,
                        distance: -60,
                        formatter: function (value: number) {
                            if (value === 0.875) {
                                return 'A';
                            } else if (value === 0.625) {
                                return 'B';
                            } else if (value === 0.375) {
                                return 'C';
                            } else if (value === 0.125) {
                                return 'D';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 8
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value * 100) + '%';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                        }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //事故率
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars2MCPie3}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let value: any = 0.21;
        let option = {
            series: [
                {
                    center: this.state.gaugeCenter,
                    radius: this.state.gaugeRadius,
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 1,
                    splitNumber: 3,
                    axisLine: {
                        lineStyle: {
                            width: 4,
                            color: [
                                [0.25, MCChartColors[0]],
                                [0.5, MCChartColors[1]],
                                [0.75, MCChartColors[2]],
                                [1, MCChartColors[3]]
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-50%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'inherit',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 6,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 8,
                        distance: -60,
                        formatter: function (value: number) {
                            if (value === 0.875) {
                                return 'A';
                            } else if (value === 0.625) {
                                return 'B';
                            } else if (value === 0.375) {
                                return 'C';
                            } else if (value === 0.125) {
                                return 'D';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 8
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value * 100) + '%';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                        }
                    ]
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