import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import { callPhoneNumber, showMsg } from "../tool/Summer";
import FplPageApi from "./FplPageApi";
import styles from "./FrmDriverArrangeCarDetail.css";

type FrmDriverArrangeCarTypeProps = {
    cargoNo: string,
    tbNo: string,
    it: string,
    dcorpno: string
}

type FrmDriverArrangeCarTypeState = {
    showShopDetail: boolean,
    isAgree: boolean,
    orderData: DataRow
}

export default class FrmDriverArrangeCarDetail extends React.Component<FrmDriverArrangeCarTypeProps, FrmDriverArrangeCarTypeState> {
    constructor(props: FrmDriverArrangeCarTypeProps) {
        super(props);
        this.state = {
            showShopDetail: false,
            isAgree: false,
            orderData: new DataRow
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <div className={styles.main}>
                <div className={styles.title}>
                    <ul className={styles.siteBox}>
                        <li>
                            <img src='images/order/sender.png'></img>
                            <div>
                                <p>广州市白云区某某物流点</p>
                                <p>张三 18112345678</p>
                            </div>
                            <img src='images/icon/call.png' onClick={() => callPhoneNumber('18112345678')}></img>
                        </li>
                        <li>
                            <img src='images/order/recipient.png'></img>
                            <div>
                                <p>广州市白云区某某物流点</p>
                                <p>张三 18112345678</p>
                            </div>
                            <img src='images/icon/call.png' onClick={() => callPhoneNumber('18112345678')}></img>
                        </li>
                    </ul>
                    <div className={styles.infoLine}>
                        <span>发车时间</span>
                        <span>2022-07-04 12:00</span>
                    </div>
                    <div className={styles.infoLine}>
                        <span>抵达时间</span>
                        <span>2022-07-04 12:00</span>
                    </div>
                </div>
                <div className={styles.orderDetails}>
                    <ul>
                        <li className={this.state.showShopDetail ? '' : styles.orderActive} onClick={() => this.setState({ showShopDetail: false })}>运单详情</li>
                        <li className={this.state.showShopDetail ? styles.orderActive : ''} onClick={() => this.setState({ showShopDetail: true })}>货物明细</li>
                    </ul>
                    {this.getOrderDetail()}
                </div>
                <div className={styles.orderBtns}>
                    <img src={this.state.isAgree ? 'images/icon/checkbox_checked.png' : 'images/icon/checkbox.png'} onClick={() => this.setState({ isAgree: !this.state.isAgree })} />
                    <div><span onClick={() => this.setState({ isAgree: !this.state.isAgree })}>我已阅读</span><a href='FrmDriverArrangeCar.carriage'>《承运协议》</a></div>
                    <button onClick={this.handleSelect.bind(this)}>确认接单</button>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        this.init();
    }

    async init() {
        let orderData = new DataRow();
        let driverRow = new DataRow();
        driverRow.setValue('cargo_no_', this.props.cargoNo);
        driverRow.setValue('tb_no_', this.props.tbNo);
        driverRow.setValue('it_', this.props.it);
        // 查询派车单信息
        let driverData = await FplPageApi.getDriverArrangeCarDetail(driverRow);
        driverData.first();
        orderData.copyValues(driverData.current);
        let cargoRow = new DataRow();
        cargoRow.setValue('cargo_no_', this.props.cargoNo);
        cargoRow.setValue('d_corp_no_', this.props.dcorpno);
        // 查询货单信息
        let cargoData = await FplPageApi.getCargoOrderDetail(cargoRow);
        cargoData.first();
        // 组装信息
        orderData.setValue("code_", cargoData.getValue("code_"));
        orderData.setValue("send_name_", cargoData.getValue("send_name_"));
        orderData.setValue("send_phone_", cargoData.getValue("send_phone_"));
        orderData.setValue("send_detail_", cargoData.getValue("send_detail_"));
        orderData.setValue("receive_name_", cargoData.getValue("receive_name_"));
        orderData.setValue("receive_phone_", cargoData.getValue("receive_phone_"));
        orderData.setValue("receive_detail_", cargoData.getValue("receive_detail_"));
        orderData.setValue("cargo_loss_rate_", cargoData.getValue("cargo_loss_rate_"));
        orderData.setValue("carry_type_", cargoData.getValue("carry_type_"));
        orderData.setValue("settle_status_", cargoData.getValue("settle_status_"));
        orderData.setValue("scheduling_mode_", cargoData.getValue("scheduling_mode_"));
        orderData.setValue("homework_type_", cargoData.getValue("homework_type_"));
        console.log(orderData)
        this.setState({
            orderData
        })
    }

    getOrderDetail() {
        if (this.state.showShopDetail) {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>货运单号</span>
                    <span>{this.state.orderData.getString('cargo_no_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货运类型</span>
                    <span>{this.state.orderData.getString('carry_type_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>调度模式</span>
                    <span>{this.state.orderData.getString('scheduling_mode_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>运输料品</span>
                    <span>{this.state.orderData.getString('code_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货损率％</span>
                    <span>{this.state.orderData.getString('cargo_loss_rate_')}</span>
                </li>
            </ul>
        } else {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>派单编号</span>
                    <span>{this.state.orderData.getString('tb_no_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车次</span>
                    <span>{this.state.orderData.getString('it_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车队</span>
                    <span>{this.state.orderData.getString('fleet_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车牌号</span>
                    <span>{this.state.orderData.getString('car_num_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>司机</span>
                    <span>{this.state.orderData.getString('driver_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>收款人</span>
                    <span>{this.state.orderData.getString('payee_name_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货物数量</span>
                    <span>{this.state.orderData.getString('weight_')}{this.state.orderData.getString('deputy_unit_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单单价</span>
                    <span>{this.state.orderData.getString('unit_price_')}</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单金额</span>
                    <span>{this.state.orderData.getString('amount_')}</span>
                </li>
            </ul>
        }
    }

    //确认接单
    handleSelect() {
        if(!this.state.isAgree) {
            showMsg('接单前请先勾选《承运协议》');
            return;
        }
        let row = new DataRow();
        //TODO精修的时候调整
    }
}