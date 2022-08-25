import { DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import UIModuleMenu from "../module/UIModuleMenu";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./It.css";

type ItTypeProps = {
};

type ItTypeState = {
    data: DataSet;
    title: string;
    lineData: DataSet;
    pieData1: DataSet;
    pieData2: DataSet;
    introduction: string;
};

export default class It extends WebControl<ItTypeProps, ItTypeState> {
    constructor(props: ItTypeProps) {
        super(props);
        let data = new DataSet();
        data
            .append()
            .setValue("Name_", "系统参数")
            .setValue("Image_", "images/MCimg/itManagement/xtcs.png")
            .setValue("系统参数_URL", "TFrmVineOptions")
            .setValue("系统参数_Dis", false)
            .append()
            .setValue("Name_", "账号权限")
            .setValue("Image_", "images/MCimg/itManagement/zhqx.png")
            .setValue("账号权限_URL", "TFrmSCMAccount")
            .setValue("账号权限_Dis", false)
            .append()
            .setValue("Name_", "单据参数")
            .setValue("Image_", "images/MCimg/itManagement/djcs.png")
            .setValue("单据参数_URL", "TFrmTBOptions")
            .setValue("单据参数_Dis", false)
            .append()
            .setValue("Name_", "用户参数")
            .setValue("Image_", "images/MCimg/itManagement/yhcs.png")
            .setValue("用户参数_URL", "TFrmAccountSet2")
            .setValue("用户参数_Dis", false)
            .append()
            .setValue("Name_", "部门资料")
            .setValue("Image_", "images/MCimg/itManagement/bmzl.png")
            .setValue("部门资料_URL", "TFrmDeptInfo")
            .setValue("部门资料_Dis", false)
            .append()
            .setValue("Name_", "公告管理")
            .setValue("Image_", "menu/FrmAdvert.png")
            .setValue("公告管理_URL", "FrmAdvert")
            .setValue("公告管理_Dis", false)
            .append()
            .setValue("Name_", "客服人员维护")
            .setValue("Image_", "images/MCimg/itManagement/kfrywh.png")
            .setValue("客服人员维护_URL", "FrmFplCustomerService")
            .setValue("客服人员维护_Dis", false);
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
        let introduction =
            "本模组主要由管理员所操作，针对自身企业的管理需要与规模，设置相应的系统参数、单别参数等，以及管理系统数据的导入与导出。针对其它用户建立帐号，并设置用户权限，若有用户忘记密码，亦可协助进行重置。基于安全，管理员无法查看或恢复其它用户的密码！";
        this.state = {
            title: '常用功能',
            data: data,
            lineData,
            pieData1,
            pieData2,
            introduction,
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
                            <div className={styles.mcTitle}>用户角色统计（对接中）</div>
                            <div className={styles.FrmTaurusMCPie1}></div>
                        </div>
                        <div className={styles.mcPieBox2}>
                            <div className={styles.mcTitle}>日志(每日警告)（对接中）</div>
                            <div className={styles.FrmTaurusMCPie2}></div>
                        </div>
                    </div>
                    <div className={styles.mcTrendChart}>
                        <div className={styles.mcTitle}>部门人数统计（对接中）</div>
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