import { Column, DataRow, DataSet, DBGrid, WebControl } from "autumn-ui";
import React from "react";
import FplApi from "../api/FplApi";
import UIIntroduction from "../module/UIIntroduction";
import StaticFile from "../static/StaticFile";
import { AuiMath, GDMap } from "../tool/Summer";
import styles from "./FrmDriverReceive.css";

type FrmDriverReceiveTypeProps = {
    introduction: string,
    chartsJson: string,
}

type FrmDriverReceiveTypeState = {
    linkRow: DataRow,
    orderData: DataSet,
    notData: DataSet,
    receivedData: DataSet,
    orderType: number,
    isInit: boolean,
    notComplete: DataSet,
    isCompleted: DataSet,
    showWay: boolean,
}

export default class FrmDriverReceive extends WebControl<FrmDriverReceiveTypeProps, FrmDriverReceiveTypeState> {
    private gdmap: GDMap = new GDMap();
    private unitArr: string[] = ['吨', '方', '件', '车'];
    constructor(props: FrmDriverReceiveTypeProps) {
        super(props);
        let linkRow = new DataRow();
        linkRow.setJson(this.props.chartsJson);
        this.state = {
            linkRow,
            notData: new DataSet(),       //未接物流订单DataSet
            orderType: 1,       //接单状态，0为全部，1为未接单，2为已接单
            orderData: new DataSet(),       //所有物流订单DataSet
            receivedData: new DataSet(),       //已接物流订单DataSet
            isInit: false,
            notComplete: new DataSet(),
            isCompleted: new DataSet(),
            showWay: true,
        }

    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return <React.Fragment>
                {this.getFlowChart()}
                <ul className={styles.orderTypeList}>
                    <li className={this.state.orderType == 1 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 1 })}>未完成</li>
                    <li className={this.state.orderType == 2 ? styles.orderActive : ''} onClick={() => this.setState({ orderType: 2 })}>已完成</li>
                </ul>
                {this.getOrderList()}
            </React.Fragment>
        } else {
            return <React.Fragment>
                <UIIntroduction introduction={this.props.introduction}></UIIntroduction>
                <div className={styles.contents}>
                    <div className={styles.info}>
                        {this.getToast()}
                        <ul>
                            <li>
                                <p>全部物流订单</p>
                                <div className={styles.links_skin} onClick={() => {
                                    location.href = `FrmDriverArrangeCar`;
                                }}>
                                    <span>{this.state.orderData.size}</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>未接物流订单</p>
                                <div className={styles.links_skin} onClick={() => {
                                    location.href = `FrmDriverArrangeCar.list`;
                                }}>
                                    <span>{this.state.notData.size}</span>
                                    <span>单</span>
                                </div>
                            </li>
                            <li>
                                <p>已接物流订单</p>
                                <div className={styles.links_skin} onClick={() => {
                                    location.href = `#`;
                                }}>
                                    <span>{this.state.receivedData.size}</span>
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
        let orderData = await FplApi.getDriverAllOrder();
        orderData.first();
        let gridData = new DataSet();
        let gridData_ = new DataSet();
        let notComplete = new DataSet();
        let isCompleted = new DataSet();
        let showWay = false;
        while (orderData.fetch()) {
            if (orderData.getString('confirm_status_') == '0' || orderData.getString('delivery_status_') < '4') {
                notComplete.append().copyRecord(orderData.current);
            } else if (orderData.getString('delivery_status_') == '4') {
                isCompleted.append().copyRecord(orderData.current);
            }
            if (orderData.getString('confirm_status_') == '0') {
                gridData.append().copyRecord(orderData.current);
                if (!this.isPhone) {
                    // 发货地详细地址
                    let sendSite1 = gridData.getString('send_detail_');
                    // 发货地
                    let sendSite2 = gridData.getString('depart_').replace(/\//g, '');
                    // 目的地详细地址
                    let receiveSite1 = gridData.getString('receive_detail_');
                    // 目的地
                    let receiveSite2 = gridData.getString('destination_').replace(/\//g, '');
                    let sendSite = sendSite1.indexOf(sendSite2) > -1 ? sendSite1 : sendSite2 + sendSite1;
                    let receiveSite = receiveSite1.indexOf(receiveSite2) > -1 ? receiveSite1 : receiveSite2 + receiveSite1;
                    let sendGeocoder = await this.gdmap.getAsyncGeocoder(sendSite);
                    let receiveGeocoder = await this.gdmap.getAsyncGeocoder(receiveSite);
                    if (sendGeocoder.status > 0 && receiveGeocoder.status > 0) {
                        gridData.setValue('sendGeocoder', sendGeocoder);
                        gridData.setValue('receiveGeocoder', receiveGeocoder);
                        gridData.setValue('hasWay', true);
                        showWay = true;
                    } else {
                        sendGeocoder = await this.gdmap.getAsyncGeocoder(sendSite2);
                        receiveGeocoder = await this.gdmap.getAsyncGeocoder(receiveSite2);
                        if (sendGeocoder.status > 0 && receiveGeocoder.status > 0) {
                            gridData.setValue('sendGeocoder', sendGeocoder);
                            gridData.setValue('receiveGeocoder', receiveGeocoder);
                            gridData.setValue('hasWay', true);
                            showWay = true;
                        } else {
                            gridData.setValue('hasWay', false);
                        }
                    }
                }
            } else
                gridData_.append().copyRecord(orderData.current);
        }
        if (gridData_.size > 1)
            gridData_.setSort('receiving_time_ ASC');
        this.setState({
            notData: gridData,
            receivedData: gridData_,
            orderData,
            isInit: true,
            notComplete,
            isCompleted,
            showWay
        })
    }

    // 获取流程图介绍
    getFlowChart() {
        if (!this.isPhone) {
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
    }

    getDBGrid() {
        if (this.state.isInit) {
            let jsx = <div className={styles.noGrid}>暂无未接单的物流订单，前往<a href='FrmCarGrab'>抢单大厅</a></div>;
            if (this.state.notData.size > 0)
                jsx = <React.Fragment>
                    <div className={styles.gridTitle}>您存在未接物流运单——{this.state.notData.size}单，请尽快接单</div>
                    <DBGrid dataSet={this.state.notData} className={styles.dbgrid}>
                        <Column code='send_date_time_' width='16' name='发货时间'></Column>
                        <Column code='arrive_date_time_' width='16' name='到货时间'></Column>
                        <Column code='depart_' width='20' name='起始点'></Column>
                        <Column code='destination_' width='20' name='目的地'></Column>
                        <Column code='code_' width='20' name='货物'></Column>
                        <Column code='num_' width='10' name='数量'></Column>
                        <Column code='amount_' width='16' name='运费'></Column>
                        <Column code='Opera_' width='6' name='操作' customText={(row: DataRow) => {
                            return <span className={styles.opera} onClick={this.handleSelect.bind(this, row)}>接单</span>
                        }}></Column>
                        {this.state.showWay ? <Column code='Site_' width='12' name='' customText={(row: DataRow) => {
                            return row.getBoolean('hasWay') ? <span className={styles.opera} onClick={this.toGaode.bind(this, row)}>查看路线</span> : ''
                        }}></Column> : ''}
                    </DBGrid>
                </React.Fragment>
            return <div className={styles.grid}>{jsx}</div>;
        }
    }

    // 获取订单列表（手机版）
    getOrderList() {
        if (!this.state.isInit)
            return;
        let list = [];
        let ds = new DataSet();
        if (this.state.orderType == 1)
            ds.appendDataSet(this.state.notComplete)
        else
            ds.appendDataSet(this.state.isCompleted)
        ds.first();
        let hasNextOrder = false;
        let time = new Date().getTime();
        let index = 1;
        while (ds.fetch()) {
            let isReceived = true;
            if (ds.getString('confirm_status_') == '0')
                isReceived = false;
            list.push(this.getOrderDetail(hasNextOrder, ds.current, isReceived, time, index))
            index++;
        }
        let bool = !list.length;
        if (bool) {
            list.push(<li className={styles.noOrder} key='noData'>
                <div><img src={StaticFile.getImage('images/Frmshopping/notDataImg.png')} alt="" /></div>
                <p>暂无运单</p>
            </li>)
        }
        return <ul className={styles.orderList} style={{ 'marginTop': !bool ? '0.75rem' : '' }} key={this.state.orderType}>{list}</ul>
    }

    linkTo(name: string) {
        if (!this.state.linkRow.getBoolean(`${name}_Dis`)) {
            location.href = this.state.linkRow.getString(`${name}_URL`);
        }
    }

    getToast() {
        if (!this.state.isInit)
            return
        let jsx = <p>暂无接单，快去抢单大厅看看吧~！<a style={{ 'marginLeft': '12px' }} href='FrmCarGrab'>立即查看</a></p>
        if (this.state.receivedData.size > 0) {
            let nearTime;
            let nearHref = '';
            let lastTime;
            this.state.receivedData.first();
            let time = new Date().getTime();
            for (let i = 0; i < this.state.receivedData.records.length; i++) {
                let time_ = new Date(this.state.receivedData.records[i].getString('receiving_time_')).getTime();
                let _time = new Date(this.state.receivedData.records[this.state.receivedData.records.length - i - 1].getString('receiving_time_')).getTime();
                if (time_ > time && !nearTime) {
                    nearTime = time_;
                    nearHref = `FrmDriverArrangeCar.detail?cargoNo=${this.state.receivedData.records[i].getString('cargo_no_')}&tbNo=${this.state.receivedData.records[i].getString('tb_no_')}&dcorpno=${this.state.receivedData.records[i].getString('d_corp_no_')}&it=${this.state.receivedData.records[i].getDouble('it_')}`;
                }
                if (_time <= time && !lastTime)
                    lastTime = _time
                if (nearTime && lastTime)
                    break;
            }
            if (nearTime) {
                jsx = <p style={{ 'color': '#E65C5C' }}>您距离下一单发货时间还有{Math.ceil((nearTime - time) / 3600000)}个小时！<a style={{ 'marginLeft': '12px' }} href={nearHref}>立即查看</a></p>
            } else if (Math.floor((time - lastTime) / 86400000) >= 5)
                jsx = <p>您已经{Math.floor((time - lastTime) / 86400000)}天没有接单了，快来抢单大厅看看吧！<a style={{ 'marginLeft': '12px' }} href='FrmCarGrab'>立即查看</a></p>
        }
        return jsx;
    }

    getOrderDetail(hasNextOrder: boolean, row: DataRow, isReceived: boolean, time: number, index: number) {
        let time_ = new Date(row.getString('receiving_time_')).getTime();
        let math = new AuiMath();
        if (!hasNextOrder && isReceived && !hasNextOrder && time_ > time) {
            hasNextOrder = true;
            return <li key={this.state.notData.recNo} onClick={this.handleSelect.bind(this, row)}>
                <div className={styles.orderMsg}>
                    <img src='images/icon/error.png' />
                    <span>您距离下一单发货时间还有{Math.ceil((time_ - time) / 3600000)}个小时</span>
                </div>
                <div className={styles.orderDetail}>
                    <div>
                        <span>{row.getString('depart_')}</span>
                        <img src='images/order/transportation.png'></img>
                        <span>{row.getString('destination_')}</span>
                    </div>
                    <button onClick={this.handleSelect.bind(this, row)}>查看详情</button>
                </div>
            </li>
        } else {
            let depart = this.removeProvinceFun(row.getString('send_city_'));
            let destination = this.removeProvinceFun(row.getString('receive_city_'));
            let stratDate = new Date(row.getString('send_date_time_'));
            let endDate = new Date(row.getString('arrive_date_time_'));
            return <li key={this.state.notData.recNo} onClick={this.handleSelect.bind(this, row)}>
                <div className={styles.orderTop}>
                    <div>
                        <span>{depart}</span>
                        <img src='images/order/transportation.png'></img>
                        <span>{destination}</span>
                        {this.state.orderType == 1 ? <span onClick={(e) => { e.preventDefault(), e.stopPropagation(), this.toGaode(row) }}> <a className={styles.luxian} href=""> <img src={StaticFile.getImage('images/Frmshopping/site.png')} alt="" /> 路线</a> </span> : ''}
                    </div>
                </div>
                <div className={styles.orderCenter}>
                    <div className={styles.orderInfo}>
                        <span className={styles.siteSkin}>{`${row.getString('depart_').replace(/\\/g, '')}${row.getString('send_detail_')}`}</span>
                        <span className={styles.siteSkin}>{`${row.getString('destination_').replace(/\\/g, '')}${row.getString('receive_detail_')}`}</span>
                        <span>{row.getString('code_')} | {this.fromatPriceFun(row.getString('num_'))}{[this.unitArr[row.getDouble('main_unit_')]]} {row.getInt('driver_type_') == 1 ? `| ${this.fromatPriceFun(row.getString('unit_price_'))}元/${[this.unitArr[row.getDouble('main_unit_')]]}` : ''}</span>
                        <span>计划发车:{this.formatDateTimeFun(stratDate)}</span>
                        <span>计划抵达:{this.formatDateTimeFun(endDate)}</span>
                    </div>
                    {isReceived ? this.getOrderState(row) : ''}
                </div>
                <div className={styles.orderBottom}>
                    <div className={styles.freight}>{row.getInt('driver_type_') == 1 ? '￥' : ''}<span>{row.getInt('driver_type_') == 1 ? math.toFixed(row.getString('amount_'), 2) : ''}</span></div>
                    <div className={styles.btns}>
                        {isReceived ? <button className={styles.btn_detail}>详情</button> : <button className={index == 1 ? '' : styles.defaultBtn}>接单</button>}
                    </div>
                </div>
            </li>
        }
    }

    // 接单
    handleSelect(row: DataRow) {
        location.href = `FrmDriverArrangeCar.detail?cargoNo=${row.getString('cargo_no_')}&tbNo=${row.getString('tb_no_')}&dcorpno=${row.getString('d_corp_no_')}&it=${row.getDouble('it_')}`;
    }

    // 查看路线
    async toGaode(row: DataRow) {
        if (this.isPhone) {
            // 发货地详细地址
            let sendSite1 = row.getString('send_detail_');
            // 发货地
            let sendSite2 = row.getString('depart_').replace(/\//g, '');
            // 目的地详细地址
            let receiveSite1 = row.getString('receive_detail_');
            // 目的地
            let receiveSite2 = row.getString('destination_').replace(/\//g, '');
            let sendSite = sendSite1.indexOf(sendSite2) > -1 ? sendSite1 : sendSite2 + sendSite1;
            let receiveSite = receiveSite1.indexOf(receiveSite2) > -1 ? receiveSite1 : receiveSite2 + receiveSite1;
            this.gdmap.routePlanInApp(sendSite, receiveSite);
        } else {
            if (row.getBoolean('receiveGeocoder') && row.getBoolean('receiveGeocoder')) {
                let sendGeocoder = row.getValue('sendGeocoder');
                let receiveGeocoder = row.getValue('receiveGeocoder');
                window.open(`https://uri.amap.com/navigation?from=${sendGeocoder.site.join()},${sendGeocoder.address}&to=${receiveGeocoder.site.join()},${receiveGeocoder.address}&mode=car&callnative=1`)
            }
        }
    }

    // 获取手机版已接单订单状态
    getOrderState(row: DataRow) {
        let imgSrc = '';
        switch (row.getDouble('delivery_status_')) {
            case 0:
                imgSrc = 'images/order/notShipped.png';
                break;
            case 1:
                imgSrc = 'images/order/shipped.png';
                break;
            case 2:
                imgSrc = 'images/order/discharge.png';
                break;
            case 3:
                imgSrc = 'images/order/awaitAudit.png';
                break;
            case 4:
                imgSrc = 'images/order/completed.png';
                break;
            default:
                imgSrc = 'images/order/notShipped.png';
                break;
        }
        return <img src={imgSrc}></img>
    }

    removeProvinceFun(address: string) {
        if (address.indexOf('/') > -1) {
            address = address.substring(address.indexOf('/') + 1, address.length);
        } else {
            address = address.substring(address.indexOf('\\') + 1, address.length);
        }
        return address;
    }

    formatDateTimeFun(dateObj: Date) {
        let str = '';
        if (dateObj.getFullYear == new Date().getFullYear) {
            str = `${(dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1}月${dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate()}日${dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours()}时`;
        } else {
            str = `${dateObj.getFullYear()}年${(dateObj.getMonth() + 1) < 10 ? '0' + (dateObj.getMonth() + 1) : dateObj.getMonth() + 1}月${dateObj.getDate() < 10 ? '0' + dateObj.getDate() : dateObj.getDate()}日`;
        }
        return str;
    }

    fromatPriceFun(num: any) {
        let d = Math.round(num * 100) / 100;
        const price = (d + "").split(".");
        price[1] = price[1] ? `${(price[1] + "000").substring(0, 2)}` : "00";
        return price.join(".");
    }
}