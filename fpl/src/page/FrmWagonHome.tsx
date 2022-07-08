import { WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmWagonHome.css";
import Introduction from "./Introduction";

type FrmWagonHomeTypeProps = {
    introduction: string,
}

type FrmWagonHomeTypeState = {
}

export default class FrmWagonHome extends WebControl<FrmWagonHomeTypeProps, FrmWagonHomeTypeState> {
    constructor(props: FrmWagonHomeTypeProps) {
        super(props);
        this.state = {
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
                                {this.isPhone ?<p className={styles.rightBtn}>
                                    查看更多 <img src="images/arrow_right.png" alt="" />
                                </p>:''}
                            </header>
                            <ul>
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                {this.isPhone ?<p className={styles.rightBtn}>
                                    查看更多 <img src="images/arrow_right.png" alt="" />
                                </p>:''}
                            </header>
                            <ul>
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                商品优惠 · <span>11条</span>
                                {this.isPhone ?<p className={styles.rightBtn}>
                                    查看更多 <img src="images/arrow_right.png" alt="" />
                                </p>:''}
                            </header>
                            <ul>
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                    <div className={styles.rightBox}>
                        <div className={styles.items}>
                            <header>
                                服务优惠 · <span>10条</span>
                                {this.isPhone ?<p className={styles.rightBtn}>
                                    查看更多 <img src="images/arrow_right.png" alt="" />
                                </p>:''}
                            </header>
                            <ul>
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                                <li className={styles.item}>
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
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
    }


}