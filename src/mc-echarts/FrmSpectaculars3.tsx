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
    weeklyOrderCount: DataSet,
    weeklyArrangeWeight: DataSet,
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
            weeklyOrderCount: new DataSet(),
            weeklyArrangeWeight: new DataSet(),
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
                <p>
                    <b className={styles.corpName}><img src={StaticFile.getImage('images/MCimg/corpName.png')} alt="" />{this.props.corpName}</b>
                    <span>数据监控中心</span>
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
                                    {this.state.sumMoney} <span>万元</span>
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
                                    {this.state.sumTransportation} <span>单</span>
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
                                    {this.state.queryMileageTotal} <span>万公里</span>
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
                                        <div>在线率</div>
                                        <div>{this.state.onlineNum}%</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/8.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>离线率</div>
                                        <div>{this.state.contactNum}%</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/9.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>司机数</div>
                                        <div>{this.state.driverNum}</div>
                                    </div>
                                </div>
                                <div className={styles.leftTop1Item}>
                                    <div>
                                        <img src={StaticFile.getImage('images/MCimg/10.png')} alt="" />
                                    </div>
                                    <div className={styles.leftTop1ItemInfo}>
                                        <div>异常率</div>
                                        <div>{this.state.abnormalNum}%</div>
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
                            <div className={styles.mcMap} id='carMapContainer'></div>
                        </div>
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>交易金额</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>司机接单排名</div>
                            <div className={styles.rightSiteEchat1BoxPie1}></div>
                        </div>
                        <div className={styles.rightBox2}>
                            <div className={styles.mcTitle}>物流运单笔数</div>
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

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    componentDidMount(): void {
        this.init();
        this.timer = setInterval(this.init.bind(this), 30000);
        addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this))
    }

    async initCarData() {
        let carData = await FplApi.queryCarsCurrentLocation();
        this.setState({
            carData
        }, () => {
            this.initCarSite();
        })
    }

    async init() {
        let dealStatus = new DataSet();
        dealStatus = await FplApi.getDealStatus();
        dealStatus.first()
        let allDataPanelData = new DataSet();
        allDataPanelData = await FplApi.getAllDataPanelData();
        let cargoWeightTop3 = new DataSet();
        cargoWeightTop3 = await FplApi.getCargoWeightTop3();
        let queryDriverOrderTop5 = new DataSet();
        queryDriverOrderTop5 = await FplApi.getQueryDriverOrderTop5();
        let queryMileageTotal = new DataSet();
        queryMileageTotal = await FplApi.queryMileageTotal();
        let weeklyOrderAmount = new DataSet();
        weeklyOrderAmount = await FplApi.getWeeklyOrderAmount();
        let weeklyOrderCount = new DataSet();
        weeklyOrderCount = await FplApi.getWeeklyOrderCount();
        let weeklyArrangeWeight = new DataSet();
        weeklyArrangeWeight = await FplApi.getWeeklyArrangeWeight();
        let allCarNetPanel = new DataSet();
        allCarNetPanel = await FplApi.getAllCarNetPanel();
        let queryCarsLocation = new DataSet();
        queryCarsLocation = await FplApi.getQueryCarsLocation();
        let math = new AuiMath();
        let online = queryCarsLocation.head.getDouble('online_'), total = queryCarsLocation.head.getDouble('total_');
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
            dealStatus,
            cargoWeightTop3,
            queryDriverOrderTop5,
            weeklyOrderAmount,
            weeklyOrderCount,
            weeklyArrangeWeight,
            queryMileageTotal: queryMileageTotal.getDouble('total_mileage_'),
            sumMoney: allDataPanelData.getDouble('sum_money'),
            sumTransportation: allDataPanelData.getDouble('sum_transportation'),
            onlineNum,
            contactNum: 100 - onlineNum,
            driverNum: allCarNetPanel.getDouble('driver_num_'),
            abnormalNum: 0,
        }, () => {
            this.initLineChart();
            this.initLineChart1();
            this.initPieChart1();
            this.initBarChart1();
            this.initPieChart2();
            this.initBarchart2();
        })

    }

    initMap() {
        this.gdmap.initMap('carMapContainer', {
            zoom: 5.8,
            center: this.props.lonlat.split(',')
        });
        this.initCarData();

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

    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink1}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
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
                type: 'value',
                boundaryGap: [0, '100%'],
                minInterval: 1
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

    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
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
                type: 'value',
                axisLabel: {
                    color: '#333333'
                },
                minInterval: 1
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 20,
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

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let dataArr: any = [];
        dataArr = [
            { value: this.state.dealStatus.getDouble('ydeal'), name: '已成交' },
            { value: this.state.dealStatus.getDouble('ndeal'), name: '未成交' },
        ];
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
                    center: ['30%', '53%'],
                    radius: ['50%', '75%'],
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
                    data: dataArr
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    initBarChart1() {
        let peiChart = document.querySelector(`.${styles.FrmSpectaculars3MCBar1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.cargoWeightTop3;
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('type_goods_'));
            sData.push(ds.getDouble('weight_total_'));
        }
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
                data: xArr
            },
            yAxis: {
                type: 'value',
                minInterval: 1
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    color: MCChartColors,
                    barWidth: 30,
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.rightSiteEchat1BoxPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds = this.state.queryDriverOrderTop5;
        let dataArr: any = [];
        ds.first();
        while (ds.fetch()) {
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
                    center: ['30%', '53%'],
                    radius: ['50%', '75%'],
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
                    data: dataArr
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    initBarchart2() {
        let peiChart = document.querySelector(`.${styles.mcBar2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
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
            grid: [{
                left: 10,
                top: 12,
                right: 5,
                bottom: 5,
                containLabel: true,
            }],
            xAxis: {
                type: 'category',
                data: xArr
            },
            yAxis: {
                type: 'value',
                minInterval: 1
            },
            series: [
                {
                    data: sData,
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