import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import { DataRow } from "autumn-ui";
import React from "react";
import { AuiMath } from '../tool/Summer';
import { Excel, excelData } from "../tool/Utils";
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
type stateType = {
    polylineOption: any,
    option: any,
    wireRow: DataRow,
    coilRow: DataRow,
    hSteelRow: DataRow,
    steelRow: DataRow,
    listTypeArr1: listType[],
    listTypeArr2: listType[],
    listTypeArr3: listType[],
    listTypeArr4: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number,
    boardConfig: {}
}
type PropsType = {
}

export default class FrmSaleChart1 extends React.Component<PropsType, stateType> {
    private timer: any = null;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            polylineOption: {},
            option: {},
            wireRow: new DataRow(),
            coilRow: new DataRow(),
            hSteelRow: new DataRow(),
            steelRow: new DataRow(),
            listTypeArr1: [{
                name: '今日接单数量',
                key: 'todayOrder',
                href: 'javascript:aui.showPage("FrmReport9", "线材接单今日动态（T）", { index: 0 })'
            }, {
                name: '本月接单数量',
                key: 'monthOrder',
                href: 'javascript:aui.showPage("FrmReport11", "线材本月接单动态（T）", { index: 0 })'
            }, {
                name: '本年接单数量',
                key: 'yearOrder',
                href: 'javascript:aui.showPage("FrmReport12", "线材本年接单动态（T）", { index: 0 })'
            }, {
                name: '今日出库数量',
                key: 'todayOutStock',
                href: 'javascript:aui.showPage("FrmReport13", "线材今日出库动态（T）", { index: 0 })'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock',
                href: 'javascript:aui.showPage("FrmReport15", "线材本月出库动态（4月）", { index: 0 })'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock',
                href: 'javascript:aui.showPage("FrmReport16", "线材本年出货动态（2022年）", { index: 0 })'
            }, {
                name: '当前未出库数',
                key: 'onOutStock',
                href: 'javascript:aui.showPage("FrmReport17", "线材未出货订单与库存动态（T）", { index: 0 })'
            }, {
                name: '当前库存数量',
                key: 'inStock',
            }],
            listTypeArr2: [{
                name: '今日接单数量',
                key: 'todayOrder',
                href: 'javascript:aui.showPage("FrmReport9", "卷材接单今日动态（T）", { index: 1 })'
            }, {
                name: '本月接单数量',
                key: 'monthOrder',
                href: 'javascript:aui.showPage("FrmReport11", "卷材本月接单动态（T）", { index: 1 })'
            }, {
                name: '本年接单数量',
                key: 'yearOrder',
                href: 'javascript:aui.showPage("FrmReport12", "卷材本年接单动态（T）", { index: 1 })'
            }, {
                name: '今日出库数量',
                key: 'todayOutStock',
                href: 'javascript:aui.showPage("FrmReport13", "卷材今日出库动态（T）", { index: 1 })'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock',
                href: 'javascript:aui.showPage("FrmReport15", "卷材本月出库动态（4月）", { index: 1 })'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock',
                href: 'javascript:aui.showPage("FrmReport16", "卷材本年出货动态（2022年）", { index: 1 })'
            }, {
                name: '当前未出库数',
                key: 'onOutStock',
                href: 'javascript:aui.showPage("FrmReport17", "卷材未出货订单与库存动态（T）", { index: 1 })'
            }, {
                name: '当前库存数量',
                key: 'inStock',
            }],
            listTypeArr3: [{
                name: '今日接单数量',
                key: 'todayOrder',
                href: 'javascript:aui.showPage("FrmReport9", "H钢材接单今日动态（T）", { index: 2 })'
            }, {
                name: '本月接单数量',
                key: 'monthOrder',
                href: 'javascript:aui.showPage("FrmReport11", "H钢材本月接单动态（T）", { index: 2 })'
            }, {
                name: '本年接单数量',
                key: 'yearOrder',
                href: 'javascript:aui.showPage("FrmReport12", "H钢材本年接单动态（T）", { index: 2 })'
            }, {
                name: '今日出库数量',
                key: 'todayOutStock',
                href: 'javascript:aui.showPage("FrmReport13", "H钢材今日出库动态（T）", { index: 2 })'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock',
                href: 'javascript:aui.showPage("FrmReport15", "H钢材本月出库动态（4月）", { index: 2 })'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock',
                href: 'javascript:aui.showPage("FrmReport16", "H钢材本年出货动态（2022年）", { index: 2 })'
            }, {
                name: '当前未出库数',
                key: 'onOutStock',
                href: 'javascript:aui.showPage("FrmReport17", "H钢材未出货订单与库存动态（T）", { index: 2 })'
            }, {
                name: '当前库存数量',
                key: 'inStock',
            }],
            listTypeArr4: [{
                name: '今日接单数量',
                key: 'todayOrder',
                href: 'javascript:aui.showPage("FrmReport9", "螺纹钢材接单今日动态（T）", { index: 3 })'
            }, {
                name: '本月接单数量',
                key: 'monthOrder',
                href: 'javascript:aui.showPage("FrmReport11", "螺纹钢材本月接单动态（T）", { index: 3 })'
            }, {
                name: '本年接单数量',
                key: 'yearOrder',
                href: 'javascript:aui.showPage("FrmReport12", "螺纹钢材本年接单动态（T）", { index: 3 })'
            }, {
                name: '今日出库数量',
                key: 'todayOutStock',
                href: 'javascript:aui.showPage("FrmReport13", "螺纹钢材今日出库动态（T）", { index: 3 })'
            }, {
                name: '本月出库数量',
                key: 'monthOutStock',
                href: 'javascript:aui.showPage("FrmReport15", "螺纹钢材本月出库动态（4月）", { index: 3 })'
            }, {
                name: '本年出库数量',
                key: 'yearOutStock',
                href: 'javascript:aui.showPage("FrmReport16", "螺纹钢材本年出货动态（2022年）", { index: 3 })'
            }, {
                name: '当前未出库数',
                key: 'onOutStock',
                href: 'javascript:aui.showPage("FrmReport17", "螺纹钢材未出货订单与库存动态（T）", { index: 3 })'
            }, {
                name: '当前库存数量',
                key: 'inStock',
            }],
            menuOptions: new Map([['工业4.0-数字化供应链管理中心V1.0', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart", "工业4.0-数字化供应链管理中心V1.0")'
            }], ['工业4.0-数字化制造管理中心V1.0', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "工业4.0-数字化制造管理中心V1.0")'
            }], ['工业4.0-数字化销售管理中心V1.0', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmSaleChart", "工业4.0-数字化销售管理中心V1.0")'
            }]]),
            showIndex: 0,
            boardConfig: {}
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
        await fetch('./kanban3.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList = execl.getDataByArrayBuffer(data);
        })
        let dataArr = [{ todayOrder: 0, weekOrder: 0, monthOrder: 0, yearOrder: 0, todayOutStock: 0, weekOutStock: 0, monthOutStock: 0, yearOutStock: 0, onOutStock: 0, inStock: 0 },
        { todayOrder: 0, weekOrder: 0, monthOrder: 0, yearOrder: 0, todayOutStock: 0, weekOutStock: 0, monthOutStock: 0, yearOutStock: 0, onOutStock: 0, inStock: 0 },
        { todayOrder: 0, weekOrder: 0, monthOrder: 0, yearOrder: 0, todayOutStock: 0, weekOutStock: 0, monthOutStock: 0, yearOutStock: 0, onOutStock: 0, inStock: 0 },
        { todayOrder: 0, weekOrder: 0, monthOrder: 0, yearOrder: 0, todayOutStock: 0, weekOutStock: 0, monthOutStock: 0, yearOutStock: 0, onOutStock: 0, inStock: 0 }];
        let date = new Date();
        let year_ = date.getFullYear();
        let month_ = date.getMonth();
        let day_ = date.getDay();
        if (day_ == 0)
            day_ = 7;
        let date_ = date.getDate();
        let startDay = new Date(year_, month_, 1).getDay();
        let dates = new Date(year_, month_ + 1, 0).getDate();
        if (startDay == 0)
            startDay = 7;
        let startTime = 0;
        if (day_ > date_) {
            let month = month_;
            let year = year_;
            if (month > 0) {
                month--;
            } else {
                year--;
            }
            let lastMonthDay = new Date(year, month + 1, 0).getDate();
            let day = lastMonthDay - startDay + 2;
            startTime = new Date(year, month, day).getTime();
        } else {
            startTime = new Date(year_, month_, (date_ - day_ + 1)).getTime()
        }
        let endTime = 0;
        if (date_ + 7 - day_ > dates) {
            let month = month_;
            let year = year_;
            if (month < 11) {
                month++;
            } else {
                year++;
            }
            let day = 8 - day_ + date_ - dates;
            endTime = new Date(year, month, day).getTime();
        } else {
            endTime = new Date(year_, month_, (date_ + 7 - day_ + 1)).getTime();
        }
        let ployLengend = ['目标', '销售', '库存'];
        let ployLengendData = new Array(ployLengend.length);
        for (let i = 0; i < ployLengendData.length; i++) {
            ployLengendData[i] = new Array(12).fill(0);
        }
        dataArr.forEach((obj, index) => {
            let data = dataList[index].data;
            data.first();
            while (data.fetch()) {
                let orderDate = new Date(data.getString('接单日期'));
                let orderYear = orderDate.getFullYear();
                let orderMonth = orderDate.getMonth();
                let orderDate_ = orderDate.getDate();
                let orderTime_ = orderDate.getTime();
                let orderNum = data.getDouble('数量（吨）');
                let outStockDate = new Date(data.getString('出货日期'));
                let outStockYear = outStockDate.getFullYear();
                let outStockMonth = outStockDate.getMonth();
                let outStockDate_ = outStockDate.getDate();
                let outStockTime_ = outStockDate.getTime();
                let outStockNum = data.getDouble('出货数量（吨）');
                let onOutStockNum = data.getDouble('未出货数量（吨）');
                let targetNum = data.getDouble('销售目标（吨）');
                let stockNum = data.getDouble('当前库存');
                if (orderYear == year_)
                    dataArr[index].yearOrder += orderNum;
                if (orderYear == year_ && orderMonth == month_)
                    dataArr[index].monthOrder += orderNum;
                if (orderYear == year_ && orderMonth == month_ && orderDate_ == date_)
                    dataArr[index].todayOrder += orderNum
                if (orderTime_ >= startTime && orderTime_ <= endTime)
                    dataArr[index].weekOrder += orderNum
                if (outStockYear == year_)
                    dataArr[index].yearOutStock += outStockNum;
                if (outStockYear == year_ && outStockMonth == month_)
                    dataArr[index].monthOutStock += outStockNum;
                if (outStockYear == year_ && outStockMonth == month_ && outStockDate_ == date_)
                    dataArr[index].todayOutStock += outStockNum
                if (outStockTime_ >= startTime && outStockTime_ <= endTime)
                    dataArr[index].weekOutStock += outStockNum
                if (orderTime_ <= orderTime_)
                    dataArr[index].onOutStock += onOutStockNum;
                dataArr[index].inStock = stockNum;
                if (orderYear == year_ - 1) {
                    ployLengendData[0][orderMonth] += targetNum;
                    ployLengendData[1][orderMonth] += orderNum;
                    ployLengendData[2][orderMonth] += stockNum;
                }
            }
        })
        let wireRow = new DataRow();
        // wireRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let coilRow = new DataRow();
        // coilRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let hSteelRow = new DataRow();
        // hSteelRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let steelRow = new DataRow();
        // steelRow.setValue('todayOrder', this.getRandom(10)).setValue('weekOrder', this.getRandom(50)).setValue('monthOrder', this.getRandom(200)).setValue('yearOrder', this.getRandom(2000)).setValue('weekOutStock', this.getRandom(20)).setValue('monthOutStock', this.getRandom(100)).setValue('yearOutStock', this.getRandom(500)).setValue('onOutStock', this.getRandom(100)).setValue('inStock', this.getRandom(3000));
        let rowArr = [wireRow, coilRow, hSteelRow, steelRow];
        let allValue = 0;
        let optionSeriesData: any[] = [];
        rowArr.forEach((row: DataRow, index) => {
            row.setValue('todayOrder', dataArr[index].todayOrder).setValue('weekOrder', dataArr[index].weekOrder).setValue('monthOrder', dataArr[index].monthOrder).setValue('yearOrder', dataArr[index].yearOrder).setValue('todayOutStock', dataArr[index].todayOutStock).setValue('weekOutStock', dataArr[index].weekOutStock).setValue('monthOutStock', dataArr[index].monthOutStock).setValue('yearOutStock', dataArr[index].yearOutStock).setValue('onOutStock', dataArr[index].onOutStock).setValue('inStock', dataArr[index].inStock);
            allValue += dataArr[index].yearOutStock;
            optionSeriesData.push({
                name: dataList[index].name,
                value: dataArr[index].yearOutStock
            })
        })
        let ploySeries: any[] = []
        ployLengendData.forEach((arr, index) => {
            ploySeries.push({
                name: ployLengend[index],
                data: arr,
                type: 'bar',
                label: {
                    show: true,
                    style: {
                        fontSize: 18,
                        fill: '#fff'
                    }
                },
            })
        })

        let dataList2: excelData[] = [];
        await fetch('./区域月度.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList2 = execl.getDataByArrayBuffer(data);
        })
        let ds2 = dataList2[0].data;
        ds2.first();
        let boardConfig: {
            header: string[],
            data: any[][],
            align: string[],
            waitTime: number
        } = {
            header: ['序', '销售区域', '产品类别', '销售目标', '实际销售', '目标达成率'],
            data: [],
            align: ['center', 'center', 'center', 'center', 'center', 'center'],
            waitTime: 3000
        }
        let index = 1;
        let math = new AuiMath();
        while (ds2.fetch()) {
            let arr = new Array();
            arr.push(index);
            let sellNum1 = ds2.getDouble('销售目标');
            let sellNum2 = ds2.getDouble('实际销售');
            arr.push(ds2.getString('销售区域'));
            arr.push(ds2.getString('产品类别'));
            arr.push(sellNum1);
            arr.push(sellNum2);
            let proption = sellNum2 / sellNum1 * 100;
            let text = `${math.toFixed(proption, 2)}%`
            let span = `<span>${text}</span>`;
            if(proption < 60) 
                span = `<span style='color: #ff4e4e'>${text}</span>`;
            if(proption > 100)
                span = `<span style='color: #53f553'>${text}</span>`;
            arr.push(span);
            boardConfig.data.push(arr);
            index++;
        }
        this.setState({
            wireRow,
            coilRow,
            hSteelRow,
            steelRow,
            boardConfig,
            polylineOption: {
                title: {
                    text: `${year_ - 1}年度销售动态分析`,
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    },
                },
                grid: {
                    bottom: 60,
                    top: 50,
                    left: 40,
                    right: 40
                },
                xAxis: {
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        style: {
                            fill: '#fff',
                            fontSize: 20,
                            rotate: 0
                        },
                    },
                    axisLine: {
                        show: false
                    }
                },
                yAxis: {
                    data: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    }
                },
                legend: {
                    data: ployLengend,
                    textStyle: {
                        fill: '#fff'
                    },
                    top: 60
                },
                series: ploySeries,
                color: ['#41aebd', '#97e9d5', '#a2cf49']
            },
            option: {
                title: {
                    text: '销售商品结构比例分析',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                grid: {
                    bottom: '15',
                    left: 10,
                    right: 10
                },
                series: [
                    {
                        data: optionSeriesData,
                        type: 'pie',
                        radius: '60%',
                        outsideLabel: {
                            style: {
                                fontSize: 20,
                            },
                            formatter: (dataItem: any) => {
                                return `${dataItem.name}${dataItem.percent.toFixed(2)}%`
                            }
                        }
                    }
                ],
                color: ['#42C1D2', '#4AF8E4', '#62B530', '#14A338']
            },
        })
        let pieData: any[] = [];
        optionSeriesData.forEach((data) => {
            pieData.push([`${data.name}${math.toFixed(data.value / allValue * 100, 2)}%`, data.value])
        })
        this.initPeiChart({
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                },
                backgroundColor: 'transparent',
            },
            title: {
                text: '销售商品结构比例分析',
                style: {
                    "color": '#fff',
                    "fontSize": 22,
                }
            },
            plotOptions: {
                pie: {
                    depth: 50,
                    dataLabels: {
                        color: '#fff',
                        style: {
                            "fontSize": '20',
                            "fontWeight": '300'
                        }
                        
                    }
                }
            },
            tooltip: {
                enabled: false
            },
            lenged: {},
            series: [{
                type: 'pie',
                data: pieData,
            }],
            colors: ['#1CB53C', '#1C71D4', '#EBBB06', '#ff5555'],
            label: {
                "color": "#fff"
            },
            credits: {  
                enabled: false
            }
        })
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='工业4.0-数字化销售管理中心V1.0' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList4}>
                                <TextList title="线材出库动态（T）" date={this.state.wireRow} listArray={this.state.listTypeArr1} />
                                <TextList title="卷材出库动态（T）" date={this.state.coilRow} listArray={this.state.listTypeArr2} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <div className={styles.pieBox1} id='piechart'></div>
                                <div className={styles.pieBox1} id='piechart2'></div>
                                <div className={styles.pieBox1} id='piechart3'></div>
                                <div className={styles.pieBox1} id='piechart4'></div>
                            </div>
                            <div className={styles.textList4}>
                                <TextList title="H钢材出库动态（T）" date={this.state.hSteelRow} listArray={this.state.listTypeArr3} />
                                <TextList title="螺纹钢材出库动态（T）" date={this.state.steelRow} listArray={this.state.listTypeArr4} />
                            </div>
                        </div>
                        <div className={styles.polylineOption2} >
                            <Charts option={this.state.polylineOption} />
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

    initPeiChart(option: any) {
        //@ts-ignore
        Highcharts.chart('piechart', option);
    }
}
