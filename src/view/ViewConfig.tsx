import * as echarts from "echarts";
import React from "react";
import DataSet from "../db/DataSet";
import styles from "./ViewConfig.css";

export type ViewTypeProps = {
    address?: string,
    echartData?: DataSet,
    id?: string,
    title?: string,
    width?: string,
    height?: string
}

export const xPointName = 'xPointName_';
export const xColumns = 'xColumns_';
export const seriesName = 'seriesName_'

export type ViewTypeState = {
    myEchart: echarts.EChartsType 
}

export default abstract class ViewConfig<T extends ViewTypeProps = ViewTypeProps, S extends ViewTypeState = ViewTypeState> extends React.Component<T, S> {
    state = {
        myEchart: null
    } as S

    componentDidMount() {
        let view = document.getElementById("auiHistogram") as HTMLDivElement;
        this.setState({
            myEchart: echarts.init(view)
        }, () => {
            this.initEchart();
        })
    }

    abstract initEchart(): void;

    render(): React.ReactNode {
        return <div className={styles.main}>
            <div id='auiHistogram' style={this.getStyle()}></div>
        </div>
    }

    getStyle() {
        let style: any = {
            width: this.props.width,
            height: this.props.height
        }
        return style
    }
}