import { Charts, FullScreenContainer } from '@jiaminghi/data-view-react';
import React from 'react';
import { DataRow, DataSet } from 'autumn-ui';
import { excelData, Excel } from '../tool/Utils';
import "../tool/Summer.css";
import styles from './FrmPurchaseChart3.css';
import TextList, { listType } from "./TextList";
import TopHeader from './TopHeader';
import ViewMenu, { ViewMenuMap } from './ViewMenu';
import * as echarts from "echarts";
import { ids } from 'webpack';

type stateType = {
    ltype: number,
    rtype: number,
    ltable: number,
    rtable: number,
    mainData: object,
    main1Data: object,
    main2Data: Array<object>,
    main3Data: Array<object>,
}
type PropsType = {

}

export default class FrmPurchaseChart3 extends React.Component<PropsType, stateType>{
    constructor(props: PropsType) {
        super(props);
        this.state = {
            ltype: 1,
            rtype: 3,
            ltable: 1,
            rtable: 3,
            mainData:{
                dimensions: ['product', '库容量', '安全库存', '当前库存', '在途库存'],
                source: [
                    { product: '煤炭', '库容量': 4.3, '安全库存': 2.4, '当前库存': 2, '在途库存': 4 },
                    { product: '焦煤', '库容量': 2.5, '安全库存': 4.4, '当前库存': 2, '在途库存': 1.4 }
                ]
            },
            main1Data: {
                dimensions: ['product', '库容量', '安全库存', '当前库存', '在途库存'],
                source: [
                    { product: '磁铁矿', '库容量': 4.3, '安全库存': 2.4, '当前库存': 2, '在途库存': 1 },
                    { product: '赤铁矿', '库容量': 2.5, '安全库存': 4.4, '当前库存': 2, '在途库存': 1 },
                    { product: '褐铁矿', '库容量': 3.5, '安全库存': 1.8, '当前库存': 3, '在途库存': 2 },
                    { product: '菱铁矿', '库容量': 4.5, '安全库存': 2.8, '当前库存': 5, '在途库存': 4 }
                ]
            },
            main2Data:[
                { value: 3.9, name: '锰' },
                { value: 2, name: '硅' },
                { value: 1.4, name: '钒' },
                { value: 1.2, name: '钨' },
                { value: 1, name: '钛' },
                { value: 1.3, name: '钼' }
            ],
            main3Data:[
                {
                    name: 'A站',
                    data: [4.3, 2.5, 3.5, 4.5, 2],
                    type: 'line',
                    label: {
                        show: true,
                        position: 'top'
                    }
                },
                {
                    name: 'B站',
                    data: [2.4, 4.4, 1.8, 2.8, 1],
                    type: 'line',
                    label: {
                        show: true,
                        position: 'top'
                    }
                },
                {
                    name: 'C站',
                    data: [1, 2, 3, 5, 4],
                    type: 'line',
                    label: {
                        show: true,
                        position: 'top'
                    }
                },
                {
                    name: 'D站',
                    data: [1, 2, 2, 3, 1.8],
                    type: 'line',
                    label: {
                        show: true,
                        position: 'top'
                    }
                }
            ]
        }
    }

    async initData() {
        // let dataList = [];
        // await fetch('./矿石.xls', {
        //     method: 'get',
        // }).then(function (response) {
        //     return response.arrayBuffer()
        // }).then((data) => {
        //     let execl = new Excel();
        //     dataList = execl.getDataByArrayBuffer(data);
        //     console.log(dataList);
        // })
    }

    componentDidMount() {
        this.initData();
        setTimeout(() => {
            this.initEchart();
        }, 1000)
    }

    componentWillUnmount() {
    }

