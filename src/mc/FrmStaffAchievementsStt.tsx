import { Column, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import styles from "./FrmStaffAchievementsStt.css";

type FrmStaffAchievementsSttTypeProps = {

}

type FrmStaffAchievementsSttTypeState = {
    tableData: DataSet
}

export default class FrmStaffAchievementsStt extends React.Component<FrmStaffAchievementsSttTypeProps, FrmStaffAchievementsSttTypeState> {
    constructor(props: FrmStaffAchievementsSttTypeProps) {
        super(props);
        this.state = {
            tableData: new DataSet()
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <ul className={styles.top}>
                <li>
                    <span>员工人数</span>
                    <span>{60}</span>
                </li>
                <li>
                    <span>本周任务</span>
                    <span>{56}</span>
                </li>
                <li>
                    <span>完成数量</span>
                    <span>{42}</span>
                </li>
                <li>
                    <span>未完成数量</span>
                    <span>{14}</span>
                </li>
            </ul>
            <div className={styles.bottom}>
                <div className={styles.table}>
                    <h4>员工绩效数据统计（按周）</h4>
                    <div className={styles.tableTH}>
                        <span>姓名</span>
                        <span>部门</span>
                        <span>PR数量</span>
                        <span>完成任务</span>
                        <span>提交数量</span>
                        <span>修复bug</span>
                        <span>引发bug</span>
                    </div>
                    <ul className={styles.tableContent}>
                        {this.getTableContent()}
                    </ul>
                </div>
                <div className={styles.echarts}>
                    <div className={styles.echart1}></div>
                    <div className={styles.echart2}></div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.init();
    }

    init() {
        // 初始化员工绩总数
        DitengApi.getStaffAcmtsPanel().then((dataOut) => {
            console.log(dataOut);
        });

        // 初始化本周员工绩效数
        DitengApi.getStaffWeekAch().then((dataOut) => {
            console.log(dataOut);
        })

        // 初始化本周员工完成最多前五
        let headIn1 = new DataRow();
        headIn1.setValue('type', 'before');
        DitengApi.getStaffAchRanking(headIn1).then((dataOut) => {
            console.log(dataOut);
        })

        // 初始化本周员工修复bug最多前五
        let headIn2 = new DataRow();
        DitengApi.getStaffAchRanking(headIn2).then((dataOut) => {
            console.log(dataOut);
        })

        this.initChart1();

        this.initChart2();
    }

    getTableContent() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.tableData);
        ds.first();
        while (ds.fetch()) {
            list.push(<li key={ds.recNo}>
                <span>姓名</span>
                <span>部门</span>
                <span>PR数量</span>
                <span>完成任务</span>
                <span>提交数量</span>
                <span>修复bug</span>
                <span>引发bug</span>
            </li>)
        }
        if (!list.length)
            list.push(<li key='noData' className={styles.noData}>
                <span>暂无数据</span>
            </li>)
        return list;
    }

    initChart1() {

    }

    initChart2() {
        
    }
} 