import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import Introduction from "./Introduction";
import styles from "./FrmWagonAccountBook.css";
import { MCChartColors } from "./FrmTaurusMC";
import * as echarts from "echarts";

type FrmWagonAccountBookTypeProps = {
    introduction: string,
}

type FrmWagonAccountBookTypeState = {
    data: DataSet
}

export default class FrmWagonAccountBook extends WebControl<FrmWagonAccountBookTypeProps, FrmWagonAccountBookTypeState> {
    constructor(props: FrmWagonAccountBookTypeProps) {
        super(props);
        this.state = {
            data: new DataSet()
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <Introduction introduction={this.props.introduction}></Introduction>
            <div className={styles.main}>
                <div className={styles.menuModule}></div>
                <div className={styles.content}>
                    <ul>
                        <li>
                            <p>钱包余额</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>支出</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>收入</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>未报销</p>
                            <div>
                                <span>12</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销进程</p>
                            <div>
                                <span>50</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销驳回</p>
                            <div>
                                <span>12</span>
                                <span>笔</span>
                            </div>
                        </li>
                    </ul>
                    <div className={styles.charts}>
                        <div className={styles.chartsTitle}>
                            <p>运单支出情况（开发中）</p>
                        </div>
                        <div className={styles.chart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let data = new DataSet();
        data.append().setValue('own', 25).setValue('reimburse', 200);
        data.append().setValue('own', 18).setValue('reimburse', 160);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 20).setValue('reimburse', 168);
        data.append().setValue('own', 25).setValue('reimburse', 178);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 22).setValue('reimburse', 230);
        data.append().setValue('own', 24).setValue('reimburse', 224);
        data.append().setValue('own', 18).setValue('reimburse', 141);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 24).setValue('reimburse', 251);
        data.append().setValue('own', 24).setValue('reimburse', 302);
        data.append().setValue('own', 19).setValue('reimburse', 120);
        data.append().setValue('own', 24).setValue('reimburse', 180);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 28).setValue('reimburse', 255);
        data.append().setValue('own', 16).setValue('reimburse', 180);
        data.append().setValue('own', 19).setValue('reimburse', 200);
        this.setState({
            data
        }, () => {
            this.initChart();
        })
    }

    initChart() {
        let peiChart = document.querySelector(`.${styles.chart}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let date = new Date();
        let monthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        let xArr: string[] = [];
        for (let i = 0; i < monthDay; i++) {
            xArr.push(`${i+1}号`)
        }
        let allData = [];
        let ownData = [];
        let reimburseData = [];
        this.state.data.first();
        while (this.state.data.fetch()) {
            let ownNum = this.state.data.getDouble('own');
            let reimburseNum = this.state.data.getDouble('reimburse');
            ownData.push(String(ownNum));
            reimburseData.push(String(reimburseNum));
            allData.push(String(ownNum + reimburseNum));
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
                right: 0,
                containLabel: true,
            },
            series: [
                {
                    data: ownData,
                    type: 'bar',
                    stack: 'Ad',
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1]
                    },
                },
                {
                    data: reimburseData,
                    type: 'bar',
                    stack: 'Ad',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0]
                    },
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }
}