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
                {/* <div handleCick={this.titleClick.bind(this)}>xxx</div> */}
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
                <img src="./img/焦煤厂.gif" className={styles.jmc} onClick={() => {
                    this.toEmployee(0, '焦煤厂', 0, 2, '吨/天', 'vedio6')
                }} />
                <div className={`${styles.nameBox1} ${styles.nameBox}`}>焦煤厂</div>
                <div className={`${styles.box1} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领料（煤）：<span className={styles.number}>5</span>T</li>
                            <li>本月领料（煤）：<span className={styles.number}>100</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box2} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出（焦煤）：<span className={styles.number}>4.8</span>T</li>
                            <li>本月产出（焦煤）：<span className={styles.number}>96</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock2}>
                <img src="./img/煤气回收2.gif" className={styles.mqhs} onClick={() => {
                    this.toEmployee(0, '煤气回收', 0, 1, '立方米/时', 'vedio6')
                }} />
                <div className={`${styles.nameBox2} ${styles.nameBox}`}>煤气回收</div>
                <div className={`${styles.box3} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日回收煤气：<span className={styles.number}>50</span>m³</li>
                            <li>本月回收煤气：<span className={styles.number}>1000</span>m³</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box4} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日回收煤气：<span className={styles.number}>30</span>m³</li>
                            <li>本月回收煤气：<span className={styles.number}>600</span>m³</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock3}>
                <img src="./img/fire.gif" className={styles.fire1} onClick={() => {
                    this.toEmployee(0, '转炉', 0, 1, '吨/天', 'vedio8')
                }} />
                <div className={`${styles.box5} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>转炉温度：<span className={styles.number}>650°</span></li>
                            <li>转炉压力：<span className={styles.number}>240<i>ata</i></span></li>
                            <li>正常运行时间：<span className={styles.number}>41<i>h</i></span></li>
                            <li>碳排放：<span className={styles.number}>41<i>T</i></span></li>
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
                            <li>今日产出（铁球）：<span className={styles.number}>6</span>T</li>
                            <li>本月产出（铁球）：<span className={styles.number}>120</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box7} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日领用（矿石）：<span className={styles.number}>8</span>T</li>
                            <li>本月领用（矿石）：<span className={styles.number}>160</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock5}>
                <img src="./img/铁水运转2.gif" className={styles.tsyz} onClick={() => {
                    this.toEmployee(0, '铁水运转', 0, 1, '吨/天', 'vedio5')
                }} />
                <div className={`${styles.nameBox4} ${styles.nameBox}`}>铁水运转</div>
                <div className={`${styles.box8} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日输出（铁水）：<span className={styles.number}>5.8</span>T</li>
                            <li>本月输出（铁水）：<span className={styles.number}>116</span>T</li>
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
            linesData: [{
                coords: [
                    [493, 596],
                    [493, 496],
                    [878, 496],
                ]
            }, {
                coords: [
                    [852, 343],
                    [780, 343],
                    [780, 124],
                    [440, 124],
                ]
            }, {
                coords: [
                    [1518, 686],
                    [1518, 496],
                    [1045, 496],
                ]
            }, {
                coords: [
                    [1075, 343],
                    [1143, 343],
                    [1143, 124],
                    [1510, 124],
                ]
            }, {
                coords: [
                    [404, 610],
                    [404, 260],
                ]
            }]
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
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 12
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
                            <li>废钢供应：<span className={styles.number}>233.0</span>T</li>
                            <li>今日供应：<span className={styles.number}>36.0</span>T</li>
                            <li>本月供应：<span className={styles.number}>178.0</span>T</li>
                            <li>当前库存：<span className={styles.number}>200.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stocks}>
                <img src="./img/铁水运转.gif" className={styles.fp} onClick={() => { this.toEmployee(0, '铁水运转', 1, 1, '吨/天', 'vedio5') }} />
                <div className={styles.nameBox}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;铁水运转</div>
                <div className={`${styles.box10} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>铁水供应：<span className={styles.number}>654.0</span>T</li>
                            <li>今日供应：<span className={styles.number}>23.0</span>T</li>
                            <li>本月供应：<span className={styles.number}>186.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>

            <div className={styles.stock7} >
                <img src="./img/制氧厂.png" className={styles.fp} onClick={() => { this.toEmployee(0, '制氧厂', 2, 1, '立方米/时', 'vedio6') }} />
                <div className={styles.nameBox}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制氧厂</div>
                <div className={`${styles.box12} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日供氧：<span className={styles.number}>41.0</span>T</li>
                            <li>本月累计：<span className={styles.number}>503.0</span>T</li>
                            <li>单位成本：<span className={styles.number}>656.0</span>T</li>
                            <li>当前储存：<span className={styles.number}>785.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock8} style={{ 'marginTop': '-20px' }}>
                <img src="./img/fire.gif" className={styles.home} onClick={() => { this.toEmployee(0, '电炉', 1, 1, '吨/天', 'vedio7') }} />
                <div className={`${styles.box51} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>电炉温度：<span className={styles.number}>650°</span></li>
                            <li>电炉压力：<span className={styles.number}>240<i>ATA</i></span></li>
                            <li>正常运行：<span className={styles.number}>41<i>H</i></span></li>
                            <li>碳排放：<span className={styles.number}>41.0<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock9} style={{ 'marginTop': '-20px' }}>
                <img src="./img/fire-2.gif" className={styles.home} onClick={() => { this.toEmployee(0, '转炉', 1, 1, '吨/天', 'vedio4') }} />
                <div className={`${styles.box5} ${styles.box}`} >
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>转炉温度：<span className={styles.number}>650°</span></li>
                            <li>转炉压力：<span className={styles.number}>240<i>ATA</i></span></li>
                            <li>正常运行：<span className={styles.number}>41<i>H</i></span></li>
                            <li>碳排放：<span className={styles.number}>41.0<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock10}>
                <div style={{ 'marginBottom': '100px' }}>
                    <img src="./img/方坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '方坯', 1, 1, '吨/天', 'vedio2') }} />
                    <p className={styles.imgP}>方坯</p>
                </div>
                <div className={`${styles.box13} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>12.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>132.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box15} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>23.0</span>T</li>
                            <li>本月累计：<span className={styles.number}>232.0</span>T</li>
                            <li>本月目标：<span className={styles.number}>240.0</span>T</li>
                            <li>单位成本：<span className={styles.number}>5646</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div >
                    <img src="./img/管坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '管坯', 1, 1, '吨/天', 'vedio1') }} />
                    <p className={styles.imgP}>管坯</p>
                </div>
                <div className={`${styles.box14} ${styles.box}  ${styles.noMinHeight}`} style={{ 'marginLeft': '100px' }}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>14.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>322.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box16} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>22.0</span>T</li>
                            <li>本月累计：<span className={styles.number}>211.0</span>T</li>
                            <li>本月目标：<span className={styles.number}>240.0</span>T</li>
                            <li>单位成本：<span className={styles.number}>4544</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock11}>
                <div style={{ 'marginBottom': '100px' }}>
                    <img src="./img/钢锭.png" className={styles.gp} onClick={() => { this.toEmployee(0, '钢锭', 1, 1, '吨/天', 'vedio3') }} />
                    <p className={styles.imgP}>钢锭</p>
                </div>
                <div className={`${styles.box13} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>5.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>100.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box15} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>10.0</span>T</li>
                            <li>本月累计：<span className={styles.number}>200.0</span>T</li>
                            <li>本月目标：<span className={styles.number}>220.0</span>T</li>
                            <li>单位成本：<span className={styles.number}>5466</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div style={{ 'marginTop': '40px' }} >
                    <img src="./img/板坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '板坯', 1, 1, '吨/天', 'vedio2') }} />
                    <p className={styles.imgP}>板坯</p>
                </div>
                <div className={`${styles.box14} ${styles.box} ${styles.box14s} ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>钢水今日供应：<span className={styles.number}>4.0</span>T</li>
                            <li>钢水本月累计：<span className={styles.number}>80.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box16} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日产出：<span className={styles.number}>3.8.0</span>T</li>
                            <li>本月累计：<span className={styles.number}>70.0</span>T</li>
                            <li>本月目标：<span className={styles.number}>65.0</span>T</li>
                            <li>单位成本：<span className={styles.number}>3215</span>￥/T</li>
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
            linesData: [{
                coords: [
                    [320, 750],
                    [885, 750],
                ]
            }, {
                coords: [
                    [325, 186],
                    [669, 186],
                    [669, 346],
                ]
            }, {
                coords: [
                    [325, 450],
                    [669, 450],
                    [669, 346],
                ]
            }, {
                coords: [
                    [669, 320],
                    [890, 320],
                ]
            }, {
                coords: [
                    [1040, 750],
                    [1280, 750],
                ]
            }, {
                coords: [
                    [1280, 750],
                    [1280, 850],
                    [1530, 850],
                ]
            }, {
                coords: [
                    [1280, 750],
                    [1280, 660],
                    [1530, 660],
                ]
            }, {
                coords: [
                    [1040, 236],
                    [1280, 236],
                ]
            }, {
                coords: [
                    [1280, 240],
                    [1280, 312],
                    [1540, 312],
                ]
            }, {
                coords: [
                    [1280, 233],
                    [1280, 126],
                    [1540, 126],
                ]
            }]
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
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 12
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
                    <img src="./img/方坯.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '方坯', 2, 1, '吨/天', 'vedio1')
                    }} />
                    <div className={styles.nameText}>方坯</div>
                </div>
                <div className={`${styles.box18} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>方坯今日供应：<span className={styles.number}>5.0</span>T</li>
                            <li>方坯本月累计：<span className={styles.number}>44.0</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock13}>
                <div className={styles.noNameBox}>
                    <img src="./img/板坯.png" className={styles.stove2} onClick={() => {
                        this.toEmployee(0, '板坯', 2, 1, '吨/天', 'vedio3')
                    }} />
                    <div className={styles.nameText}>板坯</div>
                </div>
                <div className={`${styles.box19} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>板坯今日供应：<span className={styles.number}>5.1</span>T</li>
                            <li>板坯本月累计：<span className={styles.number}>52.3</span>T</li>
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
                            <li>今日坯料供应：<span className={styles.number}>5.1</span>T</li>
                            <li>坯料本月累计：<span className={styles.number}>52.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>5.1</span>T</li>
                            <li>本月煤气供应: <span className={styles.number}>52.3</span>T</li>
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
                            <li>今日煤气供应：<span className={styles.number}>5.1</span>T</li>
                            <li>本月煤气供应: <span className={styles.number}>52.3</span>T</li>
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
                            <li>今日坯料供应：<span className={styles.number}>5.1</span>T</li>
                            <li>坯料本月累计：<span className={styles.number}>52.3</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月煤气供应: <span className={styles.number}>52.3<i>T</i></span></li>
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
                            <li>今日坯料供应：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>坯料本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box40} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日煤气供应：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>本月煤气供应: <span className={styles.number}>52.3<i>T</i></span></li>
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
                            <li>板坯今日供应：<span className={styles.number}>5.1<i>T</i></span></li>
                            <li>板坯本月累计：<span className={styles.number}>52.3<i>T</i></span></li>
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
                        [270, 733],
                        [570, 733],
                    ]
                },
                {
                    coords: [
                        [270, 508],
                        [570, 508],
                    ]
                },
                {
                    coords: [
                        [270, 270],
                        [570, 270],
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
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 12
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