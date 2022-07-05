import React from "react";
import { callPhoneNumber } from "../tool/Summer";
import styles from "./FrmDriverArrangeCarDetail.css";

type FrmDriverArrangeCarTypeProps = {
    cargoNo: string
}

type FrmDriverArrangeCarTypeState = {
    showShopDetail: boolean,
    isAgree: boolean
}

export default class FrmDriverArrangeCarDetail extends React.Component<FrmDriverArrangeCarTypeProps, FrmDriverArrangeCarTypeState> {
    constructor(props: FrmDriverArrangeCarTypeProps) {
        super(props);
        this.state = {
            showShopDetail: false,
            isAgree: false
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
                    <button>确认接单</button>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        
    }

    getOrderDetail() {
        if (this.state.showShopDetail) {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>货运单号</span>
                    <span>2022-07-04 12:00</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货运类型</span>
                    <span>2022-07-04 12:00</span>
                </li>
                <li className={styles.infoLine}>
                    <span>调度模式</span>
                    <span>2022-07-04 12:00</span>
                </li>
                <li className={styles.infoLine}>
                    <span>运输料品</span>
                    <span>2022-07-04 12:00</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货损率％</span>
                    <span>2022-07-04 12:00</span>
                </li>
            </ul>
        } else {
            return <ul className={styles.infoDetail}>
                <li className={styles.infoLine}>
                    <span>派单编号</span>
                    <span>TC2225878585685655</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车次</span>
                    <span>1车</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车队</span>
                    <span>金牛车队</span>
                </li>
                <li className={styles.infoLine}>
                    <span>车牌号</span>
                    <span>TC2225878585685655</span>
                </li>
                <li className={styles.infoLine}>
                    <span>司机</span>
                    <span>TC2225878585685655</span>
                </li>
                <li className={styles.infoLine}>
                    <span>收款人</span>
                    <span>刘老板</span>
                </li>
                <li className={styles.infoLine}>
                    <span>货物数量</span>
                    <span>1吨</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单单价</span>
                    <span>200元</span>
                </li>
                <li className={styles.infoLine}>
                    <span>派单金额</span>
                    <span>200元</span>
                </li>
            </ul>
        }
    }
}