import { Column, ColumnIt, DataRow, DataSet, DBGrid, Line, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmReception.css";

type PropsType = {
}

type stateType = {
    dataSetLeft: DataSet,
    dataSetLeftShow: DataSet,
    dataSetRight: DataSet,
    index: number,
    onSelectDiv: number,
    phone_onSelectDiv: number,
    pc_name: string,
    pc_car: string,
    pc_phone: string,
    phone_search: string,
}

export default class FrmReception extends WebControl<PropsType, stateType> {
    constructor(props: PropsType | Readonly<PropsType>) {
        super(props);
        this.state = {
            dataSetLeft: new DataSet(),
            dataSetLeftShow: new DataSet(),
            dataSetRight: new DataSet(),
            index: 0,
            onSelectDiv: 0,
            phone_onSelectDiv: 0,
            pc_name: '',
            pc_car: '',
            pc_phone: '',
            phone_search: ''
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let dataSetLeft = new DataSet();
        dataSetLeft.append().setValue('ding_', "BT3433588").setValue('ke_', '谢晓明').setValue('che_', '粤B53351').setValue('gong_', '一般维修');
        dataSetLeft.append().setValue('ding_', "BT33333338").setValue('ke_', '张三').setValue('che_', '粤B54451').setValue('gong_', '一般维修');
        dataSetLeft.append().setValue('ding_', "BT34444488").setValue('ke_', '小四').setValue('che_', '粤B56551').setValue('gong_', '一般维修');
        dataSetLeft.append().setValue('ding_', "BT3433778").setValue('ke_', '谢晓明').setValue('che_', '粤B56651').setValue('gong_', '一般维修');
        dataSetLeft.append().setValue('ding_', "BT34356588").setValue('ke_', '谢晓明').setValue('che_', '粤B58851').setValue('gong_', '一般维修');

        let dataSetRight = new DataSet();
        dataSetRight.append().setValue('date_', "2022-08-25 05:20").setValue('name_', '喷漆').setValue('hour_', '3.00').setValue('num_', '6').setValue('man_', '张三').setValue('remark_', '').setValue('schedule_', '维修中');
        dataSetRight.append().setValue('date_', "2022-08-25 05:20").setValue('name_', '喷漆').setValue('hour_', '3.00').setValue('num_', '6').setValue('man_', '张三').setValue('remark_', '').setValue('schedule_', '未派工');
        dataSetRight.append().setValue('date_', "2022-08-25 05:20").setValue('name_', '喷漆').setValue('hour_', '3.00').setValue('num_', '6').setValue('man_', '张三').setValue('remark_', '').setValue('schedule_', '维修中');
        dataSetRight.append().setValue('date_', "2022-08-25 05:20").setValue('name_', '喷漆').setValue('hour_', '3.00').setValue('num_', '6').setValue('man_', '张三').setValue('remark_', '').setValue('schedule_', '未派工');
        dataSetRight.append().setValue('date_', "2022-08-25 05:20").setValue('name_', '喷漆').setValue('hour_', '3.00').setValue('num_', '6').setValue('man_', '张三').setValue('remark_', '').setValue('schedule_', '已完成');
        this.setState({
            dataSetLeft,
            dataSetLeftShow: dataSetLeft,
            dataSetRight
        })
    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return <div className={styles.phone_main}>
                <div className={styles.phone_search}><input type="text" placeholder="请输入客户名称/电话/车牌" onChange={this.phone_change.bind(this)} /><button onClick={this.phone_search.bind(this)}>搜索</button></div>
                <div className={styles.phone_iconDiv}>
                    <div>
                        <div className={styles.phone_imgDiv}></div>
                        <span>订单管理</span>
                    </div>
                    <div>
                        <div className={styles.phone_imgDiv}></div>
                        <span>客户管理</span>
                    </div>
                    <div>
                        <div className={styles.phone_imgDiv}></div>
                        <span>车辆管理</span>
                    </div>
                </div>
                <div className={styles.phone_selectDiv}>
                    <span className={this.state.phone_onSelectDiv ? "" : styles.phone_onSelectDiv} onClick={this.onSelectDiv.bind(this, 0)}>维修中<span>(20)</span></span>
                    <span className={this.state.phone_onSelectDiv ? styles.phone_onSelectDiv : ""} onClick={this.onSelectDiv.bind(this, 1)}>待领车<span>(5)</span></span>
                </div>
                <div className={styles.phone_dataList}>
                    <li>
                        <li><span>订单号：BT56641232</span><span>08-25 08:30</span></li>
                        <li className={styles.phone_iconOne}><span>谢晓明</span><span>13266813655</span></li>
                        <li className={styles.phone_iconTwo}><span>粤B562356</span><span>一般维修</span></li>
                        <li><span>项目名称：</span><span>喷漆</span><span>二轮保养</span><span>轮胎更换</span></li>
                    </li>
                    <li>
                        <li><span>订单号：BT56641232</span><span>08-25 08:30</span></li>
                        <li className={styles.phone_iconOne}><span>谢晓明</span><span>13266813655</span></li>
                        <li className={styles.phone_iconTwo}><span>粤B562356</span><span>一般维修</span></li>
                        <li><span>项目名称：</span><span>喷漆</span><span>二轮保养</span><span>轮胎更换</span></li>
                    </li>
                </div>
            </div>
        } else {
            return <div className={styles.main}>
                <div className={styles.mainLeft}>
                    <div className={styles.selectDiv}>
                        <div className={this.state.onSelectDiv ? "" : styles.onSelectDiv} onClick={this.onSelectDiv.bind(this, 0)}><span>维修中(20)</span></div>
                        <div className={this.state.onSelectDiv ? styles.onSelectDiv : ""} onClick={this.onSelectDiv.bind(this, 1)}><span>待领车(30)</span></div>
                    </div>
                    <div className={styles.serachDiv}>
                        <li>
                            <label htmlFor="">客户名称</label>
                            <input type="text" placeholder="请输入客户名称" onChange={this.change.bind(this, 'name')} />
                        </li>
                        <li>
                            <label htmlFor="">车牌号</label>
                            <input type="text" placeholder="请输入车牌号" onChange={this.change.bind(this, 'car')} />
                        </li>
                        <li>
                            <label htmlFor="">联系电话</label>
                            <input type="text" placeholder="请输入联系电话" onChange={this.change.bind(this, 'phone')} />
                        </li>
                        <li><button onClick={this.pc_search.bind(this)}>查询</button></li>
                    </div>
                    <div className={styles.tabelLeft}>
                        <DBGrid dataSet={this.state.dataSetLeftShow} key={new Date().getTime()}>
                            <Column code="ding_" name="订单号" width="15" customText={(row: DataRow) => { return <span className={styles.spanColor}>{row.getString("ding_")}</span> }}></Column>
                            <Column code="ke_" name="客户名称" width="10"></Column>
                            <Column code="che_" name="车牌号" width="12"></Column>
                            <Column code="gong_" name="工单类型" width="10" textAlign='center'></Column>
                        </DBGrid>
                    </div>
                </div>
                <div className={styles.mainRight}>
                    <div className={styles.iconDiv}>
                        <div>
                            <div className={styles.imgDiv}></div>
                            <div className={styles.textDiv}>
                                <span>订单管理</span>
                                <span>订单维修登记</span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.imgDiv}></div>
                            <div className={styles.textDiv}>
                                <span>客户管理</span>
                                <span>客户资料登记</span>
                            </div>
                        </div>
                        <div>
                            <div className={styles.imgDiv}></div>
                            <div className={styles.textDiv}>
                                <span>车辆管理</span>
                                <span>车辆资料登记</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.textData}>
                        <div>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                        </div>
                        <div>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                        </div>
                        <div>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                            <li><span>客户名称：谢晓明</span></li>
                        </div>
                    </div>
                    <div className={styles.tabelRight}>
                        <DBGrid dataSet={this.state.dataSetRight} key={new Date().getTime()}>
                            <ColumnIt width='5'></ColumnIt>
                            <Column code="date_" name="派工日期" width="18"></Column>
                            <Column code="name_" name="项目名称" width="10"></Column>
                            <Column code="hour_" name="标准工时" width="10"></Column>
                            <Column code="num_" name="数量" width="7" textAlign='center'></Column>
                            <Column code="man_" name="维修人员" width="10" textAlign='center'></Column>
                            <Column code="remark_" name="备注" width="7" textAlign='center'></Column>
                            <Column code="schedule_" name="维修进度" width="10" textAlign='center' customText={(row: DataRow) => {
                                let str = styles.orange;
                                switch (row.getString("schedule_")) {
                                    case "维修中":
                                        str = styles.orange
                                        break;
                                    case "未派工":
                                        str = styles.red
                                        break;
                                    case "已完成":
                                        str = styles.black
                                        break;
                                }
                                return <span className={str}>{row.getString("schedule_")}</span>
                            }}></Column>
                        </DBGrid>
                    </div>
                </div>
            </div>
        }
    }

    onSelectDiv(index: number) {
        if (this.isPhone) {
            this.setState({
                phone_onSelectDiv: index
            })
        } else {
            this.setState({
                onSelectDiv: index
            })
        }
    }

    pc_search() {
        let dataSetLeftShow = new DataSet();
        let dataSetLeft = this.state.dataSetLeft;
        dataSetLeft.first();
        while (dataSetLeft.fetch()) {
            if (dataSetLeft.getString("ke_").indexOf(this.state.pc_name) > -1 &&
                dataSetLeft.getString("che_").indexOf(this.state.pc_car) > -1 &&
                dataSetLeft.getString("ding_").indexOf(this.state.pc_phone) > -1) {
                dataSetLeftShow.append().copyRecord(dataSetLeft.current);
            }
        }
        this.setState({
            dataSetLeftShow
        })
    }

    change(str: string, event: any) {
        switch (str) {
            case 'name':
                this.setState({
                    pc_name: event.target.value
                })
                break;
            case 'car':
                this.setState({
                    pc_car: event.target.value
                })
                break;
            case 'phone':
                this.setState({
                    pc_phone: event.target.value
                })
                break;

        }
    }

    phone_search() {
        
    }

    phone_change(event: any) {
        this.setState({
            phone_search: event.target.value
        })
    }
}

