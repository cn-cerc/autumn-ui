import { FullScreenContainer } from '@jiaminghi/data-view-react';
import { DataRow, DataSet } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import { Excel, excelData } from "../tool/Utils";
import styles from './FrmPurchaseChart4.css';
import PieChart from './PieChart';
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';

type stateType = {
    polylineOption: any,
    menuOptions: ViewMenuMap,
    showIndex: number,
    boardConfig: {},
    dynamicDataArr: any[],
    dynamicDataArr2: any[],
    lengedState: boolean[],
    dataList: excelData[],
    saleroom: Map<string, any>,
    refreshKey: number,
    quotation: object[],
    timeFlag: any,
    timeNub: number,
    pageType1: number
}
type PropsType = {
}

export default class FrmPurchaseChart4 extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private lineLenged: string[] = ['一区', '二区', '三区', '四区', '五区'];
    private xName: string[] = [];
    private xName2: string[] = [];
    private isLengedEvent: boolean = false;
    private lineColor = ['#14C338', '#42E1D2', '#aecc63', '#00bfad', '#40e2c1', '#42aae1'];
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
                href: 'javascript:aui.showPage("FrmPurchaseChart3", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart4", "销售数据管理中心")'
            }]]),
            showIndex: 0,
            boardConfig: {},
            lengedState: [true, true, true, true, true],
            dynamicDataArr: [],
            dynamicDataArr2: [],
            dataList: [],
            saleroom,
            refreshKey: new Date().getTime(),
            quotation: [
                { title: '螺纹钢 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 4970, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '型钢 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 5100, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '带钢 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 4940, trendNum: 20, percentage: '0.41%', date: '2022-05-01' },
                { title: '板材 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 4970, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '线材 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 5000, trendNum: 0, percentage: '0.00%', date: '2022-05-01' },
                { title: '管材 今日挂牌价<span style="color: red">我的钢铁网</span>', quotation: 5400, trendNum: 0, percentage: '0.00%', date: '2022-05-01' }
            ],
            timeFlag: null,
            timeNub: 30 * 1000,
            pageType1: 1
        }
    }

    componentDidMount(): void {
        this.initData();
        // this.timer = setInterval(() => {
        //     this.initData()
        // }, 30000)
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
        this.xName = [];
        this.xName2 = []
        let dynamicDataArr: any[] = new Array(this.lineLenged.length);
        let dynamicDataArr2: any[] = new Array(this.lineLenged.length);
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicDataArr[i] = new Array();
            dynamicDataArr2[i] = new Array();
        }
        let ds: DataSet = dataList[5].data;
        ds.first();
        while (ds.fetch()) {
            if (ds.getString('类型') == '螺纹钢' || ds.getString('类型') == '型钢' || ds.getString('类型') == '带钢') {
                this.xName.push(ds.getString('类型'))
                dynamicDataArr[0].push(ds.getDouble('一区'));
                dynamicDataArr[1].push(ds.getDouble('二区'));
                dynamicDataArr[2].push(ds.getDouble('三区'));
                dynamicDataArr[3].push(ds.getDouble('四区'));
                dynamicDataArr[4].push(ds.getDouble('五区'));
            } else {
                this.xName2.push(ds.getString('类型'))
                dynamicDataArr2[0].push(ds.getDouble('一区'));
                dynamicDataArr2[1].push(ds.getDouble('二区'));
                dynamicDataArr2[2].push(ds.getDouble('三区'));
                dynamicDataArr2[3].push(ds.getDouble('四区'));
                dynamicDataArr2[4].push(ds.getDouble('五区'));
            }
        }

        let saleroom: Map<string, any> = this.state.saleroom;
        let dsSaleroom: DataSet = dataList[6].data;
        dsSaleroom.first()
        dsSaleroom.forEach((item: DataRow) => {
            let array: { price: any, saleroom: any } = saleroom.get(item.getString('材料'));
            array.price.push(item.getDouble('单价'));
            array.saleroom.push(item.getDouble('销售额'));
        })

        this.setState({ ...this.state, dynamicDataArr, dynamicDataArr2, saleroom, refreshKey: new Date().getTime() })
        this.initBarChart(dynamicDataArr);
        this.initLineChart();
        this.autoTogglePage();
    }

    render() {
        return (
            <div className={styles.dataView} key={this.state.pageType1}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='销售数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.btnContent}>
                        <a className={this.state.pageType1 == 1 ? styles.active : ''} onClick={this.toggleData.bind(this, 1)}>螺纹钢/型钢/带钢</a>
                        <a className={this.state.pageType1 == 2 ? styles.active : ''} onClick={this.toggleData.bind(this, 2)}>板材/线材/管材</a>
                    </div>
                    <div className={styles.saleMainContent} key={this.state.refreshKey}>
                        {this.getPieHtml()}
                        <div className={styles.saleCentre}>
                            <div></div>
                            <div>
                                <div className={styles.salePolylineOption} id='lineChart'></div>
                            </div>
                            <div>
                                <div className={styles.saleBlockTopBottomContent} id='barEcharts'></div>
                            </div>
                        </div>
                    </div>
                    {this.getMenus()}
                </FullScreenContainer>
            </div>
        )
    }

    getPieHtml() {
        if (this.state.pageType1 == 1) {
            return this.getSaleLeft1();
        } else {
            return this.getSaleLeft2();
        }
    }

    getSaleLeft1() {
        return <div className={styles.saleLeft}>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart1' pieTitle='螺纹钢销售价格占比分析'
                        price={this.state.saleroom.get('螺纹钢').price}
                        saleroom={this.state.saleroom.get('螺纹钢').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>
                </div>
                <div>
                    {this.getRightinfo(0)}
                </div>
            </div>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart5' pieTitle='型钢销售价格占比分析'
                        price={this.state.saleroom.get('型钢').price}
                        saleroom={this.state.saleroom.get('型钢').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>
                </div>
                <div>
                    {this.getRightinfo(1)}
                </div>
            </div>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart3' pieTitle='带钢销售价格占比分析'
                        price={this.state.saleroom.get('带钢').price}
                        saleroom={this.state.saleroom.get('带钢').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>

                </div>
                <div>
                    {this.getRightinfo(2)}
                </div>
            </div>
        </div>;
    }

    getSaleLeft2() {
        return <div className={styles.saleRight}>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart4' pieTitle='板材销售价格占比分析'
                        price={this.state.saleroom.get('板材').price}
                        saleroom={this.state.saleroom.get('板材').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>
                </div>
                <div>
                    {this.getRightinfo(3)}
                </div>
            </div>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart2' pieTitle='线材销售价格占比分析'
                        price={this.state.saleroom.get('线材').price}
                        saleroom={this.state.saleroom.get('线材').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>
                </div>
                <div>
                    {this.getRightinfo(4)}
                </div>
            </div>
            <div>
                <div className={styles.pieDiv}>
                    <PieChart eleId='PieChart6' pieTitle='管材销售价格占比分析'
                        price={this.state.saleroom.get('管材').price}
                        saleroom={this.state.saleroom.get('管材').saleroom}
                        lineColor={this.lineColor}
                    ></PieChart>
                </div>
                <div>
                    {this.getRightinfo(5)}
                </div>
            </div>
        </div>;
    }

    getRightinfo(i: number) {
        return this.state.quotation.map((item: any, index: number) => {
            if (index == i) {
                let symbol = '';
                if (item.trendNum > 0)
                    symbol = '+'
                if (item.trendNum < 0)
                    symbol = '-'
                return <div className={styles.salePriceBox} key={index}>
                    <ul>
                        <li className={styles.saleTitle} dangerouslySetInnerHTML={{ __html: item.title }}></li>
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
            }
        })
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
        let barWidth = 32;
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
            topColor: '#aecc63',
            bottomColor: '#aecc63',
            lineColor: ['#aecc63', '#aecc63'],
            textColor: '#aecc63'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth, barWidth / 2],
                symbolOffset: [site * 1.27, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth, barWidth / 2],
                symbolOffset: [site * 1.27, 8], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '40%',
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
        var xName = this.xName;
        if (this.state.pageType1 == 2) {
            xName = this.xName2;
        }
        xName.forEach(value => {
            xData.push({
                value: value,
                textStyle: {
                    fontSize: 18,
                    color: '#fff'
                }
            })
        })
        let barChart = document.getElementById('barEcharts') as HTMLDivElement;
        let myChart = echarts.init(barChart);
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
            this.initLineChart();
        })
    }

    initLineChart(option?: any) {
        let lineSeries = [];
        let lineColir = ['#41aebd', '#EBBB06', '#1CB53C'];
        let purchaseLenged1 = ['螺纹钢', '型钢', '带钢'];
        let purchaseLenged2 = ['线材', '板材', '管材'];
        let purchaseDataArr1: any = [
            [10, 12, 13, 14, 12, 8, 8.8, 10, 12, 11, 9, 10],
            [11, 11.5, 12, 13, 13],
            // [6, 2.1, 6, 9, 3, 6.9, 4.9, 11, 9, 10, 9.5, 10.9],
            [15, 18, 19, 18, 16, 14, 16, 15.5, 14, 13.8, 15, 16.8],
            [12, 16, 18, 19, 18],
            // [2, 3.6, 5, 2, 8.3, 9, 4, 9, 5.1, 10.5, 9, 10.5],
            [6, 8, 9.5, 8, 7.5, 8, 7, 6.5, 6, 5.5, 7, 7.8],
            [6.5, 7.5, 8, 9, 7.9],
            // [9, 6.1, 7, 4, 6.8, 1, 9, 7, 9, 7, 8.9, 10]
        ];
        let purchaseDataArr2: any = [
            [32, 28, 29.6, 31, 31.5, 34, 32, 30, 28, 29.2, 28.6, 29],
            [31.8, 32.6, 31.4, 30, 28],
            // [6, 2.1, 6, 9, 3, 9, 9, 11, 9, 10, 7, 8],
            [16, 18, 17.8, 16.5, 15.5, 17, 18.2, 16.8, 19.3, 20, 20.5, 18],
            [18, 18.5, 17, 17.8, 16],
            // [2, 6, 5, 2, 8.3, 8.9, 3, 9, 5.1, 10.5, 9, 10.5],
            [25, 25.5, 26, 26.8, 24.5, 23.8, 22, 24, 26, 26.8, 25.7, 26.3],
            [28, 26.8, 24, 25.9, 26],
            // [9, 6.6, 6.8, 4, 6.8, 7, 9, 6.7, 5.9, 6.8, 8.9, 10]
        ];
        let purchaseLenged: any[], purchaseDataArr;
        if (this.state.pageType1 == 1) {
            purchaseLenged = purchaseLenged1;
            purchaseDataArr = purchaseDataArr1;
        } else {
            purchaseLenged = purchaseLenged2;
            purchaseDataArr = purchaseDataArr2;
        }
        for (let i = 0; i < purchaseDataArr.length; i++) {
            let type = 'solid', color = '', leagedName = '', opacity = 1;
            if (i < 2) {
                color = lineColir[0];
                leagedName = purchaseLenged[0];
            } else if (i < 4) {
                color = lineColir[1];
                leagedName = purchaseLenged[1];
            } else {
                color = lineColir[2];
                leagedName = purchaseLenged[2];
            }

            if (i % 2 == 0) {
                type = 'dotted';
                opacity = 0.6;
            }
                
            lineSeries.push({
                name: leagedName,
                type: 'line',
                data: purchaseDataArr[i],
                smooth: true,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                // color: lineColir[i],
                                color: '#fff',
                                fontSize: 16,
                            }
                        }
                    }
                },
                lineStyle: {
                    width: 3,
                    type: type,
                    opacity: opacity,
                    color: color
                },
                symbol: 'circle',
                symbolSize: 6
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
            tooltip: {
                formatter: function (obj: any) {
                    let num = obj.componentIndex % 2;
                    let num2;
                    let arr = ['2021年', '2022年'];
                    if (obj.componentIndex < 2)
                        num2 = 0;
                    else if (obj.componentIndex < 4)
                        num2 = 1;
                    else
                        num2 = 2;
                    return `${purchaseLenged[num2]}${arr[num]}<br/>
                                <div style="width: 120px; display: flex; align-items: center; padding-top: 12px;">
                                    <span style="background-color: ${obj.color}; width: 12px; height: 12px; border-radius: 50%;"></span>
                                    <span style="width: 5em; padding-left: 0.5em;">${obj.name}</span>
                                    <span style="font-size: 18px; color: black; font-weight: 500;">${obj.data}</span>
                                </div>
                    `
                },
            },
            // 内容区域位置
            grid: {
                left: 30,
                right: 30,
                bottom: 30,
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
                    fontSize: 18,
                }
            },
            yAxis: {
                show: false
            },
            series: lineSeries
        }
        let lineChart = document.getElementById('lineChart') as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        myChart.setOption(lineOption);
    }
    //切换界面图表及数据
    toggleData(type: number) {
        var pageType1: number;
        switch (type) {
            case 1:
                pageType1 = 1;
                break;
            case 2:
                pageType1 = 2;
                break;
        }
        this.setState({ pageType1 }, () => {
            this.setState({ timeNub: 30 * 1000 });
            clearInterval(this.state.timeFlag);
            this.setState({
                timeFlag: null
            });
            this.initData();
        });
    }
    //设置自动切换界面
    autoTogglePage() {
        this.setState({
            timeFlag: setInterval(() => {
                var type = this.state.pageType1 == 1 ? 2 : 1;
                if (type == 1) {
                    this.setState({
                        pageType1: 1
                    });
                    this.initBarChart(this.state.dynamicDataArr);
                    this.initLineChart();
                } else {
                    this.setState({
                        pageType1: 2
                    });
                    this.initBarChart(this.state.dynamicDataArr2);
                    this.initLineChart();
                }
            }, 30000)
            // }, this.state.timeNub)
        })
    }
}
