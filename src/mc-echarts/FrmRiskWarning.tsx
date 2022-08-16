import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import StaticFile from "../static/StaticFile";
import styles from "./FrmRiskWarning.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmRiskWarningTypeProps = {
    lonlat: string
}

type FrmRiskWarningTypeState = {
    toggle: number,
    wait: number,
    normal: number,
    highrisk: number,
    riskIndex: number,
    earlyWarningStatistics: DataSet,
    earlyWarningMonthStatistics: DataSet,
}

export default class FrmRiskWarning extends WebControl<FrmRiskWarningTypeProps, FrmRiskWarningTypeState>{
    constructor(props: FrmRiskWarningTypeProps) {
        super(props);
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            toggle,
            wait: 0,
            normal: 0,
            highrisk: 0,
            riskIndex: 0,
            earlyWarningStatistics: new DataSet(),
            earlyWarningMonthStatistics: new DataSet(),
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>风控预警</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>
                <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                    <div className={styles.centerBox1}>
                        <div className={styles.mcMap}>
                            <img src={StaticFile.getImage('images/MCimg/map_bg.png')} alt="" />
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox1}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>预警详情</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.warningDetail}>
                                <p>高风险：{this.state.highrisk}例</p>
                                <p>正常：{this.state.normal}例</p>
                                <p>待检测：{this.state.wait}例</p>
                            </div>
                            <div className={styles.warningPieBox}>
                                <div className={styles.warningPie}>
                                    <p>风险指数</p>
                                    <p>{this.state.riskIndex}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox2}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>数据汇总</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.line1}></div>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox3}`}>
                        <img src={StaticFile.getImage('images/MCimg/echartsData-bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>数据分析</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.line2}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }


    componentDidMount() {
        this.init();
    }

    init() {
        FplApi.getEarlyWarningDetails().then((earlyWarningDetails) => {
            this.setState({
                wait: earlyWarningDetails.getDouble('wait'),
                normal: earlyWarningDetails.getDouble('normal'),
                highrisk: earlyWarningDetails.getDouble('highrisk'),
                riskIndex: earlyWarningDetails.getDouble('riskIndex'),
            })
        })
        FplApi.getEarlyWarningStatistics().then((earlyWarningStatistics: DataSet) => {
            this.setState({
                earlyWarningStatistics
            }, () => {
                this.initLineChart1();
            })
        })
        FplApi.getEarlyWarningMonthStatistics().then((earlyWarningMonthStatistics: DataSet) => {
            this.setState({
                earlyWarningMonthStatistics
            }, () => {
                this.initLineChart2();
            })
        })
    }


    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.line1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);

        let ds = new DataSet();
        ds.appendDataSet(this.state.earlyWarningStatistics);
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(`${ds.getString('month').split("-")[1]}月`);
            sData.push(ds.getDouble('highrisk'));
        }

        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xArr
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
                    data: sData,
                    type: 'line',
                    smooth: true,
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
    initLineChart2() {
        let lineChart = document.querySelector(`.${styles.line2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);

        let ds = new DataSet();
        ds.appendDataSet(this.state.earlyWarningMonthStatistics);
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('highrisk'));
        }

        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xArr
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
                    data: sData,
                    type: 'line',
                    smooth: true,
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