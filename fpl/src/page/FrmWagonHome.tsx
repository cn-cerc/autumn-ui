import StaticFile from "@diteng/StaticFile";
import { WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmWagonHome.css";
import Introduction from "./Introduction";

type FrmWagonHomeTypeProps = {
    introduction: string,
}

type FrmWagonHomeTypeState = {
    productNum: number,
    serveNum: number,
}

export default class FrmWagonHome extends WebControl<FrmWagonHomeTypeProps, FrmWagonHomeTypeState> {
    constructor(props: FrmWagonHomeTypeProps) {
        super(props);
        this.state = {
            productNum: 0,
            serveNum: 0,
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <Introduction introduction={this.props.introduction}></Introduction>
            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.leftBox}>
                        <div className={styles.items}>
                            <header>
                                活动公告 · <span>20条</span>
                                <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>
                            </header>
                            <ul>
                                <li className={styles.item} onClick={this.toDetailFun.bind(this, 1)}>
                                    <div className={styles.mainText}>
                                        <div>
                                            恒大汽车：恒驰5将于7月6日晚8点开启预售 首一万辆可交车时付...
                                        </div>
                                        <p>2022-07-05 12:53·庆丰物流</p>
                                    </div>
                                </li>
                                <li className={styles.item} onClick={this.toDetailFun.bind(this, 1)}>
                                    <div className={styles.mainText}>
                                        <div>
                                            恒大汽车：恒驰5将于7月6日晚8点开启预售 首一万辆可交车时付...
                                        </div>
                                        <p>2022-07-05 12:53·庆丰物流</p>
                                    </div>
                                    <div className={styles.imgBox}>
                                        <img src="images/MCimg/sjzj_1.png" alt="" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.items}>
                            <header>
                                操作指引 · <span>11条</span>
                                <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>
                            </header>
                            <ul>
                                <li className={styles.item} onClick={this.toDetailFun.bind(this, 2)}>
                                    <div className={styles.mainText}>
                                        <div>
                                            恒大汽车：恒驰5将于7月6日晚8点开启预售 首一万辆可交车时付...
                                        </div>
                                        <p>2022-07-05 12:53·庆丰物流</p>
                                    </div>
                                    <div className={styles.imgBox}>
                                        <img src="images/MCimg/sjzj_1.png" alt="" />
                                    </div>
                                </li>
                                <li className={styles.item} onClick={this.toDetailFun.bind(this, 2)}>
                                    <div className={styles.mainText}>
                                        <div>
                                            恒大汽车：恒驰5将于7月6日晚8点开启预售 首一万辆可交车时付...
                                        </div>
                                        <p>2022-07-05 12:53·庆丰物流</p>
                                    </div>
                                    <div className={styles.imgBox}>
                                        <img src="images/MCimg/sjzj_1.png" alt="" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.centerBox}>
                        <div className={styles.items}>
                            <header>
                                商品优惠 · <span>{this.state.productNum}条</span>
                                {!this.state.productNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                <li className={styles.textCenter}>暂无数据</li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.rightBox}>
                        <div className={styles.items}>
                            <header>
                                服务优惠 · <span>{this.state.serveNum}条</span>
                                {!this.state.serveNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                <li className={styles.textCenter}>暂无数据</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
    }

    moreMsg() {
        location.href = `FrmDriverAdvert`;
    }

    toDetailFun(type: number) {
        let advert_no_;
        if (type == 1) {
            advert_no_ = 20220711372;
        } else if (type == 2) {
            advert_no_ = 20220711239;
        }
        location.href = `FrmDriverAdvert.modify?advert_no_=${advert_no_}`;
    }
}