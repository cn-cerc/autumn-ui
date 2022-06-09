import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
import PageApi from "./PageApi";

type FrmMessageTypeProps = {
    fromUser?: string,
    userCode: string,
    userName: string
}

type FrmMessageTypeState = {
    timing: number,
    contactData: DataSet,
    messageData: DataSet,
    currentContact: number,
    contactName: string,
    contactDate: string,
    fromUser: string,
    messageText: string,
    showMessage: boolean,
    sendText: string,
    remarkText:string
}

export default class FrmMessage extends WebControl<FrmMessageTypeProps, FrmMessageTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageTypeProps) {
        super(props);
        let fromUser = this.props.fromUser || null;
        let showMessage = this.isPhone ? false : true;

        this.state = {
            timing: 5,
            contactData: new DataSet(),     //联系人DataSet
            messageData: new DataSet(),     //消息列表DataSet
            currentContact: this.isPhone ? -1 : 0,      //当前选中的联系人下标
            contactName: '',        //当前选中的联系人名称
            contactDate: '',        //当前选中人消息查询的日期
            fromUser,       //当前选中的联系人Code字段
            messageText: '',        //当前输入的消息
            showMessage,        //是否展示消息列表
            sendText:'', //发送的消息
            remarkText:'',
        }
    }

    componentDidMount(): void {
        this.initData();
        this.startTimer();
    }

    componentWillUnmount(): void {
        this.removeTimer();
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getContactList()}
            {this.getMessageBox()}
            {this.getUserInfo()}
        </div>
    }

    async initData() {
        await this.getContactData();
        let ds = new DataSet();
        ds.appendDataSet(this.state.contactData);
        ds.first();
        let fromUser = ds.getString('FromUser_');
        let date = ds.getString('LatestDate_');
        let contactName = ds.getString('Name_');
        if (!this.isPhone)
            this.getMessageData(fromUser, date, contactName, 0);
    }

    async getContactData() {
        let contactData = await PageApi.getContactList();
        this.setState({
            contactData
        })
    }

    async getMessageData(fromUser: string, date: string, name: string, num: number) {
        let row = new DataRow();
        row.setValue('FromUser_', fromUser).setValue('Date_', date);
        let messageData = await PageApi.getMessageDetails(row);
        this.setState({
            currentContact: num,
            messageData,
            contactName: name,
            fromUser: fromUser,
            contactDate: date
        },()=>{
            this.getUserRemarkFun();
        });
        this.scrollBottom();
    }

    getContactList() {
        if (!this.isPhone || !this.state.showMessage) {
            let list = [];
            let ds = new DataSet();
            ds.appendDataSet(this.state.contactData);
            ds.first();
            while (ds.fetch()) {
                let name = ds.getString('Name_') || '系统消息';
                let date, hour, minut: string | number, timeText: string = '';
                if (ds.getString('LatestDate_')) {
                    date = new Date(ds.getString('LatestDate_'));
                    hour = date.getHours();
                    minut = date.getMinutes();
                    if (minut < 10) minut = '0' + minut;
                    timeText = `${hour}:${minut}`;
                }
                let num = ds.recNo - 1;
                let UnRead = ds.getDouble('UnReadNum_') > 99 ? 99 : ds.getDouble('UnReadNum_');
                list.push(<li key={ds.recNo} className={num == this.state.currentContact ? styles.selectContact : ''} onClick={this.handleClick.bind(this, ds.getString('FromUser_'), ds.getString('LatestDate_'), name, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        <span className={styles.UnReadNum}>{UnRead}</span>
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                            <span>{timeText}</span>
                        </div>
                        <div>{ds.getString('LatestMessage_')}</div>
                    </div>
                </li>);
            }
            return <ul className={styles.contactList}>{list}</ul>
        }
    }

    getMessageBox() {
        if (this.state.showMessage) {
            return <div className={styles.messageBox}>
                <div className={styles.messageTitle}>
                    <span>{this.state.contactName}</span>
                </div>
                {this.getMessageList()}
                <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                    <textarea value={this.state.messageText} onChange={(e) => {
                        this.setState({
                            messageText: e.target.value,
                            sendText : e.target.value
                        })
                    }}></textarea>
                    <div>
                        <button className={this.state.fromUser ? '' : styles.disEvents}>发送(S)</button>
                    </div>
                </form>
            </div>
        }
    }

    getUserInfo() {
        if (!this.isPhone) {
            return <div className={styles.rightBox}>
                <div className={styles.suerInfoBox}>
                    <p className={styles.rightBoxTitle}>对方资料</p>
                    <div>
                        {this.getUserInfoList()}
                    </div>
                </div>
                <div className={styles.quicReply}>
                    <p className={styles.rightBoxTitle}>
                        快速回复
                        <span className={styles.editBtn}>编辑</span>
                    </p>
                    <div>
                        {this.getQuicReplyList()}
                    </div>
                </div>
            </div>
        }
    }

    getUserInfoList() {

        //循环获取用户信息并拼接到ul

        return <ul>
            <li className={styles.userInfoItem}><span>{this.state.contactName}</span></li>
            <li className={styles.userInfoItem}>所属角色：<span>经理</span></li>
            <li className={styles.userInfoItem}>联系方式：<span>13266813644</span></li>
            <li className={styles.remarkBox}>
                <p><span>备注</span><button onClick={this.setUserRemarkFun.bind(this)}>保存</button></p>
                <div>
                    <textarea className={styles.remarkClass} placeholder="请输入备注" value={this.state.remarkText} onChange={(e) => {
                        this.setState({
                            remarkText: e.target.value
                        })
                    }}></textarea>
                </div>
            </li>
        </ul>
    }
    getQuicReplyList() {
        return <ul>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>收到！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>谢谢！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>等等马上到！</li>
            <li className={styles.quicReplyItem} onClick={(e) => this.quicReplySend(e)}>快点吧，我等到花儿都谢了！</li>
        </ul>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false;
            let name = this.state.contactName;
            if (ds.getString('FromUser_') == this.props.userCode) { //判定是否是自己发出的消息
                siteR = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            let mvClass = ds.getString('MVClass_'); //消息类别
            list.push(<li key={ds.recNo} className={styles.messageLeft}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                <DefaultMessage row={ds.current} code='Content_' name={name} hideName={false} siteR={siteR} systemMsg={systemMsg} msgStatus={ds.getString('Status_')} mvClass={mvClass}></DefaultMessage>
            </li>)

        }
        return <ul className={styles.messageList}>{list}</ul>
    }

    handleClick(fromUser: string, date: string, name: string, num: number) {
        this.setState({
            remarkText:''
        })
        if (!this.isPhone)
            this.getMessageData(fromUser, date, name, num);
        else {
            location.href = `./FrmNewMessage.details?fromUser=${fromUser}&date=${date}&name=${name}`
        }

    }

    startTimer() {
        this.timer = setInterval(() => {
            this.getMessageData(this.state.fromUser, this.state.contactDate, this.state.contactName, this.state.currentContact);
        }, this.state.timing * 1000)
    }

    removeTimer() {
        clearInterval(this.timer);
    }

    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    async handleSubmit(e: any) {
        e.preventDefault();
        let row = new DataRow();
        row.setValue('ToUser_', this.state.fromUser).setValue('Content_', this.state.sendText);
        let dataOut = await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
            sendText:'',
        })
        this.getMessageData(this.state.fromUser, this.state.contactDate, this.state.contactName, this.state.currentContact);
        this.getContactData();
    }

    scrollBottom() {
        var el = document.getElementsByClassName(styles.messageList)[0];
        //@ts-ignore
        el.scrollTop = el.scrollHeight;
    }

    quicReplySend(e: any) {
        this.setState({
            sendText: e.target.innerText
        }, () => {
            this.handleSubmit(e);
        })
    }

    async setUserRemarkFun(){
        let row = new DataRow();
        row.setValue('corp_no_', '目前不知道').setValue('UserCode_', this.state.fromUser)
        .setValue('from_user_', this.props.userCode).setValue('Remark_', this.state.remarkText);
        let dataOut = await PageApi.setUserRemark(row);
    }

    async getUserRemarkFun(){
        let row = new DataRow();
        row.setValue('UserCode_', this.state.fromUser)
        let dataOut = await PageApi.getUserRemark(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        while (ds.fetch()) {
            if(ds.getString('remark_')){
                this.setState({
                    remarkText:ds.getString('remark_')
                })
            }
        }
    }
}