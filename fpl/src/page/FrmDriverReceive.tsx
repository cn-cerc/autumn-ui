import { Column, DataRow, DataSet, DBGrid, WebControl } from "autumn-ui";
import React from "react";
import Introduction from "./Introduction";
import styles from "./FrmDriverReceive.css";
import FplPageApi from "./FplPageApi";

type FrmDriverReceiveTypeProps = {
    introduction: string,
    chartsJson: string
}

type FrmDriverReceiveTypeState = {
    linkRow: DataRow,
    gridData: DataSet,
    gridData_: DataSet,
    orderType: number,
    allOrder: number,
    isInit: boolean
}

export default class FrmDriverReceive extends WebControl<FrmDriverReceiveTypeProps, FrmDriverReceiveTypeState> {
    constructor(props: FrmDriverReceiveTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.chartsJson);
        this.state = {
            linkRow,
            gridData: new DataSet(),       //未接订单DataSet
            orderType: 0,       //接单状态，0为全部，1为未接单，2为已接单
            allOrder: null,
            gridData_: new DataSet(),       //已接订单DataSet
            isInit: false
        }
    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return <React.Fragment>
                {this.getFlowChart()}
                <ul className={styles.orderTypeList}>
                    <li className={this.state.orderType == 0 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 0 })}>全部(20)</li>
                    <li className={this.state.orderType == 1 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 1 })}>未接单(12)</li>
                    <li className={this.state.orderType == 2 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 2 })}>全部(8)</li>
                </ul>
                {this.getOrderList()}
            </React.Fragment>
        } else {
            return <React.Fragment>
                <Introduction introduction={this.props.introduction}></Introduction>
                <div className={styles.contents}>
                    <div className={styles.chartsBox}>
                        <p>流程图</p>
                        {this.getFlowChart()}
                    </div>
                    <div className={styles.info}>
                        {this.getToast()}
                        <ul>
                            <li>
                                <p>全部订单</p>
                                <div>
                                    <span>{this.state.allOrder}</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>未接订单</p>
                                <div>
                                    <span>{this.state.gridData.size}</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>已接订单</p>
                                <div>
                                    <span>{this.state.allOrder - this.state.gridData.size}</span>
                                    <span>单</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.grid}>
                    <div className={styles.gridTitle}>您存在未接运单——3单，请尽快接单</div>
                    {this.getDBGrid()}
                </div>
            </React.Fragment>
        }
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let ds = await FplPageApi.getDriverAllOrder();
        ds.first();
        let gridData = new DataSet();
        let gridData_ = new DataSet();
        let allOrder = 0;
        while (ds.fetch()) {
            if (ds.getString('confirm_status_') == '0') {
                gridData.append().copyRecord(ds.current);
            } else
                gridData_.append().copyRecord(ds.current);
            allOrder += 1;
        }
        console.log(gridData_)
        if (gridData_.size > 1)
            gridData_.setSort('receiving_time_ DESC');
        this.setState({
            gridData,
            gridData_,
            allOrder,
            isInit: true
        })
        console.log(ds)
    }

    // 获取流程图介绍
    getFlowChart() {
        return <div className={styles.charts}>
            <ul className={styles.flowBox}>
                <li onClick={this.linkTo.bind(this, '接单')} >
                    <img src='images/order/order.png' />
                    <span>接单</span>
                </li>
                <li className={styles.line}></li>
                <li onClick={this.linkTo.bind(this, '装货回单')}>
                    <img src='images/order/shipOrder.png' />
                    <span>装货回单</span>
                </li>
                <li className={styles.line}></li>
                <li onClick={this.linkTo.bind(this, '卸货回单')}>
                    <img src='images/order/dischargeOrder.png' />
                    <span>卸货回单</span>
                </li>
                <li className={styles.line}></li>
                <li onClick={this.linkTo.bind(this, '完结')}>
                    <img src='images/order/end.png' />
                    <span>完结</span>
                </li>
            </ul>
        </div>
    }

    getDBGrid() {
        if (this.state.isInit)
            return <DBGrid dataSet={this.state.gridData} className={styles.dbgrid}>
                <Column code='send_date_time_' width='20' name='发货时间'></Column>
                <Column code='arrive_date_time_' width='20' name='到货时间'></Column>
                <Column code='depart_' width='20' name='起始点'></Column>
                <Column code='destination_' width='20' name='目的地'></Column>
                <Column code='code_' width='20' name='货物'></Column>
                <Column code='amount_' width='20' name='运费'></Column>
                <Column code='Opera_' width='8' name='操作' customText={(row: DataRow) => {
                    return <span className={styles.opera} onClick={this.handleSelect.bind(this, row)}>接单</span>
                }}></Column>
            </DBGrid>
    }

    // 获取订单列表（手机版）
    getOrderList() {
        if (!this.state.isInit)
            return;
        let list = [];
        this.state.gridData.first();
        while (this.state.gridData.fetch()) {
            let row = this.state.gridData.current;
            list.push(<li key={this.state.gridData.recNo}>
                <div className={styles.orderTop}>
                    <div>
                        <span>{row.getString('depart_')}</span>
                        <img src='images/order/transportation.png'></img>
                        <span>{row.getString('destination_')}</span>
                    </div>
                    <span>总共3车</span>
                </div>
                <div className={styles.orderCenter}>
                    <div className={styles.orderInfo}>
                        <span>发货明细 {row.getString('Goods_')}</span>
                        <span>发货时间 {row.getString('StartTime_')}</span>
                        <span>到货时间 {row.getString('EndTime_')}</span>
                    </div>
                </div>
                <div className={styles.orderBottom}>
                    <div className={styles.freight}>￥<span>{row.getString('Freight_')}</span></div>
                    <button onClick={this.handleSelect.bind(this, row)}>立即接单</button>
                </div>
            </li>)
        }
        return <ul className={styles.orderList}>{list}</ul>
    }

    linkTo(name: string) {
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }

    getToast() {
        if (!this.state.isInit)
            return
        if (this.state.gridData_.size > 0) {
            let time = this.state.gridData_.getString('receiving_time_');
            return <p style={{ 'color': '#E65C5C' }}>您距离下一单发货时间还有3个小时！<a style={{ 'marginLeft': '12px' }} href=''>立即查看</a></p>
            // return <p>您已经5天没有接单了，快来抢单大厅看看吧！<a style={{ 'marginLeft': '12px' }} href=''>立即查看</a></p>
        } else
            return <p>暂无接单，快去抢单大厅看看吧~！<a style={{ 'marginLeft': '12px' }} href=''>立即查看</a></p>

    }

    // 接单
    handleSelect(row: DataRow) {
        console.log(row)
    }
}