import { WebControl } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import ApplicationConfig from "../static/ApplicationConfig";
import StaticFile from "../static/StaticFile";
import { addScript, GDMap } from "../tool/Summer";
import styles from "./FrmConcentratedData.css";

type FrmConcentratedDataTypeProps = {
    lonlat: string
}

type FrmConcentratedDataTypeState = {
    toggle: number,
    northNum: number,
    southNum: number,
    eastNum: number,
    westhNum: number,
}

export default class FrmConcentratedData extends WebControl<FrmConcentratedDataTypeProps, FrmConcentratedDataTypeState>{
    // private gdmap: GDMap = new GDMap();
    // private timer: any;
    constructor(props: FrmConcentratedDataTypeProps) {
        super(props);
        let toggle = location.search.split('=')[1] == 'kanban' ? 2 : 1;
        this.state = {
            toggle,
            northNum: 352,
            southNum: 68,
            eastNum: 246,
            westhNum: 153,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <p>
                    <span>集运数据</span>
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
                        <p className={styles.dataItemTitle}>华北地区</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.dataItemInfoNum}>
                                {this.state.northNum}
                            </div>
                            <p className={styles.dataItemInfoText}>在线车辆</p>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox2}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>华西地区</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.dataItemInfoNum}>
                                {this.state.westhNum}
                            </div>
                            <p className={styles.dataItemInfoText}>在线车辆</p>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox3}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>华东地区</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.dataItemInfoNum}>
                                {this.state.eastNum}
                            </div>
                            <p className={styles.dataItemInfoText}>在线车辆</p>
                        </div>
                    </div>
                    <div className={`${styles.dataBgBox} ${styles.dataBox4}`}>
                        <img src={StaticFile.getImage('images/MCimg/data_bg.png')} alt="" />
                        <p className={styles.dataItemTitle}>华南地区</p>
                        <div className={styles.dataItemInfo}>
                            <div className={styles.dataItemInfoNum}>
                                {this.state.southNum}
                            </div>
                            <p className={styles.dataItemInfoText}>在线车辆</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount() {
        this.init();
        //     // this.timer = setInterval(this.init.bind(this), 30000);
        //     addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, this.initMap.bind(this))
    }

    // initMap() {
    //     this.gdmap.initMap('carMapContainer', {
    //         zoom: 5.8,
    //         // center: this.props.lonlat.split(',')
    //         center: [115.693942, 28.2882]
    //     });
    // }

    init() {

    }

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