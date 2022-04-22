import { BorderBox11, Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from "react";
import DataRow from "../db/DataRow";
import DataSet from '../db/DataSet';
import { Excel, excelData } from '../db/Utils';
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
    stopRow: DataRow,
    stopArr: listType[],
    menuOptions: ViewMenuMap,
    showIndex: number,
    jobData: number[][]
}
type PropsType = {
}

export default class FrmManufactureChart extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private onJobNames: string[] = ["在编人数", "30岁以下", "30-40岁", "41-50岁", "51-60岁", "60岁以上", "今日出勤", "今日调休", "今日请假"];
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
                name: '本周入库数量',
                key: 'weekStock',
                href: 'javascript:aui.showPage("FrmReport4", "本周线材入库动态（T）", { index: 0 })'
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
                name: '本周入库数量',
                key: 'weekStock',
                href: 'javascript:aui.showPage("FrmReport4", "本周卷材入库动态（T）", { index: 1 })'
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
                name: '本周入库数量',
                key: 'weekStock',
                href: 'javascript:aui.showPage("FrmReport4", "本周H型钢材入库动态（T）", { index: 2 })'
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
                name: '本周入库数量',
                key: 'weekStock',
                href: 'javascript:aui.showPage("FrmReport4", "本周钢材入库动态（T）", { index: 3 })'
            }, {
                name: '本月入库数量',
                key: 'monthStock',
                href: 'javascript:aui.showPage("FrmReport5", "本月钢材入库动态（T）", { index: 3 })'
            }, {
                name: '本年入库数量',
                key: 'yearStock',
                href: 'javascript:aui.showPage("FrmReport6", "本年线材入库动态（T）", { index: 3 })'
            }],
            stopRow: new DataRow(),
            stopArr: [{
                name: '今日异常停机',
                key: 'todayError'
            }, {
                name: '本周异常停机',
                key: 'weekError'
            }, {
                name: '本月异常停机',
                key: 'monthError'
            }, {
                name: '本年异常停机',
                key: 'yearError'
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
            jobData: []
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
        let dataArr = [{ weekStock: 0, monthStock: 0, yearStock: 0 },
        { weekStock: 0, monthStock: 0, yearStock: 0 },
        { weekStock: 0, monthStock: 0, yearStock: 0 },
        { weekStock: 0, monthStock: 0, yearStock: 0 }];
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
                let index_ = polyLengend.indexOf(orderYear.toString());
                if (ployDatas[index_][orderMonth] == '') {
                    ployDatas[index_][orderMonth] = 0;
                }
                let orderTime_ = orderDate.getTime();
                let inStock = data.getDouble('销售目标（吨）');
                ployDatas[index_][orderMonth] += inStock;
                if (orderYear == year_)
                    dataArr[index].yearStock += inStock
                if (orderYear == year_ && orderMonth == month_)
                    dataArr[index].monthStock += inStock
                if (orderTime_ >= startTime && orderTime_ <= endTime)
                    dataArr[index].weekStock += inStock
            }
        })
        let polylineSeries: object[] = [];
        ployDatas.forEach((arr: [], index: number) => {
            polylineSeries.push({
                name: polyLengend[index],
                data: arr,
                type: 'line',
                label: {
                    show: true,
                    style: {
                        fontSize: 18
                    }
                },
                lineStyle: {
                    lineWidth: 3
                }
            })
        })
        let wireRow = new DataRow();
        // wireRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let coilRow = new DataRow();
        // coilRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let hSteelRow = new DataRow();
        // hSteelRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let steelRow = new DataRow();
        // steelRow.setValue('weekStock', this.getRandom(100)).setValue('monthStock', this.getRandom(500)).setValue('yearStock', this.getRandom(5000));
        let stopRow = new DataRow();
        let rowArr = [wireRow, coilRow, hSteelRow, steelRow];
        rowArr.forEach((row: DataRow, index) => {
            row.setValue('monthStock', dataArr[index].monthStock).setValue('weekStock', dataArr[index].weekStock).setValue('yearStock', dataArr[index].yearStock);
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
        this.setState({
            wireRow,
            coilRow,
            hSteelRow,
            steelRow,
            stopRow,
            jobData,
            polylineOption: {
                title: {
                    text: '生产入库汇总年度对比动态',
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                grid: {
                    bottom: 50,
                    left: 30,
                    right: 30
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
                        style: {
                            stroke: '#fff'
                        }
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
                series: polylineSeries,
                color: ['#41aebd', '#97e9d5']
            },
            option: {
                title: {
                    text: '生产现场长处动态',
                    offset: [-50, -20],
                    style: {
                        fill: '#fff',
                        fontSize: 22,
                        fontWeight: 500
                    }
                },
                legend: {
                    data: ['生产数量', '产出数量'],
                    textStyle: {
                        fill: '#fff',
                        fontSize: 18
                    },
                    bottom: '5'
                },
                grid: {
                    bottom: '15',
                    left: 100,
                    right: 10
                },
                xAxis: {
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
                yAxis: {
                    data: ['螺纹钢材线', 'H钢材线', '卷材线', '线材线'],
                    axisLine: {
                        show: true,
                        style: {
                            stroke: '#fff'
                        }
                    },
                    axisTick: {
                        show: true,
                        style: {
                            stroke: '#fff'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        style: {
                            fill: '#fff',
                            fontSize: 16,
                            rotate: 0
                        }
                    }
                },
                series: [
                    {
                        name: '生产数量',
                        data: [1200, 2230, 1900, 1800],
                        type: 'bar',
                        label: {
                            show: true,
                            offset: [25, 2],
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                    {
                        name: '产出数量',
                        data: [2230, 1900, 2100, 3000],
                        type: 'bar',
                        label: {
                            show: true,
                            offset: [25, 2],
                            style: {
                                fontSize: 18,
                                fill: '#fff'
                            },
                        },
                        barGap: 0
                    },
                ],
                color: ['#42C1D2', '#14A338']
            }
        })
    }

    render() {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='制造数据管理中心' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.mainContent}>
                        <div className={styles.blockLeftRightContent}>
                            <div className={styles.textList2}>
                                <TextList title="线材入库动态（T）" date={this.state.wireRow} listArray={this.state.listTypeArr1} />
                                <TextList title="卷材入库动态（T）" date={this.state.coilRow} listArray={this.state.listTypeArr2} />
                                <TextList title="H型钢材入库动态（T）" date={this.state.hSteelRow} listArray={this.state.listTypeArr3} />
                                <TextList title="钢材入库动态（T）" date={this.state.steelRow} listArray={this.state.listTypeArr4} />
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
                                <Charts option={this.state.option} />
                            </div>
                            <div className={styles.textList2}>
                                <div className={styles.double}>
                                    <BorderBox11 title='生产在编在岗人员动态'>
                                        <table className={styles.table}>
                                            <tbody>
                                                {this.getTableContent()}
                                            </tbody>
                                        </table>
                                    </BorderBox11>
                                </div>
                                <TextList title="设备停机动态（T）" date={this.state.stopRow} listArray={this.state.stopArr} />
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
}
