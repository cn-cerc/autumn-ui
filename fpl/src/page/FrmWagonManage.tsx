import { Column, DataRow, DataSet, DBGrid, WebControl } from "autumn-ui";
import React from "react";
import Introduction from "./Introduction";
import styles from "./FrmWagonManage.css";
import FplPageApi from "./FplPageApi";

type FrmWagonManageTypeProps = {
    introduction: string,
}

type FrmWagonManageTypeState = {
    orderType: number,
    isInit: boolean,
    data: DataSet
}

export default class FrmWagonManage extends WebControl<FrmWagonManageTypeProps, FrmWagonManageTypeState> {
    constructor(props: FrmWagonManageTypeProps) {
        super(props);
        let data = new DataSet();
        data.append().setValue('send_date_time_', '2022-07-07')
            .setValue('arrive_date_time_', '2022-07-07')
            .setValue('depart_', '广州市')
            .setValue('destination_', '深圳市')
            .setValue('code_', '原木')
            .setValue('amount_', '2202.00');
        this.state = {
            orderType: 0,       //接单状态，0为全部订单，1为限价订单，2为竞价订单 3为报价订单
            isInit: false,
            data: data
        }
    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return <React.Fragment>
                <div className={styles.qdmsBox}>
                    <div>
                        抢单模式 <span>不再提醒</span>
                    </div>
                    <p>
                        限价：报价不允许超过限价，报名星级等级高者得
                        报价：各自进行报价，由货主自行挑选决定中选者
                        竞价：各自进行报价，系统自动选中最低报价司机
                    </p>
                </div>
                <ul className={styles.orderTypeList}>
                    <li className={this.state.orderType == 0 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 0 })}>全部订单</li>
                    <li className={this.state.orderType == 1 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 1 })}>限价订单</li>
                    <li className={this.state.orderType == 2 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 2 })}>竞价订单</li>
                    <li className={this.state.orderType == 3 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 2 })}>报价订单</li>
                </ul>
                {this.getOrderList()}
            </React.Fragment>
        } else {
            return <React.Fragment>
                <Introduction introduction={this.props.introduction}></Introduction>
                <div className={styles.contents}>
                    <div className={styles.info}>
                        <ul>
                            <li>
                                <p>全部订单</p>
                                <div>
                                    <span>12</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>限价订单</p>
                                <div>
                                    <span>12</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>竞价订单</p>
                                <div>
                                    <span>12</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>报价订单</p>
                                <div>
                                    <span>12</span>
                                    <span>单</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                {this.getDBGrid()}

            </React.Fragment>
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        this.setState({
            isInit: true
        })
    }

    getDBGrid() {
        if (this.state.isInit) {
            // if (this.state.data.size > 0)
            let jsx = <React.Fragment>
                <div className={styles.gridTitle}>当前可抢订单，您可以报名抢单！</div>
                <DBGrid dataSet={this.state.data} className={styles.dbgrid}>
                    <Column code='send_date_time_' width='20' name='发货时间'></Column>
                    <Column code='arrive_date_time_' width='20' name='到货时间'></Column>
                    <Column code='depart_' width='14' name='起始点'></Column>
                    <Column code='destination_' width='14' name='目的地'></Column>
                    <Column code='code_' width='14' name='货物'></Column>
                    <Column code='amount_' width='14' name='运费'></Column>
                    <Column code='Opera_' width='20' name='操作' customText={(row: DataRow) => {
                        return <span className={styles.opera} onClick={this.handleSelect.bind(this, row)}>立即报名</span>
                    }}></Column>
                </DBGrid>
            </React.Fragment>
            return <div className={styles.grid}>{jsx}</div>;
        }
    }

    getOrderList() {
        if (!this.state.isInit)
            return;
        let list = [];
        let ds = this.state.data;
        let hasNextOrder = false;
        let time = new Date().getTime();
        while (ds.fetch()) {
            let isReceived = true;
            list.push(this.getOrderDetail(hasNextOrder, ds.current, isReceived, time))
        }
        return <ul className={styles.orderList} key={this.state.orderType}>{list}</ul>
    }

    getOrderDetail(hasNextOrder: boolean, row: DataRow, isReceived: boolean, time: number) {

        let skin_stetus = styles.xj;
        switch (this.state.orderType) {
            case 2:
                skin_stetus = styles.jj
                break;
            case 3:
                skin_stetus = styles.bj
                break;
        }
        return <li key={0} onClick={this.handleSelect.bind(this, row)}>
            <div className={styles.orderTop}>
                <div>
                    金牛水泥厂
                    <span className={skin_stetus}>限价</span>
                </div>
            </div>
            <div className={styles.orderCenter}>
                <div className={styles.orderInfo}>
                    <div>
                        <div>广东 深圳</div>
                        <p>2022-02-22 07:00</p>
                    </div>
                    <img src='images/order/transportation.png'></img>
                    <div>
                        <div>广东 广州</div>
                        <p>2022-02-22 07:00</p>
                    </div>
                </div>
            </div>
            <div className={styles.orderBottom}>
                <div className={styles.footerText}>货物明细<span>原本 | 30吨</span></div>
                <button>立即报名</button>
            </div>
        </li>
    }

    // 报名
    handleSelect(row: DataRow) {

    }
}