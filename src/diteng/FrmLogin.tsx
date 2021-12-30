import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import DBEdit from "../rcc/DBEdit";
import WebControl from "../rcc/WebControl";
import styles from "./FrmLogin.css";
import { showMsg } from "./Summer";
// @ts-ignore
import Fingerprint2 from "fingerprintjs2";
import { ClientStorage } from "../db/Utils";

type LoginTypeProps = {
    dataRow: DataRow,
    loginMsg?: string,
    language?: string,
    lowVersion?: boolean,
    verify?: () => boolean
}

type LoginTypeState = {
    showAccountList: boolean,
    accountData: DataSet,
    client: ClientStorage,
    message: string,
    savePwd: boolean,
    showVerify: boolean,
    hasSendCode: boolean,
    showLoad: boolean,
    timer: any
}

export class Login extends WebControl<LoginTypeProps, LoginTypeState> {
    constructor(props: LoginTypeProps) {
        super(props)
        let client = new ClientStorage('ErpKey');
        let accountData = new DataSet();
        let savePwd = client.get("savePwd") == 'true' ? true : false;
        if (client.get('Accounts'))
            accountData.setJson(client.get('Accounts'));
        this.state = {
            showAccountList: false,
            accountData,
            client,
            savePwd,
            showVerify: false,
            hasSendCode: false,
            showLoad: false,
            timer: null,
            message: this.props.loginMsg || ''
        }
    }
    render() {
        if (this.isPhone) {
            return (
                <React.Fragment>
                    <form method="post" className="mainBox" onSubmit={this.onSubmit.bind(this)}>
                        <div className="inputGroup userName">
                            <DBEdit dataField="userCode" dataRow={this.props.dataRow} placeholder="手机号码或地藤帐号" autoComplete='off' onChanged={this.changeUserCode.bind(this)}></DBEdit>
                            <span className={this.state.showAccountList ? 'choose-user showList' : 'choose-user'} onClick={this.chooseUser.bind(this)}></span>
                            {this.getChooseList()}
                        </div>
                        <div className="inputGroup passWord">
                            <DBEdit dataField='password' type='password' dataRow={this.props.dataRow} placeholder='登录密码'></DBEdit>
                        </div>
                        {this.getVerify()}
                        <div className="operation-login">
                            <input type="checkbox" id="savePwd" checked={this.state.savePwd} onChange={this.changeAutoLogin.bind(this)} /><label htmlFor="savePwd">自动登录</label>
                            <a href="FrmForgetPassword" style={{ "float": "right", "color": "red" }}>找回密码</a>
                        </div>
                        <div id="loginMsg" className={styles.loginMsg} style={{ "color": "red", "text-align": "center", "padding-bottom": ".5em" }}>{this.getMessage()}</div>
                        <button className="btnSubmit" onClick={this.onSubmit.bind(this)}>登录</button>
                    </form>
                    {this.getLoad()}
                </React.Fragment>
            )
        } else {
            return (
                <form id="login_form" className="ui-form" method="post" onSubmit={this.onSubmit.bind(this)}>
                    <div className="form_title">地藤登录页</div>
                    <div className="content_right">
                        <div className="user_message">
                            <p className="keyInput">
                                <img src="images/login/account.png" />
                                <DBEdit dataField="userCode" dataRow={this.props.dataRow} placeholder="手机号码或地藤帐号" autoComplete='off' autoFocus onChanged={this.changeUserCode.bind(this)}></DBEdit>
                                <span className={this.state.showAccountList ? 'choose-user showList' : 'choose-user'} onClick={this.chooseUser.bind(this)}></span>
                                {this.getChooseList()}
                            </p>
                            <p className="keyInput">
                                <img src="images/login/password.png" />
                                <DBEdit dataField='password' type='password' dataRow={this.props.dataRow} placeholder='登录密码'></DBEdit>
                            </p>
                            {this.getVerify()}
                            <p className="remember">
                                <input id="savePwd" type="checkbox" checked={this.state.savePwd} onChange={this.changeSvaePwd.bind(this)} />
                                <label htmlFor="savePwd">记住密码（私人电脑可选择此项）</label>
                            </p>
                        </div>
                        <div className="user_status">
                            <span>
                                <button onClick={this.onSubmit.bind(this)}>进入系统</button>
                            </span>
                        </div>
                        <div className="bottom">
                            <a href="FrmForgetPassword" className="afterRight">找回密码</a>
                            <a href="TFrmContact" className="afterRight">客服中心</a>
                            <a href="TFrmHardware" className="afterRight">硬件配置</a>
                            <a href="https://www.mimrc.com">公司介绍</a>
                        </div>
                        <div id="loginMsg" className="loginMsg">{this.getMessage()}</div>
                    </div>
                </form>
            )
        }
    }

