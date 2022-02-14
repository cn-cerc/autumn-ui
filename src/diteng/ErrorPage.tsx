import React from "react";
import WebControl from "../rcc/WebControl";
import styles from "./ErrorPage.css";

type errorTypeProps = {
    msg: string,
    error_hint: string,
    statuCode: number,
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
                            <li className={styles.statuBg}><img src={`http://192.168.1.138:8101/public/images/statusCode/${this.props.statuCode}.png`} /></li>
                            <li>
                                <h3>非常抱歉，您此项请求服务器无法处理！</h3>
                                <p style={{ "margin": "0px", "textAlign": "left", "textIndent": "2em" }}>请您确认您的操作是否有误，或将下述异常讯息记下来：</p>
                            </li>
                        </ul>
                        <p style={{ "color": "red", "width": "90%", "display": "block", "margin": "0px auto", "textIndent": "2em" }}
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
                        <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>
                            <div className={styles.statuBg}><img src={`http://192.168.1.138:8101/public/images/statusCode/${this.props.statuCode}.png`} /></div>
                            <div style={{ 'marginTop': '1rem' }}>
                                <h2 style={{ "color": "#40485b", 'fontSize': '1.2rem', 'fontWeight': 'bold' }}>{this.props.error_hint}</h2>
                                <div>{this.props.msg}，<a href='/public/WebDefault'>点击这里</a>返回首页</div>
                                <div className={styles.errorMsg}>
                                    <p>也有可能是以下原因导致您访问失败</p>
                                    <ul>
                                        <li>1、没有登录或登录状态失效，<a href='TFrmLogout'>点击这里</a>重新登陆</li>
                                        <li>2、服务器找不到请求的网页或拒绝请求，<a href="" onClick={this.handleBack.bind(this)}>点击这里</a>返回上页或关闭当前页面</li>
                                        <li>3、其他非具体原因，<a href='TFrmContact'>点击这里</a>联系客服</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    handleBack(e: any) {
        e.preventDefault();
        if (window.history.length > 1)
            window.history.go(-1);
        else
            window.close();
    }
}