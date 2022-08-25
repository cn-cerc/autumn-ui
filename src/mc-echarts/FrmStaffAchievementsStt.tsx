import { Column, DataRow, DataSet, DBGrid } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import styles from "./FrmStaffAchievementsStt.css";
import * as echarts from "echarts"
import { MCChartColors } from "./FrmTaurusMC";
import StaticFile from "../static/StaticFile";

type FrmStaffAchievementsSttTypeProps = {

}

type FrmStaffAchievementsSttTypeState = {
    acmtsPanelData: DataSet,
    tableData: DataSet,
    issueData: DataSet,
    prData: DataSet,
}

export default class FrmStaffAchievementsStt extends React.Component<FrmStaffAchievementsSttTypeProps, FrmStaffAchievementsSttTypeState> {
    private listHeight: number;
    private lineHieght: number;
    private initHieght: number;
    private timer: any;
    constructor(props: FrmStaffAchievementsSttTypeProps) {
        super(props);
        this.state = {
            tableData: new DataSet(),
            acmtsPanelData: new DataSet(),
            issueData: new DataSet(),
            prData: new DataSet(),
        }
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            <div className={styles.mcIntroduction}>
                <div className={styles.corpName}>
                    <img src={StaticFile.getImage('images/MCimg/corpName.png')} />
                    <span>{this.props.corpName}</span>
                </div>
                <span>车辆网看板</span>
                <div className={styles.toggleIcons}>
                    <a className={`${this.state.toggle == 1 ? styles.btn_toggle_kanban : styles.btn_toggle_pc}`} onClick={this.toggleFun.bind(this)}></a>
                </div>
            </div>
            <ul className={styles.top}>
                <li>
                    <span>员工人数</span>
                    <span>{this.state.acmtsPanelData.size ? this.state.acmtsPanelData.getDouble('user_num') : ''}</span>
                </li>
                <li>
                    <span>本周任务</span>
                    <span>{this.state.acmtsPanelData.size ? this.state.acmtsPanelData.getDouble('pr') : ''}</span>
                </li>
                <li>
                    <span>完成数量</span>
                    <span>{this.state.acmtsPanelData.size ? this.state.acmtsPanelData.getDouble('issue') : ''}</span>
                </li>
                <li>
                    <span>未完成数量</span>
                    <span>{this.state.acmtsPanelData.size ? this.state.acmtsPanelData.getDouble('no_issue') : ''}</span>
                </li>
            </ul>
            <div className={styles.bottom}>
                <div className={styles.table}>
                    <h4>员工绩效数据统计（按周）</h4>
                    <div className={`${styles.tableTH} ${styles.tableLine}`}>
                        <span>姓名</span>
                        <span>部门</span>
                        <span>PR数量</span>
                        <span>完成任务</span>
                        <span>提交数量</span>
                        <span>修复bug</span>
                        <span>引发bug</span>
                    </div>
                    <div className={styles.tableContent}>
                        <ul>
                            {this.getTableContent()}
                        </ul>
                    </div>

                </div>
                <div className={styles.echarts}>
                    <div className={styles.echart1}>
                        <h4>任务完成最多（前五）（按周）</h4>
                        <div></div>
                    </div>
                    <div className={styles.echart2}>
                        <h4>修复bug最多（前五）（按周）</h4>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.init();
    }

    componentWillUnmount(): void {
        if (this.timer)
            clearInterval(this.timer);
    }

