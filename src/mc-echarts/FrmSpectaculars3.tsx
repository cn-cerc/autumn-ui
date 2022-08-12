import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import StaticFile from "../static/StaticFile";
import { addScript, AuiMath, GDMap } from "../tool/Summer";
import ApplicationConfig from "../static/ApplicationConfig";
import styles from "./FrmSpectaculars3.css";
import { MCChartColors } from "./FrmTaurusMC";

type FrmSpectaculars3TypeProps = {
    lonlat: string,
    corpName: string
}

type FrmSpectaculars3TypeState = {
    carData: DataSet,
    toggle: number,
    dealStatus: DataSet,
    allDataPanelData: DataSet,
    cargoWeightTop3: DataSet,
    queryDriverOrderTop5: DataSet,
    weeklyOrderAmount: DataSet,
    weeklyArrangeWeight: DataSet,
    weeklyOrderCount: DataSet,
    allCarNetPanel: DataSet,
    queryMileageTotal: number,
    sumMoney: number,
    sumTransportation: number,
    onlineNum: number,
    contactNum: number,
    driverNum: number,
    abnormalNum: number,
}

export default class FrmSpectaculars3 extends WebControl<FrmSpectaculars3TypeProps, FrmSpectaculars3TypeState> {
    private gdmap: GDMap = new GDMap();
    private timer: any;
    private math: AuiMath = new AuiMath();
    constructor(props: FrmSpectaculars3TypeProps) {
        super(props);
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            carData: new DataSet(),
            toggle,
            dealStatus: new DataSet(),
            allDataPanelData: new DataSet(),
            cargoWeightTop3: new DataSet(),
            queryDriverOrderTop5: new DataSet(),
            weeklyOrderAmount: new DataSet(),
            weeklyArrangeWeight: new DataSet(),
            weeklyOrderCount: new DataSet(),
            allCarNetPanel: new DataSet(),
            queryMileageTotal: 0,
            sumMoney: 0,
            sumTransportation: 0,
            onlineNum: 0,
            contactNum: 0,
            driverNum: 0,
            abnormalNum: 0,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.corpName}>
                    <img src={StaticFile.getImage('images/MCimg/corpName.png')} />
                    <span>{this.props.corpName}</span>
                </div>
                <span>数据监控中心</span>
                <div className={styles.toggleIcons}>
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </div>
            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.top}>
                    <div className={styles.border}>
                        <h3>数据总览</h3>
                        <ul>
                            <li>
                                <p>交易金额</p>
                                <p>
                                    <span>{this.math.toFixed(this.state.sumMoney, 2)}</span>
                                    <span>万元</span>
                                </p>
                            </li>
                            <li>
                                <p>物流运单数</p>
                                <p>
                                    <span>{this.state.sumTransportation}</span>
                                    <span>单</span>
                                </p>
                            </li>
                            <li>
                                <p>总里程</p>
                                <p>
                                    <span>{this.math.toFixed(this.state.queryMileageTotal, 2)}</span>
                                    <span>万公里</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.border}>
                        <h3>实时统计</h3>
                        <ul>
                            <li>
                                <p>在线率</p>
                                <p>
                                    <span>{this.state.onlineNum}%</span>
                                </p>
                            </li>
                            <li>
                                <p>离线率</p>
                                <p>
                                    <span>{this.state.contactNum}%</span>
                                </p>
                            </li>
                            <li>
                                <p>司机数</p>
                                <p>
                                    <span>{this.state.driverNum}</span>
                                </p>
                            </li>
                            <li>
                                <p>异常率</p>
                                <p>
                                    <span>{2.15}%</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.echarts}>
                    <ul className={styles.echartsLine1}>
                        <li>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>交易状态</div>
                                <div className={styles.FrmSpectaculars3MCPie2}></div>
                            </div>
                        </li>
                        {this.isPhone ? '' : <li className={styles.border}>
                            <div>
                                <div className={styles.mcMap} id='carMapContainer'></div>
                            </div>
                        </li>}
                        <li>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>司机接单排名</div>
                                <div className={styles.rightSiteEchat1BoxPie1}></div>
                            </div>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>交易笔数</div>
                                <div className={styles.mcBar2}></div>
                            </div>
                        </li>
                    </ul>
                    <ul className={styles.echartsLine2}>
                        <li>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>货物分类</div>
                                <div className={styles.FrmSpectaculars3MCBar1}></div>
                            </div>
                        </li>
                        <li>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>交易金额</div>
                                <div className={styles.mcLink}></div>
                            </div>
                        </li>
                        <li>
                            <div className={styles.border}>
                                <div className={styles.mcTitle}>物流运单重量</div>
                                <div className={styles.mcLink1}></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount(): void {
        this.init();
        this.timer = setInterval(this.init.bind(this), 30000);
        if (!this.isPhone)
            addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this))
    }

    init() {
        // 获取交易状态--已成交数、未成交数
        FplApi.getDealStatus().then((dealStatus) => {
            this.setState({
                dealStatus
            });
        });

        // 查询总里程数
        FplApi.queryMileageTotal().then((queryMileageTotal) => {
            this.setState({
                queryMileageTotal: queryMileageTotal.getDouble('total_mileage_'),
            }, () => {
                this.initPieChart1();
            });
        });

        // 司机接单Top5
        FplApi.getQueryDriverOrderTop5().then((queryDriverOrderTop5) => {
            this.setState({
                queryDriverOrderTop5
            }, () => {
                this.initPieChart2();
            });
        });

        // 获取货物重量前三名
        FplApi.getCargoWeightTop3().then((cargoWeightTop3) => {
            this.setState({
                cargoWeightTop3,
            }, () => {
                this.initBarChart1()
            });
        });

        // 获取数据监控中心的数据(总交易金额、总物流运单数)
        FplApi.getAllDataPanelData().then((allDataPanelData) => {
            this.setState({
                sumMoney: allDataPanelData.getDouble('sum_money'),
                sumTransportation: allDataPanelData.getDouble('sum_transportation')
            });
        });

        // 交易笔数
        FplApi.getWeeklyOrderCount().then((weeklyOrderCount) => {
            this.setState({
                weeklyOrderCount,
            }, () => {
                this.initBarchart2();
            })
        })

        // 查询总里程数
        FplApi.getWeeklyOrderAmount().then((weeklyOrderAmount) => {
            this.setState({
                weeklyOrderAmount
            }, () => {
                this.initLineChart();
            });
        });

        // 获取一周运单重量
        FplApi.getWeeklyArrangeWeight().then((weeklyArrangeWeight) => {
            this.setState({
                weeklyArrangeWeight,
            }, () => {
                this.initLineChart1();
            });
        });

        // 获取车联网看板的车辆数、司机数、满载率、货损率
        FplApi.getAllCarNetPanel().then((allCarNetPanel) => {
            this.setState({
                driverNum: allCarNetPanel.getDouble('driver_num_'),
                abnormalNum: 0,
            });
        });

    }

    initMap() {
        this.gdmap.initMap('carMapContainer', {
            zoom: 8,
            center: this.props.lonlat.split(',')
        });
        this.initCarData();
    }

    async initCarData() {
        let carData = await FplApi.getQueryCarsLocation();
        let math = new AuiMath();
        let online = carData.head.getDouble('online_'), total = carData.head.getDouble('total_');
        if (!online) {
            online = 0;
        }
        let onlineNum;
        if (online == 0 || total == 0) {
            onlineNum = 0;
        } else {
            onlineNum = math.toFixed(online / total * 100, 2);
        }

        this.setState({
            carData,
            onlineNum,
            contactNum: 100 - onlineNum,
        }, () => {
            this.initCarSite();
        })
    }

    initCarSite() {
        this.gdmap.clear();
        let ds = new DataSet();
        ds.appendDataSet(this.state.carData);
        ds.first();
        while (ds.fetch()) {
            this.gdmap.addLableMark({
                position: [ds.getDouble('lon_'), ds.getDouble('lat_')],
            }, `<div class="input-card content-window-card">
                    <div style="color:#666;">
                        <h4 style="font-size: 1.2em;color: #333;padding-right: 1rem;margin-bottom:10px;">车牌号: ${ds.getString('plate_number_')}</h4>
                        <p style="margin-bottom:5px; white-space: nowrap;">最后GPS时间: ${ds.getString('gtm_')}</p>
                    </div>
                </div>`)
        }
    }

    // 物流运单重量
    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds = this.state.weeklyArrangeWeight;
        let dataArr: any = [];
        ds.first();
        while (ds.fetch()) {
            dataArr.push([`${ds.getString('create_date_').split("-")[1]}.${ds.getString('create_date_').split("-")[2]}`, ds.getString('num')])
        }

        let option = {
            xAxis: {
                type: 'category',
                boundaryGap: false
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
                    data: dataArr,
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

    // 交易金额
    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds = this.state.weeklyOrderAmount;
        let xArr = [];
        let sData = [];
        ds.first();
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('amount_total_'));
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
                show: false
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
                    smooth: 0.6,
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
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    // 交易笔数
    initBarchart2() {
        let peiChart = document.querySelector(`.${styles.mcBar2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.weeklyOrderCount;
        let xArr: any = [];
        let sData: any = [];
        ds.first();
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('trade_total_'));
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

    // 交易状态
    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCPie2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let dataArr: any = [];
        dataArr = [
            { value: this.state.dealStatus.getDouble('ydeal'), name: '已成交' },
            { value: this.state.dealStatus.getDouble('ndeal'), name: '未成交' },
        ];
        let legend: object = {
            itemWidth: 8,
            itemHeight: 8,
            icon: 'circle',
            itemGap: 16,
            formatter: (name: any) => {
                let singleData = dataArr.filter(function (item: any) {
                    return item.name == name
                })
                return name + ' : ' + singleData[0].value;
            },
            textStyle: {
                lineHeight: 10,
                fontSize: 14
            }
        }
        if(this.isPhone) {
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
                containLabel: false,
            },
            series: [
                {
                    type: 'pie',
                    center: this.isPhone ? ['30%', '55%'] : ['50%', '45%'],
                    radius: this.isPhone ? ['50%', '80%'] : ['45%', '70%'],
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

    // 货物分类
    initBarChart1() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCBar1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.cargoWeightTop3);
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('type_goods_'));
            sData.push(ds.getDouble('weight_total_'));
        }
        let option = {
            grid: [{
                left: 20,
                top: 20,
                right: 20,
                bottom: 20,
            }],
            xAxis: {
                type: 'category',
                data: xArr
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    color: MCChartColors,
                    barWidth: 30,
                    label: {
                        show: true,
                        verticalAlign: 'middle',
                        position: 'top'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    // 司机接单排名
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.rightSiteEchat1BoxPie1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.queryDriverOrderTop5;
        let dataArr: any = [];
        ds.first();
        let i = 0;
        while (ds.fetch()) {
            i++;
            if (i < 5)
                dataArr.push({ value: ds.getDouble('num'), name: ds.getString('driver_name_') });
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: 'center',
                left: '60%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
                itemGap: 5,
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value;
                },
                textStyle: {
                    lineHeight: 10,
                    fontSize: this.isPhone ? 14 : 12
                }
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
                    center: ['30%', '55%'],
                    radius: ['50%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
                    emphasis: {
                        label: {
                            show: false,
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