import { FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from '../db/DataRow';
import DataSet from '../db/DataSet';
import { Excel, excelData } from '../db/Utils';
import styles from './FrmPurchaseChart.css';
import PieChart from './PieChart';
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";

type stateType = {
    polylineOption: any,
    menuOptions: ViewMenuMap,
    showIndex: number,
    boardConfig: {},
    dynamicDataArr: any[],
    lengedState: boolean[],
    dataList: excelData[],
    saleroom: Map<string, any>,
    refreshKey: number,
    quotation: object[]
}
type PropsType = {
}

export default class FrmSaleChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private lineLenged: string[] = ['一区', '二区', '三区', '四区', '五区'];
    private xName: string[] = [];
    private isLengedEvent: boolean = false;
    private lineColor = ['#ebbb06', '#ff50d1', '#2fa9ff', '#bbff88', '#ffa707', '#04ff00'];
    constructor(props: PropsType) {
        super(props);
        let saleroom: Map<string, any> = new Map();
        saleroom.set('螺纹钢', { price: [], saleroom: [] });
        saleroom.set('线材', { price: [], saleroom: [] });
        saleroom.set('带钢', { price: [], saleroom: [] });
        saleroom.set('板材', { price: [], saleroom: [] });
        saleroom.set('型钢', { price: [], saleroom: [] });
        saleroom.set('管材', { price: [], saleroom: [] });
        this.state = {
            polylineOption: {},
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmSaleChart", "销售数据管理中心")'
            }]]),
            showIndex: 0,
            boardConfig: {},
            lengedState: [true, true, true, true, true],
            dynamicDataArr: [],
            dataList: [],
            saleroom,
            refreshKey: new Date().getTime(),
            quotation: [
                { title: '螺纹钢全国基准价', quotation: 4970, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '线材全国基准价', quotation: 5000, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '带钢全国基准价', quotation: 4940, trendNum: 20, percentage: '0.41%', date: '2022-05-01' },
                { title: '板材全国基准价', quotation: 4970, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '型钢全国基准价', quotation: 5100, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '管材全国基准价', quotation: 5400, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
            ]
        }
    }

    componentDidMount(): void {
        this.initData();
        this.timer = setInterval(() => {
            this.initData()
        }, 30000)
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initData() {
        let dataList: excelData[] = [];
        await fetch('./kanban3_1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
            this.setState({ ...this.state, dataList })
        })
        this.xName = []
        let dynamicDataArr: any[] = new Array(this.lineLenged.length);
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicDataArr[i] = new Array();
        }
        let ds: DataSet = dataList[5].data;
        ds.first();
        while (ds.fetch()) {
            this.xName.push(ds.getString('类型'))
            dynamicDataArr[0].push(ds.getDouble('一区'));
            dynamicDataArr[1].push(ds.getDouble('二区'));
            dynamicDataArr[2].push(ds.getDouble('三区'));
            dynamicDataArr[3].push(ds.getDouble('四区'));
            dynamicDataArr[4].push(ds.getDouble('五区'));
        }

        let saleroom: Map<string, any> = this.state.saleroom;
        let dsSaleroom: DataSet = dataList[6].data;
        dsSaleroom.first()
        dsSaleroom.forEach((item: DataRow) => {
            let array: { price: any, saleroom: any } = saleroom.get(item.getString('材料'));
            array.price.push(item.getDouble('单价'));
            array.saleroom.push(item.getDouble('销售额'));
        })

        this.setState({ ...this.state, dynamicDataArr, saleroom, refreshKey: new Date().getTime() })
        this.initBarChart(dynamicDataArr)
        this.initLineChart()
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='销售数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.saleMainContent} key={this.state.refreshKey}>
                        <div className={styles.saleLeft}>
                            <div><PieChart eleId='PieChart1' pieTitle='螺纹钢销售价格占比分析'
                                price={this.state.saleroom.get('螺纹钢').price}
                                saleroom={this.state.saleroom.get('螺纹钢').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                            <div><PieChart eleId='PieChart2' pieTitle='线材销售价格占比分析'
                                price={this.state.saleroom.get('线材').price}
                                saleroom={this.state.saleroom.get('线材').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                            <div><PieChart eleId='PieChart3' pieTitle='带钢销售价格占比分析'
                                price={this.state.saleroom.get('带钢').price}
                                saleroom={this.state.saleroom.get('带钢').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                        </div>
                        <div className={styles.saleCentre}>
                            <div>
                                {
                                    this.state.quotation.map((item: any) => {
                                        let symbol = '';
                                        if (item.trendNum > 0)
                                            symbol = '+'
                                        if (item.trendNum < 0)
                                            symbol = '-'

                                        return <div className={styles.salePriceBox}>
                                            <ul>
                                                <li className={styles.saleTitle}>{item.title}</li>
                                                <li className={styles.salePrice}
                                                    style={{ color: item.trendNum == 0 ? '' : item.trendNum > 0 ? 'red' : 'green' }}
                                                >
                                                    <div className={styles.saleQuotation}>{item.quotation}</div>
                                                    <div className={styles.saleTrend}>
                                                        <span>{symbol}{item.trendNum}</span>
                                                        <span>{symbol}{item.percentage}</span>
                                                    </div>
                                                </li>
                                                <li className={styles.saleDate}>{item.date}</li>
                                            </ul>
                                        </div>
                                    })
                                }
                            </div>
                            <div>
                                <div className={styles.salePolylineOption} id='lineChart'></div>
                            </div>
                            <div>
                                <div className={styles.saleBlockTopBottomContent} id='barEcharts'></div>
                            </div>
                        </div>
                        <div className={styles.saleRight}>
                            <div><PieChart eleId='PieChart4' pieTitle='板材销售价格占比分析'
                                price={this.state.saleroom.get('板材').price}
                                saleroom={this.state.saleroom.get('板材').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                            <div><PieChart eleId='PieChart5' pieTitle='型钢销售价格占比分析'
                                price={this.state.saleroom.get('型钢').price}
                                saleroom={this.state.saleroom.get('型钢').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                            <div><PieChart eleId='PieChart6' pieTitle='管材销售价格占比分析'
                                price={this.state.saleroom.get('管材').price}
                                saleroom={this.state.saleroom.get('管材').saleroom}
                                lineColor={this.lineColor}
                            ></PieChart></div>
                        </div>
                    </div>
                    {this.getMenus()}
                </FullScreenContainer>
            </div>
        )
    }

    titleClick() {
        let showIndex = this.state.showIndex + 1;
        this.setState({
            showIndex
        })
    }

    getMenus() {
        return <div className={`${styles.defaultMenu} ${this.getMenusStyle()}`}>
            <ViewMenu options={this.state.menuOptions}></ViewMenu>
        </div>
    }

    getMenusStyle() {
        let style = ''
        if (this.state.showIndex > 0)
            style = this.state.showIndex % 2 == 0 ? styles.hideMenu : styles.showMenu
        return style
    }

    initBarChart(dynamicDataArr?: any[]) {
        let dataArr = this.state.dynamicDataArr;
        if (dynamicDataArr)
            dataArr = dynamicDataArr;
        let siteSize = 0;
        let dynamicSeries = [];
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let barWidth = 25;
        let site = 0;

        if (siteSize % 2 != 0)
            site = ((barWidth * (siteSize - 1) + (barWidth * 0.1 * (siteSize - 1))) / 2) * -1;
        else
            site = ((barWidth * siteSize + (barWidth * 0.1 * (siteSize - 1))) / 2 - barWidth / 2) * -1;

        let colorArr = [{
            topColor: '#00ffdb',
            bottomColor: '#00ffdb',
            lineColor: ['#00DDdb', '#00DDdb'],
            textColor: '#00DDdb'
        }, {
            topColor: '#1CD53C',
            bottomColor: '#1b963b',
            lineColor: ['#1CB53C', '#1b963b'],
            textColor: '#B9E2A5'
        }, {
            topColor: '#1CA1D4',
            bottomColor: '#1C71D4',
            lineColor: ['#1C71D4', '#1C71D4'],
            textColor: '#fff'
        }, {
            topColor: '#EBDB06',
            bottomColor: '#ebbb06',
            lineColor: ['#EBBB06', '#ebbb06'],
            textColor: '#F5DF90'
        }, {
            topColor: '#fc8F18',
            bottomColor: '#fc6c18',
            lineColor: ['#fc6c18', '#fc6c18'],
            textColor: '#fc8F18'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth, barWidth / 2],
                symbolOffset: [site, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth, barWidth / 2],
                symbolOffset: [site, 8], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '10%',
                itemStyle: {
                    normal: {
                        color: colorArr[i].lineColor[0]
                    },
                },
                z: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 20,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState[i])
                site = site + barWidth + barWidth * 0.1
        }
        let xData: any[] = [];
        this.xName.forEach(value => {
            xData.push({
                value: value,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                }
            })
        })
        let myChart = echarts.init(document.getElementById('barEcharts'));
        //@ts-ignore
        myChart.setOption({
            title: [{
                text: '各类产品销售月度分析',
                textStyle: {
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 500
                },
                top: 20,
                left: 'center'
            }],
            legend: {
                top: 60,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                },
                itemWidth: 18,
                itemHeight: 18,
                itemGap: 20,
                symbolRotate: 10,
                icon: 'rect'

            },
            grid: {
                top: 140,
                left: 0,
                bottom: 10,
                right: 40,
                containLabel: true,
            },
            tooltip: {
                show: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: xData,
                    textStyle: {
                        fontSize: 20
                    },
                    axisTick: {
                        show: false
                    },
                    nameTextStyle: {
                        color: '#82b0ec',
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#82b0ec',
                        },
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                        margin: 20,
                    },
                },
            ],
            yAxis: [
                {
                    show: false,
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#fff',
                        },
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#0c2c5a',
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                },
            ],
            series: dynamicSeries,
        });
        if (!this.isLengedEvent) {
            this.isLengedEvent = true;
            myChart.on('legendselectchanged', (obj: {
                name: string,
                selected: object,
                type: string
            }) => {
                this.lengedChanage(obj)
            })
        }
    }
    lengedChanage(obj: {
        name: string,
        selected: object,
        type: string
    }) {
        let lengedState: boolean[] = []
        Object.values(obj.selected).forEach((bool: boolean, index: number) => {
            lengedState.push(bool);
        })
        this.setState({
            lengedState
        }, () => {
            this.initBarChart();
        })
    }

    initLineChart(option?: any) {
        let lineSeries = [];
        let lineColir = ['#41aebd', '#EBBB06', '#1CB53C'];
        let purchaseLenged = ['2021年', '2022年', '2022年目标'];
        let purchaseDataArr: any = [[4.3, 2.5, 3.5, 4.5, 5, 6, 7, 8, 3, 6, 4, 9], [2.4, 4.4, 1.8, 2.8], [6, 6, 6, 7, 8, 9, 9, 9, 9, 10, 11, 12]];
        for (let i = 0; i < purchaseLenged.length; i++) {
            lineSeries.push({
                name: purchaseLenged[i],
                type: 'line',
                data: purchaseDataArr[i],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: lineColir[i],
                                fontSize: 16,
                            }
                        }
                    }
                },
                lineStyle: {
                    width: 4
                },
                symbol: 'circle',
                symbolSize: 12
            })
        }
        let lineOption: any = {
            // 标题
            title: [
                {
                    text: '年度销售目标达成分析',
                    textStyle: {
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    },
                    top: 20,
                    left: 'center'
                }
            ],
            color: lineColir,
            textStyle: {
                color: '#fff'
            },
            // 图例
            legend: {
                textStyle: {
                    color: '#fff'
                },
                top: 60
            },
            tooltip: {},
            // 内容区域位置
            grid: {
                left: 40,
                right: 40,
                bottom: 40,
                top: 100,
                containLabel: true
            },
            xAxis: {
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                axisLabel: {
                    fontSize: 18
                }
            },
            yAxis: {
                show: false
            },
            series: lineSeries
        }
        let myChart = echarts.init(document.getElementById('lineChart'));
        myChart.setOption(lineOption);
    }
}
