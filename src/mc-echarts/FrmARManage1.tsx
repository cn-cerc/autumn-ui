import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmARManage1.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import UIIntroduction from "../module/UIIntroduction";

type FrmARManage1TypeProps = {

}

type FrmARManage1TypeState = {
    lineData: DataSet,
    dataRow: DataRow,
    introduction: string
}

export default class FrmARManage1 extends WebControl<FrmARManage1TypeProps, FrmARManage1TypeState> {
    constructor(props: FrmARManage1TypeProps) {
        super(props);
        let lineData = new DataSet();
        let lineRow = new DataRow();
        lineData.append().setValue('Value_', 258).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 240).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 350).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周日');
        let dataRow: DataRow = lineRow.setValue("应收调整单_URL", "TFrmPaidRA")
            .setValue("应收调整单_Dis", false)
            .setValue("销售订单_URL", "TFrmTranOD")
            .setValue("销售订单_Dis", false)
            .setValue("物流运单_URL", "FrmArrangeCarExport")
            .setValue("物流运单_Dis", false)
            .setValue("应收对账作业_URL", "FrmARSourceToCR")
            .setValue("应收对账作业_Dis", false)
            .setValue("运单应收对账作业_URL", "FrmArrangeCarToCR")
            .setValue("运单应收对账作业_Dis", false)
            .setValue("应收对账单_URL", "FrmTranCRBill")
            .setValue("应收对账单_Dis", false)
            .setValue("收款(申请)单_URL", "TFrmPaidAR")
            .setValue("收款(申请)单_Dis", false)
            .setValue("应收账款_URL", "TFrmCheckAR")
            .setValue("应收账款_Dis", false)
            .setValue("收款单_URL", "TFrmPaidAR")
            .setValue("收款单_Dis", false)
            .setValue("会计凭证_URL", "TFrmAccBook")
            .setValue("会计凭证_Dis", false)
            .setValue("银行存款_URL", "TSchAccBook1300")
            .setValue("银行存款_Dis", false);
        let introduction = "主要用于公司主营业务中的所有关于应收的数据，同时连接应收调整单，应收结账单，以及应付账款，请款单，收款单，会计凭证，银行存款，结合起来即形成了完整的应收管理";

        this.state = {
            lineData,
            dataRow,
            introduction
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataRow.getBoolean(`应收调整单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '应收调整单')}>
                                <span>应收调整单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`销货单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '销货单')}>
                                <span>销货单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应收对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '应收对账单')}>
                                <span>应收对账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`请款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '请款单')}>
                                <span>请款单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应收账款_Dis`) ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '应收账款')}>
                                <span>应收账款</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`收款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock10}`} onClick={this.linkTo.bind(this, '收款单')}>
                                <span>收款单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`会计凭证_Dis`) ? styles.other_disable : styles.other} ${styles.stock12}`} onClick={this.linkTo.bind(this, '会计凭证')}>
                                <span>会计凭证</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`银行存款_Dis`) ? styles.other_disable : styles.other} ${styles.stock13}`} onClick={this.linkTo.bind(this, '银行存款')}>
                                <span>银行存款</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.content}>
                        <ul>
                            <li>
                                <p>到期应收</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '到期应收')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>本期应收</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '本期应收')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>本期已收</p>
                                <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '本期已收')}>
                                    <span>{0}</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>期末应收</p>
                                <div>
                                    <span>0</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>逾期应收</p>
                                <div>
                                    <span>0</span>
                                    <span>元</span>
                                </div>
                            </li>
                            <li>
                                <p>新增应收客户</p>
                                <div>
                                    <span>0</span>
                                    <span>元</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>比例图（对接中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initBarChart();
        this.initFlowChart();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
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
                data: ['产品部', '人事部', '营销部', '设计部', '技术部'],
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
            tooltip: {},
            grid: {
                top: 15,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0]
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [ //应收调整单 往下线条
                        [168, 75],
                        [168, 108]
                    ]
                },
                {
                    coords: [ //销货单 往右线条
                        [73, 123],
                        [150, 123],
                    ]
                },
                {
                    coords: [ //应收对账单 往右下线条
                        [190, 123],
                        [279, 123],
                        [279, 271]
                    ]
                },
                {
                    coords: [ //应收对账单 往下线条
                        [168, 160],
                        [168, 189]
                    ]
                },
                {
                    coords: [ //应收对账单 往左下线条
                        [168, 174],
                        [50, 174],
                        [50, 189]
                    ]
                },
                {
                    coords: [ //应收账款 往下线条
                        [50, 247],
                        [50, 271]
                    ]
                },
                {
                    coords: [ //收款单 往右线条
                        [73, 290],
                        [256, 290]
                    ]
                },
                {
                    coords: [ //收款单 往下线条
                        [50, 328],
                        [50, 349]
                    ]
                },
            ]
        }

        let option = {
            backgroundColor: "",
            xAxis: {
                min: 0,
                max: 328,
                show: false,
                type: 'value',
                position: 'top',
            },
            yAxis: {
                min: 0,
                max: function (val: number) {
                    return flowChart.offsetHeight
                },
                show: false,
                type: 'value',
                inverse: true,
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: '#fff',
                    formatter: function (item: any) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'line',
                    width: 2,
                    color: '#ccc',
                    curveness: 0.3
                },
                effect: {
                    show: true,
                    trailLength: 0,
                    constantSpeed: 10,
                    symbol: 'arrow',
                    color: '#ccc',
                    symbolSize: 6
                },
                data: charts.linesData,
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    linkTo(name: string) {
        if (!this.state.dataRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataRow.getString(`${name}_URL`);
        }
    }

    gotoFun(name: string) {
        // location.href = this.state.btnUrl.getString(`${name}_URL`);
    }
}