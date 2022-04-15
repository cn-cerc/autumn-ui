import React from "react";
import DataSet from "../db/DataSet";
import ColumnChart from "./ColumnChart";
import styles from "./FrmPurchaseChart.css";
import LineChart from "./LineChart";
import { seriesName, xColumns, xPointName } from "./ViewConfig";

type PurchaseChartTypeState = {
    columnChartData: DataSet,
    lineChartData: DataSet,
    columnChartOption: object
}

export default class FrmPurchaseChart extends React.Component<any, PurchaseChartTypeState> {
    constructor(props: any) {
        super(props);
        let columnChartData = new DataSet();
        columnChartData.append().setValue('Stock1_', '4.3').setValue('Stock2_', '2.4').setValue('Stock3_', '2').setValue(xPointName, '铁矿石');
        columnChartData.append().setValue('Stock1_', '2.5').setValue('Stock2_', '4.4').setValue('Stock3_', '2').setValue(xPointName, '废钢');
        columnChartData.append().setValue('Stock1_', '3.5').setValue('Stock2_', '1.8').setValue('Stock3_', '3').setValue(xPointName, '焦煤');
        columnChartData.head.setValue(xColumns, ['Stock1_', 'Stock2_', 'Stock3_']);
        columnChartData.head.setValue(seriesName, ['安全库存', '当前库存', '在途库存']);
        this.state = {
            columnChartData,
            lineChartData: new DataSet(),
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
                        color: '#fff'
                    },
                    bottom: '10',
                },
                backgroundColor: 'transparent',
                color: ['#66ff66', '#49bbd1', '#ffff00'],
                grid: {
                    left: '10',
                    right: '10',
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

                </div>
                <div className={styles.moduleCenter}>
                    <ColumnChart width="50%" height="100%" key={this.state.columnChartData.json} echartData={this.state.columnChartData} option={this.state.columnChartOption}></ColumnChart>
                </div>
                <div className={styles.moduleRight}></div>
            </div>
        </div>
    }
}