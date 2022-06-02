import { FullScreenContainer } from '@jiaminghi/data-view-react';
import { DataRow, DataSet } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import { AuiMath } from '../tool/Summer';
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
    lengedState1: boolean[],
    dataList: excelData[],
    saleroom: Map<string, any>,
    refreshKey: number,
    quotation: object[],
    timeFlag: any,
    timeNub: number,
    pageType1: number,
    area1: DataSet,
    area2: DataSet,
    area3: DataSet,
    area4: DataSet,
    area5: DataSet,
    page1Month12: any,
    page2Month12: any
}
type PropsType = {
    pageType1?: number
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
        let pageType1 = this.props.pageType1 ? this.props.pageType1 : 1;
        this.state = {
            polylineOption: {},
            menuOptions: new Map([['工业4.0-数字化供应链管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart3", "工业4.0-数字化供应链管理中心V1.0")'
            }], ['工业4.0-数字化制造管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart5", "工业4.0-数字化制造管理中心V1.0")'
            }], ['工业4.0-数字化销售管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart4", "工业4.0-数字化销售管理中心V1.0")'
            }]]),
            showIndex: 0,
            boardConfig: {},
            lengedState: [true, true, true, true, true],
            lengedState1: [true, true, true, true, true],
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
            pageType1,
            area1: new DataSet,
            area2: new DataSet,
            area3: new DataSet,
            area4: new DataSet,
            area5: new DataSet,
            page1Month12: [],
            page2Month12: [],
        }
    }

    componentDidMount(): void {
        this.initData();
        document.onkeydown = (e: any) => {
            e = e || window.event;
            if (e.keyCode == 32) {
                this.clearIntervalFun();
                return;
            }
            if (e.keyCode == 49 || e.keyCode == 97) {
                this.setState({ timeNub: 30 * 1000 });
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag: null
                });
                this.autoTogglePage();
            } else if (e.keyCode == 50 || e.keyCode == 98) {
                this.setState({ timeNub: 60 * 1000 });
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag: null
                });
                this.autoTogglePage();
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.timeFlag);
        this.setState({
            timeFlag: null
        });
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
    }

    async initData() {
        let dataList: excelData[] = [];
        let page1Temp: number[][] = [],
            page2Temp: number[][] = [];
        let math = new AuiMath();
        await fetch('./kanban3_1.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
            this.setState({ ...this.state, dataList, area1: dataList[6].data, area2: dataList[7].data, area3: dataList[8].data, area4: dataList[9].data, area5: dataList[10].data });
            let fullYearList: DataSet = dataList[4].data;
            for (var i = 0; i < 6; i++) {
                page1Temp.push([]);
                page2Temp.push([]);
            }
            fullYearList.first();
            while (fullYearList.fetch()) {
                page1Temp[0].push(fullYearList.getDouble('螺纹钢'));
                page1Temp[2].push(fullYearList.getDouble('型钢'));
                page1Temp[4].push(fullYearList.getDouble('带钢'));
                page2Temp[0].push(fullYearList.getDouble('线材'));
                page2Temp[2].push(fullYearList.getDouble('板材'));
                page2Temp[4].push(fullYearList.getDouble('管材'));
            }
        })
        let now = new Date();
        let nowMonth = now.getMonth();
        let nowDay = now.getDate();
        this.xName = [];
        this.xName2 = []
        let dynamicDataArr: any[] = new Array(this.lineLenged.length);
        let dynamicDataArr2: any[] = new Array(this.lineLenged.length);
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicDataArr[i] = new Array();
            dynamicDataArr2[i] = new Array();
        }
        let fiveArea = [this.state.area1, this.state.area2, this.state.area3, this.state.area4, this.state.area5]; //保存五个区
        let page1Month12: { name: string, value: number }[][] = [],
            page2Month12: { name: string, value: number }[][] = [];
        var temp: number[][] = [];
        for (var i = 0; i < 6; i++) {
            temp.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }
        fiveArea.forEach((area, areaIndex) => {
            page1Month12 = [],
                page2Month12 = [];
            for (let i = 0; i < 12; i++) {
                page1Month12.push([{ name: '螺纹钢', value: 0 }, { name: '型钢', value: 0 }, { name: '带钢', value: 0 }]);
                page2Month12.push([{ name: '线材', value: 0 }, { name: '板材', value: 0 }, { name: '管材', value: 0 }]);
            }
            let ds: DataSet = area;
            ds.first();
            while (ds.fetch()) {
                let zl = ds.getString('类型'); //保存种类
                let xssl = ds.getDouble('销售数量'); //保存销售数量
                for (var i = 0; i < 12; i++) { //循坏12个月

                    if (zl == '螺纹钢' || zl == '型钢' || zl == '带钢') {
                        if (new Date(ds.getString('接单日期')).getMonth() == i && new Date(ds.getString('接单日期')) <= now) {
                            if (zl == '螺纹钢') {
                                this.xName[0] = zl;
                                page1Month12[i][0].value = math.toFixed(page1Month12[i][0].value + xssl, 1);
                            }
                            if (zl == '型钢') {
                                this.xName[1] = zl;
                                page1Month12[i][1].value = math.toFixed(page1Month12[i][1].value + xssl, 1);
                            }
                            if (zl == '带钢') {
                                this.xName[2] = zl;
                                page1Month12[i][2].value = math.toFixed(page1Month12[i][2].value + xssl, 1);
                            }
                        }
                    } else {
                        if (new Date(ds.getString('接单日期')).getMonth() == i && new Date(ds.getString('接单日期')) <= now) {
                            if (zl == '线材') {
                                this.xName2[0] = zl;
                                page2Month12[i][0].value = math.toFixed(page2Month12[i][0].value + xssl, 1);
                            }
                            if (zl == '板材') {
                                this.xName2[1] = zl;
                                page2Month12[i][1].value = math.toFixed(page2Month12[i][1].value + xssl, 1);
                            }
                            if (zl == '管材') {
                                this.xName2[2] = zl;
                                page2Month12[i][2].value = math.toFixed(page2Month12[i][2].value + xssl, 1);
                            }
                        }
                    }
                }
                //计算当前月份的数据分析
                if (new Date(ds.getString('接单日期')).getMonth() == nowMonth) {
                    if (zl == '螺纹钢')
                        dynamicDataArr[areaIndex][0] = page1Month12[nowMonth][0].value;

                    if (zl == '型钢')
                        dynamicDataArr[areaIndex][1] = page1Month12[nowMonth][1].value

                    if (zl == '带钢')
                        dynamicDataArr[areaIndex][2] = page1Month12[nowMonth][2].value;

                    if (zl == '线材')
                        dynamicDataArr2[areaIndex][0] = page2Month12[nowMonth][0].value;

                    if (zl == '板材')
                        dynamicDataArr2[areaIndex][1] = page2Month12[nowMonth][1].value;

                    if (zl == '管材')
                        dynamicDataArr2[areaIndex][2] = page2Month12[nowMonth][2].value;

                }
            }
            //结算五个区 12个月的数据分析
            for (var j = 0; j < 12; j++) {
                for (var k = 0; k < 3; k++) {
                    temp[k][j] = math.toFixed(temp[k][j] + page1Month12[j][k].value, 1);
                }
                for (var k = 0; k < 3; k++) {
                    temp[k + 3][j] = math.toFixed(temp[k][j] + page2Month12[j][k].value, 1);
                }
            }

        })
        for (var i = 0; i < 6; i++) {
            temp[i].splice(nowMonth + 1, temp[i].length);
        }
        page1Temp[1] = temp[0];
        page1Temp[3] = temp[1];
        page1Temp[5] = temp[2];
        page2Temp[1] = temp[3];
        page2Temp[3] = temp[4];
        page2Temp[5] = temp[5];

        this.setState({
            ...this.state,
            page1Month12: page1Temp,
            page2Month12: page2Temp
        })

        let saleroom: Map<string, any> = this.state.saleroom;
        let dsSaleroom: DataSet = dataList[5].data;
        dsSaleroom.first()
        dsSaleroom.forEach((item: DataRow) => {
            let array: { price: any, saleroom: any } = saleroom.get(item.getString('材料'));
            array.price.push(item.getDouble('单价'));
            array.saleroom.push(item.getDouble('销售额'));
        })

        this.setState({ ...this.state, dynamicDataArr, dynamicDataArr2, saleroom, refreshKey: new Date().getTime() })
        this.initBarChart();
        this.initLineChart();
        this.autoTogglePage();
    }

    render() {
        return (
            <div className={styles.dataView} key={this.state.pageType1}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='工业4.0-数字化销售管理中心<span style="font-size:16px;">V1.0</span>' handleCick={this.titleClick.bind(this)} />
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 0, pageType1: this.state.pageType1 })
                        }}
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 1, pageType1: this.state.pageType1 })
                        }}
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 2, pageType1: this.state.pageType1 })
                        }}
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 3, pageType1: this.state.pageType1 })
                        }}
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 4, pageType1: this.state.pageType1 })
                        }}
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
                        onClick={() => {
                            //@ts-ignore
                            aui.showPage("SaleDetail1", "工业4.0-数字化销售管理中心V1.0", { index: 5, pageType1: this.state.pageType1 })
                        }}
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
        let dataArr;
        if (this.state.pageType1 == 1) {
            dataArr = this.state.dynamicDataArr;
        } else {
            dataArr = this.state.dynamicDataArr2;
        }
        let siteSize = 0;
        let dynamicSeries = [];
        if (this.state.pageType1 == 1) {
            this.state.lengedState.forEach((bool: boolean) => {
                if (bool)
                    siteSize++;
            })
        } else {
            this.state.lengedState1.forEach((bool: boolean) => {
                if (bool)
                    siteSize++;
            })
        }

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
            if (this.state.pageType1 == 1) {
                if (this.state.lengedState[i])
                    site = site + barWidth + barWidth * 0.1
            } else {
                if (this.state.lengedState1[i])
                    site = site + barWidth + barWidth * 0.1
            }
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
        myChart.off('legendselectchanged');
        myChart.on('legendselectchanged', (obj: {
            name: string,
            selected: object,
            type: string
        }) => {
            this.lengedChanage(obj)
        })
        myChart.on('click', (params: any) => {
            let num = this.state.pageType1 == 1 ? 0 : 3;
            let index: number = num + params.dataIndex;
            //@ts-ignore
            aui.showPage("SaleDetail2", "工业4.0-数字化销售管理中心V1.0", { index, pageType1: this.state.pageType1 });
        })
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
        if (this.state.pageType1 == 1) {
            this.setState({
                lengedState
            }, () => {
                this.initBarChart(this.state.dynamicDataArr);
            })
        } else {
            this.setState({
                lengedState1: lengedState
            }, () => {
                this.initBarChart(this.state.dynamicDataArr2);
            })
        }

    }

    initLineChart(option?: any) {
        let lineSeries = [];
        let lineColir = ['#41aebd', '#EBBB06', '#1CB53C'];
        let purchaseLenged1 = ['螺纹钢', '型钢', '带钢'];
        let purchaseLenged2 = ['板材', '线材', '管材'];
        let purchaseDataArr1: any = this.state.page1Month12;
        let purchaseDataArr2: any = this.state.page2Month12;
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
                    return `${obj.seriesName}${arr[num]}<br/>
                                <div style="width: 120px; display: flex; align-items: center; padding-top: 12px;">
                                    <span style="background-color: ${obj.color}; width: 12px; height: 12px; border-radius: 50%;"></span>
                                    <span style="width: 5em; padding-left: 0.5em;">${obj.name}</span>
                                    <span style="font-size: 18px; color: black; font-weight: 500;">${obj.data}</span>
                                </div>`;
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
        myChart.on('click', (params: any) => {
            let name: string = params.seriesName;
            let arr = ['螺纹钢', '型钢', '带钢', '板材', '线材', '管材'];
            let num = arr.indexOf(name);
            //@ts-ignore
            aui.showPage("SaleDetail3", "工业4.0-数字化销售管理中心V1.0", { index: num, pageType1: this.state.pageType1 });
        })
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
        this.setState({
            lengedState: [true, true, true, true, true],
            lengedState1: [true, true, true, true, true]
        }, () => {
            this.setState({ pageType1 }, () => {
                this.setState({ timeNub: 30 * 1000 });
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag: null
                });
                this.initData();
            });
        })
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
                    this.initBarChart();
                    this.initLineChart();
                } else {
                    this.setState({
                        pageType1: 2
                    });
                    this.initBarChart();
                    this.initLineChart();
                }
            }, this.state.timeNub)
        })
    }

    //关闭或开启界面定时切换
    clearIntervalFun() {
        if (this.state.timeFlag != null) {
            clearInterval(this.state.timeFlag);
            this.setState({ timeFlag: null });
        } else {
            this.autoTogglePage();
        }
    }
}