    render(): JSX.Element {
        return (
            <div className={styles.dataView}>
                <FullScreenContainer className={styles.dvFullScreenContainer}>
                    <div className={styles.page}>
                        <h1 className={styles.title}>采购数据中</h1>
                        <div className={styles.echartItems}>
                            <div className={styles.fEchart}>
                                <div className=''>
                                    <a className={this.state.ltype == 1 ? styles.active : ''} onClick={this.toggleData.bind(this, 1)}>煤炭</a>
                                    <a className={this.state.ltype == 2 ? styles.active : ''} onClick={this.toggleData.bind(this, 2)}>铁矿石</a>
                                </div>
                                <ul>
                                    {this.getLDom()}
                                </ul>
                            </div>
                            <div className={styles.fEchart}>
                                <div className=''>
                                    <a className={this.state.rtype == 3 ? styles.active : ''} onClick={this.toggleData.bind(this, 3)}>合金</a>
                                    <a className={this.state.rtype == 4 ? styles.active : ''} onClick={this.toggleData.bind(this, 4)}>废钢</a>
                                </div>
                                <ul>
                                    {this.getRDom()}
                                </ul>
                            </div>
                        </div>
                        <div className={styles.dataTale}>
                            <div className={styles.lContainer}>
                                <p>
                                    <a className={this.state.ltable == 1 ? styles.active : ''} onClick={this.toggleTable.bind(this, 1)}>煤炭采购动态</a>
                                    <a className={this.state.ltable == 2 ? styles.active : ''} onClick={this.toggleTable.bind(this, 2)}>铁矿石采购动态</a>
                                </p>
                                <div>
                                    <div>
                                        {this.getLTable()}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.rContainer}>
                                <p>
                                    <a className={this.state.rtable == 3 ? styles.active : ''} onClick={this.toggleTable.bind(this, 3)}>合金采购动态</a>
                                    <a className={this.state.rtable == 4 ? styles.active : ''} onClick={this.toggleTable.bind(this, 4)}>废钢采购动态</a>
                                </p>
                                <div>
                                    <div>
                                        {this.getRTable()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FullScreenContainer>
            </div>
        )
    }
    getLDom() {
        if (this.state.ltype == 1) {
            return this.getBarDataShow();
        } else if (this.state.ltype == 2) {
            return this.getBar2DataShow();
        }
    }
    getRDom() {
        if (this.state.rtype == 3) {
            return this.getPieDataShow();
        } else if (this.state.rtype == 4) {
            return this.getLineDataShow();
        }
    }
    getLTable() {
        if (this.state.ltable == 1) {
            return this.getTable1();
        } else if (this.state.ltable == 2) {
            return this.getTable2();
        }
    }
    getRTable() {
        if (this.state.rtable == 3) {
            return this.getTable3();
        } else if (this.state.rtable == 4) {
            return this.getTable4();
        }
    }
    initEchart() {
        if (this.state.ltype == 1) {
            this.initMain();
        } else if (this.state.ltype == 2) {
            this.initMain1();
        }

        if (this.state.rtype == 3) {
            this.initMain2();
        } else if (this.state.rtype == 4) {
            this.initMain3();
        }

    }

