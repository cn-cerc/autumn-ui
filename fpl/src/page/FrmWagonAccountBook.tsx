import { WebControl } from "autumn-ui";
import React from "react";
import Introduction from "./Introduction";
import styles from "./FrmWagonAccountBook.css";

type FrmWagonAccountBookTypeProps = {
    introduction: string
}

type FrmWagonAccountBookTypeState = {

}

export default class FrmWagonAccountBook extends WebControl<FrmWagonAccountBookTypeProps, FrmWagonAccountBookTypeState> {
    constructor(props: FrmWagonAccountBookTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <Introduction introduction={this.props.introduction}></Introduction>
            <div className={styles.main}>
                <div className={styles.menuModule}></div>
                <div className={styles.content}>
                    <ul>
                        <li>
                            <p>钱包余额</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>支出</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>收入</p>
                            <div>
                                <span>2099.00</span>
                                <span>元</span>
                            </div>
                        </li>
                        <li>
                            <p>未报销</p>
                            <div>
                                <span>12</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销进程</p>
                            <div>
                                <span>50</span>
                                <span>笔</span>
                            </div>
                        </li>
                        <li>
                            <p>报销驳回</p>
                            <div>
                                <span>12</span>
                                <span>笔</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    }
}