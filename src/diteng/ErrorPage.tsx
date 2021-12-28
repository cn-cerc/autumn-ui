import React from "react";
import WebControl from "../rcc/WebControl";
import styles from "./ErrorPage.css";

type errorTypeProps = {
    msg: string,
    error_hint: string
}

export default class ErrorPage extends WebControl<errorTypeProps> {
    constructor(props: errorTypeProps) {
        super(props);
    }

    render() {
        return (
            <div className={styles.main}>
                <div className={styles.content}>
                    <header>
                        <nav className={styles.navigation}>
                            <div className="menu">
                                <a href="/public/WebDefault">首页</a>
                            </div>
                        </nav>
                    </header>
                    {this.getContanier()}
                </div>
            </div>
        )
    }

    getContanier() {
        if (this.isPhone) {
            return (
                <div className={styles.contanier}>
                    <div className={styles.errpage}>
                        <ul>
                            <li><img src={`https://www.diteng.site/public/images/bulb.png`} /></li>
                            <li>
                                <h3>非常抱歉，您此项请求服务器无法处理！</h3>
                                <p style={{ "margin": "0px", "text-align": "left", "text-indent": "2em" }}>请您确认您的操作是否有误，或将下述异常讯息记下来：</p>
                            </li>
                        </ul>
                        <p style={{ "color": "red", "width": "90%", "display": "block", "margin": "0px auto", "text-align": "left", "text-indent": "2em" }}
                            id="msg">{this.props.msg}</p>
                        <a href="javascript:history.go(-1)">返回</a>
                    </div>
                    <div className=""></div>
                </div>
            )
        } else {
            return (
                <div className={styles.contanier}>
                    <div className={styles.errpage}>
                        <ul>
                            <li><img src={`https://www.diteng.site/public/images/bulb.png`} /></li>
                            <li style={{ "margin-top": "2em" }}>
                                <h2>{this.props.error_hint}</h2>
                                <p style={{ "margin": "0" }}>请您确认您的操作是否有误，或将下述异常讯息记下来：</p>
                                <p style={{ "color": "red", "width": "100%", "display": "block", "margin": "0 auto 1.5em" }} id="msg">{this.props.msg}</p>
                                <a href="javascript:history.go(-1)">返回上页</a>
                                <a href="/public/WebDefault">返回首页</a>
                                <a href="TFrmLogout">重新登录</a>
                            </li>
                        </ul>
                    </div>
                    <div className=""></div>
                </div>
            )
        }
    }
}