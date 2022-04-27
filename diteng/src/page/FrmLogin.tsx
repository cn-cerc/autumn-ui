import React from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import QueryService from "../db/QueryService";
import DBEdit from "../rcc/DBEdit";
import WebControl from "../rcc/WebControl";
import styles from "./FrmLogin.css";
import { showMsg } from "./Summer";
import Fingerprint2 from "fingerprintjs2";
import { ClientStorage } from "../db/Utils";
import { Loading } from "../db/Loading";

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
    hasSendCode: boolean,
    showLoad: boolean,
    timer: any,
    currentIndex: number,
    isFirefox: boolean
}

var showVerify: boolean = false;

export class Login extends WebControl<LoginTypeProps, LoginTypeState> {
    constructor(props: LoginTypeProps) {
        super(props);
        let client = new ClientStorage('ErpKey');
        let accountData = new DataSet();
        let savePwd = client.get("savePwd") == 'true' ? true : false;
        if (client.get('Accounts'))
            accountData.setJson(client.get('Accounts'));
        let isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
        let _password = this.getCompletePassword(this.props.dataRow.getString('password'));
        this.props.dataRow.setValue('_password', _password);
        if (isFirefox)
            this.props.dataRow.setValue
        this.state = {
            showAccountList: false,
            accountData,
            client,
            savePwd,
            hasSendCode: false,
            showLoad: false,
            timer: null,
            message: this.props.loginMsg || '',
            currentIndex: 0,
            isFirefox
        }
    }
    render() {
        if (this.isPhone) {
            return (
                <React.Fragment>
                    <form method="post" className={styles.mainBox} onSubmit={this.onSubmit.bind(this)}>
                        <div className={`${styles.inputGroup} ${styles.userName}`}>
                            <DBEdit dataField="userCode" dataRow={this.props.dataRow} placeholder="手机号码或地藤帐号" autoComplete='off' onChanged={this.changeUserCode.bind(this)}></DBEdit>
                            <span className={this.state.showAccountList ? `${styles.chooseUser} ${styles.showList}` : styles.chooseUser} onClick={this.chooseUser.bind(this)}></span>
                            {this.getChooseList()}
                        </div>
                        <div className={`${styles.inputGroup} ${styles.passWord}`}>
                            <DBEdit dataField='password' type='password' dataRow={this.props.dataRow} placeholder='登录密码'></DBEdit>
                        </div>
                        {this.getVerify()}
                        <div className={styles.operationLogin}>
                            <input type="checkbox" id="savePwd" checked={this.state.savePwd} onChange={this.changeAutoLogin.bind(this)} /><label htmlFor="savePwd">自动登录</label>
                            <a href="FrmForgetPassword" style={{ "float": "right", "color": "red" }}>找回密码</a>
                        </div>
                        <div id="loginMsg" className={styles.loginMsg} style={{ "color": "red", "textAlign": "center", "paddingBottom": ".5em" }}>{this.getMessage()}</div>
                        <button className={styles.btnSubmit} onClick={this.onSubmit.bind(this)}>登录</button>
                    </form>
                    {this.getLoad()}
                </React.Fragment>
            )
        } else {
            return (
                <form id="login_form" className={styles.uiForm} method="post" onSubmit={this.onSubmit.bind(this)}>
                    <div className={styles.formTitle}>地藤登录页</div>
                    <div className={styles.contentRight}>
                        <div className={styles.userMessage}>
                            <p className={styles.keyInput}>
                                <img src="images/login/account.png" />
                                <DBEdit dataField="userCode" dataRow={this.props.dataRow} placeholder="手机号码或地藤帐号" autoComplete='off' autoFocus onChanged={this.changeUserCode.bind(this)}></DBEdit>
                                <span className={this.state.showAccountList ? `${styles.chooseUser} ${styles.showList}` : styles.chooseUser} onClick={this.chooseUser.bind(this)}></span>
                                {this.getChooseList()}
                            </p>
                            <p className={styles.keyInput}>
                                <img src="images/login/password.png" />
                                {this.getPasswordInput()}
                            </p>
                            {this.getVerify()}
                            <p className={styles.remember}>
                                <input id="savePwd" type="checkbox" checked={this.state.savePwd} onChange={this.changeSvaePwd.bind(this)} />
                                <label htmlFor="savePwd">记住密码（私人电脑可选择此项）</label>
                            </p>
                        </div>
                        <div className={styles.userStatus}>
                            <span>
                                {this.getLoginBtn()}
                            </span>
                        </div>
                        <div className={styles.bottom}>
                            <a href="FrmForgetPassword" className={styles.afterRight}>找回密码</a>
                            <a href="TFrmContact" className={styles.afterRight}>客服中心</a>
                            <a href="TFrmHardware" className={styles.afterRight}>硬件配置</a>
                            <a href="https://www.mimrc.com">公司介绍</a>
                        </div>
                        <div id="loginMsg" className={styles.loginMsg}>{this.getMessage()}</div>
                    </div>
                </form>
            )
        }
    }

