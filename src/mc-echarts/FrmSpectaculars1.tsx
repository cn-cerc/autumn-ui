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
}

type FrmSpectaculars1TypeState = {
    carData: DataSet,
    lineData: DataSet,
    toggle: number,
    allCarNetPanel: DataSet,
    weeklyArrCarStatis: DataSet,
    countProvince: DataSet,
    cars_num: String,
    driver_num: String,
}

export default class FrmSpectaculars1 extends WebControl<FrmSpectaculars1TypeProps, FrmSpectaculars1TypeState> {
    private gdmap: GDMap = new GDMap();
    constructor(props: FrmSpectaculars1TypeProps) {
        super(props);
        let lineData = new DataSet();
        lineData.append().setValue('Value_', 258).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 240).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 350).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周日');
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            carData: new DataSet(),
            lineData,
            toggle,
            allCarNetPanel: new DataSet(),
            weeklyArrCarStatis: new DataSet(),
            countProvince: new DataSet(),
            cars_num: "0",
            driver_num: "0",
        }
    }

    async init() {
        let allCarNetPanel = await FplApi.getAllCarNetPanel();
        let weeklyArrCarStatis = await FplApi.getWeeklyArrCarStatis();
        let countProvince = await FplApi.getCountProvince();
        let queryCarsLocation = await FplApi.getQueryCarsLocation();
        this.setState({
            ...this.state,
            allCarNetPanel,
            weeklyArrCarStatis,
            countProvince,
            cars_num: allCarNetPanel.getString('cars_total_'),
            driver_num: allCarNetPanel.getString("driver_num_"),
        }, () => {
            this.initLineChart();
            this.initLineChart1();
            this.initPieChart1();
            this.initPieChart2();
            this.initPieChart3();
            this.initPieChart4();
        })

    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>营运数据中心</span>
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
                                <div className={styles.topTitle}>车辆数</div>
                                <div className={styles.topInfo}>
                                    {this.state.carData.head.getString('total_')} <span>辆</span>
                                </div>
                            </div>
                        </li>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/5.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>今日里程(对接中)</div>
                                <div className={styles.topInfo}>
                                    46 <span>万公里</span>
                                </div>
                            </div>
                        </li>
                        <li className={styles.li_3}>
                            <div>
                                <img src={StaticFile.getImage('images/MCimg/4.png')} alt="" />
                            </div>
                            <div>
                                <div className={styles.topTitle}>司机数</div>
                                <div className={styles.topInfo}>
                                    {this.state.driver_num}
                                    <span>名</span>
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
                        <div className={styles.centerBox1}>
                            <div className={styles.mcMap} id='carMapContainer'>
                                <img src={StaticFile.getImage('images/MCimg/map.png')} alt="" />
                            </div>
                        </div>
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
                            <div className={styles.mcTitle}>异常动态</div>
                            <div className={styles.mcLink2}></div>
                        </div>
                        <div className={styles.rightBox3}>
                            <div className={styles.mcTitle}>实时动态</div>
                            <div className={styles.srcollListContent}>
                                <ul className={styles.srcollListMain}>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        06-25 11:26 <span className={styles.colorSkin}>粤BFC888</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        05-06 09:53 <span className={styles.colorSkin}>闽ALQ616</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        04-12 20:39 <span className={styles.colorSkin}>浙AWC226</span> 行驶超速
                                    </li>
                                    <li>
                                        <i className={styles.rSkin}></i>
                                        06-25 11:26 <span className={styles.colorSkin}>赣CHQ813</span> 行驶超速
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
        this.initCarData();
        // addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this))
    }
    async initCarData() {
        let carData = await FplApi.queryCarsCurrentLocation();
        this.setState({
            carData
        }, () => {
            this.initPieChart1();
        })
    }

    initMap() {
        this.gdmap.initMap('carMapContainer');
    }

    initLineChart1() {
        let lineChart = document.querySelector(`.${styles.mcLink2}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let xArr = [];
        let sData = [['周一', 10], ['周二', 14], ['周三', 12], ['周四', 2], ['周五', 10], ['周六', 2], ['周日', 6]];
        let base = +new Date(2022, 5, 17);
        let oneDay = 24 * 3600 * 1000;

        let data = [[base, Math.random() * 100]];

        for (let i = 1; i < 365; i++) {
            let now = new Date((base += oneDay));
            data.push([+now, Math.round((Math.random() * 0.5) * 200)]);
        }

        let option = {
            xAxis: {
                type: 'time',
                boundaryGap: false
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            grid: {
                top: 20,
                left: 0,
                bottom: 10,
                right: 16,
                containLabel: true,
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    areaStyle: {},
                    data: data
                }
            ]
        };


        //@ts-ignore
        myChart.setOption(option);
    }
    //物流运单
    initLineChart() {
        let lineChart = document.querySelector(`.${styles.mcLink}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = this.state.weeklyArrCarStatis;
        let xArr = [];
        let sData = [];
        ds.first();
        while (ds.fetch()) {
            xArr.push(`${ds.getString('date_').split("-")[1]}.${ds.getString('date_').split("-")[2]}`);
            sData.push(ds.getDouble('arr_total_'));
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
    //在线率
    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let math = new AuiMath();
        var value = isNaN(math.toFixed(this.state.carData.head.getDouble('online_') / this.state.carData.head.getDouble('total_') * 100, 2)) ? 0 : math.toFixed(this.state.carData.head.getDouble('online_') / this.state.carData.head.getDouble('total_') * 100, 2);
        const gaugeData = [
            {
                value: value,
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
                    color: ['#63DAAB'],
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#63DAAB'
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
                        color: 'inherit',
                        borderColor: 'inherit',
                        formatter: '{value}%'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    //满载率
    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        const gaugeData = [
            {
                value: this.state.allCarNetPanel.getDouble('full_load_rate_').toFixed(4),
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
                        color: 'inherit',
                        borderColor: 'inherit',
                        formatter: '{value}%'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    //货损率
    initPieChart3() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie3}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        const gaugeData = [
            {
                value: this.state.allCarNetPanel.getDouble('avg_loss_rate_').toFixed(4),
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
                        color: 'inherit',
                        borderColor: 'inherit',
                        formatter: '{value}%'
                    }
                }
            ]
        };

        //@ts-ignore
        myChart.setOption(option);
    }
    //
    initPieChart4() {
        let peiChart = document.querySelector(`.${styles.rightBox1Pie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
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
                top: '8%',
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