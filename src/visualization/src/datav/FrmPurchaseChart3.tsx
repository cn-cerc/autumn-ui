import { BorderBox1, FullScreenContainer } from '@jiaminghi/data-view-react';
import { Column, DataRow, DataSet, DBGrid } from 'autumn-ui';
import * as echarts from "echarts";
import { event } from 'jquery';
import React, { ReactNode } from 'react';
import { AuiMath, showPage } from '../tool/Summer';
import "../tool/Summer.css";
import { Excel, excelData } from '../tool/Utils';
import styles from './FrmPurchaseChart3.css';
import FrmPurchaseChart4 from './FrmPurchaseChart4';
import FrmPurchaseChart5 from './FrmPurchaseChart5';
import PurchaseDetailAlloy1 from './PurchaseDetailAlloy1';
import PurchaseDetailAlloy2 from './PurchaseDetailAlloy2';
import PurchaseDetailCHITKDay from './PurchaseDetailCHITKDay';
import PurchaseDetailCHITKMonth from './PurchaseDetailCHITKMonth';
import PurchaseDetailCTKDay from './PurchaseDetailCTKDay';
import PurchaseDetailCTKMonth from './PurchaseDetailCTKMonth';
import PurchaseDetailHTKDay from './PurchaseDetailHTKDay';
import PurchaseDetailHTKMonth from './PurchaseDetailHTKMonth';
import PurchaseDetailJMDay from './PurchaseDetailJMDay';
import PurchaseDetailJMMonth from './PurchaseDetailJMMonth';
import PurchaseDetailLTKDay from './PurchaseDetailLTKDay';
import PurchaseDetailLTKMonth from './PurchaseDetailLTKMonth';
import PurchaseDetailMTDay from './PurchaseDetailMTDay';
import PurchaseDetailMTMonth from './PurchaseDetailMTMonth';
import PurchaseDetailSteell from './PurchaseDetailSteell';
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';

type stateType = {
    ltype: number,
    menuOptions: ViewMenuMap,
    rtype: number,
    main2Data: Array<object>,
    main3Data: Array<object>,
    showIndex: number,
    ironOreList: DataSet,
    mineralList: DataSet,
    alloyList: DataSet,
    steellList: DataSet,
    lengedState: boolean[],
    lengedState1: boolean[],
    timeFlag: any,
    timeNub: number,
    optionOne: any[],
    optionTwo: any[],
}
type PropsType = {
    dataSet: DataSet,
    head: DataRow,
    backHref?: string,
    backTitle?: string,
    hideIt?: boolean,
    index?: number
}

