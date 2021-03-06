import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmContractManageMC.css";
import * as echarts from "echarts";
import { MCChartColors } from "./FrmTaurusMC";
import Introduction from "./Introduction";
import FplPageApi from "./FplPageApi";

type FrmContractManageMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmContractManageMCTypeState = {
    dataJson: DataRow,
    contractAmount: DataSet,
    auditedRechargeRecord: DataSet,
    acceptedContract: DataSet,
}
//合同管理(中智运)

export default class FrmContractManageMC extends WebControl<FrmContractManageMCTypeProps, FrmContractManageMCTypeState> {
    constructor(props: FrmContractManageMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        this.state = {
            dataJson: dataJson,
            contractAmount: new DataSet(),
            auditedRechargeRecord: new DataSet(),
            acceptedContract: new DataSet(),
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <Introduction introduction={this.props.introduction}></Introduction>
            <div className={styles.mcMain}>
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcTitle}>流程图</div>
                    <div className={styles.mcFlowChartMain}>
                        <div className={styles.mcFlowChart}></div>
                        <div className={styles.mcFlowBox}>
                            <div className={`${this.state.dataJson.getBoolean(`银行维护_Dis`) ? styles.other_disable : styles.other} ${styles.stock1}`} onClick={this.linkTo.bind(this, '银行维护')}>
                                <span>银行维护</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同类别_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock2}`} onClick={this.linkTo.bind(this, '合同类别')}>
                                <span>合同类别</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同登记_Dis`) ? styles.register_disable : styles.register} ${styles.stock5}`} onClick={this.linkTo.bind(this, '合同登记')}>
                                <span>合同登记</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`待接收合同_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock7}`} onClick={this.linkTo.bind(this, '待接收合同')}>
                                <span>待接收合同</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`合同管理_Dis`) ? styles.control_disable : styles.control} ${styles.stock8}`} onClick={this.linkTo.bind(this, '合同管理')}>
                                <span>合同管理</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`应收对账单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock11}`} onClick={this.linkTo.bind(this, '应收对账单')}>
                                <span>应收对账单</span>
                            </div>
                            <div className={`${this.state.dataJson.getBoolean(`收款单_Dis`) ? styles.receipt_disable : styles.receipt} ${styles.stock12}`} onClick={this.linkTo.bind(this, '收款单')}>
                                <span>收款单</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>合同类别(对接中)</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>待接受合同</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcBarChart}>
                        <div className={styles.mcTitle}>合同合计</div>
                        <div className={styles.FrmTaurusMCBar}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let auditedRechargeRecord = new DataSet();
        auditedRechargeRecord = await FplPageApi.voucherStats();
        let contractAmount = new DataSet();
        contractAmount = await FplPageApi.contractStats();
        let acceptedContract = new DataSet();
        acceptedContract = await FplPageApi.contractApplyStats();

        this.setState({
            contractAmount,
            auditedRechargeRecord,
            acceptedContract
        })

        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
    }

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.auditedRechargeRecord;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('status_name_'),
                value: ds.getDouble('sum')
            })
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value;
                },
            },
            grid: {
                top: 40,
                left: 0,
                bottom: 0,
                right: 20,
                containLabel: false,
            },
            series: [
                {
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
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
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.acceptedContract;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('contract_type_name_'),
                value: ds.getDouble('sum')
            })
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value;
                },
            },
            series: [
                {
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
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

    initBarChart() {
        let barChart = document.querySelector(`.${styles.FrmTaurusMCBar}`) as HTMLDivElement;
        let myChart = echarts.init(barChart);
        let ds = new DataSet();
        ds = this.state.contractAmount;
        ds.first();
        let dataArr = [],
            nameArr = [];
        while (ds.fetch()) {
            nameArr.push(ds.getString('contract_type_name_'));
            dataArr.push(ds.getDouble('sum'));
        }
        let option = {
            grid: {
                top: 10,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: nameArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: dataArr,
                    type: 'bar'
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
                    coords: [ //银行维护往右线条
                        [78, 40],
                        [143, 40],
                    ]
                },
                {
                    coords: [ //合同类别往下线条
                        [169, 80],
                        [169, 120],
                    ]
                },
                {
                    coords: [ //合同登记往下线条
                        [169, 180],
                        [169, 220],
                    ]
                },
                {
                    coords: [ //待接收合同往右线条
                        [78, 242],
                        [143, 242],
                    ]
                },
                {
                    coords: [ //合同管理往下线条
                        [169, 280],
                        [169, 323],
                    ]
                },
                {
                    coords: [ //收款单左线条
                        [248, 339],
                        [183, 339],
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
                position: 'top'
            },
            yAxis: {
                min: 0,
                max: function (val: number) {
                    return flowChart.offsetHeight
                },
                show: false,
                type: 'value',
                inverse: true
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
                data: charts.linesData
            }]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    linkTo(name: string) {
        if (!this.state.dataJson.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataJson.getString(`${name}_URL`);
        }
    }
}