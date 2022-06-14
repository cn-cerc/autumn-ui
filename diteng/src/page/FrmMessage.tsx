import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import DefaultMessage from "./DefaultMessage";
import ExportMessage from "./ExportMessage";
import styles from "./FrmMessage.css";
import NoticeMessage from "./NoticeMessage";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import TaskMessage from "./TaskMessage";

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
    remarkText: string,
    remarkText_: string
    quicReplyList: Array<{ text: string, uid: string }>
    quicReplyEditFlag: boolean,
    HistoricalRecordsDay: number,
    quicReplyItemIptText: string,
    msgTypeStuteFlag: boolean,
    scrollFlag: boolean,
    scrollHeightNub: number,
    HistoricalRecordsFlag: boolean,
    HistoricalRecordsList: DataSet,
    contactInfo: DataSet
}

export const timing = 5;

export default class FrmMessage extends WebControl<FrmMessageTypeProps, FrmMessageTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageTypeProps) {
        super(props);
        let fromUser = this.props.fromUser || null;
        let showMessage = this.isPhone ? false : true;
        let contactInfo = new DataSet();
        contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        this.state = {
            timing,
            contactData: new DataSet(),     //联系人DataSet
            messageData: new DataSet(),     //消息列表DataSet
            currentContact: this.isPhone ? -1 : 0,      //当前选中的联系人下标
            contactName: '',        //当前选中的联系人名称
            contactDate: '',        //当前选中人消息查询的日期
            fromUser,       //当前选中的联系人Code字段
            messageText: '',        //当前输入的消息
            showMessage,        //是否展示消息列表
            sendText: '',    //发送的消息
            remarkText_: '',        //默认备注字段，用来判断备注是否有修改
            remarkText: '',     //备注字段
            quicReplyList: [],   //保存获取的快捷回复list
            quicReplyEditFlag: false,    //是否展示快捷回复消息列表
            HistoricalRecordsDay: 1,     //获取前面第几天的数据
            quicReplyItemIptText: '',    //新增快捷回复
            msgTypeStuteFlag: true,      //切换所有消息和未读消息
            scrollFlag: true,    //标记是否需要将聊天区域自动滚动到底部
            scrollHeightNub: 0,  //记录最新高度
            HistoricalRecordsFlag: false,    //控制是否累加消息
            HistoricalRecordsList: new DataSet(),     //保存历史记录List
            contactInfo,     // 联系人资料
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
            {this.getUserInfo()}
            {this.getContactList()}
            {this.getMessageBox()}
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

        // var now = new Date();
        // var yyyy = now.getFullYear();
        // var m: any = now.getMonth() + 1;
        // var day: any = now.getDate();
        // if (m < 10) m = '0' + m;
        // if (day < 10) day = '0' + day;
        // date = yyyy + '-' + m + '-' + day;

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
        let messageData = new DataSet();
        let ds = await PageApi.getMessageDetails(row);
        messageData.appendDataSet(this.state.HistoricalRecordsList);
        messageData.appendDataSet(ds);
        this.setState({
            HistoricalRecordsFlag: false,
            currentContact: num,
            messageData,
            contactName: name,
            fromUser: fromUser,
            contactDate: date,
            remarkText: '',
            quicReplyItemIptText: ''
        }, () => {
            this.getUserRemarkFun();
            this.getQuicReplyListFun();
            this.fromDetailFun();
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
                let UnRead = 0;
                if (!this.state.msgTypeStuteFlag) {
                    UnRead = ds.getDouble('UnReadNum_') > 99 ? 99 : ds.getDouble('UnReadNum_');
                    if (UnRead == 0) {
                        continue;
                    }
                }
                list.push(<li key={ds.recNo} className={num == this.state.currentContact ? styles.selectContact : ''} onClick={this.handleClick.bind(this, ds.getString('FromUser_'), ds.getString('LatestDate_'), name, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        {UnRead ? <span className={styles.UnReadNum}>{UnRead}</span> : ''}
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                            <span>{timeText}</span>
                        </div>
                        <div>{ds.getString('LatestMessage_')}</div>
                    </div>
                </li>);
            }
            return <ul className={styles.contactList}>
                <li className={styles.msgTypeStatusBox} key="1-1">
                    <div><span className={this.state.msgTypeStuteFlag ? styles.msgTypeStute : ''} onClick={this.msgTypeStuteFun.bind(this)}>所有消息</span></div>
                    <div><span className={this.state.msgTypeStuteFlag ? '' : styles.msgTypeStute} onClick={this.msgTypeStuteFun.bind(this)}>未读消息</span></div>
                </li>
                {list}
            </ul>

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
                            sendText: e.target.value
                        })
                    }}></textarea>
                    <div>
                        <button className={this.state.fromUser && this.state.messageText != '' ? '' : styles.disEvents}>发送(S)</button>
                    </div>
                </form>
            </div>
        }
    }

    getUserInfo() {
        if (!this.isPhone) {
            return <div className={styles.nav}>
                <div className={styles.suerInfoBox}>
                    <div className={styles.title}>
                        <span>对方资料</span>
                    </div>
                    {this.getUserInfoList()}
                </div>
                <div className={styles.quicReply}>
                    <div className={styles.title}>
                        <span>快速回复</span>
                        <span className={styles.editBtn} onClick={this.quicReplyEdit.bind(this)}>{this.state.quicReplyEditFlag ? '完成' : '编辑'}</span>
                    </div>
                    {this.getQuicReplyList()}
                </div>
            </div>
        }
    }

    getUserInfoList() {
        //循环获取用户信息并拼接到ul
        return <ul>
            <li className={styles.userInfoItem}><span>{this.state.contactName}</span></li>
            <li className={styles.userInfoItem}>所属角色：<span>{this.state.contactInfo.getString('RoleName_')}</span></li>
            <li className={styles.userInfoItem}>联系方式：<span>{this.state.contactInfo.getString('Mobile_')}</span></li>
            <li className={styles.remarkBox}>
                <div>
                    <span>备注</span>
                    <span onClick={this.setUserRemarkFun.bind(this)} className={this.state.remarkText == this.state.remarkText_ ? styles.disEvents : styles.infoButton}>保存</span>
                </div>
                <textarea className={styles.remarkClass} placeholder="请输入备注" value={this.state.remarkText} onChange={(e) => {
                    this.setState({
                        remarkText: e.target.value
                    })
                }}></textarea>
            </li>
        </ul>
    }
    getQuicReplyList() {
        let datalist = this.state.quicReplyList;
        let list = datalist.map((obj) => {
            return <li className={styles.quicReplyItem} key={obj.uid}>
                <span onClick={(e) => this.quicReplySend(e)}>{obj.text}</span>
                {this.getDelete(obj)}
            </li>
        })
        if (this.state.quicReplyEditFlag) {
            list.push(
                <li key='new' className={styles.quicReplyNew}>
                    <textarea value={this.state.quicReplyItemIptText} onChange={(e) => {
                        this.setState({
                            quicReplyItemIptText: e.target.value
                        })
                    }} placeholder="请输入快捷回复内容..."></textarea>
                    <span className={this.state.quicReplyItemIptText == '' ? styles.disEvents : styles.infoButton} style={{ 'marginTop': '16px' }} onClick={this.addQuicReplyItemFun.bind(this)}>添加</span>
                </li>
            )
        }
        return <ul className={this.state.quicReplyEditFlag ? styles.editUlSkin : ''}>
            {list}
        </ul>
    }

    getDelete(obj: { text: string, uid: string }) {
        if (this.state.quicReplyEditFlag)
            return <span className={styles.delete} onClick={this.delQuicReplyItemFun.bind(this, obj.uid)}>删除</span>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false, msgStatus = ds.getString('Status_');
            let name = this.state.contactName;
            if (ds.getString('FromUser_') == this.props.userCode) { //判定是否是自己发出的消息
                siteR = true;
                name = this.props.userName;
            }
            if (ds.getString('FromUser_') == '') { //目前FromUser_ 为空则判定为系统消息
                systemMsg = true;
            }
            let mvClass = ds.getString('MVClass_'); //消息类别
            let messageName;
            switch (mvClass) {
                case 'MVNotice':
                    messageName = NoticeMessage;
                    break;
                case 'MVTask':
                    messageName = TaskMessage;
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                case 'MVExport':
                    messageName = ExportMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            let date = new Date(ds.getString('AppDate_'));
            let h: number | string = date.getHours();
            if (h < 10)
                h = '0' + h;
            let m: number | string = date.getMinutes();
            if (m < 10)
                m = '0' + m;
            let s: number | string = date.getSeconds();
            if (s < 10)
                s = '0' + s;
            list.push(<li key={ds.recNo}>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    hideName: false,
                    siteR,
                    time: `${h}:${m}:${s}`,
                    msgStatus
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e) => {
            this.scrollEventFun(e);
        }}><li key="10-1" className={styles.historicalRecordsBox}><span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>查看更多记录</span></li>{list}</ul>
    }

    handleClick(fromUser: string, date: string, name: string, num: number) {
        if (!this.isPhone)
            this.getMessageData(fromUser, date, name, num);
        else {
            this.setState({
                currentContact: num
            }, () => {
                location.href = `./FrmNewMessage.details?fromUser=${fromUser}&date=${date}&name=${name}`
            })
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
        if (this.state.sendText == '') return false;
        let row = new DataRow();
        row.setValue('ToUser_', this.state.fromUser).setValue('Content_', this.state.sendText);
        await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
            sendText: '',
            scrollFlag: true
        })
        this.getMessageData(this.state.fromUser, this.state.contactDate, this.state.contactName, this.state.currentContact);
        this.getContactData();
    }

    scrollBottom() {
        if (this.state.scrollFlag) {
            var el = document.getElementsByClassName(styles.messageList)[0];
            //@ts-ignore
            el.scrollTop = el.scrollHeight;
            this.setState({
                scrollHeightNub: el.scrollHeight
            })
        }
    }
    scrollEventFun(e: any) {
        let scrollHeight = e.target.scrollTop + e.target.offsetHeight;
        if (scrollHeight < this.state.scrollHeightNub) {
            this.setState({
                scrollFlag: false,
                scrollHeightNub: e.target.scrollHeight
            })
        } else {
            this.setState({
                scrollFlag: true,
                scrollHeightNub: e.target.scrollHeight
            })
        }
    }

    //快捷回复 发送
    quicReplySend(e: any) {
        if (this.state.quicReplyEditFlag)
            return
        this.setState({
            sendText: e.target.innerText
        }, () => {
            this.handleSubmit(e);
        })
    }

    //设置备注信息
    async setUserRemarkFun() {
        if(this.state.remarkText != this.state.remarkText_) {
            let row = new DataRow();
            row.setValue('UserCode_', this.state.fromUser).setValue('Remark_', this.state.remarkText);
            let dataOut = await PageApi.setUserRemark(row);
            if(dataOut.state < 0) {
                showMsg(dataOut.message);
            }
        }
    }

    //获取备注信息
    async getUserRemarkFun() {
        let row = new DataRow();
        row.setValue('UserCode_', this.state.fromUser)
        let dataOut = await PageApi.getUserRemark(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        while (ds.fetch()) {
            if (ds.getString('remark_')) {
                this.setState({
                    remarkText: ds.getString('remark_'),
                    remarkText_: ds.getString('remark_'),
                })
            }
        }
    }

    //获取快捷回复列表
    async getQuicReplyListFun() {
        let quicReplyList: Array<{ text: string, uid: string }> = [];
        let row = new DataRow();
        let dataOut = await PageApi.getQuickReplyList(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        while (ds.fetch()) {
            quicReplyList.push({ text: ds.getString('reply_content_'), uid: ds.getString('uid_') });
        }
        this.setState({
            quicReplyList
        })
    }

    //新增一条快捷回复
    async addQuicReplyItemFun() {
        let row = new DataRow();
        row.setValue('Content_', this.state.quicReplyItemIptText);
        await PageApi.setQuickReplyItem(row);
        this.setState({
            quicReplyItemIptText: ''
        }, () => {
            this.getQuicReplyListFun();
        })
    }
    //删除某条快捷回复
    async delQuicReplyItemFun(uid: string) {
        let row = new DataRow();
        row.setValue('UID_', uid);
        await PageApi.delQuickReplyItem(row);
    }
    //编辑快捷回复
    quicReplyEdit() {
        this.setState({
            quicReplyEditFlag: !this.state.quicReplyEditFlag
        })
    }
    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun() {
        let date: any;
        var nowTime = new Date().getTime() - (this.state.HistoricalRecordsDay * 24 * 60 * 60 * 1000);
        var now = new Date(nowTime);
        var yyyy = now.getFullYear();
        var m: any = now.getMonth() + 1;
        var day: any = now.getDate();
        if (m < 10) m = '0' + m;
        if (day < 10) day = '0' + day;
        date = yyyy + '-' + m + '-' + day;
        let row = new DataRow();
        let HistoricalRecordsList = new DataSet();
        row.setValue('FromUser_', this.state.fromUser).setValue('Date_', date);
        let messageData = await PageApi.getMessageDetails(row);
        HistoricalRecordsList.appendDataSet(messageData);
        HistoricalRecordsList.appendDataSet(this.state.HistoricalRecordsList);
        this.setState({
            HistoricalRecordsFlag: true,
            HistoricalRecordsList,
            HistoricalRecordsDay: this.state.HistoricalRecordsDay + 1
        });
    }

    //切换消息类型
    msgTypeStuteFun() {
        this.setState({
            msgTypeStuteFlag: !this.state.msgTypeStuteFlag
        }, () => {
            this.getContactList();
        })
    }

    //获取对方资料
    async fromDetailFun() {
        let contactInfo = new DataSet();
        if (this.state.fromUser) {
            let row = new DataRow();
            row.setValue('FromUser_', this.state.fromUser);
            contactInfo = await PageApi.fromDetail(row);
        } else {
            contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        }
        this.setState({
            contactInfo
        })

    }
}