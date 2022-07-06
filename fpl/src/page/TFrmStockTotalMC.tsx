import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./TFrmStockTotalMC.css";
import * as echarts from "echarts";
import moduleMenu from "./UIModuleMenu";

type TFrmStockTotalMCTypeProps = {
    dataJson: string,
    introduction: string
}

type TFrmStockTotalMCTypeState = {
    dataJson: DataRow,
    introduction: string,
    data: DataSet,
    title:string
}

export const MCChartColors = ['#ee6666', '#fac858', '#91cc75', '#73c0de', '#fc8452', '#9a60b4', '#5470c6']

export default class TFrmStockTotalMC extends WebControl<TFrmStockTotalMCTypeProps, TFrmStockTotalMCTypeState> {
    constructor(props: TFrmStockTotalMCTypeProps) {
        super(props);
        let lineRow = new DataRow();
        let dataJson: DataRow = lineRow.setJson(this.props.dataJson);
        let data = new DataSet();
        data.append().setValue('img_', 'images/MCimg/financialManagement/yfgl.png').setValue('name_', '应付管理')
            .append().setValue('img_', 'images/MCimg/financialManagement/ysgl.png').setValue('name_', '应收管理')
            .append().setValue('img_', 'images/MCimg/financialManagement/zcgl.png').setValue('name_', '资产管理')
            .append().setValue('img_', 'images/MCimg/financialManagement/fygl.png').setValue('name_', '费用管理')
            .append().setValue('img_', 'images/MCimg/financialManagement/cbhs.png').setValue('name_', '成本核算')
            .append().setValue('img_', 'images/MCimg/financialManagement/pjzj.png').setValue('name_', '票据资金')
            .append().setValue('img_', 'images/MCimg/financialManagement/kjzz.png').setValue('name_', '会计总账');
        this.state = {
            title:'常用功能',
            data: data,
            dataJson: dataJson,
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
                <div className={styles.mcFlowChartBox}>
                    <div className={styles.mcFlowChartMain}>
                        {
                            React.createElement(moduleMenu, {
                                title:this.state.title,
                                data: this.state.data,
                                dataJson:this.state.dataJson
                            })
                        }
                    </div>
                </div>
                <div className={styles.mcCharts}>

                </div>
            </div>
        </div>
    }

    componentDidMount(): void {

    }
}