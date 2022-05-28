import React from "react";
import ViewMenu, { ViewMenuMap } from "./ViewMenu";
import * as echarts from "echarts";
import styles from "./FrmPurchaseChart5.css";
import { FullScreenContainer } from "@jiaminghi/data-view-react";
import TopHeader from "./TopHeader";

type stateType = {
    menuOptions: ViewMenuMap,
    showIndex: number,
    navArr: string[],
    navIndex: number,
}
type PropsType = {
}

export default class FrmPurchaseChart5 extends React.Component<PropsType, stateType> {
    private myChart: any;
    constructor(props: PropsType) {
        super(props);
        this.state = {
            menuOptions: new Map([['采购数据管理中心', {
                imgSrc: './kanban1.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart3", "采购数据管理中心")'
            }], ['制造数据管理中心', {
                imgSrc: './kanban2.png',
                href: 'javascript:aui.showPage("FrmManufactureChart", "制造数据管理中心")'
            }], ['销售数据管理中心', {
                imgSrc: './kanban3.png',
                href: 'javascript:aui.showPage("FrmPurchaseChart4", "销售数据管理中心")'
            }]]),
            showIndex: 0,
            navArr: ['炼铁', '炼钢', '轧钢'],
            navIndex: 0
        }
    }

    componentDidMount(): void {
        let canvas = document.getElementById('canvas') as HTMLDivElement;
        this.myChart = echarts.init(canvas);
        this.initCanvas1();
    }

    render(): React.ReactNode {
        return <div className={styles.dataView}>
            <FullScreenContainer className={styles.dvFullScreenContainer}>
                <TopHeader title='销售数据管理中心' handleCick={this.titleClick.bind(this)} />
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
            <div className={styles.stock2}>
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
            <div className={styles.stock4}>
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
            <div className={styles.stock5}>
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
                    [650, 473],
                    [885, 473],
                ]
            }, {
                coords: [
                    [885, 453],
                    [650, 453],
                    [650, 124],
                    [428, 124],
                ]
            }, {
                coords: [
                    [1492, 802],
                    [1270, 802],
                    [1270, 473],
                    [1035, 473],
                ]
            }, {
                coords: [
                    [1035, 453],
                    [1270, 453],
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

    initCanvas2() {
        let nodes: any[] = [];
        var charts = {
            nodes,
            linesData: [{
                coords: [
                    [428, 802],
                    [650, 802],
                    [650, 473],
                    [885, 473],
                ]
            }, {
                coords: [
                    [885, 453],
                    [650, 453],
                    [650, 124],
                    [428, 124],
                ]
            }, {
                coords: [
                    [1492, 802],
                    [1270, 802],
                    [1270, 473],
                    [1035, 473],
                ]
            }, {
                coords: [
                    [1035, 453],
                    [1270, 453],
                    [1270, 124],
                    [1492, 124],
                ]
            }, {
                coords: [
                    [244, 605],
                    [244, 310],
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

    initCanvas3() {

    }

    getProcess2() {
        return <div className={styles.main}></div>
    }

    getProcess3() {
        return <div className={styles.main}></div>
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