import { WebControl } from "autumn-ui";
import React, { ReactNode } from "react";
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
        if(this.client.get('state'))
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
                <li>
                    <img src={StaticFile.getImage('')}></img>
                </li>
            </ul>
        </div>
    }
}