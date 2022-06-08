import { BorderBox10, FullScreenContainer } from "@jiaminghi/data-view-react";
import { DataRow } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import { showPage } from "../tool/Summer";
import styles from "./FrmPurchaseChart5.css";
import TopHeader from "./TopHeader";
import ViewMenu, { ViewMenuMap } from "./ViewMenu";

type stateType = {
    menuOptions: ViewMenuMap,
    showIndex: number,
    navArr: string[],
    navIndex: number,
}
type PropsType = {
    navIndex?: number
}

export default class FrmPurchaseChart5 extends React.Component<PropsType, stateType> {
    private timer: any = null;
    private myChart: any;
    constructor(props: PropsType) {
        super(props);
        let navIndex = this.props.navIndex ? this.props.navIndex : 0;
        this.state = {
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
            navArr: ['炼铁', '炼钢', '轧钢'],
            navIndex
        }
    }

    componentDidMount(): void {
        let canvas = document.getElementById('canvas') as HTMLDivElement;
        this.timer = setInterval(() => {
            let navIndex = this.state.navIndex + 1;
            if (navIndex > 2)
                navIndex = 0;
            showPage("FrmPurchaseChart5", "制造数据中心", { navIndex });
        }, 30000)
        this.myChart = echarts.init(canvas);
        switch (this.state.navIndex) {
            case 0:
                this.initCanvas1();
                break;
            case 1:
                this.initCanvas2();
                break;
            case 2:
                this.initCanvas3();
                break;

        }
        document.onkeydown = (e: any) => {
            e = e || window.event;
            if (e.keyCode == 32) {
                e.preventDefault();
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                } else {
                    this.timer = setInterval(() => {
                        let navIndex = this.state.navIndex + 1;
                        if (navIndex > 2)
                            navIndex = 0;
                        showPage("FrmPurchaseChart5", "制造数据中心", { navIndex });
                    }, 30000)
                }
                return;
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    render(): React.ReactNode {
        return <div className={styles.dataView}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title='工业4.0-数字化制造管理中心<span style="font-size:16px;">V1.0</span>' handleCick={this.titleClick.bind(this)} />
                {this.getNav()}
                <div className={styles.content}>
                    <div id="canvas" className={styles.canvas}></div>
                    {this.getContent()}
                </div>
                {this.getMenus()}
            </FullScreenContainer>
        </div>
    }

    titleClick() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        } else {
            this.timer = setInterval(() => {
                let navIndex = this.state.navIndex + 1;
                if (navIndex > 2)
                    navIndex = 0;
                showPage("FrmPurchaseChart5", "制造数据中心", { navIndex });
            }, 30000)
        }
        let showIndex = this.state.showIndex + 1;
        this.setState({
            showIndex
        })
    }

    getNav() {
        let arr = this.state.navArr.map((navName: string, index: number) => {
            return <li key={index} className={index == this.state.navIndex ? styles.navHover : ''} onClick={this.handleNavClick.bind(this, index)}>{navName}</li>
        })
        return <ul className={styles.nav}>{arr}</ul>
    }

    getContent() {
        switch (this.state.navIndex) {
            case 0:
                return this.getProcess1();
                break;
            case 1:
                return this.getProcess2();
                break;
            case 2:
                return this.getProcess3();
                break;
        }
    }

