import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import UIModuleMenu from "../module/UIModuleMenu";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./FrmWagonAccountBook.css";

type FrmWagonAccountBookTypeProps = {
    record: any
}

type FrmWagonAccountBookTypeState = {
    data: DataSet,
    moduleData: DataSet,
    btnUrl: DataRow,
    record: DataRow,
    introduction: string,
}

export default class FrmWagonAccountBook extends WebControl<FrmWagonAccountBookTypeProps, FrmWagonAccountBookTypeState> {
    constructor(props: FrmWagonAccountBookTypeProps) {
        super(props);
        let moduleData = new DataSet();
        moduleData.append()
        .setValue("Name_", "账本记录")
        .setValue("Image_", "images/MCimg/wagonAccountBook/zbjl.png")
        .setValue("账本记录_URL", "FrmPUserBookkeeping")
        .setValue("账本记录_Dis", false)
        .append()
        .setValue("Name_", "支出登记")
        .setValue("Image_", "images/MCimg/wagonAccountBook/zcdj.png")
        .setValue("支出登记_URL", "FrmPUserBookkeeping.append?billType=1")
        .setValue("支出登记_Dis", false)
        .append()
        .setValue("Name_", "收入登记")
        .setValue("Image_", "images/MCimg/wagonAccountBook/srdj.png")
        .setValue("收入登记_URL", "FrmPUserBookkeeping.append?billType=0")
        .setValue("收入登记_Dis", false)
        .append()
        .setValue("Name_", "公司报销")
        .setValue("Image_", "images/MCimg/wagonAccountBook/gsbx.png")
        .setValue("公司报销_URL", "FrmPReimburse")
        .setValue("公司报销_Dis", false)
        .append()
        .setValue("Name_", "申请报销")
        .setValue("Image_", "images/MCimg/wagonAccountBook/sqbx.png")
        .setValue("申请报销_URL", "FrmPReimburse.selectBookkeeping")
        .setValue("申请报销_Dis", false);
        let btnUrl = new DataRow();
        btnUrl.setValue("Name_", "钱包余额")
        .setValue("钱包余额_URL", "FrmDriverWallet")
        .setValue("Name_", "支出")
        .setValue("支出_URL", "FrmDriverWallet.expeDetails")
        .setValue("Name_", "收入")
        .setValue("收入_URL", "FrmDriverWallet.incomeDetails")
        .setValue("Name_", "提现")
        .setValue("提现_URL", "FrmDriverWallet.selectSubWallet");
        let record = new DataRow();
        if (this.props.record != '') {
            record.setJson(this.props.record);
        }
        let introduction = "主要用于管理钱包余额、账本记录、费用报销的费用登记。拥有相关的支出登记，收入登记、报销申请，以及相关的数据统计以及分析等功能。";

        this.state = {
            data: new DataSet(),
            moduleData,
            btnUrl,
            record,
            introduction
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
            <div className={styles.main}>
                {this.isPhone ? '' : this.getModule()}
                <div className={styles.content}>
                    <ul>
                        <li>
                            <p>钱包余额</p>
                            <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '钱包余额')}>
                                <span>{this.state.record.getDouble('total')}</span>
                                <span>元</span>
                            </div>
                            <button className={styles.btn_tixian} onClick={this.gotoFun.bind(this, '提现')}>提现</button>
                        </li>
                        <li>
                            <p>支出</p>
                            <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '支出')}>
                                <span>{this.state.record.getDouble('expenditure')}</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>收入</p>
                            <div className={styles.links_skin} onClick={this.gotoFun.bind(this, '收入')}>
                                <span>{this.state.record.getDouble('income')}</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>未报销</p>
                            <div>
                                <span>0</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销进程</p>
                            <div>
                                <span>0</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销驳回</p>
                            <div>
                                <span>0</span>
                                <span>笔</span>
                            </div>
                        </li>
                    </ul>
                    {this.isPhone ? this.getModule() : ''}
                    <div className={styles.charts}>
                        <div className={styles.chartsTitle}>
                            <p>物流运单支出情况（对接中）</p>
                        </div>
                        <div className={styles.chart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let data = new DataSet();
        data.append().setValue('own', 25).setValue('reimburse', 200);
        data.append().setValue('own', 18).setValue('reimburse', 160);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 20).setValue('reimburse', 168);
        data.append().setValue('own', 25).setValue('reimburse', 178);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        data.append().setValue('own', 0).setValue('reimburse', 0);
        this.setState({
            data
        }, () => {
            this.initChart();
        })
    }

    getModule() {
        return <div className={styles.menuModule}>
            <UIModuleMenu dataSet={this.state.moduleData} title='常用功能'></UIModuleMenu>
        </div>
    }

    initChart() {
        let peiChart = document.querySelector(`.${styles.chart}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let date = new Date();
        let xArr: string[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        let allData = [];
        let ownData = [];
        let reimburseData = [];
        this.state.data.first();
        while (this.state.data.fetch()) {
            let ownNum = this.state.data.getDouble('own');
            let reimburseNum = this.state.data.getDouble('reimburse');
            ownData.push(String(ownNum));
            reimburseData.push(String(reimburseNum));
            allData.push(String(ownNum + reimburseNum));
        }
        let option = {
            xAxis: {
                type: 'category',
                data: xArr,
                axisLabel: {
                    color: '#333333'
                },
                axisLine: {
                    lineStyle: {
                        color: '#333333'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: '#333333'
                }
            },
            lengend: {},
            tooltip: {},
            grid: {
                top: 10,
                left: 0,
                bottom: 0,
                right: 0,
                containLabel: true,
            },
            series: [
                {
                    data: ownData,
                    type: 'bar',
                    stack: 'Ad',
                    barWidth: 40,
                    itemStyle: {
                        color: MCChartColors[1]
                    },
                    lineStyle: {
                        color: MCChartColors[1]
                    },
                },
                {
                    data: reimburseData,
                    type: 'bar',
                    stack: 'Ad',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0]
                    },
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    gotoFun(name: string) {
        location.href = this.state.btnUrl.getString(`${name}_URL`);
    }
}