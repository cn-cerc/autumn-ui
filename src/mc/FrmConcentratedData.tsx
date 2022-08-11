import { WebControl } from "autumn-ui";
import React from "react";
import StaticFile from "../static/StaticFile";
import styles from "./FrmConcentratedData.css";

type FrmConcentratedDataTypeProps = {
    lonlat: string
}

type FrmConcentratedDataTypeState = {
    toggle: number
}

export default class FrmConcentratedData extends WebControl<FrmConcentratedDataTypeProps, FrmConcentratedDataTypeState>{
    constructor(props: FrmConcentratedDataTypeProps) {
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
                    <span>集运数据</span>
                    <img src={StaticFile.getImage('images/MCimg/title_line.png')} alt="" />
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </p>

            </div>
            <div className={`${styles.mcMain} ${this.state.toggle == 1 ? '' : styles.mcMainNoPB}`}>
                <div className={styles.contentEcharts}>
                    
                </div>
            </div>
        </div>
    }

    componentWillUnmount() {

    }

    componentDidMount() {

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