    getCompletePassword(password: string) {
        let _password = '';
        for (let i = 0; i < password.length; i++) {
            _password += '●'
        }
        return _password;
    }

    getPasswordInput() {
        if (this.state.isFirefox) {
            return <DBEdit dataField='_password' dataRow={this.props.dataRow} autoComplete="new-password" placeholder='登录密码' className={styles.passwordInput} onChanged={this.fireFoxChange.bind(this)} onKeyDown={this.fireFoxKeyDown.bind(this)}></DBEdit>
        } else {
            return <DBEdit dataField='password' type='password' dataRow={this.props.dataRow} autoComplete="new-password" placeholder='登录密码' onKeyDown={this.passWordKeyDown.bind(this)}></DBEdit>
        }
    }

    // 阻止chrome中自动记忆密码弹窗弹出逻辑
    passWordKeyDown(sender: any) {
        let passwordInput = document.querySelector('#password') as HTMLInputElement;
        let selectStart = passwordInput.selectionStart;
        let selectionEnd = passwordInput.selectionEnd;
        let oldPassword = this.props.dataRow.getString('password');
        let newPassword = oldPassword;
        let keyCode: number = sender.keyCode;
        let preventDefault: boolean = true;
        let _selectStart = selectStart;
        let _selectionEnd = selectionEnd;
        let currentIndex = this.state.currentIndex;
        if (keyCode == 8) { // 删除键
            let endIndex = selectStart;
            if (selectStart == selectionEnd && selectStart > 0)
                endIndex = selectStart - 1;
            newPassword = oldPassword.slice(0, endIndex) + oldPassword.slice(selectionEnd);
            _selectStart = endIndex;
            currentIndex = endIndex;
        } else if (keyCode == 37) { // ←
            if (selectStart > 0) {
                if (sender.shiftKey) {
                    if (currentIndex > selectStart) {
                        _selectionEnd = selectionEnd - 1;
                        currentIndex = selectionEnd - 1;
                    } else {
                        _selectionEnd = selectionEnd;
                        _selectStart = selectStart - 1;
                        currentIndex = selectStart - 1;
                    }
                } else {
                    if (selectStart == selectionEnd) {
                        _selectStart = selectStart - 1;
                        _selectionEnd = selectStart - 1;
                        currentIndex = selectStart - 1;
                    } else {
                        _selectStart = selectStart;
                        _selectionEnd = selectStart;
                        currentIndex = selectStart;
                    }
                }
            }
        } else if (keyCode == 39) { // →
            if (selectStart < oldPassword.length) {
                if (sender.shiftKey) {
                    if (currentIndex < selectionEnd) {
                        _selectStart = selectStart + 1;
                        currentIndex = selectStart + 1;
                    } else {
                        _selectStart = selectStart;
                        _selectionEnd = _selectionEnd + 1;
                        currentIndex = _selectionEnd + 1;
                    }
                } else {
                    if (selectStart == selectionEnd) {
                        _selectStart = selectStart + 1;
                        _selectionEnd = selectStart + 1;
                        currentIndex = selectStart + 1;
                    } else {
                        _selectStart = selectionEnd;
                        _selectionEnd = selectionEnd;
                        currentIndex = selectionEnd;
                    }
                }
            }
        } else if (keyCode == 65 && sender.ctrlKey) { // A
            _selectStart = 0;
            _selectionEnd = oldPassword.length;
        } else if (sender.key.length > 1) { // 阻止非英文、数字、字符输入
            return;
        } else if (sender.shiftKey) {
            preventDefault = false;
        } else if (keyCode == 88 && sender.ctrlKey) { // X
            newPassword = oldPassword;
        } else {
            newPassword = oldPassword.slice(0, selectStart) + sender.key + oldPassword.slice(selectionEnd);
            _selectStart = selectStart + 1;
            _selectionEnd = selectStart + 1;
            currentIndex = selectStart + 1;
        }
        if (preventDefault)
            sender.preventDefault();
        this.props.dataRow.setValue('password', newPassword);
        this.setState({
            currentIndex
        }, () => {
            passwordInput.selectionStart = _selectStart;
            passwordInput.selectionEnd = _selectionEnd;
        });
    }

