import { DataRow, WebControl } from "autumn-ui";
import React, { ReactNode } from "react";
import FplApi from "../api/FplApi";
import DialogDOM from "../dialog/DialogDOM";
import { AddressPopup_MC } from "../popup/AddressPopup";
import { CodeRecordTwoPopup_MC } from "../popup/CodeRecordTwoPopup";
import { DriverInfoPopup_MC } from "../popup/DriverInfoPopup";
import { FSCusPopup_MC } from "../popup/FSCusPopup";
import { NumberPlatePopup_MC } from "../popup/NumberPlatePopup";
import { PayeePopup_MC } from "../popup/PayeePopup";
import { QuickSitePopup_MC } from "../popup/QuickSitePopup";
import StaticFile from "../static/StaticFile";
import { showMsg } from "../tool/Summer";
import { ClientStorage } from "../tool/Utils";
import styles from "./FrmShippingAppend.css";

type FrmShippingAppendTypeProps = {
    lnglat: string,
    units: string,
    userCode: string,
    tbNo: string,
}

type FrmShippingAppendTypeState = {
    sendName: string,       // 发货人名称
    sendMobile: string,     // 发货人手机号
    sendDepart: string,     // 发货地
    sendAddress: string,    // 发货详细地址
    receiveName: string,    // 收货人名称
    receiveMobile: string,  // 收货人手机号
    receiveDepart: string,  // 收货地
    receiveAddress: string, // 收货详细地址
    goodsName: string,      // 货物名称
    goodsNum: number,       // 货物数量
    goodsUnit: number,      // 货物单位
    goodsPrice: number,     // 货物订单价
    goodsPriceF: number,    // 货物运单价
    carName: string,        // 车牌号
    driverName: string,     // 司机名称
    driverMobile: string,   // 司机手机号
    payeeName: string,      // 收款人名称
    payeeMobile: string     // 收款人手机号
}

export default class FrmShippingAppend extends WebControl<FrmShippingAppendTypeProps, FrmShippingAppendTypeState> {
    private client: ClientStorage = null;
    private units: string[] = [];
    constructor(props: FrmShippingAppendTypeProps) {
        super(props);
        let state = {};
        this.client = new ClientStorage(`FrmShoppingAppend_${this.props.userCode}`);
        this.units = this.props.units.split(',');
        if (this.client.get('state'))
            state = JSON.parse(this.client.get('state'));
        this.state = {
            sendName: '',
            sendMobile: '',
            sendDepart: '',
            sendAddress: '',
            receiveName: '',
            receiveMobile: '',
            receiveDepart: '',
            receiveAddress: '',
            goodsName: '',
            goodsNum: null,
            goodsUnit: 0,
            goodsPrice: null,
            goodsPriceF: null,
            carName: '',
            driverName: '',
            driverMobile: '',
            payeeName: '',
            payeeMobile: '',
            ...state
        }
    }

