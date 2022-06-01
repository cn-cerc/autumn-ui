import React from "react";
import ViewMenu, { ViewMenuMap } from "./ViewMenu";
import * as echarts from "echarts";
import styles from "./FrmPurchaseChart5.css";
import { FullScreenContainer } from "@jiaminghi/data-view-react";
import TopHeader from "./TopHeader";
import { DataRow } from "autumn-ui";

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
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart3", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart5", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart4", "销售数据管理中心")'
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
                <TopHeader title='制造数据管理中心' handleCick={this.titleClick.bind(this)} />
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
                <img src="./home.png" className={styles.home} />
                <div className={styles.nameBox}>焦煤厂</div>
                <ul className={`${styles.box1} ${styles.box}`}>
                    <li className={styles.boxTitle}>领用材料：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
                <ul className={`${styles.box2} ${styles.box}`}>
                    <li className={styles.boxTitle}>产出半成品：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
            </div>
            <div className={styles.stock2} onClick={() => {
                this.toEmployee(0, '煤气回收', 0, 1, '立方米/时')
            }}>
                <img src="./home.png" className={styles.home} />
                <div className={styles.nameBox}>煤气回收</div>
                <ul className={`${styles.box3} ${styles.box}`}>
                    <li className={styles.boxTitle}>回收煤气：</li>
                    <li>A：</li>
                    <li>B：</li>
                </ul>
                <ul className={`${styles.box4} ${styles.box}`}>
                    <li className={styles.boxTitle}>回收煤气：</li>
                    <li>A：</li>
                    <li>B：</li>
                </ul>
            </div>
            <div className={styles.stock3}>
                <img src="./stove.png" className={styles.stove} />
                <ul className={`${styles.box5} ${styles.box}`}>
                    <li>温度：</li>
                    <li>压力：</li>
                    <li>正常运行时间：</li>
                    <li>碳排放：</li>
                </ul>
            </div>
            <div className={styles.stock4} onClick={() => {
                this.toEmployee(0, '烧结厂', 0, 2)
            }}>
                <img src="./home.png" className={styles.home} />
                <div className={styles.nameBox}>烧结厂</div>
                <ul className={`${styles.box6} ${styles.box}`}>
                    <li className={styles.boxTitle}>产出半成品：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
                <ul className={`${styles.box7} ${styles.box}`}>
                    <li className={styles.boxTitle}>领用材料：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
            </div>
            <div className={styles.stock5} onClick={() => {
                this.toEmployee(0, '铁水运转', 0)
            }}>
                <img src="./car.png" className={styles.car} />
                <div className={styles.nameBox}>铁水运转</div>
                <ul className={`${styles.box8} ${styles.box}`}>
                    <li className={styles.boxTitle}>产出铁水：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                </ul>
            </div>
        </div>
    }

    initCanvas1() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [{
                coords: [
                    [428, 802],
                    [650, 802],
                    [650, 583],
                    [885, 583],
                ]
            }, {
                coords: [
                    [885, 343],
                    [650, 343],
                    [650, 124],
                    [428, 124],
                ]
            }, {
                coords: [
                    [1492, 802],
                    [1270, 802],
                    [1270, 583],
                    [1035, 583],
                ]
            }, {
                coords: [
                    [1035, 343],
                    [1270, 343],
                    [1270, 124],
                    [1492, 124],
                ]
            }, {
                coords: [
                    [304, 605],
                    [304, 310],
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
                    color: '#175064',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 8
                },
                data: charts.linesData
            }]
        };
        //@ts-ignore
        this.myChart.setOption(option);
    }

    getProcess2() {
        return <div className={styles.main}>
            <div className={styles.stock6} onClick={() => {
                this.toEmployee(0, '废钢', 1)
            }}>
                <img src="./home.png" className={styles.home} />
                <div className={styles.nameBox}>废钢</div>
                <ul className={`${styles.box9} ${styles.box}`}>
                    <li className={styles.boxTitle}>废钢供应：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
                <ul className={`${styles.box10} ${styles.box}`}>
                    <li className={styles.boxTitle}>铁水供应：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
            </div>
            <div className={styles.stock7} onClick={() => {
                this.toEmployee(0, '制氧厂', 2, 1, '立方米/时')
            }}>
                <img src="./home.png" className={styles.home} />
                <div className={styles.nameBox}>制氧厂</div>
                <ul className={`${styles.box11} ${styles.box}`}>
                    <li className={styles.boxTitle}>领用材料：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
                <ul className={`${styles.box12} ${styles.box}`}>
                    <li>今日供养：</li>
                    <li>A：</li>
                    <li>B：</li>
                    <li>C：</li>
                    <li>D：</li>
                    <li>E：</li>
                </ul>
            </div>
            <div className={styles.stock8}>
                <img src="./stove.png" className={styles.stove2} />
                <ul className={`${styles.box5} ${styles.box}`}>
                    <li>电磁温度：</li>
                    <li>转炉温度：</li>
                    <li>正常运行时间：</li>
                    <li>碳排放：</li>
                </ul>
            </div>
            <div className={styles.stock9}>
                <img src="./stove.png" className={styles.stove2} />
                <ul className={`${styles.box5} ${styles.box}`}>
                    <li>电磁温度：</li>
                    <li>转炉温度：</li>
                    <li>正常运行时间：</li>
                    <li>碳排放：</li>
                </ul>
            </div>
            <div className={styles.stock10}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '方坯', 1)
                }}>方坯</div>
                <ul className={`${styles.box13} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>钢水今日供应：</li>
                    <li>钢水本月累计：</li>
                </ul>
                <ul className={`${styles.box15} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginTop': '80px' }} onClick={() => {
                    this.toEmployee(0, '管坯', 1)
                }}>管坯</div>
                <ul className={`${styles.box14} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>钢水今日供应：</li>
                    <li>钢水本月累计：</li>
                </ul>
                <ul className={`${styles.box16} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
            </div>
            <div className={styles.stock11}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '钢锭', 1)
                }}>钢锭</div>
                <ul className={`${styles.box13} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>钢水今日供应：</li>
                    <li>钢水本月累计：</li>
                </ul>
                <ul className={`${styles.box15} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginTop': '80px' }} onClick={() => {
                    this.toEmployee(0, '板坯', 1)
                }}>板坯</div>
                <ul className={`${styles.box14} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>钢水今日供应：</li>
                    <li>钢水本月累计：</li>
                </ul>
                <ul className={`${styles.box16} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
            </div>
        </div>
    }

    initCanvas2() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [{
                coords: [
                    [428, 682],
                    [669, 682],
                    [669, 842],
                    [910, 842]
                ]
            }, {
                coords: [
                    [428, 186],
                    [669, 186],
                    [669, 346]
                ]
            }, {
                coords: [
                    [469, 346],
                    [669, 346],
                ]
            }, {
                coords: [
                    [669, 346],
                    [910, 346]
                ]
            }, {
                coords: [
                    [1010, 692],
                    [1241, 692],
                ]
            }, {
                coords: [
                    [1241, 692],
                    [1241, 756],
                    [1570, 756],
                ]
            }, {
                coords: [
                    [1241, 692],
                    [1241, 620],
                    [1570, 620],
                ]
            }, {
                coords: [
                    [1010, 236],
                    [1241, 236],
                ]
            }, {
                coords: [
                    [1241, 236],
                    [1241, 296],
                    [1570, 296],
                ]
            }, {
                coords: [
                    [1241, 236],
                    [1241, 162],
                    [1570, 162],
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
                    color: '#175064',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 8
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
                }}>管坯</div>
                <div className={styles.noNameBox} style={{ 'marginTop': '100px' }} onClick={() => {
                    this.toEmployee(0, '方坯', 2)
                }}>方坯</div>
                <ul className={`${styles.box17} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>管坯今日供应：</li>
                    <li>管坯本月累计：</li>
                </ul>
                <ul className={`${styles.box18} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>方坯今日供应：</li>
                    <li>方坯本月累计：</li>
                </ul>
            </div>
            <div className={styles.stock13}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '板坯', 2)
                }}>板坯</div>
                <ul className={`${styles.box19} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>板坯今日供应：</li>
                    <li>板坯本月累计：</li>
                </ul>
            </div>
            <div className={styles.stock14}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '初轧机', 2)
                }}>初轧机</div>
                <ul className={`${styles.box20} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
            </div>
            <div className={styles.stock15}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '2050热连扎线', 2)
                }}>2050热连扎线</div>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '1580热连扎线', 2)
                }}>1580热连扎线</div>
                <ul className={`${styles.box21} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box22} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
            </div>
            <div className={styles.stock16}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '管坯', 2)
                }}>管坯</div>
                <ul className={`${styles.box23} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>管坯今日产出：</li>
                    <li>管坯本月累计：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginTop': '40px' }} onClick={() => {
                    this.toEmployee(0, '方坯', 2)
                }}>方坯</div>
                <ul className={`${styles.box24} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>方坯今日产出：</li>
                    <li>方坯本月累计：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginTop': '40px' }} onClick={() => {
                    this.toEmployee(0, '板坯', 2)
                }}>板坯</div>
                <ul className={`${styles.box25} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>板坯今日产出：</li>
                    <li>板坯本月累计：</li>
                </ul>
            </div>
            <div className={styles.stock17}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '热轧钢卷', 2)
                }}>热轧钢卷</div>
                <ul className={`${styles.box26} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>钢卷今日产出：</li>
                    <li>钢卷本月累计：</li>
                </ul>
                <ul className={`${styles.box27} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>轧板今日供应：</li>
                    <li>轧板本月累计：</li>
                </ul>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '热轧板', 2)
                }}>热轧板</div>
            </div>
            <div className={styles.stock18}>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '140连续轧管线', 2)
                }}>140连续轧管线</div>
                <ul className={`${styles.box28} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box33} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>管材今日产出：</li>
                    <li>管材本月累计：</li>
                    <li>管材单位成本：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginTop': '100px' }} onClick={() => {
                    this.toEmployee(0, '高速线材轧机', 2)
                }}>高速线材轧机</div>
                <ul className={`${styles.box29} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box34} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>线材今日产出：</li>
                    <li>线材本月累计：</li>
                    <li>线材单位成本：</li>
                </ul>
            </div>
            <div className={styles.stock19}>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '2030冷链轧机', 2)
                }}>2030冷链轧机</div>
                <ul className={`${styles.box30} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box35} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
                <div className={styles.noNameBox} style={{ 'marginBottom': '100px' }} onClick={() => {
                    this.toEmployee(0, '1550冷链轧机', 2)
                }}>1550冷链轧机</div>
                <ul className={`${styles.box31} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box36} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
                <div className={styles.noNameBox} onClick={() => {
                    this.toEmployee(0, '1420冷链轧机', 2)
                }}>1420冷链轧机</div>
                <ul className={`${styles.box32} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>设备状况：</li>
                    <li>今日停产时间：</li>
                    <li>本月停产时间：</li>
                </ul>
                <ul className={`${styles.box37} ${styles.box}  ${styles.noMinHeight}`}>
                    <li>今日产出：</li>
                    <li>本月累计：</li>
                    <li>单位成本：</li>
                </ul>
            </div>
        </div>
    }

    initCanvas3() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [{
                coords: [
                    [270, 769],
                    [468, 769],
                    [468, 692],
                    [538, 692],
                ]
            }, {
                coords: [
                    [270, 615],
                    [468, 615],
                    [468, 692],
                    [538, 692],
                ]
            }, {
                coords: [
                    [712, 692],
                    [902, 692],
                ]
            }, {
                coords: [
                    [902, 692],
                    [902, 768],
                    [976, 768],
                ]
            }, {
                coords: [
                    [902, 692],
                    [902, 674],
                    [976, 674],
                ]
            }, {
                coords: [
                    [902, 692],
                    [902, 580],
                    [976, 580],
                ]
            }, {
                coords: [
                    [1146, 768],
                    [1414, 768],
                ]
            }, {
                coords: [
                    [1586, 768],
                    [1666, 768],
                ]
            }, {
                coords: [
                    [1146, 674],
                    [1324, 674],
                    [1324, 616],
                    [1414, 616],
                ]
            }, {
                coords: [
                    [1586, 616],
                    [1666, 616],
                ]
            }, {
                coords: [
                    [1061, 554],
                    [1061, 484],
                    [185, 484],
                    [185, 320],
                ]
            }, {
                coords: [
                    [270, 291],
                    [468, 291],
                ]
            }, {
                coords: [
                    [468, 291],
                    [468, 368],
                    [538, 368],
                ]
            }, {
                coords: [
                    [468, 291],
                    [468, 214],
                    [538, 214],
                ]
            }, {
                coords: [
                    [1146, 368],
                    [1324, 368],
                ]
            }, {
                coords: [
                    [1146, 214],
                    [1324, 214],
                ]
            }, {
                coords: [
                    [1324, 368],
                    [1324, 454],
                    [1414, 454],
                ]
            }, {
                coords: [
                    [1586, 454],
                    [1666, 454],
                ]
            }, {
                coords: [
                    [1324, 368],
                    [1324, 298],
                ]
            }, {
                coords: [
                    [1324, 298],
                    [1414, 298],
                ]
            }, {
                coords: [
                    [1586, 298],
                    [1666, 298],
                ]
            }, {
                coords: [
                    [1324, 214],
                    [1324, 298],
                ]
            }, {
                coords: [
                    [1324, 214],
                    [1324, 146],
                    [1414, 146],
                ]
            }, {
                coords: [
                    [1586, 146],
                    [1666, 146],
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
                    color: '#175064',
                    curveness: 0.3

                },
                effect: {
                    show: true,
                    trailLength: 0.1,
                    symbol: 'arrow',
                    color: 'orange',
                    symbolSize: 8
                },
                data: charts.linesData
            }]
        };
        //@ts-ignore
        this.myChart.setOption(option);
    }

    toEmployee(num: number, title: string, navIndex: number = 0, type: 1 | 2 = 1, unit: string = '吨/天') {
        console.log(type, unit)
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
        aui.showPage('Employee', title, { dataRow: row, title: title, backHref: 'FrmPurchaseChart5', backTitle: '制造数据管理中心', type: bool ? 2 : 1, params: { navIndex } })
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
            this.setState({
                navIndex
            }, () => {
                this.initCanvas(navIndex)
            })
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