    componentWillMount() {
        if (this.state.client.get('autoLogin') == 'true' && !this.props.loginMsg) {
            this.setState({ showLoad: true })
            this.onSubmit();
        }
    }

    getMessage() {
        if (this.props.lowVersion) {
            return <a href='FrmBrowserRecommend' target='_blank' style={{ 'color': '#ff4545' }}>你的浏览器版本太低，请使用推荐的浏览器</a>
        } else
            return this.state.message;
    }

    changeUserCode = (sender: any) => {
        this.setState({
            showAccountList: false,
            showVerify: false,
            hasSendCode: false,
            timer: null
        })
    }

    chooseUser() {
        this.setState({
            showAccountList: !this.state.showAccountList
        })
    }

    getChooseList() {
        if (this.state.showAccountList) {
            let accountList = [];
            let dataSet = new DataSet();
            dataSet.appendDataSet(this.state.accountData);
            dataSet.first();
            while (dataSet.fetch()) {
                let account = dataSet.getString('account');
                accountList.push(
                    <li key={dataSet.recNo}>
                        <span onClick={this.setAccount.bind(this, dataSet.current)}>{account}</span>
                        <i className='remove' onClick={this.chooseListRemove.bind(this, dataSet.current)}></i>
                    </li>
                )
            }
            return (
                <ul className="user-list">{accountList}</ul>
            )
        }
    }

    setAccount(row: DataRow) {
        this.props.dataRow.setValue('userCode', row.getString('account'));
        this.props.dataRow.setValue('password', row.getString('password'));
        this.setState({
            showAccountList: false,
            showVerify: false,
            hasSendCode: false,
            timer: null
        })
    }

    chooseListRemove(row: DataRow) {
        if (this.state.accountData.locate('account', row.getString('account')))
            this.state.accountData.delete();
        this.setState({
            showAccountList: false,
            showVerify: false
        });
    }

    changeAutoLogin = (sender: any) => {
        let savePwd = !this.state.savePwd;
        this.state.client.set('savePwd', savePwd);
        this.state.client.set('autoLogin', savePwd);
        this.setState({
            savePwd
        })
    }

    changeSvaePwd = (sender: any) => {
        let savePwd = !this.state.savePwd;
        this.state.client.set('savePwd', savePwd);
        this.setState({
            savePwd
        })
    }

    getVerify() {
        if (this.state.showVerify) {
            if (this.isPhone) {
                return (
                    <div className="inputGroup verify">
                        <DBEdit dataField='verifyCode_' dataRow={this.props.dataRow} placeholder='验证码'></DBEdit>
                        <div onClick={this.sendCode.bind(this)} id="sendCode">发送验证码</div>
                    </div>
                )
            } else {
                return (
                    <p className="keyInput verify">
                        <img src="images/verify.png" />
                        <DBEdit dataField='verifyCode_' dataRow={this.props.dataRow} placeholder='验证码'></DBEdit>
                        <div onClick={this.sendCode.bind(this)} id="sendCode">发送验证码</div>
                    </p>
                )
            }
        }
    }

    async sendCode() {
        if (this.state.hasSendCode)
            return;
        this.props.dataRow.setValue('verifyCode', '??????');
        this.setState({
            hasSendCode: true
        })
        let sendBtn = document.getElementById('sendCode') as HTMLDivElement;
        this.setState({ showLoad: true })
        let dataSet = await this.getService();
        this.setState({ showLoad: false })
        let timeOut = 360;
        showMsg(dataSet.message)
        if (dataSet.state > 0) {
            sendBtn.innerHTML = `发送验证码(${timeOut}s)`;
            this.setState({
                timer: setInterval(() => {
                    sendBtn.innerHTML = `发送验证码(${--timeOut}s)`;
                    if (timeOut <= 0) {
                        sendBtn.innerHTML = `发送验证码`;
                        clearInterval(this.state.timer);
                        this.setState({
                            hasSendCode: false
                        })
                    };
                }, 1000)
            })
        }
    }

    getLoad() {
        if (this.state.showLoad) {
            return (
                <div id='load'>
                    <div className="loadContent">
                        <span className="loadSvg">
                            <svg viewBox="25 25 50 50">
                                <circle cx="50" cy="50" r="20" fill="none"></circle>
                            </svg>
                        </span>
                        <span className="loadMessage">加载中...</span>
                    </div>
                </div>
            )
        }
    }

