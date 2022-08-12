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
    online_num: number,
    cars_num: number,
    driver_num: number,
}

export default class FrmSpectaculars1 extends WebControl<FrmSpectaculars1TypeProps, FrmSpectaculars1TypeState> {
    private gdmap: GDMap = new GDMap();
    private timer: any;
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
            online_num: 0,
            cars_num: 0,
            driver_num: 0,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>营运数据中心</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>
            </div>
            <div className={styles.topBox}>
                <div className={styles.top_list}>
                    <p>数据总览</p>
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
                        <div className={styles.mcTitle}>在线率</div>
                        <div className={styles.FrmTaurusMCPie1}></div>
                    </div>
                    <div className={styles.topBox2}>
                        <div className={styles.mcTitle}>满载率</div>
                        <div className={styles.FrmTaurusMCPie2}></div>
                    </div>
                </div>
            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.contentEcharts}>
                    <div className={styles.leftSiteEcharts}>
                        <div className={styles.leftBox1}>
                            <div className={styles.mcTitle}>货损率</div>
                            <div className={styles.FrmTaurusMCPie3}></div>
                        </div>
                        <div className={styles.leftBox2}>
                            <div className={styles.mcTitle}>区域排名TOPS</div>
                            <div className={styles.leftBox1Pie1}></div>
                        </div>
                    </div>
                    <div className={styles.centerSiteEcharts}>
                        <div className={styles.centerBox1}>
                            <div className={styles.mcMap} id='carMapContainer'></div>
                        </div>
                        <div className={styles.centerBox2}>
                            <div className={styles.mcTitle}>物流运单</div>
                            <div className={styles.mcLink}></div>
                        </div>
                    </div>
                    <div className={styles.rIghtSiteEcharts}>
                        <div className={styles.rightBox1}>
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.mcLink2}></div>
                        </div>
                        <div className={styles.rightBox2}>
                            <div className={styles.mcTitle}>实时动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>08-10 07:37 <span className={styles.colorSkin}>闽DW572</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>08-07 23:19 <span className={styles.colorSkin}>闽BA427</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>07-19 23:19 <span className={styles.colorSkin}>闽FE734</span> 行驶超速
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
        addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this));
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

        FplApi.getCountProvince().then((countProvince: DataSet) => {
            this.setState({
                countProvince
            }, () => {

            })
        })

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
                    online_num: queryCarsLocation.head.getDouble('online_'),
                    queryMileageD: queryMileageD.getDouble('total_mileage_'),
                }, () => {
                    this.initLineChart1();
                    this.initPieChart1();
                })
            })
        })
    }

    initMap() {
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
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 20,
                left: 0,
                bottom: 10,
                right: 16,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'line',
                    smooth: true,
                    // symbol: 'none',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0],
                        width: 1
                    },
                    areaStyle: {},
                },
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(lineChart);
        if (!myChart)
            myChart = echarts.init(lineChart);

        let ds = this.state.weeklyArrCarStatis;
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('XName_'));
            sData.push(ds.getDouble('Value_'));
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
                top: 15,
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
                    // symbol: 'none',
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

    //在线率
    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let math = new AuiMath();
        let online = this.state.online_num, total = this.state.cars_num;
        if (!online) {
            online = 0;
        }
        let value: any;
        if (online == 0 || total == 0) {
            value = 0;
        } else {
            value = math.toFixed(online / total * 100, 2);
        }
        // const gaugeData = [
        //     {
        //         value: value,
        //         title: {
        //             offsetCenter: ['0%', '30%']
        //         },
        //         detail: {
        //             valueAnimation: true,
        //             offsetCenter: ['0%', '10%']
        //         }
        //     }
        // ];
        // let option = {
        //     series: [
        //         {
        //             type: 'gauge',
        //             startAngle: 90,
        //             endAngle: -270,
        //             pointer: {
        //                 show: false
        //             },
        //             color: ['#63DAAB'],
        //             progress: {
        //                 show: true,
        //                 overlap: false,
        //                 roundCap: true,
        //                 clip: false,
        //                 itemStyle: {
        //                     borderWidth: 1,
        //                     borderColor: '#63DAAB'
        //                 }
        //             },
        //             axisLine: {
        //                 lineStyle: {
        //                     width: 6
        //                 }
        //             },
        //             splitLine: {
        //                 show: false,
        //                 distance: 0,
        //                 length: 10
        //             },
        //             axisTick: {
        //                 show: false
        //             },
        //             axisLabel: {
        //                 show: false,
        //                 distance: 20
        //             },
        //             data: gaugeData,
        //             title: {
        //                 fontSize: 14
        //             },
        //             detail: {
        //                 width: 5,
        //                 height: 14,
        //                 fontSize: 14,
        //                 color: 'inherit',
        //                 borderColor: 'inherit',
        //                 formatter: '{value}%'
        //             }
        //         }
        //     ]
        // };

        let option = {
            series: [
                {
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
                                [0.25, '#FF6E76'],
                                [0.5, '#FDDD60'],
                                [0.75, '#58D9F9'],
                                [1, '#7CFFB2']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '12%',
                        width: 8,
                        offsetCenter: [0, '-60%'],
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        length: 4,
                        lineStyle: {
                            color: 'auto',
                            width: 1
                        }
                    },
                    splitLine: {
                        length: 14,
                        lineStyle: {
                            color: 'auto',
                            width: 3
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
                        fontSize: 16,
                        offsetCenter: [0, '0%'],
                        valueAnimation: true,
                        formatter: function (value: number) {
                            return Math.round(value) + '分';
                        },
                        color: 'auto'
                    },
                    data: [
                        {
                            value: value,
                            name: 'Grade Rating'
                        }
                    ]
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);


        const gaugeData = [
            {
                value: 99,
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '10%']
                }
            }
        ];
        let option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    color: ['#578DF9'],
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#578DF9'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 6
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 20
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 5,
                        height: 14,
                        fontSize: 14,
                        color: 'auto',
                        borderColor: 'auto',
                        formatter: '{value}%'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);


        const gaugeData = [
            {
                value: 10,
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '10%']
                }
            }
        ];
        let option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    color: ['#E6806C'],
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#E6806C'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 6
                        }
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 10
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 20
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 14
                    },
                    detail: {
                        width: 5,
                        height: 14,
                        fontSize: 14,
                        color: 'auto',
                        borderColor: 'auto',
                        formatter: '{value}%'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    initPieChart4() {
        let peiChart = document.querySelector(`.${styles.leftBox1Pie1}`) as HTMLDivElement;
        let myChart = echarts.getInstanceByDom(peiChart);
        if (!myChart)
            myChart = echarts.init(peiChart);

        let ds = this.state.countProvince;
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
            grid: {
                top: 40,
                left: 5,
                bottom: 5,
                right: 50,
                containLabel: true,
            },
            series: [
                {
                    name: '司机年龄',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    color: MCChartColors,
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '16',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        length: 5,
                        length2: 5,
                        maxSurfaceAngle: 80
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