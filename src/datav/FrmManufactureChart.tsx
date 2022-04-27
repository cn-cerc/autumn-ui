import { BorderBox11, Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import { Excel, excelData } from '../db/Utils';
import styles from './FrmPurchaseChart.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";
import DataSet from '../db/DataSet';
type stateType = {
    wireRow: DataRow,
    coilRow: DataRow,
    hSteelRow: DataRow,
    steelRow: DataRow,
    listTypeArr1: listType[],
    listTypeArr2: listType[],
    listTypeArr3: listType[],
    listTypeArr4: listType[],
    stopRow: DataRow,
    stopArr: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number,
    jobData: number[][],
    lengedState: boolean[]
}
type PropsType = {
}

export default class FrmManufactureChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private onJobNames: string[] = ["在编人数", "30岁以下", "30-40岁", "41-50岁", "51-60岁", "60岁以上", "今日出勤", "今日调休", "今日请假"];
    private isLengedEvent: boolean = false;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            wireRow: new DataRow(),
            coilRow: new DataRow(),
            hSteelRow: new DataRow(),
            steelRow: new DataRow(),
            listTypeArr1: [{
                name: '今日入库数量',
                key: 'todayStock',
                href: 'javascript:aui.showPage("FrmReport4", "今日线材入库动态（T）", { index: 0 })'
            }, {
                name: '本月入库数量',
                key: 'monthStock',
                href: 'javascript:aui.showPage("FrmReport5", "本月线材入库动态（T）", { index: 0 })'
            }, {
                name: '本年入库数量',
                key: 'yearStock',
                href: 'javascript:aui.showPage("FrmReport6", "本年线材入库动态（T）", { index: 0 })'
            }],
            listTypeArr2: [{
                name: '今日入库数量',
                key: 'todayStock',
                href: 'javascript:aui.showPage("FrmReport4", "今日卷材入库动态（T）", { index: 1 })'
            }, {
                name: '本月入库数量',
                key: 'monthStock',
                href: 'javascript:aui.showPage("FrmReport5", "本月卷材入库动态（T）", { index: 1 })'
            }, {
                name: '本年入库数量',
                key: 'yearStock',
                href: 'javascript:aui.showPage("FrmReport6", "本年卷材入库动态（T）", { index: 1 })'
            }],
            listTypeArr3: [{
                name: '今日入库数量',
                key: 'todayStock',
                href: 'javascript:aui.showPage("FrmReport4", "今日H型钢材入库动态（T）", { index: 2 })'
            }, {
                name: '本月入库数量',
                key: 'monthStock',
                href: 'javascript:aui.showPage("FrmReport5", "本月H型钢材入库动态（T）", { index: 2 })'
            }, {
                name: '本年入库数量',
                key: 'yearStock',
                href: 'javascript:aui.showPage("FrmReport6", "本年H型钢材入库动态（T）", { index: 2 })'
            }],
            listTypeArr4: [{
                name: '今日入库数量',
                key: 'todayStock',
                href: 'javascript:aui.showPage("FrmReport4", "今日螺纹钢材入库动态（T）", { index: 3 })'
            }, {
                name: '本月入库数量',
                key: 'monthStock',
                href: 'javascript:aui.showPage("FrmReport5", "本月螺纹钢材入库动态（T）", { index: 3 })'
            }, {
                name: '本年入库数量',
                key: 'yearStock',
                href: 'javascript:aui.showPage("FrmReport6", "本年螺纹钢材入库动态（T）", { index: 3 })'
            }],
            stopRow: new DataRow(),
            stopArr: [{
                name: '今日异常停机',
                key: 'todayError',
                href: 'javascript:aui.showPage("FrmReport19", "生产设备停机动态")'
            }, {
                name: '本周异常停机',
                key: 'weekError',
                href: 'javascript:aui.showPage("FrmReport19", "生产设备停机动态")'
            }, {
                name: '本月异常停机',
                key: 'monthError',
                href: 'javascript:aui.showPage("FrmReport19", "生产设备停机动态")'
            }, {
                name: '本年异常停机',
                key: 'yearError',
                href: 'javascript:aui.showPage("FrmReport19", "生产设备停机动态")'
            }],
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
            jobData: [],
            lengedState: [true, true],
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
        let tagertData = new DataSet();
        dataList.forEach((data) => {
            if (data.name == '年度销售预计')
                tagertData.appendDataSet(data.data);
        })
        let tragetArr = [];
        tagertData.first();
        while (tagertData.fetch()) {
            let target = 0;
            target += tagertData.getDouble('线材');
            target += tagertData.getDouble('卷材');
            target += tagertData.getDouble('H型钢材');
            target += tagertData.getDouble('螺纹钢材');
            tragetArr.push(target);
        }
        let dataArr = [{ todayStock: 0, monthStock: 0, yearStock: 0 },
        { todayStock: 0, monthStock: 0, yearStock: 0 },
        { todayStock: 0, monthStock: 0, yearStock: 0 },
        { todayStock: 0, monthStock: 0, yearStock: 0 }];
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
        let polyLengend: string[] = [];
        let ployDatas: any[][] = [];
        dataArr.forEach((obj, index) => {
            let data = dataList[index].data;
            data.first();
            while (data.fetch()) {
                let orderDate = new Date(data.getString('接单日期'));
                let orderYear = orderDate.getFullYear();
                if (polyLengend.indexOf(orderYear.toString()) == -1) {
                    polyLengend.push(orderYear.toString());
                    let arr = new Array(12).fill('');
                    ployDatas.push(arr);
                }
                let orderMonth = orderDate.getMonth();
                let orderDate_ = orderDate.getDate();
                let index_ = polyLengend.indexOf(orderYear.toString());
                if (ployDatas[index_][orderMonth] == '') {
                    ployDatas[index_][orderMonth] = 0;
                }
                let inStock = data.getDouble('销售目标（吨）');
                ployDatas[index_][orderMonth] += inStock;
                if (orderYear == year_)
                    dataArr[index].yearStock += inStock
                if (orderYear == year_ && orderMonth == month_)
                    dataArr[index].monthStock += inStock
                if (orderYear == year_ && orderMonth == month_ && orderDate_ == date_)
                    dataArr[index].todayStock += inStock
            }
        })
        let lineSeries: any[] = [];
        let lineColir = ['#41aebd', '#97e9d5', '#EBBB06'];
        //年度销售预计
        ployDatas.forEach((arr: [], index: number) => {
            lineSeries.push({
                name: `${polyLengend[index]}年度入库汇总`,
                type: 'line',
                data: arr,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: lineColir[index],
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
        })
        lineSeries.push({
            name: `${new Date().getFullYear()}年度入库预计`,
            type: 'line',
            data: tragetArr,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        textStyle: {
                            color: lineColir[2],
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
        let wireRow = new DataRow();
        // wireRow.setValue('todayStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let coilRow = new DataRow();
        // coilRow.setValue('todayStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let hSteelRow = new DataRow();
        // hSteelRow.setValue('todayStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let steelRow = new DataRow();
        // steelRow.setValue('todayStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let stopRow = new DataRow();
        let rowArr = [wireRow, coilRow, hSteelRow, steelRow];
        rowArr.forEach((row: DataRow, index) => {
            row.setValue('monthStock', dataArr[index].monthStock).setValue('todayStock', dataArr[index].todayStock).setValue('yearStock', dataArr[index].yearStock);
        })

        let dataList2: excelData[] = [];
        let jobData: number[][] = [];
        this.onJobNames.forEach((name: string, index: number) => {
            let arr = new Array(2).fill(0);
            jobData.push(arr);
        })
        await fetch('./在岗人员.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList2 = execl.getDataByArrayBuffer(data);
        })
        let ds = dataList2[0].data;
        ds.first();
        while (ds.fetch()) {
            let state = ds.getString('考勤状态');
            let sex = ds.getString('性别');
            let age = ds.getDouble('年龄');
            if (sex == '男') {
                jobData[0][0] += 1;
                if (age < 30)
                    jobData[1][0] += 1;
                else if (age < 41)
                    jobData[2][0] += 1;
                else if (age < 51)
                    jobData[3][0] += 1;
                else if (age < 61)
                    jobData[4][0] += 1;
                else
                    jobData[5][0] += 1;
                if (state == '请假')
                    jobData[7][0] += 1;
                else if (state == '调休')
                    jobData[8][0] += 1;
                else
                    jobData[6][0] += 1;
            } else {
                jobData[0][1] += 1;
                if (age < 30)
                    jobData[1][1] += 1;
                else if (age < 41)
                    jobData[2][1] += 1;
                else if (age < 51)
                    jobData[3][1] += 1;
                else if (age < 61)
                    jobData[4][1] += 1;
                else
                    jobData[5][1] += 1;
                if (state == '请假')
                    jobData[7][1] += 1;
                else if (state == '调休')
                    jobData[8][1] += 1;
                else
                    jobData[6][1] += 1;
            }
        }
        let dataList3: excelData[] = [];
        await fetch('./设备停机.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            dataList3 = execl.getDataByArrayBuffer(data);
        })
        let ds2 = dataList3[0].data;
        ds2.first();
        let todayError_ = 0;
        let weekError_ = 0;
        let monthError_ = 0;
        let yearError_ = 0;
        while (ds2.fetch()) {
            let stopDate = new Date(ds2.getString('日期'));
            let stopYear = stopDate.getFullYear();
            let stopMonth = stopDate.getMonth();
            let stopTime = stopDate.getTime();
            if (stopYear == year_)
                yearError_ += 1;
            if (stopYear == year_ && stopMonth == month_)
                monthError_ += 1;
            if (stopTime >= startTime && startTime <= endTime)
                weekError_ += 1;
            if (stopYear == year_ && stopMonth == month_ && stopDate.getDate() == date_)
                todayError_ += 1;
        }
        stopRow.setValue('todayError', todayError_).setValue('weekError', weekError_).setValue('monthError', monthError_).setValue('yearError', yearError_);
        let lineOption = {
            // 标题
            title: [
                {
                    text: '生产入库汇总年度对比动态',
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
                top: 50
            },
            tooltip: {},
            // 内容区域位置
            grid: {
                left: 20,
                right: 20,
                bottom: 20,
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
        this.initLineChart(lineOption);
        this.initBarChart();
        this.setState({
            wireRow,
            coilRow,
            hSteelRow,
            steelRow,
            stopRow,
            jobData
        })
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='制造数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList5}>
                                <TextList title="线材入库动态（T）" date={this.state.wireRow} listArray={this.state.listTypeArr1} />
                                <TextList title="卷材入库动态（T）" date={this.state.coilRow} listArray={this.state.listTypeArr2} />
                                <TextList title="H型钢材入库动态（T）" date={this.state.hSteelRow} listArray={this.state.listTypeArr3} />
                                <TextList title="螺纹钢材入库动态（T）" date={this.state.steelRow} listArray={this.state.listTypeArr4} />
                            </div>
                            <div className={styles.blockTopBottomContent}>
                                <ul className={styles.chartState}>
                                    <li>
                                        <img src='./employee.png' onClick={() => {
                                            //@ts-ignore
                                            aui.showPage("FrmEmployee1", "线材生产线")
                                        }}></img>
                                        <span className={styles.warn}></span>
                                    </li>
                                    <li>
                                        <img src='./employee.png' onClick={() => {
                                            //@ts-ignore
                                            aui.showPage("FrmEmployee2", "卷材生产线")
                                        }}></img>
                                        <span className={styles.success}></span>
                                    </li>
                                    <li>
                                        <img src='./employee.png' onClick={() => {
                                            //@ts-ignore
                                            aui.showPage("FrmEmployee3", "H型钢材生产线")
                                        }}></img>
                                        <span className={styles.success}></span>
                                    </li>
                                    <li>
                                        <img src='./employee.png' onClick={() => {
                                            //@ts-ignore
                                            aui.showPage("FrmEmployee4", "螺纹钢材生产线")
                                        }}></img>
                                        <span className={styles.error}></span>
                                    </li>
                                </ul>
                                {/* <Charts option={this.state.option} /> */}
                                <div id='barChart' style={{ 'width': '100%', 'height': '100%' }}></div>
                            </div>
                            <div className={styles.textList2}>
                                <TextList title="设备停机动态（T）" date={this.state.stopRow} listArray={this.state.stopArr} />
                                <div className={styles.double}>
                                    <BorderBox11 title='生产在编在岗人员动态'>
                                        <table className={styles.table} onClick={() => {
                                            //@ts-ignore
                                            aui.showPage("FrmReport8", "采购数据管理中心");
                                        }}>
                                            <tbody>
                                                {this.getTableContent()}
                                            </tbody>
                                        </table>
                                    </BorderBox11>
                                </div>
                            </div>
                        </div>
                        <div className={styles.polylineOption2} id='lineChart'></div>
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

    getTableContent() {
        let trList = this.state.jobData.map((arr: number[], index) => {
            return <tr key={index}>
                <td>{this.onJobNames[index]}：</td>
                <td>{arr[0]}</td>
                <td>{arr[1]}</td>
                <td>{arr[0] + arr[1]}</td>
            </tr>
        })
        return <React.Fragment>
            <tr>
                <th>分类：</th>
                <th>男</th>
                <th>女</th>
                <th>合计</th>
            </tr>
            {trList}
        </React.Fragment>
    }

    initBarChart() {
        let siteSize = -1;
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let site = (siteSize * -70) / 2;
        let barSeries = [];
        if (this.state.lengedState[0]) {
            barSeries.push({
                name: '实际产能',
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: '#42E1D2',
                data: [1200, 2230, 1900, 1800],
            });
            barSeries.push({
                name: '实际产能',
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, 8], // 下部椭圆
                z: 10,
                color: '#42C1D2',
                data: [1200, 2230, 1900, 1800],
            })
            barSeries.push({
                name: '实际产能',
                type: 'bar',
                barWidth: '50',
                barGap: '40%', // Make series be overlap
                barCateGoryGap: '10%',
                itemStyle: {
                    normal: {
                        color: '#42c1d2'
                    },
                },
                z: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 20,
                        color: '#fff',
                        offset: [0, -6]
                    },
                },
                data: [1200, 2230, 1900, 1800],
            })
            site += 70;
        }
        if (this.state.lengedState[1]) {
            barSeries.push({
                name: '标准产能',
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: '#14C338',
                data: [2230, 1900, 2100, 3000],
            });
            barSeries.push({
                name: '标准产能',
                type: 'pictorialBar',
                symbolSize: [50, 16],
                symbolOffset: [site, 8], // 下部椭圆
                z: 10,
                color: '#14A338',
                data: [2230, 1900, 2100, 3000],
            })
            barSeries.push({
                name: '标准产能',
                type: 'bar',
                barWidth: '50',
                barGap: '40%', // Make series be overlap
                barCateGoryGap: '10%',
                itemStyle: {
                    color: '#14A338'
                },
                z: 10,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        fontSize: 20,
                        color: '#fff',
                        offset: [0, -6]
                    },
                },
                data: [2230, 1900, 2100, 3000],
            })
        }
        let myChart = echarts.init(document.getElementById('barChart'));
        //@ts-ignore
        myChart.setOption({
            title: [{
                text: '今日生产现场长处动态',
                textStyle: {
                    color: '#fff',
                    fontSize: 22,
                    fontWeight: 500
                },
                top: 20,
                left: 'center'
            }],
            legend: {
                bottom: 20,
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
                top: 90,
                left: 0,
                bottom: 100,
                right: 40,
                containLabel: true,
            },
            tooltip: {
                show: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: [{
                        value: '螺纹钢材',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: 'H钢材线',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '卷材线',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }, {
                        value: '线材线',
                        textStyle: {
                            fontSize: 18,
                            color: '#fff'
                        }
                    }],
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
                        margin: 30,
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
            series: barSeries,
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

    initLineChart(option: any) {
        let myChart = echarts.init(document.getElementById('lineChart'));
        myChart.setOption(option);
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
        console.log(lengedState)
        this.setState({
            lengedState
        }, () => {
            this.initBarChart();
        })
    }
}
