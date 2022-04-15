import React from "react";
import DataSet from "../db/DataSet";
import ColumnChart from "./ColumnChart";
import styles from "./FrmPurchaseChart.css";
import LineChart from "./LineChart";
import { seriesName, xColumns, xPointName } from "./ViewConfig";

type PurchaseChartTypeState = {
    columnChartData: DataSet,
    lineChartData: DataSet,
    columnChartOption: object,
    lineChartOption: object
}

export default class FrmPurchaseChart extends React.Component<any, PurchaseChartTypeState> {
    constructor(props: any) {
        super(props);
        let columnChartData = new DataSet();
        columnChartData.append().setValue('Stock1_', '4.3').setValue('Stock2_', '2.4').setValue('Stock3_', '2').setValue(xPointName, '铁矿石');
        columnChartData.append().setValue('Stock1_', '2.5').setValue('Stock2_', '4.4').setValue('Stock3_', '2').setValue(xPointName, '废钢');
        columnChartData.append().setValue('Stock1_', '3.5').setValue('Stock2_', '1.8').setValue('Stock3_', '3').setValue(xPointName, '焦煤');
        columnChartData.append().setValue('Stock1_', '5.2').setValue('Stock2_', '3.1').setValue('Stock3_', '1').setValue(xPointName, '粉煤');
        columnChartData.head.setValue(xColumns, ['Stock1_', 'Stock2_', 'Stock3_']);
        columnChartData.head.setValue(seriesName, ['安全库存', '当前库存', '在途库存']);

        let lineChartData = new DataSet();
        lineChartData.append().setValue('LastYear_', '4.3').setValue('ThisYear_', '2.4').setValue(xPointName, '1月');
        lineChartData.append().setValue('LastYear_', '2.5').setValue('ThisYear_', '4.4').setValue(xPointName, '2月');
        lineChartData.append().setValue('LastYear_', '3.5').setValue('ThisYear_', '1.8').setValue(xPointName, '3月');
        lineChartData.append().setValue('LastYear_', '4.5').setValue('ThisYear_', '2.8').setValue(xPointName, '4月');
        lineChartData.append().setValue('LastYear_', '5').setValue(xPointName, '5月');
        lineChartData.append().setValue('LastYear_', '6').setValue(xPointName, '6月');
        lineChartData.append().setValue('LastYear_', '4').setValue(xPointName, '7月');
        lineChartData.append().setValue('LastYear_', '6').setValue(xPointName, '8月');
        lineChartData.append().setValue('LastYear_', '3').setValue(xPointName, '9月');
        lineChartData.append().setValue('LastYear_', '3').setValue(xPointName, '10月');
        lineChartData.append().setValue('LastYear_', '4').setValue(xPointName, '11月');
        lineChartData.append().setValue('LastYear_', '5.5').setValue(xPointName, '12月');
        lineChartData.head.setValue(xColumns, ['LastYear_', 'ThisYear_']);
        lineChartData.head.setValue(seriesName, ['去年', '今年']);
        this.state = {
            columnChartData,
            lineChartData,
            columnChartOption: {
                title: [
                    {
                        text: '库存动态预警',
                        textStyle: {
                            color: '#fff',
                            fontSize: '20',
                            fontWeight: '500'
                        },
                        top: '10',
                        left: 'center'
                    }
                ],
                legend: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 16
                    },
                    bottom: '10',
                    itemWidth: 16,
                    itemHeight: 16
                },
                backgroundColor: 'transparent',
                color: ['#66ff66', '#49bbd1', '#ffff00'],
                yAxis: {
                    show: false,
                },
                xAxis: {
                    data: ['铁矿石', '废钢', '焦煤', '粉煤'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                grid: {
                    left: '10',
                    right: '10',
                    bottom: '40',
                    containLabel: true
                }
            },
            lineChartOption: {
                title: [
                    {
                        text: '废钢采购年度对比动态',
                        textStyle: {
                            color: '#fff',
                            fontSize: '20',
                            fontWeight: '500'
                        },
                        top: '10',
                        left: 'center'
                    }
                ],
                legend: {
                    textStyle: {
                        color: '#fff'
                    },
                    right: '60',
                },
                backgroundColor: 'transparent',
                color: ['#41aebd', '#97e9d5'],
                xAxis: {
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisLine: {
                        lineStyle: {
                            color: '#fff'
                        }
                    }
                },
                yAxis: {
                    show: false,
                },
                grid: {
                    top: '80',
                    left: '40',
                    right: '40',
                    bottom: '40',
                    containLabel: true
                }
            }
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <h2>采购数据管理中心</h2>
            <div className={styles.module1}>
                <div className={styles.moduleLeft}>
                    <div className={styles.stock}>
                        <div>铁矿石采购状态（T）</div>
                        <ul>
                            <li>年度采购数量：<span>1110</span></li>
                            <li>年度入库数量：<span>1110</span></li>
                            <li>当前在途数量：<span>1110</span></li>
                            <li>当前在库数量：<span>1110</span></li>
                        </ul>
                    </div>
                    <div className={styles.stock}>
                        <div>废钢采购状态（T）</div>
                        <ul>
                            <li>年度采购数量：</li>
                            <li>年度入库数量：</li>
                            <li>当前在途数量：</li>
                            <li>当前在库数量：</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.moduleCenter}>
                    <ColumnChart width="100%" height="100%" id="columnChart" key={this.state.columnChartData.json} echartData={this.state.columnChartData} option={this.state.columnChartOption}></ColumnChart>
                </div>
                <div className={styles.moduleRight}>
                    <div className={styles.stock}>
                        <div>焦煤采购状态（T）</div>
                        <ul>
                            <li>年度采购数量：</li>
                            <li>年度入库数量：</li>
                            <li>当前在途数量：</li>
                            <li>当前在库数量：</li>
                        </ul>
                    </div>
                    <div className={styles.stock}>
                        <div>粉煤采购状态（T）</div>
                        <ul>
                            <li>年度采购数量：</li>
                            <li>年度入库数量：</li>
                            <li>当前在途数量：</li>
                            <li>当前在库数量：</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles.module2}>
                <LineChart echartData={this.state.lineChartData} width='100%' height='300px' id="lineChart" option={this.state.lineChartOption}></LineChart>
            </div>
        </div>
    }
}