    fireFoxKeyDown(sender: any) {
        let preventDefault = false;
        let _password = this.props.dataRow.getString('_password');
        let passwordInput = document.querySelector('#_password') as HTMLInputElement;
        let selectStart = passwordInput.selectionStart;
        let selectionEnd = passwordInput.selectionEnd;
        let _selectStart = selectStart;
        let _selectionEnd = selectionEnd;
        if (sender.keyCode == 65 && sender.ctrlKey) {
            _selectStart = 0;
            _selectionEnd = _password.length
        }
        if (preventDefault)
            sender.preventDefault();
        this.setState(this.state, () => {
            passwordInput.selectionStart = _selectStart;
            passwordInput.selectionEnd = _selectionEnd;
        })
    }

    fireFoxChange(sender: any) {
        let _password = this.props.dataRow.getString('_password');
        this.props.dataRow.setValue('_password', this.getCompletePassword(_password));
        let password = this.props.dataRow.getString('password');
        let passwordInput = document.querySelector('#_password') as HTMLInputElement;
        let selectStart = passwordInput.selectionStart;
        let char = _password.replace(/●/g, '');
        if (_password.length > password.length) {
            let index = _password.indexOf(char);
            if (index >= password.length) {
                password += char;
            } else {
                password = password.slice(0, index) + char + password.slice(index);
            }
        } else {
            if (char) {
                let index = _password.indexOf(char);
                password = password.slice(0, selectStart - 1) + char + password.slice(index + 1, _password.length);
            } else {
                password = password.slice(0, selectStart) + password.slice(selectStart + 1);
            }
        }
        this.props.dataRow.setValue('password', password);
        this.setState(this.state, () => {
            passwordInput.selectionStart = selectStart;
            passwordInput.selectionEnd = selectStart;
        })
    }

