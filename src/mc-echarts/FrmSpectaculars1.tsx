import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import FplApi from "../api/FplApi";
import ApplicationConfig from "../static/ApplicationConfig";
import StaticFile from "../static/StaticFile";
import { addScript, AuiMath, GDMap } from "../tool/Summer";
import styles from "./FrmSpectaculars1.css";
import { MCChartColors } from "./FrmTaurusMC";
type FrmSpectaculars1TypeProps = {
    lonlat: string,
    corpName: string
}
type FrmSpectaculars1TypeState = {
    carData: DataSet,
    toggle: number,
    allCarNetPanel: DataSet,
    weeklyArrCarStatis: DataSet,
    countProvince: DataSet,
    queryMileageD: number,
    cars_num: number,
    driver_num: number,
}

export default class FrmSpectaculars1 extends WebControl<FrmSpectaculars1TypeProps, FrmSpectaculars1TypeState> {
    private gdmap: GDMap = new GDMap();
    private timer: any;
    private math = new AuiMath();
    private isInitMap: boolean = false;
    constructor(props: FrmSpectaculars1TypeProps) {
        super(props);
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            carData: new DataSet(),
            toggle,
            allCarNetPanel: new DataSet(),
            weeklyArrCarStatis: new DataSet(),
            countProvince: new DataSet(),
            queryMileageD: 0,
            cars_num: 0,
            driver_num: 0,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.corpName}>
                    <img src={StaticFile.getImage('images/MCimg/corpName.png')} />
                    <span>{this.props.corpName}</span>
                </div>
                <span>车辆网看板</span>
                <div className={styles.toggleIcons}>
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </div>
            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.topBox}>
                    <div className={styles.top_list}>
                        <p className={styles.mcTitle}>数据总览</p>
                        <ul>
                            <li className={styles.li_3}>
                                <div className={styles.topTitle}>车辆数</div>
                                <div className={styles.topInfo}>
                                    {this.state.cars_num} <span>辆</span>
                                </div>
                            </li>
                            <li className={styles.li_3}>
                                <div className={styles.topTitle}>今日里程</div>
                                <div className={styles.topInfo}>
                                    {this.state.queryMileageD.toFixed(2)}<span>万公里</span>
                                </div>
                            </li>
                            <li className={styles.li_3}>
                                <div className={styles.topTitle}>司机数</div>
                                <div className={styles.topInfo}>
                                    {this.state.driver_num}
                                    <span>名</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.toprightEacharBox}>
                        <div className={styles.topBox1}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.mcLink2}></div>
                        </div>
                    </div>
                </div>
                <div className={styles.contentEcharts}>
                    <div className={styles.leftSiteEcharts}>
                        <div className={styles.leftBox1}>
                            <div className={styles.mcTitle}>在线率</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.leftBox2}>
                            <div className={styles.mcTitle}>满载率</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                        <div className={styles.leftBox3}>
                            <div className={styles.mcTitle}>货损率</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        {this.isPhone ? '' : <div className={styles.centerBox1}>
                            <div className={styles.mcMap} id='carMapContainer'></div>
                        </div>}
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>物流运单</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>区域排名TOPS</div>
                            <div className={styles.rightBox1Pie1}></div>
                        </div>
                        <div className={styles.rightBox2}>
                            <div className={styles.mcTitle}>实时动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>08-10 07:37 <span className={styles.colorSkin}>闽DW572</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-07 23:19 <span className={styles.colorSkin}>闽BAC427</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>07-19 23:19 <span className={styles.colorSkin}>闽FEA734</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>07-12 17:39 <span className={styles.colorSkin}>闽ALQ616</span> 行驶超速
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.init();
        this.timer = setInterval(this.init.bind(this), 30000);
        if (!this.isPhone)
            addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, () => {
                this.isInitMap = true;
                this.initMap();
            });
    }

    async initCarData() {
        let carData = this.state.carData;
        this.setState({
            carData,
        }, () => {
            this.initCarSite();
        })
    }

    init() {
        FplApi.getAllCarNetPanel().then((allCarNetPanel: DataSet) => {
            this.setState({
                allCarNetPanel,
                cars_num: allCarNetPanel.getDouble('cars_total_'),
                driver_num: allCarNetPanel.getDouble("driver_num_"),
            }, () => {
                this.initPieChart2();
                this.initPieChart3();
            })
        })

        FplApi.getWeeklyArrCarStatis().then((weeklyArrCarStatis: DataSet) => {
            this.setState({
                weeklyArrCarStatis
            }, () => {
                this.initLineChart();
            })
        })

        // FplApi.getCountProvince().then((countProvince: DataSet) => {
        //     this.setState({
        //         countProvince
        //     }, () => {

        //     })
        // })

        FplApi.getCountProvince().then((countProvince: DataSet) => {
            this.setState({
                countProvince
            }, () => {
                this.initPieChart4();
            })
        })

        FplApi.getQueryCarsLocation().then((queryCarsLocation) => {
            FplApi.getQueryMileageD().then((queryMileageD) => {
                this.setState({
                    carData: queryCarsLocation,
                    queryMileageD: queryMileageD.getDouble('total_mileage_'),
                }, () => {
                    this.initPieChart1();
                })
            })
        })

        this.initLineChart1();
    }

    initMap() {
        if (!this.isInitMap)
            return;
        if (!this.gdmap.map)
            this.gdmap.initMap('carMapContainer', {
                zoom: 8,
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

    //异常动态
    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);

        let ds = new DataSet();
        ds.first();
        let xArr = ['三月', '四月', '五月', '六月', '七月', '八月'];
        let sData = [10, 20, 30, 15, 3, 41];
        // while (ds.fetch()) {
        //     xArr.push(ds.getString('type_goods_'));
        //     sData.push(ds.getDouble('weight_total_'));
        // }
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
                    label: {
                        show: true
                    }
                },
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //在线率
    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let online = this.state.carData.head.getNumber('online_'), total = this.state.carData.head.getNumber('total_');
        if (!online) {
            online = 0;
        }
        let value: any;
        if (online == 0 || total == 0) {
            value = 0;
        } else {
            value = this.math.toFixed(online / total, 2);
        }

        let option = {
            series: [
                {
                    center: this.isPhone ? ['50%', '80%'] : ['55%', '85%'],
                    radius: this.isPhone ? 90 : 62,
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 1,
                    splitNumber: 3,
                    axisLine: {
                        lineStyle: {
                            width: 4,
                            color: [
                                [0.25, MCChartColors[0]],
                                [0.5, MCChartColors[1]],
                                [0.75, MCChartColors[2]],
                                [1, MCChartColors[3]]
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-50%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'inherit',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 6,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 8,
                        distance: -60,
                        formatter: function (value: number) {
                            if (value === 0.875) {
                                return 'A';
                            } else if (value === 0.625) {
                                return 'B';
                            } else if (value === 0.375) {
                                return 'C';
                            } else if (value === 0.125) {
                                return 'D';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 8
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value * 100) + '%';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                        }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //满载率
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let value: any = this.math.toFixed(this.state.allCarNetPanel.getDouble('full_load_rate_') / 100, 2);
        let option = {
            series: [
                {
                    center: this.isPhone ? ['50%', '80%'] : ['55%', '85%'],
                    radius: this.isPhone ? 90 : 62,
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 1,
                    splitNumber: 3,
                    axisLine: {
                        lineStyle: {
                            width: 4,
                            color: [
                                [0.25, MCChartColors[0]],
                                [0.5, MCChartColors[1]],
                                [0.75, MCChartColors[2]],
                                [1, MCChartColors[3]]
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-50%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'inherit',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 6,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 8,
                        distance: -60,
                        formatter: function (value: number) {
                            if (value === 0.875) {
                                return 'A';
                            } else if (value === 0.625) {
                                return 'B';
                            } else if (value === 0.375) {
                                return 'C';
                            } else if (value === 0.125) {
                                return 'D';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 8
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value * 100) + '%';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                        }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //货损率
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let value = this.math.toFixed(this.state.allCarNetPanel.getDouble('avg_loss_rate_') / 100, 2);
        let option = {
            series: [
                {
                    center: this.isPhone ? ['50%', '80%'] : ['55%', '85%'],
                    radius: this.isPhone ? 90 : 62,
                    type: 'gauge',
                    startAngle: 180,
                    endAngle: 0,
                    min: 0,
                    max: 1,
                    splitNumber: 3,
                    axisLine: {
                        lineStyle: {
                            width: 4,
                            color: [
                                [0.25, MCChartColors[0]],
                                [0.5, MCChartColors[1]],
                                [0.75, MCChartColors[2]],
                                [1, MCChartColors[3]]
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-50%'],
                        itemStyle: {
                            color: 'inherit'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'inherit',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 6,
                        lineStyle: {
                            color: 'inherit',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 8,
                        distance: -60,
                        formatter: function (value: number) {
                            if (value === 0.875) {
                                return 'A';
                            } else if (value === 0.625) {
                                return 'B';
                            } else if (value === 0.375) {
                                return 'C';
                            } else if (value === 0.125) {
                                return 'D';
                            }
                            return '';
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 8
                    },
                    detail: {
                        fontSize: 20,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value * 100) + '%';
                        },
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: value,
                        }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //物流运单
    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);

        let ds = this.state.weeklyArrCarStatis;
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('arr_total_'));
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
                    label: {
                        show: true
                    }
                },
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }

    //区域排名TOPS
    initPieChart4() {
        let peiChart = document.querySelector(`.${styles.rightBox1Pie1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);
        let ds = this.state.countProvince;
        ds.first();
        let dataArr: any = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('receive_province_'),
                value: ds.getDouble('num')
            })
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
                left: 0,
                bottom: 0,
                right: 20,
                containLabel: false,
            },
            series: [
                {
                    type: 'pie',
                    center: this.isPhone ? ['30%', '55%'] : ['28%', '50%'],
                    radius: this.isPhone ? ['50%', '80%'] : ['30%', '55%'],
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