    initMain() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            legend: {
                bottom: 0
            },
            tooltip: {},
            dataset:this.state.mainData,
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        //@ts-ignore
        myChart.setOption(option);
    }
    initMain1() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main1'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            legend: {
                bottom: 0
            },
            tooltip: {},
            dataset:this.state.main1Data,
            xAxis: { type: 'category' },
            yAxis: {},
            series: [{
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }, {
                type: 'bar', label: {
                    show: true,
                    position: 'top'
                }
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        //@ts-ignore
        myChart.setOption(option);
    }
    initMain2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main2'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589', '#ff8ebf', '#ffdc57'],
            tooltip: {
                trigger: 'item'
            },
            legend: {
                width: '50px',
                top: 'center',
                right: '2%'
            },
            series: [
                {
                    // name: 'Access From',
                    type: 'pie',
                    radius: ['50%', '85%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2,
                        normal: {
                            label: {
                                show: true,
                                position: 'outside',
                                // formatter: '{c} ({d}%)'
                                formatter: '{c}'
                            }
                        }
                    },
                    label: {
                        show: true,
                        position: 'center'
                    },
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
                    data:this.state.main2Data,
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        //@ts-ignore
        myChart.setOption(option);
    }
    initMain3() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main3'));
        // 指定图表的配置项和数据
        var option = {
            color: ['#61ede7', '#6fc7ff', '#daa4fd', '#fe8589'],
            legend: {
                bottom: 0,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '13%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
            },
            yAxis: {
                type: 'value'
            },
            series:this.state.main3Data,
        };
        // 使用刚指定的配置项和数据显示图表。
        //@ts-ignore
        myChart.setOption(option);
    }

    toggleData(type: number) {
        switch (type) {
            case 1:
                this.setState({ ltype: 1 }, () => {
                    this.initEchart();
                });
                break;
            case 2:
                this.setState({ ltype: 2 }, () => {
                    this.initEchart()
                });
                break;
            case 3:
                this.setState({ rtype: 3 }, () => {
                    this.initEchart()
                });
                break;
            case 4:
                this.setState({ rtype: 4 }, () => {
                    this.initEchart()
                });
                break;
        }
    }
    toggleTable(type: number) {
        switch (type) {
            case 1:
                this.setState({ ltable: 1 }, () => {
                    // this.initEchart();
                });
                break;
            case 2:
                this.setState({ ltable: 2 }, () => {
                    // this.initEchart()
                });
                break;
            case 3:
                this.setState({ rtable: 3 }, () => {
                    // this.initEchart()
                });
                break;
            case 4:
                this.setState({ rtable: 4 }, () => {
                    // this.initEchart()
                });
                break;
        }
    }
    getBarDataShow() {
        return <li className={styles.echartItem} key={1}>
            <div className={styles.eName}>
                项目关注点类分布
                <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p>
            </div>
            <div>
                <div id='main' className={styles.main}></div>
            </div>
        </li>
    }
    getBar2DataShow() {
        return <li className={`${styles.echartItem}`} key={2}>
            <div className={styles.eName}>
                项目关注点类分布
                <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p>
            </div>
            <div>
                <div id='main1' className={styles.main}>图表</div>
            </div>
        </li>
    }
    getPieDataShow() {
        return <li className={styles.echartItem} key={3}>
            <div className={styles.eName}>
                项目关注点类分布
                <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p>
            </div>
            <div>
                <div id="main2" className={styles.main}></div>
            </div>
        </li>
    }
    getLineDataShow() {
        return <li className={`${styles.echartItem}`} key={4}>
            <div className={styles.eName}>
                项目关注点类分布
                <p>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                    <span className={styles.radioskin}></span>
                </p>
            </div>
            <div>
                <div id='main3' className={styles.main}>图表</div>
            </div>
        </li>
    }

    getTable1() { //煤炭采购动态
        return <table className={styles.lTable}>
            <colgroup>
                <col width={'33%'} />
                <col width={'33%'} />
                <col width={'33%'} />
            </colgroup>
            <thead>
                <tr>
                    <th>
                        项次
                    </th>
                    <th>
                        煤炭
                    </th>
                    <th>
                        焦煤
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>今日牌价（T/元）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日采购价（T/元）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日水分检验（%）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日热量检验（千卡）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日发货数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日入库数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日损耗数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月到厂数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月损耗数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>当前库存数量（T）</td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>库存均价（T/元）</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    }
    getTable2() { //铁矿石采购动态
        return <table className={styles.lTable}>
            <colgroup>
                <col width={'24%'} />
                <col width={'19%'} />
                <col width={'19%'} />
                <col width={'19%'} />
                <col width={'19%'} />
            </colgroup>
            <thead>
                <tr>
                    <th>
                        项次
                    </th>
                    <th>
                        磁铁矿
                    </th>
                    <th>
                        赤铁矿
                    </th>
                    <th>
                        褐铁矿
                    </th>
                    <th>
                        菱铁矿
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>矿石今日牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>矿石今日采购价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日水份检验（%）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日品位检验（%）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日发货数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日到厂数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日损耗数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月入库数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月损耗数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>当前库存数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>库存均价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>

            </tbody>
        </table>
    }
    getTable3() { //合金采购动态
        return <table className={styles.rTable}>
            <colgroup>
                <col width={'22%'} />
                <col width={'13%'} />
                <col width={'13%'} />
                <col width={'13%'} />
                <col width={'13%'} />
                <col width={'13%'} />
                <col width={'13%'} />
            </colgroup>
            <thead>
                <tr>
                    <th>
                        项次
                    </th>
                    <th>
                        锰
                    </th>
                    <th>
                        硅
                    </th>
                    <th>
                        钒
                    </th>
                    <th>
                        钨
                    </th>
                    <th>
                        钛
                    </th>
                    <th>
                        钼
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>今日牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日采购价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日入库数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月入库数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>年度入库数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>当前库存数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月采购数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>年度采购数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>采购在途数量（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>当前库存均价（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    }
    getTable4() { //废钢采购动态
        return <table className={styles.rTable}>
            <colgroup>
                <col width={'24%'} />
                <col width={'19%'} />
                <col width={'19%'} />
                <col width={'19%'} />
                <col width={'19%'} />
            </colgroup>
            <thead>
                <tr>
                    <th>
                        项次
                    </th>
                    <th>
                        A站
                    </th>
                    <th>
                        B站
                    </th>
                    <th>
                        C站
                    </th>
                    <th>
                        D站
                    </th>

                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>今日重废牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日中废牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日小废牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日统料牌价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日收购均价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>今日收料（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>本月收料（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>年度累计收料（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>年度累计回厂（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>收购站当前库存（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>厂区当前库存（T）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>厂区当前库存均价（T/元）</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    }
}