import { DataRow, WebControl } from "autumn-ui";
import React, { ReactNode } from "react";
import DialogDOM from "../dialog/DialogDOM";
import { AddressPopup_MC } from "../popup/AddressPopup";
import { FSCusPopup_MC } from "../popup/FSCusPopup";
import { QuickSitePopup_MC } from "../popup/QuickSitePopup";
import StaticFile from "../static/StaticFile";
import { ClientStorage } from "../tool/Utils";
import styles from "./FrmShippingAppend.css";

type FrmShippingAppendTypeProps = {

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
    goodsUnit: string,      // 货物单位
    goodsPrice: string,     // 货物订单价
    goodsPriceF: string,    // 货物运单价
    carName: string,        // 车牌号
    driverName: string,     // 司机名称
    driverMobile: string,   // 司机手机号
    payeeName: string,      // 收款人名称
    payeeMobile: string     // 收款人手机号
}

export default class FrmShippingAppend extends WebControl<FrmShippingAppendTypeProps, FrmShippingAppendTypeState> {
    private client: ClientStorage = new ClientStorage('FrmShoppingAppend');
    constructor(props: FrmShippingAppendTypeProps) {
        super(props);
        let state = {};
        if (this.client.get('state'))
            state = JSON.parse(this.client.get('state'))
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
            goodsUnit: '',
            goodsPrice: '',
            goodsPriceF: '',
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
                    <textarea value={this.state.sendAddress} onChange={(e) => { this.saveState({ sendAddress: e.target.value }) }} ></textarea>
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
                    <textarea value={this.state.receiveAddress} onChange={(e) => { this.saveState({ receiveAddress: e.target.value }) }} ></textarea>
                </li>
            </ul>
            <ul className={styles.goodsBox}>
                <li>
                    <span>货物名称</span>
                    <span className={this.state.goodsName ? '' : styles.color9}>{this.state.goodsName || '货物信息'}</span>
                    {this.state.goodsName ? '' : <span className={styles.selectName}>请选择</span>}
                    <img src={StaticFile.getImage('images/icon/arrow-right.png')} />
                </li>
            </ul>
        </div>
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
        console.log(row);
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
}