    onSubmit(sender?: any) {
        if (sender)
            sender.preventDefault();
        if (!this.props.dataRow.getString('userCode') || !this.props.dataRow.getString('password')) {
            this.setState({
                message: '请输入正确的帐号和密码'
            })
            return;
        }
        let ds1 = new DataSet();
        if (this.state.client.get('Accounts'))
            ds1.setJson(this.state.client.get('Accounts'))
        let account = this.props.dataRow.getString('userCode');
        if (account) {
            if (!ds1.locate("account", account)) {
                ds1.append();
                ds1.setValue("account", account);
            }
            if (this.props.dataRow.getString('password') || this.isPhone) {
                ds1.setValue("password", this.props.dataRow.getString('password'));
            }
            this.state.client.set("Accounts", ds1.json);
        }
        if (this.props.verify && !this.props.verify())
            return;
        this.postData();
    }

    async postData() {
        this.props.dataRow.setValue('verifyCode', this.props.dataRow.getValue('verifyCode_'));
        this.setState({ showLoad: true })
        let dataOut = await this.getService();
        if (dataOut.state > 0) {
            let href = location.protocol + '//' + location.host + '/public/WebDefault?sid=' + dataOut.head.getString('token') + '&CLIENTID=' + this.props.dataRow.getString('clientId');
            this.state.client.set('Account1', this.props.dataRow.getString('userCode'));
            this.state.client.set('password', this.props.dataRow.getString('password'));
            location.href = href;
        } else {
            this.setState({ showLoad: false })
            if (dataOut.head.getValue('status') == -8) {
                this.props.dataRow.setValue('verifyCode', '??????');
                this.setState({
                    showVerify: true,
                    message: ''
                })
            } else {
                this.setState({
                    message: dataOut.message
                })
            }
        }
    }

    async getService(): Promise<DataSet> {
        let service = new QueryService(this.props);
        service.setService('SvrUserLogin.getToken');
        service.dataIn.head.copyValues(this.props.dataRow.current)
        let dataOut: DataSet = await service.open().catch(e => e);
        return dataOut;
    }
}

type FrmLoginTypeProps = {
    language?: string,
    lowVersion?: boolean
}

type FrmLoginTypeState = {
    dataIn: DataRow,
    client: any,
    message: string,
    protocol: boolean,
}

export default class FrmLogin extends WebControl<FrmLoginTypeProps, FrmLoginTypeState> {
    constructor(props: FrmLoginTypeProps) {
        super(props);
        let client = new ClientStorage('ErpKey');
        let dataIn = new DataRow();
        dataIn.setValue('languageId', this.props.language);
        dataIn.setValue('userCode', client.get('Account1') || '');
        dataIn.setValue('password', client.get("savePwd") == 'true' ? client.get('password') : '');
        let protocol = client.get("protocol") == 'true' ? true : false;
        this.state = {
            client,
            dataIn,
            protocol,
            message: ''
        }
    }

    render() {
        return <div className={styles.main}>{this.getPage()}</div>
    }

