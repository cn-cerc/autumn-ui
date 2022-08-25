import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmARManage.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import UIIntroduction from "../module/UIIntroduction";

type FrmARManageTypeProps = {
    
}

type FrmARManageTypeState = {
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    dataRow: DataRow,
    introduction: string
}

export default class FrmARManage extends WebControl<FrmARManageTypeProps, FrmARManageTypeState> {
    constructor(props: FrmARManageTypeProps) {
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
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 11).setValue('Name_', '品牌名1');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名2');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名3');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名4');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 10).setValue('Name_', '湖北省');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '广西省');
        pieData2.append().setValue('Value_', 30).setValue('Name_', '湖南省');
        pieData2.append().setValue('Value_', 15).setValue('Name_', '广东省');
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
            pieData1,
            pieData2,
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
                            <div className={`${this.state.dataRow.getBoolean(`物流运单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock3}`} onClick={this.linkTo.bind(this, '物流运单')}>
                                <span>物流运单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`销售订单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock4}`} onClick={this.linkTo.bind(this, '销售订单')}>
                                <span>销售订单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应收对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock5}`} onClick={this.linkTo.bind(this, '应收对账单')}>
                                <span>应收对账单</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`应收对账作业_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock6}`} onClick={this.linkTo.bind(this, '应收对账作业')}>
                                <span>应收对账作业</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`运单应收对账作业_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock9}`} onClick={this.linkTo.bind(this, '运单应收对账作业')}>
                                <span>运单应收对账作业</span>
                            </div>
                            <div className={`${this.state.dataRow.getBoolean(`收款(申请)单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '收款(申请)单')}>
                                <span>收款(申请)单</span>
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
                    coords: [ 
                        [170, 65],
                        [170, 96]
                    ]
                },
                {
                    coords: [ 
                        [50, 65],
                        [50, 80],
                        [170, 80]
                    ]
                },
                {
                    coords: [ 
                        [154, 113],
                        [60, 113]
                    ]
                },
                {
                    coords: [ 
                        [182, 113],
                        [256, 113]
                    ]
                },
                {
                    coords: [ 
                        [50, 146],
                        [50, 156],
                        [170, 156],
                        [170, 175]
                    ]
                },
                {
                    coords: [ 
                        [278, 146],
                        [278, 156],
                        [170, 156]
                    ]
                },
                {
                    coords: [ 
                        [170, 222],
                        [170, 254]
                    ]
                },
                {
                    coords: [ 
                        [170, 235],
                        [50, 235],
                        [50, 254]
                    ]
                },
                {
                    coords: [ 
                        [50, 308],
                        [50, 336]
                    ]
                },
                {
                    coords: [ 
                        [50, 386],
                        [50, 416]
                    ]
                },
                {
                    coords: [ 
                        [60, 352],
                        [265, 352]
                    ]
                },
                {
                    coords: [ 
                        [182, 186],
                        [278, 186],
                        [278, 336]
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