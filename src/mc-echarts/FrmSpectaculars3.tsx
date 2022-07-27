import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import StaticFile from "../static/StaticFile";
import styles from "./FrmSpectaculars3.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmSpectaculars3TypeProps = {
}

type FrmSpectaculars3TypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    toggle: number
}

export default class FrmSpectaculars3 extends WebControl<FrmSpectaculars3TypeProps, FrmSpectaculars3TypeState> {
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
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            lineData,
            pieData1,
            pieData2,
            toggle,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>数据总览</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>
                <div>
                    <ul className={styles.top_list}>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/6.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>交易金额</div>
                                <div className={styles.topInfo}>
                                    626.65 <span>万元</span>
                                </div>
                            </div>
                        </li>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/5.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>物流运单数</div>
                                <div className={styles.topInfo}>
                                    746 <span>单</span>
                                </div>
                            </div>
                        </li>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/4.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>总里程</div>
                                <div className={styles.topInfo}>
                                    576.66 <span>万公里</span>
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
                            <div className={styles.mcTitle}>实时统计</div>
                            <div className={styles.FrmSpectaculars3LeftTop1}>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/7.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>停车数</div>
                                        <div>150</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/8.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>司机数</div>
                                        <div>108</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/9.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>异常率</div>
                                        <div>12%</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/10.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>回款率</div>
                                        <div>89%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.leftBox2}>
                            <div className={styles.mcTitle}>交易状态</div>
                            <div className={styles.FrmSpectaculars3MCPie2}></div>
                        </div>
                        <div className={styles.leftBox3}>
                            <div className={styles.mcTitle}>货物分类</div>
                            <div className={styles.FrmSpectaculars3MCBar1}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        <div className={styles.centerBox1}>
                            <div className={styles.mcMap}>
                                <img src={StaticFile.getImage('images/MCimg/map.png')} alt="" />
                            </div>
                        </div>
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>交易金额</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>区域排名TOPS</div>
                            <div className={styles.rightSiteEchat1BoxPie1}></div>
                        </div>
                        <div className={styles.rightBox2}>
                            <div className={styles.mcTitle}>物流运单量</div>
                            <div className={styles.mcBar2}></div>
                        </div>
                        <div className={styles.rightBox3}>
                            <div className={styles.mcTitle}>物流运单重量</div>
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
        this.initBarchart2();
    }

    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink1}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let xArr = [];
        let sData = [['周一', 200], ['周二', 180], ['周三', 250], ['周四', 291], ['周五', 270], ['周六', 146], ['周日', 128]];
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
                    // symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0],
                        width: 1
                    },
                    areaStyle: {},
                    label: {
                        show: true
                    }
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
                    // symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0],
                        width: 5
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                },
                {
                    data: [158, 310, 221, 30, 281, 290, 129],
                    type: 'line',
                    smooth: 0.6,
                    // symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1],
                        width: 5
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
        let legend = {
            top: '25%',
            left: '65%',
            orient: 'vertical',
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
        };
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: legend,
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
                    color: MCChartColors,
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
                        { value: 1048, name: '已成交' },
                        { value: 735, name: '未成交' },
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
                    ['product', '钢铁', '废钢', '合金'],
                    ['铁矿', 43.3, 85.8, 85.8,],
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            grid: [{ top: 25, left: 30, right: 10, bottom: 20 }],
            color: MCChartColors,
            series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let legend = {
            top: '25%',
            left: '65%',
            orient: 'vertical',
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
        };
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
                    radius: ['55%', '75%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
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
                        { value: 750, name: '广东省' },
                        { value: 1048, name: '福建省' },
                        { value: 580, name: '山东省' },
                        { value: 484, name: '山西省' },
                        { value: 300, name: '浙江省' }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    initBarchart2() {
        let peiChart = document.querySelector(`.${styles.mcBar2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let option = {
            grid: [{
                left: 10,
                top: 12,
                right: 5,
                bottom: 5,
                containLabel: true,
            }],
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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