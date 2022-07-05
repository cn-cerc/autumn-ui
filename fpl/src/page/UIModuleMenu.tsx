import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./UIModuleMenu.css";
import * as echarts from "echarts";

type UIModuleMenuTypeProps = {
    data:DataSet
}

type UIModuleMenuTypeState = {

}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class UIModuleMenu extends WebControl<UIModuleMenuTypeProps, UIModuleMenuTypeState> {
    constructor(props: UIModuleMenuTypeProps) {
        super(props);
        this.state = {

        }
        console.log(this.props.data);
    }

    render(): React.ReactNode {
        return <div className={styles.stockContent}>
            <ul>
                {this.getLi()}
            </ul>
        </div>
       
    }

    getLi() {
        let ds = new DataSet();
        let list = [];
        ds = this.props.data;
        if(ds.size >= 1 && ds.getString('title_')){
            ds.first();
            let index = 1;
            while (ds.fetch()) {
                list.push(<li className={`${styles.stockBox}`} onClick={this.linkTo.bind(this, ds.getString('title_'))} key={ds.getString('title_')}>
                    <div>
                        <img src={ds.getString('img_')} alt="" />
                    </div>
                    <span>{ds.getString('title_')}</span>
                </li>);
                index++;
            }
        }
        return list;
    }

    linkTo(name: string) {
        // if (!this.state.dataJson.getBoolean(`${name}_Dis`)) {
        //     location.href = this.state.dataJson.getString(`${name}_URL`);
        // }
    }
}