    render(): ReactNode {
        return <div className={styles.main}>
            <div className={styles.info}>
                <ul className={styles.peopleBox}>
                    <li onClick={this.showSendPopup.bind(this)}>
                        <img src={StaticFile.getImage('images/icon/send_round.png')}></img>
                        <span>{(this.state.sendName || this.state.sendMobile) ? `${this.state.sendName} ${this.state.sendMobile}` : '发货人信息'}</span>
                        {(this.state.sendName || this.state.sendMobile) ? '' : <span className={styles.selectName}>请选择</span>}
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li onClick={this.showSendSitePopup.bind(this)}>
                        <span>{this.state.sendDepart || '发货人地址'}</span>
                        {this.state.sendDepart ? '' : <span className={styles.selectName}>请选择</span>}
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li>
                        <textarea value={this.state.sendAddress} onChange={(e) => { this.saveState({ sendAddress: e.target.value }) }} placeholder='请编辑出发地详细地址'></textarea>
                    </li>
                </ul>
                <ul className={styles.peopleBox}>
                    <li onClick={this.showReceivePopup.bind(this)}>
                        <img src={StaticFile.getImage('images/icon/receive_round.png')}></img>
                        <span>{(this.state.receiveName || this.state.receiveMobile) ? `${this.state.receiveName} ${this.state.receiveMobile}` : '发货人信息'}</span>
                        {(this.state.receiveName || this.state.receiveMobile) ? '' : <span className={styles.selectName}>请选择</span>}
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li onClick={this.showReceiveSitePopup.bind(this)}>
                        <span>{this.state.receiveDepart || '发货人地址'}</span>
                        {this.state.receiveDepart ? '' : <span className={styles.selectName}>请选择</span>}
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li>
                        <textarea value={this.state.receiveAddress} onChange={(e) => { this.saveState({ receiveAddress: e.target.value }) }} placeholder='请编辑目的地详细地址'></textarea>
                    </li>
                </ul>
                <ul className={styles.goodsBox}>
                    <li onClick={this.showGoosNamePopup.bind(this)}>
                        <span>货物名称</span>
                        <span className={this.state.goodsName ? '' : styles.color9}>{this.state.goodsName || '货物信息'}</span>
                        {this.state.goodsName ? '' : <span className={styles.selectName}>请选择</span>}
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li>
                        <span>数量</span>
                        <input type="number" value={this.state.goodsNum} onChange={(e) => { this.saveState({ goodsNum: this.getPrice(e.target.value) }) }} onFocus={(e) => { e.target.select() }} placeholder='请输入数量' />
                    </li>
                    <li>
                        <span>单位</span>
                        {this.getUnit()}
                    </li>
                    <li>
                        <span>订单价</span>
                        <div>
                            <div>
                                <input type="number" value={this.state.goodsPrice} onChange={(e) => { this.saveState({ goodsPrice: this.getPrice(e.target.value) }) }} onFocus={(e) => { e.target.select() }} placeholder='输入金额' />
                                <span>/{this.units[this.state.goodsUnit]}</span>
                            </div>
                            <div>总价：<span>{this.state.goodsNum > 0 && this.state.goodsPrice > 0 ? this.state.goodsNum * this.state.goodsPrice : '0.00'}</span></div>
                        </div>
                    </li>
                    <li>
                        <span>运单价</span>
                        <div>
                            <div>
                                <input type="number" value={this.state.goodsPriceF} onChange={(e) => { this.saveState({ goodsPriceF: this.getPrice(e.target.value) }) }} onFocus={(e) => { e.target.select() }} placeholder='输入金额' />
                                <span>/{this.units[this.state.goodsUnit]}</span>
                            </div>
                            <div>总价：<span>{this.state.goodsNum > 0 && this.state.goodsPriceF > 0 ? this.state.goodsNum * this.state.goodsPriceF : '0.00'}</span></div>
                        </div>
                    </li>
                </ul>
                <ul className={styles.otherInfo}>
                    <li onClick={this.showCarNamePopup.bind(this)}>
                        <span>车牌号</span>
                        <span className={this.state.carName ? '' : styles.selectName}>{this.state.carName || '请选择'}</span>
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li onClick={this.showDirverPopup.bind(this)}>
                        <span>司机信息</span>
                        <span className={(this.state.driverName || this.state.driverMobile) ? '' : styles.selectName}>{(this.state.driverName || this.state.driverMobile) ? `${this.state.driverName} ${this.state.driverMobile}` : '请选择'}</span>
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                    <li onClick={this.showPayeePopup.bind(this)}>
                        <span>收款人</span>
                        <span className={(this.state.payeeName || this.state.payeeMobile) ? '' : styles.selectName}>{(this.state.payeeName || this.state.payeeMobile) ? `${this.state.payeeName} ${this.state.payeeMobile}` : '请选择'}</span>
                        <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                    </li>
                </ul>
            </div>
            <div className={styles.btn}>
                <button onClick={this.handleSubmit.bind(this)} className={this.isIntact() ? '' : styles.disable}>确认发布</button>
            </div>
        </div>
    }

    componentDidMount(): void {
        if (this.props.tbNo) {
            this.init();
        }
    }

    async init() {
        let headIn = new DataRow();
        headIn.setValue('tb_no_', this.props.tbNo);
        let ds = await FplApi.copyShipping(headIn);
        this.setState({
            sendName: ds.head.getString('send_name_'),
            sendMobile: ds.head.getString('send_phone_'),
            sendDepart: ds.head.getString('depart_'),
            sendAddress: ds.head.getString('send_detail_'),
            receiveName: ds.head.getString('receive_name_'),
            receiveMobile: ds.head.getString('receive_phone_'),
            receiveDepart: ds.head.getString('destination_'),
            receiveAddress: ds.head.getString('receive_detail_'),
            goodsName: ds.head.getString('code_'),
            goodsNum: parseFloat(ds.head.getString('total_')) || null,
            goodsUnit: ds.head.getDouble('main_unit_'),
            goodsPrice: parseFloat(ds.head.getString('unit_price_')) || null,
            goodsPriceF: parseFloat(ds.head.getString('waybill_unit_price_')) || null,
            carName: ds.head.getString('car_num_'),
            driverName: ds.head.getString('driver_name_'),
            driverMobile: ds.head.getString('driver_phone_'),
        })
    }

    getUnit() {
        let list = this.units.map((unit, index) => {
            return <span key={unit} className={index == this.state.goodsUnit ? styles.active : ''} onClick={() => this.saveState({ goodsUnit: index })}>{unit}</span>
        })
        return <div>{list}</div>
    }

    getPrice(val: string) {
        return val != '0' && !val ? val : Number(val);
    }

    saveState(obj: object) {
        this.setState({
            ...obj
        }, () => {
            this.client.set('state', JSON.stringify(this.state));
        })
    }

    showSendPopup() {
        DialogDOM.render(React.createElement(AddressPopup_MC, {
            onSelect: this.chooseSendInfo.bind(this)
        }));
    }

