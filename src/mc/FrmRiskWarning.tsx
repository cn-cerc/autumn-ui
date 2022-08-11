import { WebControl } from "autumn-ui";
import React from "react";
import ApplicationConfig from "../static/ApplicationConfig";
import StaticFile from "../static/StaticFile";
import { addScript, GDMap } from "../tool/Summer";
import styles from "./FrmRiskWarning.css";

type FrmRiskWarningTypeProps = {
    lonlat: string
}

type FrmRiskWarningTypeState = {
    toggle: number
}

export default class FrmRiskWarning extends WebControl<FrmRiskWarningTypeProps, FrmRiskWarningTypeState>{
    // private gdmap: GDMap = new GDMap();
    // private timer: any;
    constructor(props: FrmRiskWarningTypeProps) {
        super(props);
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            toggle,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>风控预警</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>
                <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                    <div className={styles.centerBox1}>
                        <div className={styles.mcMap}>
                            <img src={StaticFile.getImage('images/MCimg/map_bg.png')} alt="" />
                        </div>
                        {/* <div className={styles.mcMap} id='carMapContainer'></div> */}
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox1}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>预警详情</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.warningDetail}>
                                <p>高风险：23例</p>
                                <p>正常：85例</p>
                                <p>待检测：2例</p>
                            </div>
                            <div className={styles.warningPieBox}>
                                <div className={styles.warningPie}>
                                    <p>风险指数</p>
                                    <p>23%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox2}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>数据汇总</p>
                        <div className={styles.dataItemInfo}>

                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox3}`}>
                        <img src={StaticFile.getImage('images/MCimg/echartsData-bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>数据分析</p>
                        <div className={styles.dataItemInfo}>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentWillUnmount() {

    }

    // componentDidMount() {
    //     // this.timer = setInterval(this.init.bind(this), 30000);
    //     addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this))
    // }

    // initMap() {
    //     this.gdmap.initMap('carMapContainer', {
    //         zoom: 5.8,
    //         // center: this.props.lonlat.split(',')
    //         center: [115.693942, 28.2882]
    //     });
    // }

    toggleFun() {
        if (this.state.toggle == 2) {
            location.href = `${location.origin}${location.pathname}?device=pc`;
            this.setState({
                toggle: 1
            })
        } else {
            location.href = `${location.origin}${location.pathname}?device=kanban`;
            this.setState({
                toggle: 2
            })
        }
    }
}