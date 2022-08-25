import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import UIModuleMenu from "../module/UIModuleMenu";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./My.css";

type MyTypeProps = {}

type MyTypeState = {
    data: DataSet,
    title: string,
    lineData: DataSet,
    pieData1: DataSet
    pieData2: DataSet,
    introduction: string
}

export default class My extends WebControl<MyTypeProps, MyTypeState> {
    constructor(props: MyTypeProps) {
        super(props);
        let data = new DataSet();
        data.append()
            .setValue("Name_", "更改密码")
            .setValue("Image_", "menu/FrmModifyPassword.png")
            .setValue("更改密码_URL", "FrmModifyPassword")
            .setValue("更改密码_Dis", false)
            .append()
            .setValue("Name_", "设置资料")
            .setValue("Image_", "menu/TFrmYGTMyAccount.png")
            .setValue("设置资料_URL", "TFrmYGTMyAccount")
            .setValue("设置资料_Dis", false)
            .append()
            .setValue("Name_", "设置喜好")
            .setValue("Image_", "menu/TFrmMyInputMode.png")
            .setValue("设置喜好_URL", "TFrmMyInputMode")
            .setValue("设置喜好_Dis", false)
            .append()
            .setValue("Name_", "待签单据")
            .setValue("Image_", "menu/FrmMyWorkFlow.png")
            .setValue("待签单据_URL", "FrmMyWorkFlow")
            .setValue("待签单据_Dis", false)
            .append()
            .setValue("Name_", "草稿单据")
            .setValue("Image_", "menu/FrmMyGraftTB.png")
            .setValue("草稿单据_URL", "FrmMyGraftTB")
            .setValue("草稿单据_Dis", false)
            .append()
            .setValue("Name_", "设置打印")
            .setValue("Image_", "menu/FrmMyPrinterInfo.png")
            .setValue("设置打印_URL", "FrmMyPrinterInfo")
            .setValue("设置打印_Dis", false)
            .append()
            .setValue("Name_", "预警设置")
            .setValue("Image_", "menu/TFrmAutoMail.png")
            .setValue("预警设置_URL", "TFrmAutoMail")
            .setValue("预警设置_Dis", false)
            .append()
            .setValue("Name_", "消息管理")
            .setValue("Image_", "menu/FrmMessages.png")
            .setValue("消息管理_URL", "FrmMessages")
            .setValue("消息管理_Dis", false)
            .append()
            .setValue("Name_", "我的收藏")
            .setValue("Image_", "menu/myCollect.png")
            .setValue("我的收藏_URL", "TFrmProSearch.myCollect")
            .setValue("我的收藏_Dis", false)
            .append()
            .setValue("Name_", "新闻列表")
            .setValue("Image_", "menu/FrmJournalism.png")
            .setValue("新闻列表_URL", "TFrmProSearch.newsMore")
            .setValue("新闻列表_Dis", false)
            .append()
            .setValue("Name_", "司机认证")
            .setValue("Image_", "menu/FrmAdminDriverAuth.png")
            .setValue("司机认证_URL", "FrmDriver.append")
            .setValue("司机认证_Dis", false)
            .append()
            .setValue("Name_", "收款人认证")
            .setValue("Image_", "menu/FrmPayeeCertification.png")
            .setValue("收款人认证_URL", "FrmPayeeCertification")
            .setValue("收款人认证_Dis", false)
            .append()
            .setValue("Name_", "车辆交接")
            .setValue("Image_", "menu/FrmPFollowHandoverRecord.png")
            .setValue("车辆交接_URL", "FrmPFollowHandoverRecord")
            .setValue("车辆交接_Dis", false)
            .append()
            .setValue("Name_", "车辆认证")
            .setValue("Image_", "menu/FrmDriverCarRegistration.png")
            .setValue("车辆认证_URL", "FrmDriverCarRegistration.append")
            .setValue("车辆认证_Dis", false)
            .append()
            .setValue("Name_", "货主关联")
            .setValue("Image_", "menu/FrmOwnerAssociation.png")
            .setValue("货主关联_URL", "FrmOwnerAssociation")
            .setValue("货主关联_Dis", false);
        let lineData = new DataSet();
        lineData.append().setValue('Value_', 258).setValue('XName_', '周一');
        lineData.append().setValue('Value_', 225).setValue('XName_', '周二');
        lineData.append().setValue('Value_', 240).setValue('XName_', '周三');
        lineData.append().setValue('Value_', 210).setValue('XName_', '周四');
        lineData.append().setValue('Value_', 320).setValue('XName_', '周五');
        lineData.append().setValue('Value_', 350).setValue('XName_', '周六');
        lineData.append().setValue('Value_', 260).setValue('XName_', '周日');
        let pieData1 = new DataSet();
        pieData1.append().setValue('Value_', 11).setValue('Name_', '品牌名1');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名2');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名3');
        pieData1.append().setValue('Value_', 13).setValue('Name_', '品牌名4');
        let pieData2 = new DataSet();
        pieData2.append().setValue('Value_', 10).setValue('Name_', '湖北省');
        pieData2.append().setValue('Value_', 20).setValue('Name_', '广西省');
        pieData2.append().setValue('Value_', 30).setValue('Name_', '湖南省');
        pieData2.append().setValue('Value_', 15).setValue('Name_', '广东省');
        let introduction = "主要用于设置自己的帐号资料，更改自己的登录密码，设置自己的喜好，设置自己常用的菜单项以便于操作等。日常作业中，可以在此处理属于自己的未读消息、待处理任务，以及待签核单据等。";
        this.state = {
            title: '常用功能',
            data: data,
            lineData,
            pieData1,
            pieData2,
            introduction
        }

    }

    render(): React.ReactNode {
        return <div className={styles.mc}>
            <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
            <div className={styles.mcMain}>
                <div className={styles.bgColor}>
                    <UIModuleMenu dataSet={this.state.data} title={this.state.title}></UIModuleMenu>
                </div>
                <div className={styles.mcCharts}>
                    <div className={styles.mcPieChart}>
                        <div className={styles.mcPieBox1}>
                            <div className={styles.mcTitle}>操作日志（对接中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>今日处理工作（对接中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>在线时间（对接中）</div>
                        <div className={styles.FrmTaurusMCLine}></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.initBarChart();
        this.initPieChart1();
        this.initPieChart2();
    }

    initBarChart() {
        let lineChart = document.querySelector(`.${styles.FrmTaurusMCLine}`) as HTMLDivElement;
        let myChart = echarts.init(lineChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.lineData);
        ds.first();
        let xArr = [];
        let sData = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('XName_'));
            sData.push(ds.getDouble('Value_'));
        }
        let option = {
            xAxis: {
                type: 'category',
                data: ['产品部', '人事部', '营销部', '设计部', '技术部'],
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
            tooltip: {},
            grid: {
                top: 15,
                left: 0,
                bottom: 0,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    name: '售出',
                    itemStyle: {
                        color: MCChartColors[0]
                    },
                    lineStyle: {
                        color: MCChartColors[0]
                    },
                    label: {
                        show: true,
                        position: 'top'
                    },
                }
            ]
        };
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart1() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie1}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.pieData1);
        ds.first();
        let dataArr = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
            },
            grid: {
                top: 40,
                left: 0,
                bottom: 0,
                right: 20,
                containLabel: false,
            },
            series: [
                {
                    // name: '本周货运吨数占比',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataArr
                }
            ]
        }
        //@ts-ignore
        myChart.setOption(option);
    }

    initPieChart2() {
        let peiChart = document.querySelector(`.${styles.FrmTaurusMCPie2}`) as HTMLDivElement;
        let myChart = echarts.init(peiChart);
        let ds = new DataSet();
        ds.appendDataSet(this.state.pieData2);
        ds.first();
        let dataArr = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('Name_'),
                value: ds.getDouble('Value_')
            })
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '65%',
                orient: 'vertical',
                itemWidth: 8,
                itemHeight: 8,
                icon: 'circle',
            },
            series: [
                {
                    // name: '本周货运车辆占比',
                    type: 'pie',
                    center: ['30%', '50%'],
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: dataArr
                }
            ]
        }
        //@ts-ignore
        myChart.setOption(option);
    }
}