    chooseSendInfo(row: DataRow) {
        this.saveState({
            sendName: row.getString('contact_'),
            sendMobile: row.getString('mobile_'),
            sendDepart: row.getString('address_'),
            sendAddress: row.getString('area5_')
        });
    }

    showSendSitePopup() {
        DialogDOM.render(React.createElement(QuickSitePopup_MC, {
            onSelect: this.chooseSendSite.bind(this),
            title: '选择发货地'
        }));
    }

    chooseSendSite(depart: string, address: string) {
        this.saveState({
            sendDepart: depart,
            sendAddress: address
        })
    }

    showReceivePopup() {
        DialogDOM.render(React.createElement(FSCusPopup_MC, {
            onSelect: this.chooseReceiveInfo.bind(this)
        }));
    }

    chooseReceiveInfo(row: DataRow) {
        this.saveState({
            receiveName: row.getString('Name_'),
            receiveMobile: row.getString('Mobile_'),
        })
    }

    showReceiveSitePopup() {
        DialogDOM.render(React.createElement(QuickSitePopup_MC, {
            onSelect: this.chooseReceiveSite.bind(this),
            title: '选择收货地'
        }));
    }

    chooseReceiveSite(depart: string, address: string) {
        this.saveState({
            receiveDepart: depart,
            receiveAddress: address
        })
    }

    showGoosNamePopup() {
        DialogDOM.render(React.createElement(CodeRecordTwoPopup_MC, {
            onSelect: this.chooseGoodsName.bind(this),
            title: '货物信息'
        }));
    }

    chooseGoodsName(row: DataRow) {
        this.saveState({
            goodsName: row.getString('code_')
        })
    }

    showCarNamePopup() {
        DialogDOM.render(React.createElement(NumberPlatePopup_MC, {
            onSelect: this.chooseCarName.bind(this),
            title: '车牌号信息'
        }));
    }

    chooseCarName(row: DataRow) {
        this.saveState({
            carName: row.getString('car_num_')
        })
    }

    showDirverPopup() {
        DialogDOM.render(React.createElement(DriverInfoPopup_MC, {
            onSelect: this.chooseDirver.bind(this),
            title: '司机信息'
        }));
    }

    chooseDirver(row: DataRow) {
        this.saveState({
            driverName: row.getString('name_'),
            driverMobile: row.getString('phone_num_')
        })
    }

    showPayeePopup() {
        DialogDOM.render(React.createElement(PayeePopup_MC, {
            onSelect: this.choosePayee.bind(this),
            title: '收款人信息'
        }));
    }

    choosePayee(row: DataRow) {
        this.saveState({
            payeeName: row.getString('payee_name_'),
            payeeMobile: row.getString('phone_number_')
        })
    }

    isIntact() {
        let bool = true;
        if (!this.state.sendName)
            bool = false;
        else if (!this.state.sendMobile)
            bool = false;
        else if (!this.state.sendDepart)
            bool = false;
        else if (!this.state.sendAddress)
            bool = false;
        else if (!this.state.receiveName)
            bool = false;
        else if (!this.state.receiveMobile)
            bool = false;
        else if (!this.state.receiveDepart)
            bool = false;
        else if (!this.state.receiveAddress)
            bool = false;
        else if (!this.state.goodsName)
            bool = false;
        else if (!this.state.goodsNum)
            bool = false;
        else if (!this.state.goodsPrice)
            bool = false;
        else if (!this.state.goodsPriceF)
            bool = false;
        else if (!this.state.carName)
            bool = false;
        else if (!this.state.driverName)
            bool = false;
        else if (!this.state.driverMobile)
            bool = false;
        return bool;
    }

    async handleSubmit() {
        if (!this.isIntact())
            return;
        let headIn = new DataRow();
        headIn.setValue('send_name_', this.state.sendName);
        headIn.setValue('send_phone_', this.state.sendMobile);
        headIn.setValue('depart_', this.state.sendDepart);
        headIn.setValue('send_detail_', this.state.sendAddress);
        headIn.setValue('receive_name_', this.state.receiveName);
        headIn.setValue('receive_phone_', this.state.receiveMobile);
        headIn.setValue('destination_', this.state.receiveDepart);
        headIn.setValue('receive_detail_', this.state.receiveAddress);
        headIn.setValue('code_', this.state.goodsName);
        headIn.setValue('total_', this.state.goodsNum);
        headIn.setValue('main_unit_', this.state.goodsUnit);
        headIn.setValue('unit_price_', this.state.goodsPrice);
        headIn.setValue('waybill_unit_price_', this.state.goodsPriceF);
        headIn.setValue('car_num_', this.state.carName);
        headIn.setValue('driver_name_', this.state.driverName);
        headIn.setValue('driver_phone_', this.state.driverMobile);
        let dataOut = await FplApi.appendAndTakeEffect(headIn);
        if (dataOut.state > 0) {
            this.client.remove('state');
            showMsg('发布成功');
            location.href = `FrmShipping.success?tbNo=${dataOut.head.getString('tb_no_')}`;
        } else {
            showMsg(dataOut.message);
        }
    }
}