export default class FrmPurchaseChart3 extends React.Component<PropsType, stateType>{
    private lineLenged: string[] = ['仓库容量', '安全库存', '当前库存', '在途库存'];
    constructor(props: PropsType) {
        super(props);
        this.state = {
            showIndex: 0,
            menuOptions: new Map([['工业4.0-数字化供应链管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban1.png',
                href: () => showPage(FrmPurchaseChart3, "工业4.0-数字化供应链管理中心V1.0")
            }], ['工业4.0-数字化制造管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban2.png',
                href: () => showPage(FrmPurchaseChart5, "工业4.0-数字化制造管理中心V1.0")
            }], ['工业4.0-数字化销售管理中心<span style="font-size:16px;">V1.0</span>', {
                imgSrc: './kanban3.png',
                href: () => showPage(FrmPurchaseChart4, "工业4.0-数字化销售管理中心V1.0")
            }]]),
            ltype: this.props.index || 1,
            rtype: 3,
            main2Data: [],
            main3Data: [],
            ironOreList: new DataSet(), //铁矿石=》煤炭 数据
            mineralList: new DataSet(), //矿石 数据
            alloyList: new DataSet(), //合金 数据
            steellList: new DataSet(), //废钢 数据
            lengedState: [true, true, true, true],
            lengedState1: [true, true, true, true],
            timeFlag: null,
            timeNub: 30 * 1000,
            optionOne: [],
            optionTwo: [],
        }
    }

    async initData() {
        await fetch('./矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let ksList: any = [
                [],
                [],
                [],
                [0, 0]
            ]
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ ironOreList: dataList[2].data });
            let ksSheet1 = dataList[0].data;
            let ksSheet2 = dataList[1].data;
            ksSheet1.first();
            ksSheet2.first();
            while (ksSheet1.fetch()) {
                switch (ksSheet1.getString('名称')) {
                    case '煤炭':
                        ksList[0][0] = ksSheet1.getString('仓库容量')
                        ksList[1][0] = ksSheet1.getString('安全库存')
                        break;
                    case '焦煤':
                        ksList[0][1] = ksSheet1.getString('仓库容量')
                        ksList[1][1] = ksSheet1.getString('安全库存')
                        break;
                }
            }
            let date = new Date
            while (ksSheet2.fetch()) {
                let ksDate = new Date(ksSheet2.getString('发货日期'))
                let ksDate2 = new Date(ksSheet2.getString('到货日期'))
                if (ksDate <= date && date < ksDate2) {
                    if (ksSheet2.getString('种类') == '煤炭') {
                        ksList[3][0] += ksSheet2.getDouble('数量')
                    }
                    if (ksSheet2.getString('种类') == '焦煤') {
                        ksList[3][1] += ksSheet2.getDouble('数量')
                    }
                }

            }
            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();

            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let nowDay = now.getDate();
            let arr = ['今日挂牌价（T/元）', '今日采购价（T/元）', '今日损耗数量（T）', '今日入库数量（T）', '本月到厂数量（T）', '本月损耗数量（T）', '当前库存数量（T）', '库存均价（T/元）'];
            let math = new AuiMath();

            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp: {
                    name: string,
                    p: number,
                    c: number
                }[] = [{ name: '煤炭', p: 0, c: 0 }, { name: '焦煤', p: 0, c: 0 }];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (zl != '煤炭' && zl != '焦煤') continue;
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日采购价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日损耗数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '今日入库数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月到厂数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= nowDay) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月损耗数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= nowDay) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '当前库存数量（T）' && new Date(calcData.getString('到货日期')) <= new Date((now).getTime() + 86400000)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch (zl) {
                            case '煤炭':
                                temp[0].p += calcData.current.getDouble('单价');
                                temp[0].c += 1;
                                break;
                            case '焦煤':
                                temp[1].p += calcData.current.getDouble('单价');
                                temp[1].c += 1;
                                break;
                        }
                    }
                }
                if (item == '库存均价（T/元）') {
                    temp.forEach((item1, index1) => {
                        tempDataSet.setValue(item1.name, math.toFixed(math.div((item1.p || 0), (item1.c || 0)), 2));
                    })
                }

            })
            tempDataSet.appendDataSet(this.state.ironOreList);
            this.setState({
                ironOreList: tempDataSet
            })
            this.state.ironOreList.first()
            while (this.state.ironOreList.fetch()) {
                if (this.state.ironOreList.getString('项次') == '当前库存数量（T）') {
                    ksList[2][0] = this.state.ironOreList.getString('煤炭')
                    ksList[2][1] = this.state.ironOreList.getString('焦煤')
                }
            }
            this.setState({
                optionOne: ksList
            })
        })
        await fetch('./铁矿石.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let tksList: any = [
                [],
                [],
                [],
                [0, 0, 0, 0]
            ]
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            let dateListOne = dataList[0].data;
            let xxx = new DataSet();
            dateListOne.first();
            while (dateListOne.fetch()) {
                if (dateListOne.getString('项次') == '今日湿度检测' || dateListOne.getString('项次') == '今日品位检测') {
                    xxx.append().
                        setValue('项次', dateListOne.getString('项次')).
                        setValue('磁铁矿', dateListOne.getString('磁铁矿') + "%").
                        setValue('赤铁矿', dateListOne.getString('赤铁矿') + "%").
                        setValue('褐铁矿', dateListOne.getString('褐铁矿') + "%").
                        setValue('菱铁矿', dateListOne.getString('菱铁矿') + "%")
                }
                if (dateListOne.getString('项次') == '仓库容量（T）') {
                    tksList[0][0] = dateListOne.getString('磁铁矿')
                    tksList[0][1] = dateListOne.getString('赤铁矿')
                }
                if (dateListOne.getString('项次') == '安全库存（T）') {
                    tksList[1][0] = dateListOne.getString('磁铁矿')
                    tksList[1][1] = dateListOne.getString('赤铁矿')
                }
            }
            this.setState({ mineralList: xxx });
            let calcData: DataSet = dataList[1].data; //第二个表数据

            let tksSheet2 = dataList[1].data;
            tksSheet2.first();
            let date = new Date
            while (tksSheet2.fetch()) {
                let ksDate = new Date(tksSheet2.getString('发货日期'))
                let ksDate2 = new Date(tksSheet2.getString('到货日期'))
                if (ksDate <= date && date < ksDate2) {
                    switch (tksSheet2.getString('种类')) {
                        case '磁铁矿':
                            tksList[3][0] += tksSheet2.getDouble('数量')
                            break;
                        case '赤铁矿':
                            tksList[3][1] += tksSheet2.getDouble('数量')
                            break;
                    }
                }
            }

            let tempDataSet: DataSet = new DataSet();
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let nowDay = now.getDate();
            let arr = ['今日挂牌价（T/元）', '今日采购价（T/元）', '今日发货数量（T）', '今日到厂数量（T）', '今日损耗数量（T）', '本月到厂数量（T）', '本月损耗数量（T）', '当前库存数量（T）', '库存均价（T/元）'];
            let math = new AuiMath();
            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp: {
                    name: string,
                    p: number,
                    c: number
                }[] = [{ name: '磁铁矿', p: 0, c: 0 }, { name: '赤铁矿', p: 0, c: 0 }, { name: '褐铁矿', p: 0, c: 0 }, { name: '菱铁矿', p: 0, c: 0 }];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日采购价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日发货数量（T）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '今日到厂数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '今日损耗数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月到厂数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= nowDay) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月损耗数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= nowDay) {
                        tempDataSet.setValue(zl, math.toFixed((calcData.current.getDouble('数量') - calcData.current.getDouble('到货数量')) + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '当前库存数量（T）' && new Date(calcData.getString('到货日期')) <= new Date((now).getTime() + 86400000)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        switch (zl) {
                            case '磁铁矿':
                                temp[0].p += calcData.current.getDouble('单价');
                                temp[0].c += 1;
                                break;
                            case '褐铁矿':
                                temp[1].p += calcData.current.getDouble('单价');
                                temp[1].c += 1;
                                break;
                            case '赤铁矿':
                                temp[2].p += calcData.current.getDouble('单价');
                                temp[2].c += 1;
                                break;
                            case '菱铁矿':
                                temp[3].p += calcData.current.getDouble('单价');
                                temp[3].c += 1;
                                break;
                        }
                    }
                }
                if (item == '库存均价（T/元）') {
                    temp.forEach((item1, index1) => {
                        tempDataSet.setValue(item1.name, ((item1.p || 0) / (item1.c || 0)).toFixed(2));
                    })
                }

            })
            tempDataSet.appendDataSet(this.state.mineralList);
            this.setState({
                mineralList: tempDataSet
            })
            tempDataSet.first()
            while (tempDataSet.fetch()) {
                if (tempDataSet.getString('项次') == '当前库存数量（T）') {
                    tksList[2][0] = tempDataSet.getString('磁铁矿')
                    tksList[2][1] = tempDataSet.getString('赤铁矿')
                }
            }
            this.setState({
                optionTwo: tksList
            })
        })
        await fetch('./合金.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let hjList: any[] = [
                { value: 3.9, name: '锰' },
                { value: 2, name: '硅' },
                { value: 1.4, name: '钒' },
                { value: 1.2, name: '钨' },
                { value: 1, name: '钛' },
                { value: 1.3, name: '钼' }
            ]
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ alloyList: dataList[0].data });

            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.alloyList);
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let arr = ['今日挂牌价（T/元）', '今日入库数量（T）', '本月入库数量（T）', '年度入库数量（T）',
                '当前库存数量（T）', '本月采购数量（T）', '年度采购数量（T）', '采购在途数量（T）', '当前库存均价（T）'];
            let math = new AuiMath();

            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp: {
                    name: string,
                    p: number,
                    c: number
                }[] = [{ name: '锰', p: 0, c: 0 }, { name: '硅', p: 0, c: 0 }, { name: '钒', p: 0, c: 0 }, { name: '钨', p: 0, c: 0 }, { name: '钛', p: 0, c: 0 }, { name: '钼', p: 0, c: 0 }];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日挂牌价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日入库数量（T）' && new Date(calcData.getString('到货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月入库数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= now.getDate()) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '年度入库数量（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() <= nowMonth && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '当前库存数量（T）') {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月采购数量（T）' && new Date(calcData.getString('发货日期')).getFullYear() == nowYear && new Date(calcData.getString('发货日期')).getMonth() == nowMonth && new Date(calcData.getString('发货日期')).getDate() <= now.getDate()) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '年度采购数量（T）' && new Date(calcData.getString('发货日期')).getFullYear() == nowYear && new Date(calcData.getString('发货日期')) <= now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '采购在途数量（T）' && new Date(calcData.getString('到货日期')).getDate() > now.getDate()) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '当前库存均价（T）' && new Date(calcData.getString('到货日期')).getDate() <= now.getDate()) {
                        let index: any = -1;
                        switch (zl) {
                            case '锰':
                                index = 0;
                                break;
                            case '硅':
                                index = 1;
                                break;
                            case '钒':
                                index = 2;
                                break;
                            case '钨':
                                index = 3;
                                break;
                            case '钛':
                                index = 4;
                                break;
                            case '钼':
                                index = 5;
                                break;
                        }
                        if (index != -1) {
                            temp[index].p += calcData.current.getDouble('单价');
                            temp[index].c += 1;
                        }
                    }
                }
                if (item == '当前库存均价（T）') {
                    temp.forEach((item1, index1) => {
                        tempDataSet.setValue(item1.name, math.toFixed(math.div((item1.p || 0), (item1.c || 0)), 2));
                    })
                }
                this.setState({
                    alloyList: tempDataSet
                })
            })
            tempDataSet.first();
            while (tempDataSet.fetch()) {
                if (tempDataSet.getString('项次') == '当前库存数量（T）') {
                    hjList[0].value = tempDataSet.getString('锰')
                    hjList[0].name = '锰'
                    hjList[1].value = tempDataSet.getString('硅')
                    hjList[1].name = '硅'
                    hjList[2].value = tempDataSet.getString('钒')
                    hjList[2].name = '钒'
                    hjList[3].value = tempDataSet.getString('钨')
                    hjList[3].name = '钨'
                    hjList[4].value = tempDataSet.getString('钛')
                    hjList[4].name = '钛'
                    hjList[5].value = tempDataSet.getString('钼')
                    hjList[5].name = '钼'
                }
            }
            this.setState({
                main2Data: hjList
            })
        })
        await fetch('./废钢.xls', {
            method: 'get',
        }).then(function (response) {
            return response.arrayBuffer()
        }).then((data) => {
            let execl = new Excel();
            let dataList: excelData[] = execl.getDataByArrayBuffer(data);
            this.setState({ steellList: dataList[1].data });
            let now = new Date();
            let nowYear = now.getFullYear();
            let nowMonth = now.getMonth();
            let table1data = dataList[2].data;
            let tempDataSet1: DataSet = new DataSet();
            table1data.first();
            while (table1data.fetch()) {
                if (new Date(table1data.getString('日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                    tempDataSet1.append().setValue('项次', table1data.getString('项次')).setValue('A站', table1data.getString('A站'))
                        .setValue('B站', table1data.getString('B站')).setValue('C站', table1data.getString('C站')).setValue('D站', table1data.getString('D站'));
                }
            }
            this.setState({ steellList: tempDataSet1 });
            let calcData: DataSet = dataList[1].data; //第二个表数据
            let tempDataSet: DataSet = new DataSet();
            tempDataSet.appendDataSet(this.state.steellList);
            let arr = ['今日收购均价（T/元）', '今日收料（T）', '本月收料（T）', '年度累计收料（T）',
                '年度累计回厂（T）', '收购站当前库存（T）', '厂区当前库存（T）', '厂区当前库存均价（T/元）'];
            let math = new AuiMath();
            arr.forEach((item, index) => {
                tempDataSet.append().setValue('项次', item);
                var temp: {
                    name: string,
                    p: number,
                    c: number
                }[] = [{ name: 'A站', p: 0, c: 0 }, { name: 'B站', p: 0, c: 0 }, { name: 'C站', p: 0, c: 0 }, { name: 'D站', p: 0, c: 0 }];
                calcData.first();
                while (calcData.fetch()) {
                    let zl = calcData.getString('种类');
                    if (item == '今日收购均价（T/元）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, calcData.current.getDouble('单价'));
                    }
                    if (item == '今日收料（T）' && new Date(calcData.getString('发货日期')).setHours(0, 0, 0, 0) == now.setHours(0, 0, 0, 0)) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '本月收料（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')).getMonth() == nowMonth && new Date(calcData.getString('到货日期')).getDate() <= now.getDate()) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '年度累计收料（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '年度累计回厂（T）' && new Date(calcData.getString('到货日期')).getFullYear() == nowYear && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '收购站当前库存（T）' && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '厂区当前库存（T）' && new Date(calcData.getString('到货日期')) <= now) {
                        tempDataSet.setValue(zl, math.toFixed(calcData.current.getDouble('到货数量') + tempDataSet.current.getDouble(zl), 1));
                    }
                    if (item == '厂区当前库存均价（T/元）' && new Date(calcData.getString('到货日期')) <= now) {
                        let index: any = -1;
                        switch (zl) {
                            case 'A站':
                                index = 0;
                                break;
                            case 'B站':
                                index = 1;
                                break;
                            case 'C站':
                                index = 2;
                                break;
                            case 'D站':
                                index = 3;
                                break;
                        }
                        if (index != -1) {
                            temp[index].p = math.add(temp[index].p, calcData.current.getDouble('单价'));
                            temp[index].c += 1;
                        }
                    }
                }
                if (item == '厂区当前库存均价（T/元）') {
                    temp.forEach((item1, index1) => {
                        tempDataSet.setValue(item1.name, math.toFixed((item1.p || 0) / (item1.c || 0), 2));
                    })
                }
            })
            let main3Data = [
                {
                    name: 'A站',
                    data: new Array(nowMonth + 1).fill(0),
                },
                {
                    name: 'B站',
                    data: new Array(nowMonth + 1).fill(0),
                },
                {
                    name: 'C站',
                    data: new Array(nowMonth + 1).fill(0),
                },
                {
                    name: 'D站',
                    data: new Array(nowMonth + 1).fill(0),
                }
            ]
            for (let i = 0; i < main3Data.length; i++) {
                let obj = {
                    type: 'line',
                    symbolSize: 8,
                    // smooth: true,
                    label: {
                        // show: true,
                        position: 'top',
                        color: '#fff',
                        fontSize: 13
                    }
                }
                Object.assign(main3Data[i], obj)
            }
            let date = new Date;
            let d = date.getDate();
            let m = date.getMonth();
            let ftSheet = dataList[1].data;
            ftSheet.first();
            while (ftSheet.fetch()) {
                let month = new Date(ftSheet.getString('到货日期')).getMonth() + 1
                let day = new Date(ftSheet.getString('到货日期')).getDate();
                if (month == m) {
                    if (d >= day) {
                        this.monthSwitch(ftSheet, main3Data, month - 1);
                    }
                } else {
                    this.monthSwitch(ftSheet, main3Data, month - 1);
                }
            }
            this.setState({
                steellList: tempDataSet,
                main3Data: main3Data
            })
        })
        this.initEchart();
        this.autoTogglePage();
    }

    monthSwitch(ftSheet: { getString: (arg0: string) => any; }, main3Data: { data: number[]; }[], i: any) {
        switch (ftSheet.getString('种类')) {
            case 'A站':
                main3Data[0].data[i] += Number(ftSheet.getString('到货数量'));
                main3Data[0].data[i] = Number((main3Data[0].data[i]).toFixed(1));
                break;
            case 'B站':
                main3Data[1].data[i] += Number(ftSheet.getString('到货数量'));
                main3Data[1].data[i] = Number((main3Data[1].data[i]).toFixed(1));
                break;
            case 'C站':
                main3Data[2].data[i] += Number(ftSheet.getString('到货数量'));
                main3Data[2].data[i] = Number((main3Data[2].data[i]).toFixed(1));
                break;
            case 'D站':
                main3Data[3].data[i] += Number(ftSheet.getString('到货数量'));
                main3Data[3].data[i] = Number((main3Data[3].data[i]).toFixed(1));
                break;
        }
    }

    componentDidMount() {
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

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <TopHeader title='工业4.0-数字化供应链管理中心<span style="font-size:16px;">V1.0</span>' handleCick={this.titleClick.bind(this)} />
                    <div className={styles.headerTitle}>
                        <a className={this.state.ltype == 1 ? styles.active : ''} onClick={this.toggleData.bind(this, 1)}>煤炭/铁矿石</a>
                        <a className={this.state.ltype == 2 ? styles.active : ''} onClick={this.toggleData.bind(this, 2)}>合金/废钢</a>
                    </div>
                    <div className={styles.mainContent}>
                        <div className={styles.page}>
                            <div className={styles.echartItems}>
                                <div className={`${styles.fEchart} ${styles.lEchart}`}>
                                    <ul>
                                        {this.getLDom()}
                                    </ul>
                                </div>
                                <div className={`${styles.fEchart} ${styles.rEchart}`}>
                                    <ul>
                                        {this.getRDom()}
                                    </ul>
                                </div>
                            </div>
                            <div className={styles.dataTale}>
                                <div className={styles.lContainer}>
                                    <div>
                                        <div>
                                            {this.getLTable()}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.rContainer}>
                                    <div>
                                        <div>
                                            {this.getRTable()}
                                        </div>
                                    </div>
                                </div>
                            </div>
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
            style = this.state.showIndex % 2 == 0 ? styles.hideMenu : styles.showMenu;
        return style
    }

    //设置自动切换界面
    autoTogglePage() {
        this.setState({
            timeFlag: setInterval(() => {
                var ltype = this.state.ltype == 1 ? 2 : 1;
                this.setState({
                    ltype
                }, () => {
                    this.initEchart();
                })
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
    //渲染数据表行
    getColumns(reportHead: DataRow, type?: number) {
        let list: ReactNode[] = [];
        reportHead.forEach((key: string, value: any) => {
            if (key == '项次') {
                list.push(<Column code={value.name} name={key} width={value.width} textAlign='center' key={key} customText={(row: DataRow) => {
                    switch (type) {
                        // case 1:
                        //     return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{ color: 'red', 'fontSize': '12px', 'transform': 'scale(0.8)' }}>我的钢铁网</span></span> : row.getString('项次') == '今日入库数量（T）' || row.getString('项次') == '本月到厂数量（T）' ? <span style={{ color: '#58f7ff' }}>{row.getString('项次')}</span> : row.getString('项次');
                        //     break;
                        // case 2:
                        //     return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{ color: 'red', 'fontSize': '12px', 'transform': 'scale(0.8)' }}>我的钢铁网</span></span> : row.getString('项次') == '今日到厂数量（T）' || row.getString('项次') == '本月到厂数量（T）' ? <span style={{ color: '#58f7ff' }}>{row.getString('项次')}</span> : row.getString('项次');
                        //     break;
                        case 3:
                            return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{ color: 'red', 'fontSize': '15px' }}>我的钢铁网</span></span> : row.getString('项次') == '今日入库数量（T）' || row.getString('项次') == '本月入库数量（T）' ? <span style={{ color: '#58f7ff' }}>{row.getString('项次')}</span> : row.getString('项次');
                            break;
                        case 4:
                            return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{ color: 'red', 'fontSize': '15px' }}>我的钢铁网</span></span> : row.getString('项次') == '今日收料（T）' ? <span style={{ color: '#58f7ff' }}>{row.getString('项次')}</span> : row.getString('项次');
                            break;
                        default:
                            return row.getString('项次').indexOf('牌价') > -1 ? <span>{row.getString('项次')}<span style={{ color: 'red', 'fontSize': '15px' }}>我的钢铁网</span></span> : row.getString('项次');
                            break;
                    }

                }}></Column>);
            } else {
                list.push(<Column code={value.name} name={key} width={value.width} textAlign='center' key={key}></Column>);
            }
        })
        return list;
    }
    //获取左侧dom结构
    getLDom() {
        let id: string
        if (this.state.ltype == 1) {
            id = 'main';
        } else if (this.state.ltype == 2) {
            id = 'main1';
        }
        return this.getEchartDomShow(id);
    }
    //获取右侧dom结构
    getRDom() {
        let id: string
        if (this.state.ltype == 1) {
            id = 'main2';
        } else if (this.state.ltype == 2) {
            id = 'main3';
        }
        return this.getEchartDomShow(id);
    }
    //获取左侧数据表
    getLTable() {
        if (this.state.ltype == 1) {
            return this.getTable1();
        } else if (this.state.ltype == 2) {
            return this.getTable2();
        }
    }
    //获取右侧数据表
    getRTable() {
        if (this.state.ltype == 1) {
            return this.getTable3();
        } else if (this.state.ltype == 2) {
            return this.getTable4();
        }
    }
    //需要渲染的图表
    initEchart() {
        if (this.state.ltype == 1) {
            this.initMain();
            this.initMain1();
        } else if (this.state.ltype == 2) {
            this.initMain2();
            this.initMain3();
        }
    }
    //初始化煤炭图表
    initMain() {
        let dataArr: any[] = this.state.optionOne;
        let siteSize = 0;
        let dynamicSeries = [];
        this.state.lengedState.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let barWidth = 40;
        let site = 0;
        if (siteSize % 2 != 0)
            site = ((barWidth * (siteSize - 1) + (barWidth * 0.1 * (siteSize - 1))) / 2) * -1;
        else
            site = ((barWidth * siteSize + (barWidth * 0.1 * (siteSize - 1))) / 2 - barWidth / 2) * -1;

        let colorArr = [{
            topColor: '#A5B1FF',
            bottomColor: '#00ffdb',
            lineColor: ['#A587FF', '#00DDdb'],
            textColor: '#00DDdb'
        }, {
            topColor: '#5CC4FE',
            bottomColor: '#1b963b',
            lineColor: ['#5CB4FE', '#1b963b'],
            textColor: '#B9E2A5'
        }, {
            topColor: '#FFA64B',
            bottomColor: '#1C71D4',
            lineColor: ['#FF8B4B', '#1C71D4'],
            textColor: '#fff'
        }, {
            topColor: '#00ECA0',
            bottomColor: '#ebbb06',
            lineColor: ['#00D3A0', '#ebbb06'],
            textColor: '#F5DF90'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, 8], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '35%',
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
                        fontSize: 14,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState[i])
                site = site + barWidth + barWidth * 0.1
        }

        var myChart = echarts.init(document.getElementById('main'));
        var option = {
            // color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            tooltip: {},
            xAxis: {
                axisLine: {
                    show: false
                },
                type: 'category',
                data: [{
                    value: '煤炭',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '焦煤',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }],
                splitLine: {
                    show: false
                },
                // axisLabel: {
                //     show: false
                // }
            },
            yAxis: {
                show: false,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: dynamicSeries
        };
        //@ts-ignore
        myChart.setOption(option);
        myChart.off('legendselectchanged');
        myChart.on('legendselectchanged', (obj: {
            name: string,
            selected: object,
            type: string,
        }) => {
            this.lengedChanage(obj, 0)
        })
    }
    //初始化铁矿石图表
    initMain1() {
        let dataArr: any[] = this.state.optionTwo
        let siteSize = 0;
        let dynamicSeries = [];
        this.state.lengedState1.forEach((bool: boolean) => {
            if (bool)
                siteSize++;
        })
        let barWidth = 40;
        let site = 0;
        if (siteSize % 2 != 0)
            site = ((barWidth * (siteSize - 1) + (barWidth * 0.1 * (siteSize - 1))) / 2) * -1;
        else
            site = ((barWidth * siteSize + (barWidth * 0.1 * (siteSize - 1))) / 2 - barWidth / 2) * -1;

        let colorArr = [{
            topColor: '#A5B1FF',
            bottomColor: '#00ffdb',
            lineColor: ['#A587FF', '#00DDdb'],
            textColor: '#00DDdb'
        }, {
            topColor: '#5CC4FE',
            bottomColor: '#1b963b',
            lineColor: ['#5CB4FE', '#1b963b'],
            textColor: '#B9E2A5'
        }, {
            topColor: '#FFA64B',
            bottomColor: '#1C71D4',
            lineColor: ['#FF8B4B', '#1C71D4'],
            textColor: '#fff'
        }, {
            topColor: '#00ECA0',
            bottomColor: '#ebbb06',
            lineColor: ['#00D3A0', '#ebbb06'],
            textColor: '#F5DF90'
        }]
        for (let i = 0; i < this.lineLenged.length; i++) {
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, -8], // 上部椭圆
                symbolPosition: 'end',
                z: 12,
                color: colorArr[i].topColor,
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'pictorialBar',
                symbolSize: [barWidth - 1, barWidth / 2],
                symbolOffset: [site * 1.228, 8], // 下部椭圆
                z: 10,
                color: colorArr[i].lineColor[0],
                data: dataArr[i],
            })
            dynamicSeries.push({
                name: this.lineLenged[i],
                type: 'bar',
                barWidth: barWidth,
                barGap: '35%',
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
                        fontSize: 14,
                        color: colorArr[i].textColor,
                        offset: [0, -6]
                    },
                },
                data: dataArr[i],
            })
            if (this.state.lengedState1[i])
                site = site + barWidth + barWidth * 0.1
        }

        var myChart = echarts.init(document.getElementById('main2'));
        var option = {
            // color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            // tooltip: {},
            xAxis: {
                // show:true,
                axisLine: {
                    show: false
                },
                type: 'category',
                data: [{
                    value: '进口矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }, {
                    value: '国产矿',
                    textStyle: {
                        fontSize: 14,
                        color: '#fff'
                    }
                }]
            },
            yAxis: {
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: dynamicSeries
        };
        //@ts-ignore
        myChart.setOption(option);
        myChart.off('legendselectchanged');
        myChart.on('legendselectchanged', (obj: {
            name: string,
            selected: object,
            type: string
        }) => {
            this.lengedChanage(obj, 1)
        })
    }
    //初始化合金图表
    initMain2() {
        var myChart = echarts.init(document.getElementById('main1'));
        var option = {
            color: ['#A587FF', '#5CB4FE', '#FF8B4B', '#00D3A0', '#007CFF', '#FFB800'],
            textStyle: {
                color: '#fff'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            series: [
                {
                    // name: 'Access From',
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['45%', '75%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,

                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}: {c} ( {d}% )',
                                color: '#fff',
                                fontSize: 14,
                            }
                        }
                    },
                    label: {
                        show: false,
                        position: 'center',
                        color: '#fff',
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#fff'
                        },
                        length: 20,
                        length2: 80,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold',
                            color: '#fff'
                        },
                        labelLine: {
                            color: "#fff",
                        }
                    },
                    // labelLine: {
                    //     show: false
                    // },
                    data: this.state.main2Data,
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }
    //初始化废钢图表
    initMain3() {
        let data = [], yearArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        let nowMonth = new Date().getMonth() + 1;
        let index = 0;
        if (nowMonth <= 6) {
            nowMonth = 6;
        }
        // else { //当前月份超过六个月时，显示最近六个月
        //     index = nowMonth - 6;
        // }
        for (index; index < nowMonth; index++) {
            data.push(yearArr[index]);
        }
        var myChart = echarts.init(document.getElementById('main3'));
        var option = {
            color: ['#A587FF', '#5CB4FE', '#FF8B4B', '#00D3A0'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7982'
                    }
                }
            },
            textStyle: {
                color: '#fff'
            },
            legend: {
                bottom: 0,
                textStyle: {
                    fontSize: 14,
                    color: '#fff'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '13%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                data: data
            },
            yAxis: {
                type: 'value',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            },
            series: this.state.main3Data,
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    //切换界面图表及数据
    toggleData(type: number) {
        let ltype: number = 1;
        switch (type) {
            case 1:
                ltype = 1;
                break;
            case 2:
                ltype = 2;
                break;
        }
        this.setState({
            lengedState: [true, true, true, true],
            lengedState1: [true, true, true, true]
        }, () => {
            this.setState({ ltype }, () => {
                this.initEchart();

                this.setState({ timeNub: 30 * 1000 });
                clearInterval(this.state.timeFlag);
                this.setState({
                    timeFlag: null
                });
                this.autoTogglePage();
            });
        })
    }

    //获取图表dom结构
    getEchartDomShow(id: string) {
        return <li className={styles.echartItem} key={id}>
            <div>
                <div id={id} className={styles.main}></div>
            </div>
        </li>
    }

    getTable1() { //煤炭采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '6' }).setValue('煤炭', { name: '煤炭', width: '6' }).setValue('焦煤', { name: '焦煤', width: '6' });
        return this.getHtmlFun(reportHead, this.state.ironOreList, 1);
    }
    getTable2() { //合金采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '40' }).setValue('锰', { name: '锰', width: '16' }).setValue('硅', { name: '硅', width: '16' })
            .setValue('钒', { name: '钒', width: '16' }).setValue('钨', { name: '钨', width: '16' }).setValue('钛', { name: '钛', width: '16' })
            .setValue('钼', { name: '钼', width: '16' });
        return this.getHtmlFun(reportHead, this.state.alloyList, 3);
    }
    getTable3() { //铁矿石采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '33' }).setValue('进口矿', { name: '磁铁矿', width: '33' })
            .setValue('国产矿', { name: '赤铁矿', width: '33' });
        return this.getHtmlFun(reportHead, this.state.mineralList, 2);
    }
    getTable4() { //废钢采购动态 table
        let reportHead = new DataRow();
        reportHead.setValue('项次', { name: '项次', width: '32' }).setValue('A站', { name: 'A站', width: '18' }).setValue('B站', { name: 'B站', width: '18' })
            .setValue('C站', { name: 'C站', width: '18' }).setValue('D站', { name: 'D站', width: '18' });
        return this.getHtmlFun(reportHead, this.state.steellList, 4);
    }

    getHtmlFun(reportHead: DataRow, dataList: DataSet, type?: number) {
        let currentData = new DataSet();
        dataList.first();
        let className = '';
        switch (type) {
            case 1:
                className = styles.table1;
                break;
            case 2:
                className = styles.table2;
                break;
            case 3:
                className = styles.table3;
                break;
            case 4:
                className = styles.table4;
                break;
        }
        while (dataList.fetch()) {
            currentData.append().copyRecord(dataList.current);
        }
        return <div className={`${styles.box} ${className}`} key={this.state.ltype}>
            <BorderBox1>
                <div className={styles.grid}>
                    <DBGrid dataSet={currentData} key={this.getColumns(reportHead).toString()} onRowClick={this.handleRowClick.bind(this)}>
                        {this.getColumns(reportHead, type)}
                    </DBGrid>
                </div>
            </BorderBox1>
        </div>;
    }

    lengedChanage(obj: {
        name: string,
        selected: object,
        type: string
    }, flag: number) {
        let lengedState: boolean[] = [];
        Object.values(obj.selected).forEach((bool: boolean, index: number) => {
            lengedState.push(bool);
        })
        if (flag == 1) {
            this.setState({
                lengedState1: lengedState
            }, () => {
                this.initMain1();
            })
        } else {
            this.setState({
                lengedState
            }, () => {
                this.initMain();
            })
        }
    }

    handleRowClick(row: DataRow, sender: any) {
        //以下代码 李敏负责部分 =====================
        var itemText = row.getString('项次');
        switch (itemText) {
            case '今日入库数量（T）':
                showPage(PurchaseDetailAlloy1, "合金今日入库数量", { index: 1, title: '今日入库数量（T）' });
                break;
            case '本月入库数量（T）':
                showPage(PurchaseDetailAlloy2, "合金本月入库数量", { index: 1, title: '本月入库数量（T）' });
                break;
        }
        switch (itemText) {
            case '今日收料（T）':
                showPage(PurchaseDetailSteell, "废铁今日收料数量（T）", { index: 1, title: '今日收料（T）' });
                break;
        }

        //华丽的分割线==============================
        let target = sender.target.getAttribute('data-field');
        switch (row.getString('项次')) {
            case '今日入库数量（T）':
                if (target == '煤炭') {
                    showPage(PurchaseDetailMTDay, "煤炭今日入库数量（T）");
                } else if (target == '焦煤') {
                    showPage(PurchaseDetailJMDay, "焦煤今日入库数量（T）");
                }
                break;
            case '本月到厂数量（T）':
                switch (target) {
                    case '煤炭':
                        showPage(PurchaseDetailMTMonth, "煤炭月度入库数量（T）");
                        break;
                    case '焦煤':
                        showPage(PurchaseDetailJMMonth, "焦煤月度入库数量（T）");
                        break;
                    case '磁铁矿':
                        showPage(PurchaseDetailCTKMonth, "磁铁矿月度入库数量（T）");
                        break;
                    case '赤铁矿':
                        showPage(PurchaseDetailCHITKMonth, "赤铁矿月度入库数量（T）");
                        break;
                    case '褐铁矿':
                        showPage(PurchaseDetailHTKMonth, "褐铁矿月度入库数量（T）");
                        break;
                    case '菱铁矿':
                        showPage(PurchaseDetailLTKMonth, "菱铁矿月度入库数量（T）");
                        break;
                }
                break;
            case '今日到厂数量（T）':
                switch (target) {
                    case '磁铁矿':
                        showPage(PurchaseDetailCTKDay, "磁铁矿今日入库数量（T）");
                        break;
                    case '赤铁矿':
                        showPage(PurchaseDetailCHITKDay, "赤铁矿今日入库数量（T）");
                        break;
                    case '褐铁矿':
                        showPage(PurchaseDetailHTKDay, "褐铁矿今日入库数量（T）");
                        break;
                    case '菱铁矿':
                        showPage(PurchaseDetailLTKDay, "菱铁矿今日入库数量（T）");
                        break;
                }
        }
    }
}