    init() {
        // 初始化员工绩总数
        DitengApi.getStaffAcmtsPanel().then((acmtsPanelData) => {
            this.setState({
                acmtsPanelData
            })
        });

        // 初始化本周员工绩效数
        DitengApi.getStaffWeekAch().then((tableData) => {
            tableData = new DataSet();
            tableData.append().setValue('name_', '张三').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '李四').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '王五').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '赵六').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '钱多多').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '金盛达').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '赵雷').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '孙红').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '李党贵').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '邓不列多').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '达芬奇').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '牛顿').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '赵云').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '刘备').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '张飞').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '孙膑').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '张三丰').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '李世民').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '刘邦').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '成吉思汗').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '朱棣').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            tableData.append().setValue('name_', '马尔哈赤').setValue('deptName_', '1部').setValue('pr_', '5').setValue('issue_', '3').setValue('commit_', '8').setValue('fix_bug_', 5).setValue('add_bug_', 2);
            this.setState({
                tableData
            }, () => {
                let tableContent = document.querySelector(`.${styles.tableContent}`) as HTMLDivElement;
                this.listHeight = tableContent.offsetHeight;
                let tableLine = document.querySelector(`.${styles.tableContent}>ul>li`) as HTMLLIElement;
                this.lineHieght = tableLine.offsetHeight;
                if (tableData.size * this.lineHieght > this.listHeight) {
                    this.initHieght = 0 - (tableData.size * this.lineHieght);
                    let num = Math.ceil(this.listHeight / this.lineHieght);
                    this.state.tableData.records.forEach((data: DataRow, index: number) => {
                        if (index < num) {
                            tableData.append().copyRecord(data);
                        }
                    })
                    this.setState({
                        tableData
                    }, () => {
                        this.initScorll();
                    })
                }
            })
        })

        // 初始化本周员工完成最多前五
        let headIn1 = new DataRow();
        headIn1.setValue('type', 'before');
        DitengApi.getStaffAchRanking(headIn1).then((issueData) => {
            issueData.setSort('total_ DESC');
            this.setState({
                issueData
            }, () => {
                this.initChart1();
            })
        })

        // 初始化本周员工修复bug最多前五
        let headIn2 = new DataRow();
        headIn2.setValue('type', '');
        DitengApi.getStaffAchRanking(headIn2).then((prData) => {
            prData.setSort('total_ DESC');
            this.setState({
                prData
            }, () => {
                this.initChart2();
            })
        })
    }

    getTableContent() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.tableData);
        ds.first();
        while (ds.fetch()) {
            list.push(<li key={ds.recNo} className={styles.tableLine}>
                <span>{ds.getString('name_')}</span>
                <span>{ds.getString('deptName_')}</span>
                <span>{ds.getDouble('pr_')}</span>
                <span>{ds.getDouble('issue_')}</span>
                <span>{ds.getDouble('commit_')}</span>
                <span>{ds.getDouble('fix_bug_')}</span>
                <span>{ds.getDouble('add_bug_')}</span>
            </li>)
        }
        if (!list.length)
            list.push(<li key='noData' className={styles.noData}>
                <span>暂无数据</span>
            </li>)
        return list;
    }

    initChart1() {
        let dom = document.querySelector(`.${styles.echart1}>div`) as HTMLDivElement;
        let myecharts = echarts.getInstanceByDom(dom);
        if (!myecharts)
            myecharts = echarts.init(dom);
        let ds = new DataSet();
        ds.appendDataSet(this.state.issueData);
        ds.first();
        let dataArr: any[] = [];
        while (ds.fetch()) {
            dataArr.push({
                name: ds.getString('name_'),
                value: ds.getString('total_')
            })
        }
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '25%',
                left: '60%',
                orient: 'vertical',
                itemWidth: 12,
                itemHeight: 12,
                textStyle: {
                    fontSize: 14
                },
                icon: 'circle',
                formatter: (name: any) => {
                    let singleData = dataArr.filter(function (item: any) {
                        return item.name == name
                    })
                    return name + ' : ' + singleData[0].value + '个';
                },
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
                    type: 'pie',
                    center: ['30%', '45%'],
                    radius: ['50%', '80%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    color: MCChartColors,
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
        myecharts.setOption(option);

    }

    initChart2() {
        let dom = document.querySelector(`.${styles.echart2}>div`) as HTMLDivElement;
        let myecharts = echarts.getInstanceByDom(dom);
        if (!myecharts)
            myecharts = echarts.init(dom);
        let ds = new DataSet();
        ds.appendDataSet(this.state.prData);
        ds.first();
        let xArr: string[] = [];
        let sData: number[] = [];
        while (ds.fetch()) {
            xArr.push(ds.getString('name_'));
            sData.push(ds.getDouble('total_'));
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
            tooltip: {},
            grid: {
                top: 25,
                left: 16,
                bottom: 16,
                right: 10,
                containLabel: true,
            },
            series: [
                {
                    data: sData,
                    type: 'bar',
                    barWidth: '50%',
                    itemStyle: {
                        color: MCChartColors[0],
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
        myecharts.setOption(option);
    }

    // 滚动效果
    initScorll() {
        this.timer = setInterval(() => {
            let ul = document.querySelector(`.${styles.tableContent}>ul`) as HTMLUListElement;
            let top = ul.offsetTop;
            top--;
            if (top <= this.initHieght)
                top = 0;
            ul.style.top = `${top}px`;
        }, 30);
    }
} 