    getProcess1() {
        return <div className={styles.main}>
            <div className={styles.stock1}>
                <img src="./img/焦化厂.gif" className={styles.jmc} onClick={() => {
                    this.toEmployee(0, '焦化厂', 0, 2, '吨/天', 'vedio6')
                }} />
                <div className={`${styles.nameBox1} ${styles.nameBox}`}>焦化厂</div>
                <div className={`${styles.box1} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领料（煤）：<span className={styles.number}>5.5</span>T</li>
                            <li>本月领料（煤）：<span className={styles.number}>100.1</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box2} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出（焦煤）：<span className={styles.number}>4.8</span>T</li>
                            <li>本月产出（焦煤）：<span className={styles.number}>96.9</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box2ss} ${styles.box}`}>
                    <img src="./img/油桶.png" style={{ width: '65px', position: 'absolute', top: '-65px', left: '50px' }} />
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出（焦油）：<span className={styles.number}>5.0</span>T</li>
                            <li>本月产出（焦油）：<span className={styles.number}>130.6</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock2}>
                <img src="./img/粉煤.png" style={{ width: '200px' }} onClick={() => {
                    this.toEmployee(0, '粉煤', 0, 1, '吨/天', 'vedio6')
                }} />
                <div className={`${styles.nameBox2} ${styles.nameBox}`} style={{ width: '100%', textAlign: 'center' }}>粉煤</div>
                <div className={`${styles.box2fm1} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领料：<span className={styles.number}>50.3</span>T</li>
                            <li>本月领料：<span className={styles.number}>998.8</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock2a}>
                <img src="./img/矿石.png" style={{ width: '130px' }} onClick={() => {
                    this.toEmployee(0, '矿石', 0, 1, '吨/天', 'vedio6')
                }} />
                <div className={`${styles.nameBox2} ${styles.nameBox}`} style={{ width: '100%', textAlign: 'center' }}>矿石</div>
                <div className={`${styles.box2fm2} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领料：<span className={styles.number}>45.3</span>T</li>
                            <li>本月领料：<span className={styles.number}>908.8</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock2s}>
                <img src="./img/煤气回收2.gif" className={styles.mqhs} onClick={() => {
                    this.toEmployee(0, '煤气回收', 0, 1, '立方米/时', 'vedio6')
                }} />
                <div className={`${styles.nameBox2} ${styles.nameBox}`} style={{ width: '100%', textAlign: 'center' }}>煤气回收</div>
                <div className={`${styles.box3} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>焦化今日煤气回收：<span className={styles.number}>50.5</span>M³</li>
                            <li>焦化本月累计：<span className={styles.number}>1030.1</span>M³</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box4} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日回收煤气：<span className={styles.number}>30.2</span>M³</li>
                            <li>本月回收煤气：<span className={styles.number}>603.7</span>M³</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock3}>
                <img src="./img/fire-5.gif" className={styles.fire1} onClick={() => {
                    this.toEmployee(0, '高炉', 0, 1, '吨/天', 'vedio8')
                }} />
                <div className={`${styles.box5} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>高炉温度：<span className={styles.number}>1271°</span></li>
                            <li>正常运行时间：<span className={styles.number}>46.1<i>H</i></span></li>
                            <li>碳排放：<span className={styles.number}>42.7<i>T</i></span></li>
                            <li>容积：<span className={styles.number}>43.1<i>M³</i></span></li>
                            <li>利用率：<span className={styles.number}>3.8</span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock4}>
                <img src="./img/烧结厂.gif" className={styles.sjc} onClick={() => {
                    this.toEmployee(0, '烧结厂', 0, 2, '吨/天', 'vedio6')
                }} />
                <div className={`${styles.nameBox3} ${styles.nameBox}`}>烧结厂</div>
                <div className={`${styles.box6} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>合格率：<span className={styles.number}>93</span>%</li>
                            <li>今日产出（球团）：<span className={styles.number}>5.8</span>T</li>
                            <li>本月产出（球团）：<span className={styles.number}>121.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box6s} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>合格率：<span className={styles.number}>94</span>%</li>
                            <li>今日产出（烧结矿）：<span className={styles.number}>4.9</span>T</li>
                            <li>本月产出（烧结矿）：<span className={styles.number}>107.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box7} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领用（矿石）：<span className={styles.number}>8.1</span>T</li>
                            <li>本月领用（矿石）：<span className={styles.number}>160.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock5}>
                <img src="./img/渣水.png" className={styles.tsyz} onClick={() => {
                    this.toEmployee(0, '铁水运转', 0, 1, '吨/天', 'vedio5')
                }} />
                <div className={`${styles.nameBox4} ${styles.nameBox}`}>水渣</div>
                <div className={`${styles.box8} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出（水渣）：<span className={styles.number}>5.4</span>T</li>
                            <li>本月产出（水渣）：<span className={styles.number}>116.7</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock5s}>
                <img src="./img/铁水运转.gif" className={styles.tsyz} onClick={() => {
                    this.toEmployee(0, '铁水运转', 0, 1, '吨/天', 'vedio5')
                }} />
                <div className={`${styles.nameBox4} ${styles.nameBox}`}>铁水运转</div>
                <div className={`${styles.box8s} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出（铁水）：<span className={styles.number}>5.9</span>T</li>
                            <li>本月产出（铁水）：<span className={styles.number}>118.1</span>T</li>
                            <li>合格率：<span className={styles.number}>94</span>%</li>
                            <li>单位成本：<span className={styles.number}>8.5</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
        </div>
    }

    initCanvas1() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [
                {
                    coords: [ //焦煤厂指向火炉线条
                        [530, 780],
                        [810, 780],
                        [810, 530],
                    ]
                },
                {
                    coords: [ //焦煤厂指向煤气回收线条
                        [495, 860],
                        [495, 920],
                        [1750, 920],
                    ]
                },
                {
                    coords: [ //焦煤厂指向焦油线条
                        [270, 810],
                        [125, 810],
                        [125, 785],
                    ]
                },
                {
                    coords: [ //转炉指向煤气回收线条
                        [1220, 680],
                        [1780, 680],
                        [1780, 730],
                    ]
                },
                {
                    coords: [ //高炉指向煤气回收线条
                        [1072, 580],
                        [1220, 580],
                        [1220, 680],
                    ]
                },
                {
                    coords: [ //烧结厂指向火炉线条
                        [480, 200],
                        [810, 200],
                        [810, 530],
                    ]
                },
                {
                    coords: [ //铁渣左边线条
                        [1075, 450],
                        [1710, 450],
                    ]
                },
                {
                    coords: [ //铁水运转左边线条
                        [1075, 420],
                        [1220, 420],
                        [1220, 180],
                        [1720, 180]
                    ]
                },
                {
                    coords: [ //粉煤指向转炉
                        [480, 590],
                        [810, 590],
                    ]
                },
                {
                    coords: [ //高炉左边短线
                        [810, 530],
                        [968, 530],
                    ]
                },
                {
                    coords: [ //矿石右边线条
                        [450, 350],
                        [810, 350],
                    ]
                },
            ]
        }

        let option = {
            backgroundColor: "",
            xAxis: {
                min: 0,
                max: 1920,
                show: false,
                type: 'value'
            },
            yAxis: {
                min: 0,
                max: 926,
                show: false,
                type: 'value'
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: '#fff',
                    formatter: function (item: any) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: '#E3F0FF',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    constantSpeed: 20,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 6
                },
                data: charts.linesData
            }]
        };
        //@ts-ignore
        this.myChart.setOption(option);
    }

    getProcess2() {
        return <div className={styles.main}>
            <div className={styles.stock6}>
                <img src="./img/废钢.png" className={styles.hl} onClick={() => { this.toEmployee(0, '废钢', 1, 1, '吨/天', 'vedio9') }} />
                <p className={styles.imgP}>废钢</p>
                <div className={styles.nameBox}></div>
                <div className={`${styles.box9} ${styles.box}`} style={{ 'marginLeft': '0px' }}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>
                                消耗设备：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>电弧炉</span></p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>转炉</span></p>
                            </li>
                            <li>
                                今日供应：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>3.7</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>3.9</span>T</p>
                            </li>
                            <li>
                                本月供应：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>178.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>173.2</span>T</p>
                            </li>
                            <li>
                                当前库存：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                            </li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock6_2}>
                <img src="./img/合金.png" className={styles.hl} onClick={() => { this.toEmployee(0, '废钢', 1, 1, '吨/天', 'vedio9') }} />
                <p className={styles.imgP}>合金</p>
                <div className={styles.nameBox}></div>
                <div className={`${styles.box9_1} ${styles.box}`} style={{ 'marginLeft': '0px' }}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>
                                消耗设备：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>电弧炉</span></p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>转炉</span></p>
                            </li>
                            <li>
                                今日供应：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>3.3</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>3.2</span>T</p>
                            </li>
                            <li>
                                本月供应：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>171.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>162.8</span>T</p>
                            </li>
                            <li>
                                当前库存：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>210.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>204.5</span>T</p>
                            </li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock6_1}>
                <img src="./img/铁水运转.gif" className={styles.fp} onClick={() => { this.toEmployee(0, '铁水运转', 1, 1, '吨/天', 'vedio5') }} />
                <div className={styles.nameBox}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;铁水运转</div>
                <div className={`${styles.box10} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>铁水供应：<span className={styles.number}>3.9</span>T</li>
                            <li>今日供应：<span className={styles.number}>3.3</span>T</li>
                            <li>本月供应：<span className={styles.number}>166.1</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>

            <div className={styles.stock7} >
                <img src="./img/制氧厂.gif" className={styles.fp} onClick={() => { this.toEmployee(0, '制氧厂', 2, 1, '立方米/时', 'vedio6') }} />
                <div className={styles.nameBox}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制氧厂</div>
                <div className={`${styles.box12} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日供氧：<span className={styles.number}>4.1</span>M³</li>
                            <li>本月累计：<span className={styles.number}>503.0</span>M³</li>
                            <li>单位成本：<span className={styles.number}>100</span>￥/M³</li>
                            <li>当前储存：<span className={styles.number}>785.0</span>M³</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock8} style={{ 'marginTop': '-20px' }}>
                <img src="./img/电弧炉.gif" className={styles.home} onClick={() => { this.toEmployee(0, '电炉', 1, 1, '吨/天', 'vedio7') }} />
                <div className={`${styles.box51} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>电弧炉温度：<span className={styles.number}>1271°</span></li>
                            <li>正常运行：<span className={styles.number}>41<i>H</i></span></li>
                            <li>碳排放：<span className={styles.number}>41.0<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box51_1} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日运转次数：<span className={styles.number}>99</span>N</li>
                            <li>今日合格率：<span className={styles.number}>92</span>%</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box51_3} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>5.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>100.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock9} style={{ 'marginTop': '-20px' }}>
                <img src="./img/氧气转炉.gif" className={styles.home} onClick={() => { this.toEmployee(0, '转炉', 1, 1, '吨/天', 'vedio4') }} />
                <div className={`${styles.box5} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>转炉温度：<span className={styles.number}>650°</span></li>
                            <li>正常运行：<span className={styles.number}>41<i>H</i></span></li>
                            <li>碳排放：<span className={styles.number}>41.0<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box5_2} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日运转次数：<span className={styles.number}>101</span>N</li>
                            <li>今日合格率：<span className={styles.number}>96</span>%</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box5_4} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>5.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>100.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock10}>
                <div >
                    <img src="./img/钢坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '钢坯', 1, 1, '吨/天', 'vedio1') }} />
                    <p className={styles.imgP}>钢坯</p>
                </div>
                <div className={`${styles.box14} ${styles.box}  ${styles.noMinHeight}`} style={{ 'marginLeft': '100px' }}>
                    <ul style={{ transform: 'translate(50px, 0px)' }}>
                        <li>连续浇铸</li>
                    </ul>
                </div>
                <div className={`${styles.box16} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>
                                产出设备：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>电弧炉</span></p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>转炉</span></p>
                            </li>
                            <li>
                                今日产出：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>5.7</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>5.3</span>T</p>
                            </li>
                            <li>本月累计：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>179.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>178.0</span>T</p>
                            </li>
                            <li>
                                本月目标：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                            </li>
                            <li>
                                单位成本：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>5676</span>￥/T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>5546</span>￥/T</p>
                            </li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock11}>
                <div style={{ 'marginBottom': '100px' }}>
                    <img src="./img/钢渣.png" className={styles.gp} onClick={() => { this.toEmployee(0, '钢渣', 1, 1, '吨/天', 'vedio3') }} />
                    <p className={styles.imgP}>钢渣</p>
                </div>
                <div className={`${styles.box15} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>
                                产出设备：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>电弧炉</span></p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>转炉</span></p>
                            </li>
                            <li>
                                今日产出：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>4.1</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>4.5</span>T</p>
                            </li>
                            <li>
                                本月累计：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>200.0</span>T</p>
                            </li>
                            <li>
                                本月目标：
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>240.0</span>T</p>
                                <p style={{ padding: '0 5px' }}><span className={styles.number}>240.0</span>T</p>
                            </li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
        </div>
    }

    initCanvas2() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [
                {
                    coords: [ //制氧厂左边线条
                        [146, 750],
                        [90, 750],
                        [90, 220],
                        [855, 220]
                    ]
                },
                {
                    coords: [ //铁水运转 右边线条
                        [325, 180],
                        [855, 180]
                    ]
                },
                {
                    coords: [ //合金右边线条
                        [320, 265],
                        [669, 265]
                    ]
                },
                {
                    coords: [ //合金至氧气炉条线
                        [669, 265],
                        [855, 265]
                    ]
                },
                {
                    coords: [ //合金右边往上电弧炉线条
                        [725, 265],
                        [725, 700],
                        [855, 700]
                    ]
                },

                {
                    coords: [ //电弧炉右边线条
                        [1065, 709],
                        [1280, 709],
                        [1280, 660]
                    ]
                },
                {
                    coords: [ //钢坯左边线条
                        [1280, 660],
                        [1570, 660]
                    ]
                },
                {
                    coords: [ //转炉右边线条
                        [1040, 280],
                        [1280, 280],
                        [1280, 479],
                        [1280, 660]
                    ]
                },
                {
                    coords: [ //废钢右边线条  
                        [310, 530],
                        [650, 530],
                        [650, 730],
                        [870, 730]
                    ]
                },
                {
                    coords: [ //废钢至转炉右边线条 
                        [650, 530],
                        [650, 300],
                        [870, 300]
                    ]
                },
                {
                    coords: [ //电炉至钢渣线条
                        [1050, 685],
                        [1050, 530],
                        [1380, 530],
                        [1380, 312]
                    ]
                },
                {
                    coords: [ //转炉至钢渣线条
                        [1030, 170],
                        [1380, 170],
                        [1380, 312],
                    ]
                },
                {
                    coords: [ //钢渣左边线条
                        [1380, 312],
                        [1540, 312]
                    ]
                },
            ]
        }

        let option = {
            backgroundColor: "",
            xAxis: {
                min: 0,
                max: 1920,
                show: false,
                type: 'value'
            },
            yAxis: {
                min: 0,
                max: 926,
                show: false,
                type: 'value'
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: 'orange',
                    formatter: function (item: any) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: '#E3F0FF',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    constantSpeed: 20,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 6
                },
                data: charts.linesData
            }]
        };
        //@ts-ignore
        this.myChart.setOption(option);
    }

    getProcess3() {
        return <div className={styles.main}>
            <div className={styles.stock12}>
                <div className={styles.noNameBox} style={{ 'marginTop': '130px' }}>
                    <img src="./img/钢坯.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '钢坯', 2, 1, '吨/天', 'vedio1')
                    }} />
                    <div className={styles.nameText}>钢坯</div>
                </div>
                <div className={`${styles.box18} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>钢坯今日供应：<span className={styles.number}>10.0</span>T</li>
                            <li>钢坯本月累计：<span className={styles.number}>95.5</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock20}>
                <div className={styles.noNameBox} style={{ 'width': 'auto' }}>
                    <img src="./img/设备-1.gif" className={styles.stove3} onClick={() => { this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3') }} />
                    <div className={styles.nameText}>设备1</div>
                </div>
                <div className={`${styles.box38} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日坯料供应：<span className={styles.number}>4.5</span>T</li>
                            <li>坯料本月累计：<span className={styles.number}>55.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>5.1</span>M³</li>
                            <li>本月煤气供应: <span className={styles.number}>52.3</span>M³</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock21}>
                <div className={styles.noNameBox} style={{ 'width': 'auto' }}>
                    <img src="./img/设备-1.gif" className={styles.stove3} onClick={() => { this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3') }} />
                    <div className={styles.nameText}>设备2</div>
                </div>
                <div className={`${styles.box38} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日坯料供应：<span className={styles.number}>5.1</span>T</li>
                            <li>坯料本月累计：<span className={styles.number}>52.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>6.5</span>M³</li>
                            <li>本月煤气供应: <span className={styles.number}>42.3</span>M³</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock22}>
                <div className={styles.noNameBox} style={{ 'width': 'auto' }}>
                    <img src="./img/设备-1.gif" className={styles.stove3} onClick={() => { this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3') }} />
                    <div className={styles.nameText}>设备3</div>
                </div>
                <div className={`${styles.box38} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日坯料供应：<span className={styles.number}>6.1</span>T</li>
                            <li>坯料本月累计：<span className={styles.number}>56.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>8.5<i>M³</i></span></li>
                            <li>本月煤气供应: <span className={styles.number}>33.3<i>M³</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock23}>
                <div className={styles.noNameBox} style={{ 'width': 'auto' }}>
                    <img src="./img/设备-1.gif" className={styles.stove3} onClick={() => { this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3') }} />
                    <div className={styles.nameText}>设备4</div>
                </div>
                <div className={`${styles.box38} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日坯料供应：<span className={styles.number}>6.5<i>T</i></span></li>
                            <li>坯料本月累计：<span className={styles.number}>50.0<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>6.9<i>M³</i></span></li>
                            <li>本月煤气供应: <span className={styles.number}>66.6<i>M³</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock24}>
                <div className={styles.noNameBox}>
                    <img src="./img/煤气回收2.gif" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>煤气</div>
                </div>
                <div className={`${styles.box39} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>板坯今日供应：<span className={styles.number}>27.0<i>M³</i></span></li>
                            <li>板坯本月累计：<span className={styles.number}>194.5<i>M³</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock25}>
                <div className={styles.noNameBox}>
                    <img src="./img/螺纹钢、型材.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>螺纹钢 /型材</div>
                </div>
                <div className={`${styles.box41} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
                            <li>单位成本：<span className={styles.number}>2322<i>￥/T</i></span></li>
                            <li>制成率：<span className={styles.number}>98<i>%</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock26}>
                <div className={styles.noNameBox}>
                    <img src="./img/管材.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>管材</div>
                </div>
                <div className={`${styles.box41} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
                            <li>单位成本：<span className={styles.number}>3365<i>￥/T</i></span></li>
                            <li>制成率：<span className={styles.number}>98<i>%</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock27}>
                <div className={styles.noNameBox}>
                    <img src="./img/线材.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>线材</div>
                </div>
                <div className={`${styles.box41} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
                            <li>单位成本：<span className={styles.number}>2633<i>￥/T</i></span></li>
                            <li>制成率：<span className={styles.number}>98<i>%</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock28}>
                <div className={styles.noNameBox}>
                    <img src="./img/板材、卷材.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>板材/卷材</div>
                </div>
                <div className={`${styles.box41} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
                            <li>单位成本：<span className={styles.number}>2365<i>￥/T</i></span></li>
                            <li>制成率：<span className={styles.number}>98<i>%</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
        </div>
    }

    initCanvas3() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [
                // 方坯板坯
                {
                    coords: [
                        [270, 625],
                        [570, 625],
                    ]
                },
                {
                    coords: [
                        [270, 345],
                        [570, 345],
                    ]
                },
                // 设备
                {
                    coords: [
                        [570, 530],
                        [570, 773]
                    ]
                },
                {
                    coords: [
                        [570, 530],
                        [570, 200]
                    ]
                },
                // 设备1234
                {
                    coords: [
                        [570, 773],
                        [985, 773]
                    ]
                },
                {
                    coords: [
                        [570, 581],
                        [985, 581]
                    ]
                },
                {
                    coords: [
                        [570, 390],
                        [985, 390]
                    ]
                },
                {
                    coords: [
                        [570, 200],
                        [985, 200]
                    ]
                },
                {
                    coords: [
                        [1290, 773],
                        [1443, 773]
                    ]
                },
                {
                    coords: [
                        [1290, 582],
                        [1443, 582]
                    ]
                },
                {
                    coords: [
                        [1290, 391],
                        [1443, 391]
                    ]
                },
                {
                    coords: [
                        [1290, 200],
                        [1443, 200]
                    ]
                },
            ]
        }

        let option = {
            backgroundColor: "",
            xAxis: {
                min: 0,
                max: 1920,
                show: false,
                type: 'value'
            },
            yAxis: {
                min: 0,
                max: 926,
                show: false,
                type: 'value'
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            },
            series: [{
                type: 'graph',
                coordinateSystem: 'cartesian2d',
                label: {
                    show: true,
                    position: 'bottom',
                    color: 'orange',
                    formatter: function (item: any) {
                        return item.data.nodeName
                    }
                },
                data: charts.nodes,
            }, {
                type: 'lines',
                polyline: true,
                coordinateSystem: 'cartesian2d',
                lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: '#E3F0FF',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    constantSpeed: 20,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 6
                },
                data: charts.linesData
            }]
        };
        //@ts-ignore
        this.myChart.setOption(option);
    }

    toEmployee(num: number, title: string, navIndex: number = 0, type: 1 | 2 = 1, unit: string = '吨/天', vedioName: string = "monitor") {
        let surnameArr = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐'.split('');
        let name = `${surnameArr[this.getRandom(surnameArr.length)]}××`;
        let contact = `138××××${this.getRandom(10)}${this.getRandom(10)}${this.getRandom(10)}${this.getRandom(10)}`;
        let currentCapacity = `${(this.getRandom(50) + 50) / 10}${unit}`;
        let state = '良好';
        let bool = type && type == 2;
        let row1 = bool ? `${this.getRandom(10) + 30}℃` : `${this.getRandom(100) + 100}℃`;
        let row2 = bool ? `${this.getRandom(30) + 50}%` : `${this.getRandom(60)}s/次`;
        let row3 = `${this.getRandom(50) + 30}分贝`;
        let row4 = '良好';
        let row5 = bool ? '' : '良好';
        let row = new DataRow();
        row.setValue('A1', row1).setValue('A2', row2).setValue('A3', row3).setValue('A4', row4).setValue('A5', row5).setValue('Name_', name).setValue('Contact_', contact).setValue('CurrentCapacity_', currentCapacity).setValue('State_', state);
        //@ts-ignore
        aui.showPage('Employee', title, { dataRow: row, title: title, backHref: 'FrmPurchaseChart5', backTitle: '工业4.0-数字化制造管理中心V1.0', type: bool ? 2 : 1, params: { navIndex }, vedioName })
    }

    getRandom(num: number) {
        return Math.floor(Math.random() * num);
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

    handleNavClick(navIndex: number) {
        if (navIndex != this.state.navIndex)
            showPage("FrmPurchaseChart5", "制造数据中心", { navIndex });
    }

    initCanvas(num: number) {
        switch (num) {
            case 0:
                this.initCanvas1();
                break;
            case 1:
                this.initCanvas2();
                break;
            case 2:
                this.initCanvas3();
                break;
        }
    }
}