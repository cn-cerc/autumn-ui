import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmTaurusMC.css";
import * as echarts from "echarts";
import FplPageApi from "./FplPageApi";
import Introduction from "./Introduction";

type FrmTaurusMCTypeProps = {
    dataJson: string,
    introduction: string
}

type FrmTaurusMCTypeState = {
    lineData: DataSet,
    pieData1: DataSet,
    pieData2: DataSet,
    linkRow: DataRow,
    vehicleState: DataSet
}

export const MCChartColors = ['#578DF9', '#63DAAB', '#6B7A91', '#F0D062', '#E6806C', '#7DD17D', '#9A7BD9']

export default class FrmTaurusMC extends WebControl<FrmTaurusMCTypeProps, FrmTaurusMCTypeState> {
    constructor(props: FrmTaurusMCTypeProps) {
        super(props);
        let lineData = new DataSet();
        let linkRow = new DataRow();
        linkRow.setJson(this.props.dataJson);
        lineData.append().setValue('Value_', 300).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 285).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 220).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 360).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 28).setValue('Name_', '1-3吨');
        pieData1.append().setValue('Value_', 15).setValue('Name_', '3-5吨');
        pieData1.append().setValue('Value_', 12).setValue('Name_', '5-7吨');
        pieData1.append().setValue('Value_', 8).setValue('Name_', '7-9吨');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 12).setValue('Name_', '微型卡车');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '轻型卡车');
        pieData2.append().setValue('Value_', 18).setValue('Name_', '中型卡车');
        pieData2.append().setValue('Value_', 13).setValue('Name_', '重型卡车');
        this.state = {
            lineData,
            pieData1,
            pieData2,
            linkRow,
            vehicleState: new DataSet(),
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
                            <div className={`${this.state.linkRow.getBoolean('商品资料登记_Dis') ? styles.register_disable : styles.register} ${styles.stock1}`} onClick={this.linkTo.bind(this, '商品资料登记')}>
                                <span>商品资料登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('客户登记_Dis') ? styles.register_disable : styles.register} ${styles.stock2}`} onClick={this.linkTo.bind(this, '客户登记')}>
                                <span>客户登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('车队与司机登记_Dis') ? styles.register_disable : styles.register} ${styles.stock3}`} onClick={this.linkTo.bind(this, '车队与司机登记')}>
                                <span>车队与司机登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货单登记_Dis') ? styles.register_disable : styles.register} ${styles.stock5}`} onClick={this.linkTo.bind(this, '货单登记')}>
                                <span>货单登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('货单管理_Dis') ? styles.register_disable : styles.register} ${styles.stock8}`} onClick={this.linkTo.bind(this, '货单管理')}>
                                <span>货单管理</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('自行派车运单登记_Dis') ? styles.register_disable : styles.register} ${styles.stock10}`} onClick={this.linkTo.bind(this, '自行派车运单登记')}>
                                <span>自行派车运单登记</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('委托第三方物流运输_Dis') ? styles.other_disable : styles.other} ${styles.stock11}`} onClick={this.linkTo.bind(this, '委托第三方物流运输')}>
                                <span>委托第三方物流运输</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('网络货运平台撮合_Dis') ? styles.other_disable : styles.other} ${styles.stock12}`} onClick={this.linkTo.bind(this, '网络货运平台撮合')}>
                                <span>网络货运平台撮合</span>
                            </div>
                            <div className={`${this.state.linkRow.getBoolean('司机端_Dis') ? styles.other_disable : styles.other} ${styles.stock14}`} onClick={this.linkTo.bind(this, '司机端')}>
                                <span>司机端</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>车辆状态统计</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>货单统计</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>货运车辆统计</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    async init() {
        let vehicleState = new DataSet();
        vehicleState = await FplPageApi.getMoreThanOneWeekReport();

        this.setState({
            vehicleState
        })
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
        this.initFlowChart();
    }

    componentDidMount(): void {
        this.init();
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
                    name: '售出',
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

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.vehicleState;
        ds.first();
        let dataArr: any = [
            { name: '在途中', value: ds.getDouble('empty_car_sum_') },
            { name: '空车', value: ds.getDouble('carry_sum_') },
            { name: '待发货', value: ds.getDouble('to_be_shipped_sum_') },
        ];
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
        ds.appendDataSet(this.state.pieData2);
        ds.first();
        let dataArr = [];
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
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
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

    initFlowChart() {
        let flowChart = document.querySelector(`.${styles.mcFlowChart}`) as HTMLDivElement;
        let myChart = echarts.init(flowChart);
        let nodes: any[] = [];
        let charts = {
            nodes,
            linesData: [
                {
                    coords: [
                        [75, 35],
                        [143, 35],
                    ]
                }, {
                    coords: [
                        [190, 35],
                        [256, 35],
                    ]
                },
                {
                    coords: [
                        [168, 160],
                        [168, 189],
                    ]
                },
                {
                    coords: [
                        [168, 247],
                        [168, 271],
                    ]
                },
                {
                    coords: [
                        [168, 247],
                        [168, 261],
                        [50, 261],
                        [50, 271],
                    ]
                }, {
                    coords: [
                        [168, 247],
                        [168, 261],
                        [278, 261],
                        [278, 271],
                    ]
                },
                {
                    coords: [ //自行派车运单登记 往右下线条
                        [50, 328],
                        [50, 347],
                        [168, 347]
                    ]
                },
                {
                    coords: [ //网络货运平台撮合 往左下线条
                        [278, 328],
                        [278, 347],
                        [168, 347],
                    ]
                },
                {
                    coords: [
                        [168, 328],
                        [168, 356],
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
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }
}