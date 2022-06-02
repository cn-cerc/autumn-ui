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
            <div className={styles.stock1} onClick={() => {
                this.toEmployee(0, '焦煤厂', 0, 2)
            }}>
                <img src="./img/焦煤厂.gif" className={styles.jmc} />
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
            <div className={styles.stock2} onClick={() => {
                this.toEmployee(0, '煤气回收', 0, 1, '立方米/时')
            }}>
                <img src="./img/煤气回收2.gif" className={styles.mqhs} />
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
                <img src="./img/fire.gif" className={styles.fire1} />
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
            <div className={styles.stock4} onClick={() => {
                this.toEmployee(0, '烧结厂', 0, 2)
            }}>
                <img src="./img/烧结厂.gif" className={styles.sjc} />
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
                            <li>今日领用（煤）：<span className={styles.number}>8</span>T</li>
                            <li>本月领用（煤）：<span className={styles.number}>160</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock5} onClick={() => {
                this.toEmployee(0, '铁水运转', 0)
            }}>
                <img src="./img/铁水运转2.gif" className={styles.tsyz} />
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
                <img src="./img/废钢.png" className={styles.hl} onClick={() => { this.toEmployee(0, '废钢', 1) }} />
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
                <img src="./img/铁水运转.gif" className={styles.fp} />
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
                <img src="./img/制氧厂.png" className={styles.fp} onClick={() => { this.toEmployee(0, '制氧厂', 2, 1, '立方米/时') }} />
                <div className={styles.nameBox}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制氧厂</div>
                {/* <div className={`${styles.box11} ${styles.box}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>领用材料：</li>
                            <li>A：</li>
                            <li>B：</li>
                            <li>C：</li>
                            <li>D：</li>
                            <li>E：</li>
                        </ul>
                    </BorderBox10>
                </div> */}
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
                <img src="./img/fire.gif" className={styles.home} />
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
                <img src="./img/fire-2.gif" className={styles.home} />
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
                    <img src="./img/方坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '方坯', 1) }} />
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
                    <img src="./img/管坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '管坯', 1) }} />
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
                    <img src="./img/钢锭.png" className={styles.gp} onClick={() => { this.toEmployee(0, '钢锭', 1) }} />
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
                    <img src="./img/板坯.png" className={styles.gp} onClick={() => { this.toEmployee(0, '板坯', 1) }} />
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
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '管坯', 2)
                }}>
                    <img src="./img/管坯.png" className={styles.stove2} />
                    <div className={styles.nameText}>管坯</div>
                </div>
                <div className={styles.noNameBox} style={{ 'marginTop': '130px' }} onClick={() => {
                    this.toEmployee(0, '方坯', 2)
                }}>
                    <img src="./img/方坯.png" className={styles.stove2} />
                    <div className={styles.nameText}>方坯</div>
                </div>

                <div className={`${styles.box17} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>管坯今日供应：<span className={styles.number}>3.4</span>T</li>
                            <li>管坯本月累计：<span className={styles.number}>41.0</span>T</li>
                        </ul>
                    </BorderBox10>
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
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '板坯', 2)
                }}>
                    <img src="./img/板坯.png" className={styles.stove2} />
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
            <div className={styles.stock14}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '初轧机', 2)
                }}>
                    <img src="./img/1.gif" className={styles.stove2} />
                    <div className={styles.nameText}>初轧机</div>
                </div>
                <div className={`${styles.box20} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日停产时间：<span className={styles.number}>6.9</span>H</li>
                            <li>本月停产时间：<span className={styles.number}>36.0</span>H</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock15}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '66px' }} onClick={() => {
                    this.toEmployee(0, '2050热连扎线', 2)
                }}>
                    <img src="./img/2.gif" className={styles.stove2} />
                    <div className={styles.nameText}>2050热连扎线</div>
                </div>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '1580热连扎线', 2)
                }}>
                    <img src="./img/3.gif" className={styles.stove2} />
                    <div className={styles.nameText}>1580热连扎线</div>
                </div>
                <div className={`${styles.box21} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul>
                            <li>今日停产时间：<span className={styles.number}>2.7</span><span style={{ 'float': 'right' }}>H</span></li>
                            <li>本月停产时间：<span className={styles.number}>24.4</span><span style={{ 'float': 'right' }}>H</span></li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box22} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>8.4</span><span style={{ 'float': 'right' }}>H</span></li>
                            <li>本月停产时间：<span className={styles.number}>100.5</span><span style={{ 'float': 'right' }}>H</span></li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock16}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '管坯', 2)
                }}>
                    <img src="./img/管坯.png" className={styles.stove2} />
                    <div className={styles.nameText}>管坯1</div>
                </div>
                <div className={`${styles.box23} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>管坯今日产出：<span className={styles.number}>3.2</span>T</li>
                            <li>管坯本月累计：<span className={styles.number}>19.7</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>

                <div className={styles.noNameBox} style={{ 'marginTop': '60px' }} onClick={() => {
                    this.toEmployee(0, '方坯', 2)
                }}>
                    <img src="./img/方坯.png" className={styles.stove2} />
                    <div className={styles.nameText}>方坯</div>
                </div>
                <div className={`${styles.box24} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>方坯今日产出：<span className={styles.number}>2.3</span>T</li>
                            <li>方坯本月累计：<span className={styles.number}>10.7</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={styles.noNameBox} style={{ 'marginTop': '60px' }} onClick={() => {
                    this.toEmployee(0, '板坯', 2)
                }}>
                    <img src="./img/板坯.png" className={styles.stove2} />
                    <div className={styles.nameText}>板坯</div>
                </div>
                <div className={`${styles.box25} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>板坯今日产出：<span className={styles.number}>2.8</span>T</li>
                            <li>板坯本月累计：<span className={styles.number}>26.9</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>

            </div>
            <div className={styles.stock17}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '热轧钢卷', 2)
                }}>
                    <img src="./img/热轧钢卷3.png" className={styles.stove2} style={{ width: '80px' }} />
                    <div className={styles.nameText}>热轧钢卷</div>
                </div>
                <div className={`${styles.box26} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>钢卷今日产出：<span className={styles.number}>4.3</span>T</li>
                            <li>钢卷本月累计：<span className={styles.number}>80.7</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box27} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>轧板今日供应：<span className={styles.number}>5.5</span>T</li>
                            <li>轧板本月累计：<span className={styles.number}>130.4</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '热轧板', 2)
                }}>
                    <img src="./img/热轧板.png" className={styles.stove2} />
                    <div className={styles.nameText}>热轧板</div>
                </div>
            </div>
            <div className={styles.stock18}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '140连续轧管线', 2)
                }}>
                    <img src="./img/资源-28.gif" className={styles.stove2} />
                    <div className={styles.nameText}>140连续轧管线</div>
                </div>
                <div className={`${styles.box28} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>2.7</span>T</li>
                            <li>本月停产时间：<span className={styles.number}>70.9</span>T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box33} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日产出：<span className={styles.number}>5.1</span>T</li>
                            <li>本月累计：<span className={styles.number}>90.2</span>T</li>
                            <li>本月目标：<span className={styles.number}>390.2</span>T</li>
                            <li>单位成本：<span className={styles.number}>6.5</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={styles.noNameBox} style={{ 'marginTop': '60px' }} onClick={() => {
                    this.toEmployee(0, '高速线材轧机', 2)
                }}>
                    <img src="./img/资源-29.gif" className={styles.stove2} />
                    <div className={styles.nameText}>高速线材轧机</div>
                </div>
                <div className={`${styles.box29} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>3.5</span>H</li>
                            <li>本月停产时间：<span className={styles.number}>80.7</span>H</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box34} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日产出：<span className={styles.number}>6.3</span>T</li>
                            <li>本月累计：<span className={styles.number}>106.9</span>T</li>
                            <li>本月目标：<span className={styles.number}>310.2</span>T</li>
                            <li>单位成本：<span className={styles.number}>7.2</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>
            </div>
            <div className={styles.stock19}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '2030冷链轧机', 2)
                }}>
                    <img src="./img/4.gif" className={styles.stove2} />
                    <div className={styles.nameText}>2030冷链轧机</div>
                </div>
                <div className={`${styles.box30} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>5.7</span>H</li>
                            <li>本月停产时间：<span className={styles.number}>100.4</span>H</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box35} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日产出：<span className={styles.number}>4.9</span>T</li>
                            <li>本月累计：<span className={styles.number}>130.7</span>T</li>
                            <li>本月目标：<span className={styles.number}>287.2</span>T</li>
                            <li>单位成本：<span className={styles.number}>5.2</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>

                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '1550冷链轧机', 2)
                }}>
                    <img src="./img/5.gif" className={styles.stove2} />
                    <div className={styles.nameText}>1550冷链轧机</div>
                </div>
                <div className={`${styles.box31} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>3.3</span>H</li>
                            <li>本月停产时间：<span className={styles.number}>40.0</span>H</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box36} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日产出：<span className={styles.number}>9.7</span>T</li>
                            <li>本月累计：<span className={styles.number}>200.3</span>T</li>
                            <li>本月目标：<span className={styles.number}>500</span>T</li>
                            <li>单位成本：<span className={styles.number}>10.0</span>￥/T</li>
                        </ul>
                    </BorderBox10>
                </div>

                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '1420冷链轧机', 2)
                }}>
                    <img src="./img/6.gif" className={styles.stove2} />
                    <div className={styles.nameText}>1420冷链轧机</div>
                </div>
                <div className={`${styles.box32} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日停产时间：<span className={styles.number}>4.3</span>H</li>
                            <li>本月停产时间：<span className={styles.number}>70.1</span>H</li>
                        </ul>
                    </BorderBox10>
                </div>
                <div className={`${styles.box37} ${styles.box}  ${styles.noMinHeight}`}>
                    <BorderBox10 color={['#8aafff', '#88bdff']}>
                        <ul >
                            <li>今日产出：<span className={styles.number}>6.2</span>T</li>
                            <li>本月累计：<span className={styles.number}>150.3</span>T</li>
                            <li>本月目标：<span className={styles.number}>410</span>T</li>
                            <li>单位成本：<span className={styles.number}>7.1</span>￥/T</li>
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
            linesData: [{
                coords: [
                    [168, 769],
                    [380, 769],
                    [380, 670],
                    [490, 670],
                ]
            }, {
                coords: [
                    [168, 580],
                    [380, 580],
                    [380, 670],
                    [490, 670],
                ]
            }, {
                coords: [
                    [580, 675],
                    [680, 675],
                ]
            },
            {
                coords: [
                    [680, 670],
                    [680, 790],
                    [830, 790],
                ]
            },
            {
                coords: [ //方坯 左边线条
                    [680, 675],
                    [680, 675],
                    [830, 675],
                ]
            },
            {
                coords: [ //板坯 左边线条
                    [680, 675],
                    [680, 580],
                    [830, 580],
                ]
            },
            {
                coords: [ //140连续轧管线 左边线条
                    [940, 790],
                    [1300, 790],
                ]
            },
            {
                coords: [ //140连续轧管线 右边线条
                    [1380, 790],
                    [1666, 790],
                ]
            },
            {
                coords: [ //高速线材轧机左边线条
                    [900, 677],
                    [1300, 677],
                ]
            },
            {
                coords: [ //高速线材轧机右边线条
                    [1380, 677],
                    [1666, 677],
                ]
            },
            {
                coords: [ //板坯右侧往下线条
                    [930, 550],
                    [930, 484],
                    [130, 484],
                    [130, 270],
                ]
            }, {
                coords: [ //左侧 下方第一个图线条
                    [165, 255],
                    [380, 255],
                ]
            },
            {
                coords: [//2050热线链接热轧钢卷线条
                    [580, 320],
                    [860, 320],
                ]
            },
            {
                coords: [//1580热线链接热轧板线条
                    [580, 204],
                    [850, 204],
                ]
            },
            {
                coords: [ //2050热连扎线 线条
                    [380, 260],
                    [380, 318],
                    [495, 318],
                ]
            },
            {
                coords: [ //1580热连扎线 线条
                    [380, 255],
                    [380, 200],
                    [495, 200],
                ]
            },
            {
                coords: [ //热轧钢卷右边线条
                    [930, 328],
                    [1230, 328],
                ]
            },
            {
                coords: [ //热轧板右边线条
                    [930, 204],
                    [1160, 204],
                    [1160, 328],
                    [1240, 328],
                ]
            },
            {
                coords: [ //2030冷链轧机 左边线条
                    [1230, 333],
                    [1230, 475],
                    [1300, 475],
                ]
            },
            {
                coords: [//2030冷链轧机 右边线条
                    [1345, 475],
                    [1666, 475],
                ]
            },
            {
                coords: [ //1550 冷链轧机 左边线条
                    [1230, 328],
                    [1300, 328],
                ]
            },
            {
                coords: [ //1550 冷链轧机 右边线条
                    [1345, 328],
                    [1666, 328],
                ]
            },
            {
                coords: [ //1420 冷链轧机 左边线条
                    [1230, 330],
                    [1230, 172],
                    [1300, 172],
                ]
            },
            {
                coords: [
                    [1345, 172],
                    [1666, 172],
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

    toEmployee(num: number, title: string, navIndex: number = 0, type: 1 | 2 = 1, unit: string = '吨/天') {
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
        aui.showPage('Employee', title, { dataRow: row, title: title, backHref: 'FrmPurchaseChart5', backTitle: '工业4.0-数字化制造管理中心V1.0', type: bool ? 2 : 1, params: { navIndex } })
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