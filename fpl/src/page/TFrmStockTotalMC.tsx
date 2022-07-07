import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TFrmStockTotalMC.css";
import UImoduleMenu from "./UIModuleMenu";

type TFrmStockTotalMCTypeProps = {
    dataJson: string,
    introduction: string
}

type TFrmStockTotalMCTypeState = {
    introduction: string,
    data: DataSet,
    title: string
}

export default class TFrmStockTotalMC extends WebControl<TFrmStockTotalMCTypeProps, TFrmStockTotalMCTypeState> {
    constructor(props: TFrmStockTotalMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let data = new DataSet();
        data.setJson(this.props.dataJson);
        this.state = {
            title: '常用功能',
            data: data,
            introduction: this.props.introduction
        }

    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <div className={styles.mcIntroduction}>
                <div className={styles.mcTitle}>简介</div>
                <p>{this.state.introduction}</p>
            </div>
            <div className={styles.mcMain}>
                <div className={styles.bgColor}>
                    <UImoduleMenu dataSet={this.state.data}></UImoduleMenu>
                </div>
                <div className={styles.mcCharts}>

                </div>
            </div>
        </div>
    }

    componentDidMount(): void {

    }
}