    componentWillMount() {
        let device = '';
        let clientId = ''
        let href = window.location.href;
        if (href.indexOf('device') > -1) {
            let params = href.split('?')[1].split('&');
            params.forEach((param) => {
                let arr = param.split('=');
                if (arr[0] == 'device')
                    device = arr[1]
                if (arr[0] == 'CLIENTID')
                    clientId = arr[1]
            })
        }
        if (!device)
            device = this.state.client.get('device') || ''
        if (!device)
            device = this.isPhone ? 'phone' : 'pc';
        this.state.client.set('device', device);
        this.props.dataRow.setValue('device', device);
        // 获取用户指纹
        //@ts-ignore
        if (window.ApiCloud.isApiCloud() || !clientId) {
            this.getFingerprient();
        } else {
            this.props.dataRow.setValue('clientId', clientId);
            this.state.client.set('fingerprint', clientId);
        }
        // @ts-ignore
        setAppliedTitleStatus(false);
        $("body").css('height', $(document).height());
        // @ts-ignore
        window.addPhoneKeyBoardListener(function () {
            // $(document).scrollTop($('.logo').outerHeight() - 20);
            $(document).scrollTop(0);
        }, function () {
            $(document).scrollTop(0);
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

        if (this.state.client.get('autoLogin') == 'true' && !this.props.loginMsg && this.props.dataRow.getString('password') && this.isPhone) {
            this.setState({ showLoad: true })
            this.onSubmit();
        }
    }

    async getFingerprient() {
        let fingerprient
        //@ts-ignore
        if (window.ApiCloud.isApiCloud()) {
            let href = window.location.href;
            if (href.indexOf('?') > -1) {
                let params = href.split('?')[1].split('&');
                params.forEach((param) => {
                    let arr = param.split('=');
                    if (arr[0] == 'CLIENTID')
                        fingerprient = arr[1]
                })
            }
        } else {
            fingerprient = this.state.client.get('fingerprint');
        }
        if (!fingerprient) {
            Fingerprint2.get((components: any) => {
                let values = components.map((component: any, index: number) => {
                    if (index === 0) {
                        return component.value.replace(/\bNetType\/\w+\b/, '')
                    }
                    return component.value
                })
                fingerprient = 'b-' + Fingerprint2.x64hash128(values.join(''), 31);
                this.props.dataRow.setValue('clientId', fingerprient);
                this.state.client.set('fingerprint', fingerprient);
            });
        } else {
            this.props.dataRow.setValue('clientId', fingerprient);
        }
    }

    getMessage() {
        if (this.props.lowVersion) {
            return <a href='FrmBrowserRecommend' target='_blank' style={{ 'color': '#ff4545' }}>你的浏览器版本太低，请使用推荐的浏览器</a>
        } else
            return <span dangerouslySetInnerHTML={{ __html: this.state.message }}></span>;;
    }

    changeUserCode = (sender: any) => {
        showVerify = false;
        if (this.props.dataRow.getValue('verifyCode_'))
            this.props.dataRow.setValue('verifyCode_', '');
        this.setState({
            showAccountList: false,
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
                        <i className={styles.remove} onClick={this.chooseListRemove.bind(this, dataSet.current)}></i>
                    </li>
                )
            }
            return (
                <ul className={styles.userList}>{accountList}</ul>
            )
        }
    }

    setAccount(row: DataRow) {
        let password = row.getString('password');
        this.props.dataRow.setValue('userCode', row.getString('account'));
        this.props.dataRow.setValue('password', password);
        if (this.state.isFirefox)
            this.props.dataRow.setValue('_password', this.getCompletePassword(row.getString('password')));
        this.props.dataRow.setValue('verifyCode_', '');
        showVerify = false;
        let savePwd = this.state.savePwd;
        if (!this.isPhone)
            savePwd = password ? true : false;
        this.setState({
            showAccountList: false,
            hasSendCode: false,
            timer: null,
            savePwd
        })

    }

    chooseListRemove(row: DataRow) {
        if (this.state.accountData.locate('account', row.getString('account'))) {
            this.state.accountData.delete();
            this.state.client.set('Accounts', this.state.accountData.json);
        }
        showVerify = false;
        this.setState({
            showAccountList: false
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
        if (showVerify) {
            if (this.isPhone) {
                return (
                    <div className={`${styles.inputGroup} ${styles.verify}`}>
                        <DBEdit dataField='verifyCode_' dataRow={this.props.dataRow} placeholder='验证码'></DBEdit>
                        <div onClick={this.sendCode.bind(this)} className={styles.sendCode}>发送验证码</div>
                    </div>
                )
            } else {
                return (
                    <p className={`${styles.keyInput} ${styles.verify}`}>
                        <img src="images/verify.png" />
                        <DBEdit dataField='verifyCode_' dataRow={this.props.dataRow} placeholder='验证码'></DBEdit>
                        <div onClick={this.sendCode.bind(this)} className={styles.sendCode}>发送验证码</div>
                    </p>
                )
            }
        }
    }

    getLoginBtn() {
        if (this.state.showLoad) {
            return <div className={styles.pcLoad}>
                <Loading></Loading>
            </div>
        } else {
            return <button onClick={this.onSubmit.bind(this)} style={{ 'cursor': 'pointer' }}>进入系统</button>
        }
    }

    async sendCode() {
        if (this.state.hasSendCode)
            return;
        this.props.dataRow.setValue('verifyCode', '??????');
        this.setState({
            hasSendCode: true
        })
        let sendBtn = document.querySelector(`.${styles.sendCode}`) as HTMLDivElement;
        if (this.isPhone) this.setState({ showLoad: true });
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
            return <Loading></Loading>
        }
    }

    onSubmit(sender?: any) {
        if (sender)
            sender.preventDefault();
        if (this.state.showLoad)
            return;
        if (this.props.verify && !this.props.verify())
            return;
        if (!this.props.dataRow.getString('userCode') || !this.props.dataRow.getString('password')) {
            this.setState({
                message: '请输入正确的帐号和密码',
                showLoad: false
            })
            return;
        }
        if (showVerify && !this.props.dataRow.getBoolean('verifyCode_')) {
            this.setState({
                message: '请输入验证码',
                showLoad: false
            })
            return;
        }
        this.postData();
    }

    async postData() {
        this.props.dataRow.setValue('verifyCode', this.props.dataRow.getValue('verifyCode_'));
        this.setState({ showLoad: true, message: '' })
        let dataOut = await this.getService();
        if (dataOut.state > 0) {
            let ds1 = new DataSet();
            if (this.state.client.get('Accounts'))
                ds1.setJson(this.state.client.get('Accounts'))
            let account = this.props.dataRow.getString('userCode');
            if (account) {
                if (!ds1.locate("account", account)) {
                    ds1.append();
                    ds1.setValue("account", account);
                }
                if (this.isPhone || this.state.savePwd)
                    ds1.setValue("password", this.props.dataRow.getString('password'));
                else
                    ds1.setValue("password", '');
                this.state.client.set("Accounts", ds1.json);
            }
            let href = location.protocol + '//' + location.host + '/public/WebDefault?sid=' + dataOut.head.getString('token') + '&CLIENTID=' + this.props.dataRow.getString('clientId') + '&device=' + this.state.client.get('device');
            this.state.client.set('Account1', this.props.dataRow.getString('userCode'));
            this.state.client.set('password', this.props.dataRow.getString('password'));
            location.href = href;
        } else {
            this.setState({ showLoad: false })
            if (dataOut.head.getValue('status') == -8) {
                this.props.dataRow.setValue('verifyCode', '??????');
                showVerify = true
                this.setState({
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
    lowVersion?: boolean,
    loginCenter: string
}

type FrmLoginTypeState = {
    dataIn: DataRow,
    client: any,
    message: string,
    protocol: boolean,
    isPhoneWeb: boolean
}

export default class FrmLogin extends WebControl<FrmLoginTypeProps, FrmLoginTypeState> {
    constructor(props: FrmLoginTypeProps) {
        super(props);
        let isPhoneWeb = false;
        //@ts-ignore
        if (this.isPhone && !window.ApiCloud.isApiCloud()) {
            isPhoneWeb = true;
        }
        let client = new ClientStorage('ErpKey');
        let dataIn = new DataRow();
        dataIn.setValue('languageId', this.props.language);
        dataIn.setValue('userCode', client.get('Account1') || '');
        dataIn.setValue('password', client.get("savePwd") == 'true' ? client.get('password') || '' : '');
        let protocol = client.get("protocol") == 'true' ? true : false;
        this.state = {
            client,
            dataIn,
            protocol,
            message: '',
            isPhoneWeb
        }
    }

    render() {
        if (!this.state.isPhoneWeb) {
            return <div className={styles.page}><div className={styles.main}>{this.getPage()}</div></div>
        } else {
            return <React.Fragment></React.Fragment>
        }
    }

    getPage() {
        if (this.isPhone) {
            return (
                <React.Fragment>
                    <div className={styles.logoBox}>
                        <img src="images/login/login_phone_logo.png" />
                        <h3>地藤管家</h3>
                    </div>
                    <Login dataRow={this.state.dataIn} loginMsg={this.state.message} language={this.props.language || ''} lowVersion={this.props.lowVersion} verify={this.verify.bind(this)} key={new Date().getTime()} />
                    <section className={styles.customService}>
                        <div className={styles.protocolBox}>
                            <div className={styles.protocol}>
                                <input type="checkBox" name="protocol" id="protocol" checked={this.state.protocol} onChange={this.changeProtocol.bind(this)} />
                                <label htmlFor="protocol">我已同意<a href="user-agreement?back=WebDefault">《用户协议》</a>和<a href="privacy-right?back=WebDefault">《隐私协议》</a></label>
                            </div>
                        </div>
                        <h3>如有疑问请联系 <a href="TFrmContact" style={{ "color": "#FF9000" }}>客服中心</a></h3>
                    </section>

                    <div className={styles.upt}>
                        <div>
                            <img className={styles.backImg} src="images/forgetPwd/关闭.png" />
                            <span className={styles.forgetPassword}>密码错误</span>
                            <div className={styles.content}></div>
                            <div className={styles.option}>
                                <span className={styles.true}>确定</span>
                                <span className={styles.forget}>找回密码</span>
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
                        <div className={styles.headLogin}>
                            <img src="images/welcome/logo.png" />
                            <a href="install">下载应用</a>
                        </div>
                    </div>
                    <div className={styles.loginMain}>
                        <img src="images/login/background.png" />
                        <div className={styles.loginFormBox}>
                            <div className={styles.loginTitle}>地藤管家 您随身携带的大管家</div>
                            <div className="login_right">
                                <div className={styles.loginTitle}>欢迎使用地藤管家</div>
                                <Login dataRow={this.state.dataIn} loginMsg={this.state.message} lowVersion={this.props.lowVersion} language={this.props.language || ''} />
                            </div>
                        </div>
                    </div>
                    <footer className={styles.status} style={{ 'clear': 'both', 'textAlign': 'center' }}>
                        <div className={styles.footRight}>
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
        let head = this.props.loginCenter;
        if (!head || head.indexOf(location.origin) > -1)
            head = location.origin;
        else {
            location.href = head + location.pathname + location.search;
            return;
        }
        if (this.state.isPhoneWeb)
            window.location.href = 'install?device=phone';
        if (!this.isPhone) {
            try {
                if (location.href.indexOf('www.diteng.site') > -1) {
                    let iframe = document.querySelector(`.${styles.iframe}`) as HTMLIFrameElement;
                    let iWindow = iframe.contentWindow;
                    iWindow.onload = function () {
                        iWindow.document.body.setAttribute('style', 'margin: 0; padding: 0;height: 40px; overflow: hidden;');
                        iframe.style.visibility = 'inherit';
                    }
                } else {
                    let dom = document.querySelector('.electronicFlag');
                    dom.remove();
                }
            } catch (error) {
                console.log(error.message);
            }
        }
    }
}