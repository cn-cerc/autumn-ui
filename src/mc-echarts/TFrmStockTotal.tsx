import { DataRow, DataSet, WebControl } from "autumn-ui";
import * as echarts from "echarts";
import React from "react";
import UIIntroduction from "../module/UIIntroduction";
import UIModuleMenu from "../module/UIModuleMenu";
import { MCChartColors } from "./FrmTaurusMC";
import styles from "./TFrmStockTotal.css";

type TFrmStockTotalTypeProps = {};

type TFrmStockTotalTypeState = {
  data: DataSet;
  title: string;
  lineData: DataSet;
  pieData1: DataSet;
  pieData2: DataSet;
  introduction: string;
};

export default class TFrmStockTotal extends WebControl<
  TFrmStockTotalTypeProps,
  TFrmStockTotalTypeState
> {
  constructor(props: TFrmStockTotalTypeProps) {
    super(props);
    let lineRow = new DataRow();
    let data = new DataSet();
    data
      .append()
      .setValue("Name_", "应付管理")
      .setValue("Image_", "images/MCimg/financialManagement/yfgl.png")
      .setValue("应付管理_URL", "FrmAPManage")
      .setValue("应付管理_Dis", false)
      .append()
      .setValue("Name_", "应收管理")
      .setValue("Image_", "images/MCimg/financialManagement/ysgl.png")
      .setValue("应收管理_URL", "FrmARManage")
      .setValue("应收管理_Dis", false)
      .append()
      .setValue("Name_", "资产管理")
      .setValue("Image_", "images/MCimg/financialManagement/zcgl.png")
      .setValue("资产管理_URL", "pa")
      .setValue("资产管理_Dis", false)
      .append()
      .setValue("Name_", "费用管理")
      .setValue("Image_", "images/MCimg/financialManagement/fygl.png")
      .setValue("费用管理_URL", "TFrmPaidFY")
      .setValue("费用管理_Dis", false)
      // 暂无界面 先隐藏
      //                .append()
      //                .setValue("Name_", "成本核算")
      //                .setValue("Image_", "images/MCimg/financialManagement/cbhs.png")
      //                .setValue("成本核算_URL", "")
      //                .setValue("成本核算_Dis", false)
      //                .append()
      //                .setValue("Name_", "票据资金")
      //                .setValue("Image_", "images/MCimg/financialManagement/pjzj.png")
      //                .setValue("票据资金_URL", "")
      //                .setValue("票据资金_Dis", false)
      .append()
      .setValue("Name_", "企业总账")
      .setValue("Image_", "images/MCimg/financialManagement/kjzz.png")
      .setValue("企业总账_URL", "TAcc")
      .setValue("企业总账_Dis", false);
    let lineData = new DataSet();
    lineData.append().setValue("Value_", 258).setValue("XName_", "周一");
    lineData.append().setValue("Value_", 225).setValue("XName_", "周二");
    lineData.append().setValue("Value_", 240).setValue("XName_", "周三");
    lineData.append().setValue("Value_", 210).setValue("XName_", "周四");
    lineData.append().setValue("Value_", 320).setValue("XName_", "周五");
    lineData.append().setValue("Value_", 350).setValue("XName_", "周六");
    lineData.append().setValue("Value_", 260).setValue("XName_", "周日");
    let pieData1 = new DataSet();
    pieData1.append().setValue("Value_", 10).setValue("Name_", "湖北省");
    pieData1.append().setValue("Value_", 20).setValue("Name_", "广西省");
    pieData1.append().setValue("Value_", 30).setValue("Name_", "湖南省");
    pieData1.append().setValue("Value_", 15).setValue("Name_", "广东省");
    let pieData2 = new DataSet();
    pieData2.append().setValue("Value_", 11).setValue("Name_", "女生");
    pieData2.append().setValue("Value_", 13).setValue("Name_", "男生");
    let introduction =
      "主要用于管理应收帐款、应付帐款以及企业内部的费用登记 。从相应的应收、应付对帐单，到相应的收款单、对帐单，还有应收、应付调整，结合起来即形成了完成应收应付管理，此模组的数据，可以依据事先设置好的会计科目，自动生成相应的会计凭证，以生成相应的会计总帐与财务报表。";
    this.state = {
      title: "常用功能",
      data,
      lineData,
      pieData1,
      pieData2,
      introduction,
    };
  }

  render(): React.ReactNode {
    return (
      <div className={styles.mc}>
        <UIIntroduction introduction={this.state.introduction}></UIIntroduction>
        <div className={styles.mcMain}>
          <div className={styles.bgColor}>
            <UIModuleMenu
              dataSet={this.state.data}
              title={this.state.title}
            ></UIModuleMenu>
          </div>
          <div className={styles.mcCharts}>
            <div className={styles.mcPieChart}>
              <div className={styles.mcPieBox1}>
                <div className={styles.mcTitle}>比例图（对接中）</div>
                <div className={styles.FrmTaurusMCPie1}></div>
              </div>
              <div className={styles.mcPieBox2}>
                <div className={styles.mcTitle}>比例图（对接中）</div>
                <div className={styles.FrmTaurusMCPie2}></div>
              </div>
            </div>
            <div className={styles.mcTrendChart}>
              <div className={styles.mcTitle}>比例图（对接中）</div>
              <div className={styles.FrmTaurusMCLine}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.initLineChart();
    this.initPieChart1();
    this.initPieChart2();
  }

  initLineChart() {
    let lineChart = document.querySelector(
      `.${styles.FrmTaurusMCLine}`
    ) as HTMLDivElement;
    let myChart = echarts.init(lineChart);
    let ds = new DataSet();
    ds.appendDataSet(this.state.lineData);
    ds.first();
    let xArr = [];
    let sData = [];
    while (ds.fetch()) {
      xArr.push(ds.getString("XName_"));
      sData.push(ds.getDouble("Value_"));
    }
    let option = {
      xAxis: {
        type: "category",
        data: xArr,
        axisLabel: {
          color: "#333333",
        },
        axisLine: {
          lineStyle: {
            color: "#333333",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLabel: {
          color: "#333333",
        },
      },
      lengend: {},
      tooltip: {},
      grid: {
        top: 10,
        left: 0,
        bottom: 0,
        right: 10,
        containLabel: true,
      },
      series: [
        {
          data: sData,
          type: "bar",
          itemStyle: {
            color: MCChartColors[0],
          },
          lineStyle: {
            color: MCChartColors[0],
          },
          label: {
            show: true,
            position: "top",
          },
        },
      ],
    };
    //@ts-ignore
    myChart.setOption(option);
  }

  initPieChart1() {
    let peiChart = document.querySelector(
      `.${styles.FrmTaurusMCPie1}`
    ) as HTMLDivElement;
    let myChart = echarts.init(peiChart);
    let ds = new DataSet();
    ds.appendDataSet(this.state.pieData1);
    ds.first();
    let dataArr = [];
    while (ds.fetch()) {
      dataArr.push({
        name: ds.getString("Name_"),
        value: ds.getDouble("Value_"),
      });
    }
    let option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "25%",
        left: "65%",
        orient: "vertical",
        itemWidth: 8,
        itemHeight: 8,
        icon: "circle",
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
          type: "pie",
          center: ["30%", "50%"],
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: dataArr,
        },
      ],
    };
    //@ts-ignore
    myChart.setOption(option);
  }

  initPieChart2() {
    let peiChart = document.querySelector(
      `.${styles.FrmTaurusMCPie2}`
    ) as HTMLDivElement;
    let myChart = echarts.init(peiChart);
    let ds = new DataSet();
    ds.appendDataSet(this.state.pieData2);
    ds.first();
    let dataArr = [];
    while (ds.fetch()) {
      dataArr.push({
        name: ds.getString("Name_"),
        value: ds.getDouble("Value_"),
      });
    }
    let option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "25%",
        left: "65%",
        orient: "vertical",
        itemWidth: 8,
        itemHeight: 8,
        icon: "circle",
      },
      series: [
        {
          // name: '本周货运车辆占比',
          type: "pie",
          center: ["30%", "50%"],
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: dataArr,
        },
      ],
    };
    //@ts-ignore
    myChart.setOption(option);
  }
}