    getPage() {
        if (this.isPhone) {
            return (
                <React.Fragment>
                    <div className="logo_box">
                        <img src="images/login/login_phone_logo.png" />
                        <h3>地藤管家</h3>
                    </div>
                    <Login dataRow={this.state.dataIn} loginMsg={this.state.message} language={this.props.language || ''} lowVersion={this.props.lowVersion} verify={this.verify.bind(this)} key={new Date().getTime()} />
                    <section className="customService">
                        <div className="protocol_box">
                            <div className="protocol">
                                <input type="checkBox" name="protocol" id="protocol" checked={this.state.protocol} onChange={this.changeProtocol.bind(this)} />
                                <label htmlFor="protocol">我已同意<a href="user-agreement?back=WebDefault">《用户协议》</a>和<a href="privacy-right?back=WebDefault">《隐私协议》</a></label>
                            </div>
                        </div>
                        <h3>如有疑问请联系 <a href="TFrmContact" style={{ "color": "#FF9000" }}>客服中心</a></h3>
                    </section>

                    <div className="upt">
                        <div>
                            <img className="back_img" src="images/forgetPwd/关闭.png" />
                            <span className="forget_password">密码错误</span>
                            <div className="content"></div>
                            <div className="option">
                                <span className="true">确定</span>
                                <span className="forget">找回密码</span>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            const iFrame = '<div><script id="ebsgovicon" src="https://szcert.ebs.org.cn/govicons.js?id=ef20c85d-fe69-45d2-b75a-96d47073a89d&amp;width=112&amp;height=40&amp;type=2" type="text/javascript"></script></div>'
            return (
                <React.Fragment>
                    <div className="header">
                        <div className="head-login">
                            <img src="images/welcome/logo.png" />
                            <a href="install">下载应用</a>
                        </div>
                    </div>
                    <div className="login-main">
                        <img src="images/login/background.png" />
                        <div className="login_form_box">
                            <div className="login_title">地藤管家 您随身携带的大管家</div>
                            <div className="login_right">
                                <div className="login_title">欢迎使用地藤管家</div>
                                <Login dataRow={this.state.dataIn} loginMsg={this.state.message} lowVersion={this.props.lowVersion} language={this.props.language || ''} />
                            </div>
                        </div>
                    </div>
                    <footer id="status" style={{ 'clear': 'both', 'textAlign': 'center' }}>
                        <div className="foot-right">
                            &copy;
                            <a href="http://www.mimrc.com">
                                <small>深圳市华软资讯科技有限公司</small>
                            </a>
                            <div style={{ 'padding': '0.5em' }}>
                                <small><a href="http://beian.miit.gov.cn/">粤ICP备11098885号-3</a></small>
                            </div>
                        </div>
                        <div className="electronicFlag">
                            <iframe srcDoc={iFrame} className={styles.iframe}></iframe>
                        </div>
                    </footer>
                </React.Fragment>
            )
        }
    }

    verify(): boolean {
        if (!this.state.protocol && this.isPhone) {
            this.setState({
                message: '请先同意用户协议和隐私协议'
            })
            return false;
        } else
            return true;
    }

    changeProtocol = (sender: any) => {
        let protocol = !this.state.protocol;
        this.state.client.set('protocol', protocol);
        this.setState({
            protocol,
        })
    }

    componentDidMount(): void {
        this.getFlag();
        let device = this.state.client.get('device') || '';
        let clientId = ''
        if (!device) {
            let href = window.location.href;
            if (href.indexOf('?') > -1) {
                let params = href.split('?')[1].split('&');
                params.forEach((param) => {
                    let arr = param.split('=');
                    if (arr[0] == 'device')
                        device = arr[1]
                    if (arr[0] == 'CLIENTID')
                        clientId = arr[1]
                })
            }
        }
        if (!device) {
            device = this.isPhone ? 'phone' : 'pc';
        }
        this.state.client.set('device', device);
        this.state.dataIn.setValue('device', device);
        // 获取用户指纹
        if (!clientId)
            this.getFingerprient();
        else {
            this.state.dataIn.setValue('clientId', clientId);
            this.state.client.set('fingerprint', clientId);
        }

        // @ts-ignore
        setAppliedTitleStatus(false);
        $("body").css('height', $(document).height());
        // @ts-ignore
        window.addPhoneKeyBoardListener(function () {
            $(document).scrollTop($('.logo').outerHeight() - 20);
        }, function () {
            $(document).scrollTop(0);
        });
        $(window).on('resize', function () {
            $("body").css('height', $(document).height());
        });

        //@ts-ignore
        if (window.ApiCloud.isApiCloud()) {
            if (window.localStorage.getItem("alreadyLogin")) {
                window.localStorage.removeItem("alreadyLogin")
                //@ts-ignore
                apiready = function () {
                    //@ts-ignore
                    api.execScript({
                        script: "closeAllFrames();"
                    })
                    //@ts-ignore
                    api.execScript({
                        script: "hideHeader(true, 'main');"
                    })
                    //@ts-ignore
                    api.execScript({
                        script: "hideFooter();"
                    })
                }
            } else {
                //@ts-ignore
                apiready = function () {
                    //@ts-ignore
                    api.execScript({
                        script: "hideHeader(true, 'main');"
                    })
                    //@ts-ignore
                    api.execScript({
                        script: "hideFooter();"
                    })
                }
            }
        }
        if (!this.isPhone && location.href.indexOf('www.diteng.site') > -1) {
            let iframe = document.querySelector(`.${styles.iframe}`) as HTMLIFrameElement;
            let iWindow = iframe.contentWindow;
            iWindow.onload = function () {
                iWindow.document.body.setAttribute('style', 'margin: 0; padding: 0;height: 40px; overflow: hidden;');
                iframe.style.visibility = 'inherit';
            }
        }
    }

    async getFingerprient() {
        let fingerprient = this.state.client.get('fingerprint')
        if (!fingerprient) {
            Fingerprint2.get((components: any) => {
                let values = components.map((component: any, index: number) => {
                    if (index === 0) {
                        return component.value.replace(/\bNetType\/\w+\b/, '')
                    }
                    return component.value
                })
                fingerprient = 'b-' + Fingerprint2.x64hash128(values.join(''), 31);
                this.state.dataIn.setValue('clientId', fingerprient);
                this.state.client.set('fingerprint', fingerprient);
            });
        } else {
            this.state.dataIn.setValue('clientId', fingerprient);
        }
    }

    getFlag() {
        let flag = document.querySelector('.electronicFlag');
        if (flag && location.href.indexOf('www.diteng.site') > -1) {
            let script = document.createElement('script');
            script.id = 'ebsgovicon';
            script.type = 'text/javascript';
            script.src = 'https://szcert.ebs.org.cn/govicons.js?id=ef20c85d-fe69-45d2-b75a-96d47073a89d&width=112&height=40&type=2';
            flag.appendChild(script);
        }
    }
}