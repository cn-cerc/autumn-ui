import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import DefaultMessage from "./DefaultMessage";
import ExportMessage from "./ExportMessage";
import styles from "./FrmMessage.css";
import NoticeMessage from "./NoticeMessage";
import PageApi from "./PageApi";
import SignMessage from "./SignMessage";
import SubscribeMessage from "./SubscribeMessage";
import TaskMessage from "./TaskMessage";

type FrmMessageTypeProps = {
    fromUser?: string,
    userCode: string,
    userName: string
}

type FrmMessageTypeState = {
    timing: number,
    contactData: DataSet,
    messageDataList: messageDetail[],
    currentIndex: number,
    messageText: string,
    showMessage: boolean,
    remarkText: string,
    remarkText_: string
    quicReplyList: Array<{ text: string, uid: string }>
    quicReplyEditFlag: boolean,
    HistoricalRecordsDay: number,
    quicReplyItemIptText: string,
    msgTypeStuteFlag: boolean,
    scrollFlag: boolean,
    scrollHeightNub: number,
    contactInfo: DataSet
}

type messageDetail = {
    data: DataSet,
    latestDate: string,
    latestMessage: string,
    date: string,
    scrollTop: number,
    fromUser: string,
    name: string,
    unReadNum: number
};

export const timing = 5;

export default class FrmMessage extends WebControl<FrmMessageTypeProps, FrmMessageTypeState> {
    private timer: any = null;
    constructor(props: FrmMessageTypeProps) {
        super(props);
        let showMessage = this.isPhone ? false : true;
        let contactInfo = new DataSet();
        contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        this.state = {
            timing,
            contactData: new DataSet(),     //联系人DataSet
            messageDataList: [{
                data: new DataSet(),
                latestDate: '',
                latestMessage: '',
                date: '',
                scrollTop: 0,
                fromUser: '',
                name: '',
                unReadNum: 0
            }],     //消息列表DataSet
            currentIndex: this.isPhone ? -1 : 0,      //当前选中的联系人下标
            messageText: '',        //当前输入的消息
            showMessage,        //是否展示消息列表
            remarkText_: '',        //默认备注字段，用来判断备注是否有修改
            remarkText: '',     //备注字段
            quicReplyList: [],   //保存获取的快捷回复list
            quicReplyEditFlag: false,    //是否展示快捷回复消息列表
            HistoricalRecordsDay: 1,     //获取前面第几天的数据
            quicReplyItemIptText: '',    //新增快捷回复
            msgTypeStuteFlag: true,      //切换所有消息和未读消息
            scrollFlag: true,    //标记是否需要将聊天区域自动滚动到底部
            scrollHeightNub: 0,  //记录最新高度
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
            {this.getUserInfoDOM()}
            {this.getContactList()}
            {this.getMessageBox()}
        </div>
    }

    // 初始化页面数据加载
    async initData() {
        await this.getContactData();
        let ds = new DataSet();
        ds.appendDataSet(this.state.contactData);
        ds.first();
        let messageDataList: messageDetail[] = [];
        while (ds.fetch()) {
            let latestDate = ds.getString('LatestDate_');
            let date_ = new Date(latestDate);
            let year_ = date_.getFullYear();
            let month_ = date_.getMonth() + 1;
            let day_ = date_.getDate();
            messageDataList.push({
                data: new DataSet(),
                latestDate,
                latestMessage: ds.getString('LatestMessage_'),
                date: `${year_}-${month_ < 10 ? '0' + month_ : month_}-${day_ < 10 ? '0' + day_ : day_}`,
                scrollTop: 0,
                fromUser: ds.getString('FromUser_'),
                name: ds.getString('Name_'),
                unReadNum: ds.getDouble('UnReadNum_')
            })
        }
        this.setState({
            messageDataList: messageDataList
        }, () => {
            if (!this.isPhone) {
                this.getMessageData(0);
                this.getUserInfo();
            }
        })
    }

    // 获取联系人列表数据
    async getContactData() {
        let contactData = await PageApi.getContactList();
        this.setState({
            contactData
        })
    }

    async getUserInfo() {
        let remarkText = await this.getUserRemarkFun();
        let quicReplyList = await this.getQuicReplyListFun();
        let contactInfo = await this.fromDetailFun();
        this.setState({
            quicReplyEditFlag: false,
            quicReplyItemIptText: '',
            remarkText,
            remarkText_: remarkText,
            quicReplyList,
            contactInfo
        })
    }

    // 获取单个联系人消息详情
    async getMessageData(num: number, date?: string) {
        let messageData = this.state.messageDataList[num]
        let date_ = date ? date : messageData.date
        let row = new DataRow();
        row.setValue('FromUser_', messageData.fromUser).setValue('Date_', date_);
        let dataOut = await PageApi.getMessageDetails(row);
        let ds = new DataSet();
        ds.appendDataSet(messageData.data);
        dataOut.first();
        while (dataOut.fetch()) {
            if (ds.locate('UID_', dataOut.getString('UID_'))) {
                ds.copyRecord(dataOut.current);
            } else {
                ds.append();
                ds.copyRecord(dataOut.current);
            }
        }
        this.state.messageDataList[num].data = ds;
        this.state.messageDataList[num].date = date;
        this.setState({
            currentIndex: num,
        });
        this.scrollBottom();
    }

    // 获取联系人JSX结构
    getContactList() {
        if (!this.isPhone || !this.state.showMessage) {
            let list = [];
            for (let i = 0; i < this.state.messageDataList.length; i++) {
                let messageData = this.state.messageDataList[i];
                let name = messageData.name || '系统消息';
                let date, hour, minut: string | number, timeText: string = '';
                if (messageData.latestDate) {
                    date = new Date(messageData.latestDate);
                    hour = date.getHours();
                    minut = date.getMinutes();
                    if (minut < 10) minut = '0' + minut;
                    timeText = `${hour}:${minut}`;
                }
                let num = i;
                let unread = 0;
                if (!this.state.msgTypeStuteFlag) {
                    unread = messageData.unReadNum > 99 ? 99 : messageData.unReadNum;
                    if (unread == 0) {
                        continue;
                    }
                }
                list.push(<li key={num} className={num == this.state.currentIndex ? styles.selectContact : ''} onClick={this.handleClick.bind(this, messageData.latestDate, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        {unread ? <span className={styles.UnReadNum}>{unread}</span> : ''}
                        <div className={styles.contactTitle}>
                            <span>{name}</span>
                            <span>{timeText}</span>
                        </div>
                        <div>{messageData.latestMessage}</div>
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

    // 获取消息详情JSX结构
    getMessageBox() {
        let messageData = this.state.messageDataList[this.state.currentIndex]
        if (this.state.showMessage) {
            return <div className={styles.messageBox}>
                <div className={styles.messageTitle}>
                    <span>{messageData.name}</span>
                </div>
                {this.getMessageList()}
                <form className={styles.replyBox} onSubmit={(e) => this.handleSubmit(e)} onKeyDown={(e) => this.handleKeyDown(e)}>
                    <textarea value={this.state.messageText} onChange={(e) => {
                        this.setState({
                            messageText: e.target.value
                        })
                    }}></textarea>
                    <div>
                        <button className={messageData.fromUser && this.state.messageText != '' ? '' : styles.disEvents}>发送(S)</button>
                    </div>
                </form>
            </div>
        }
    }

    // 获取nav区域JSX
    getUserInfoDOM() {
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

    // 获取对象资料JSX结构
    getUserInfoList() {
        let messageData = this.state.messageDataList[this.state.currentIndex]
        return <ul>
            <li className={styles.userInfoItem}><span>{messageData.name}</span></li>
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

    // 获取快速回复JSX结构
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

    // 获取删除按钮展示与否
    getDelete(obj: { text: string, uid: string }) {
        if (this.state.quicReplyEditFlag)
            return <span className={styles.delete} onClick={this.delQuicReplyItemFun.bind(this, obj.uid)}>删除</span>
    }

    // 获取具体的消息体结构
    getMessageList() {
        let list = [];
        let ds = new DataSet();
        let messageData = this.state.messageDataList[this.state.currentIndex];
        list.push(<li key="10-1" className={styles.historicalRecordsBox}>
            {this.getHistoryBtn(messageData)}
        </li>)
        ds.appendDataSet(messageData.data);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false, msgStatus = ds.getString('Status_');
            let name = messageData.name;
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
                case 'MVSubscribe':
                    messageName = SubscribeMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            // let date = new Date(ds.getString('AppDate_'));
            // let h: number | string = date.getHours();
            // if (h < 10)
            //     h = '0' + h;
            // let m: number | string = date.getMinutes();
            // if (m < 10)
            //     m = '0' + m;
            // let s: number | string = date.getSeconds();
            // if (s < 10)
            //     s = '0' + s;
            list.push(<li key={ds.recNo}>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    hideName: false,
                    siteR,
                    time: ds.getString('AppDate_'),
                    msgStatus
                })}
            </li>)
        }
        return <ul className={styles.messageList} onScroll={(e) => {
            this.scrollEventFun(e);
        }}>{list}</ul>
    }

    getHistoryBtn(messageData: messageDetail) {
        if (this.moreThanOneMonth(messageData.latestDate)) {
            return <span>暂无更多历史消息</span>
        } else {
            return <span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>获取更多历史消息</span>;
        }
    }

    moreThanOneMonth(date: string) {
        let date_ = new Date(date);
        return false;
    }

    // 点击联系人触发的事件
    async handleClick(date: string, num: number) {
        let messageData = this.state.messageDataList[num];
        if (!this.isPhone) {
            await this.getMessageData(num, date);
            this.getUserInfo();
        } else {
            this.setState({
                currentIndex: num
            }, () => {
                location.href = `./FrmNewMessage.details?fromUser=${messageData.fromUser}&date=${date}&name=${messageData.name}`
            })
        }

    }

    // 开始定时请求数据进程
    startTimer() {
        this.timer = setInterval(() => {
            this.getContactData();
            this.getMessageData(this.state.currentIndex);
            this.getUserInfo();
        }, this.state.timing * 1000)
    }

    // 关闭定时请求数据进程
    removeTimer() {
        clearInterval(this.timer);
    }

    // form表单键盘事件监听
    handleKeyDown(e: any) {
        let keyCode: number = e.keyCode;
        if (keyCode == 13) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    }

    // 消息回复
    async handleSubmit(e: any) {
        e.preventDefault();
        let messageData = this.state.messageDataList[this.state.currentIndex]
        if (this.state.messageText == '') return false;
        let row = new DataRow();
        row.setValue('ToUser_', messageData.fromUser).setValue('Content_', this.state.messageText);
        await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
            scrollFlag: true
        })
        await this.getContactData();
        this.getMessageData(this.state.currentIndex, Utils.getNowDate());
    }

    // 设置聊天区域滚动到底部
    scrollBottom() {
        var el = document.getElementsByClassName(styles.messageList)[0];
        //@ts-ignore
        el.scrollTop = el.scrollHeight;
        this.setState({
            scrollHeightNub: el.scrollHeight
        })
    }

    // 消息区域滚动事件
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
            messageText: e.target.innerText
        }, () => {
            this.handleSubmit(e);
        })
    }

    //设置备注信息
    async setUserRemarkFun() {
        if (this.state.remarkText != this.state.remarkText_) {
            let messageData = this.state.messageDataList[this.state.currentIndex]
            let row = new DataRow();
            row.setValue('UserCode_', messageData.fromUser).setValue('Remark_', this.state.remarkText);
            let dataOut = await PageApi.setUserRemark(row);
            if (dataOut.state < 0) {
                showMsg(dataOut.message);
            } else {
                this.setState({
                    remarkText_: this.state.remarkText
                })
            }
        }
    }

    //获取备注信息
    async getUserRemarkFun() {
        let row = new DataRow();
        let messageData = this.state.messageDataList[this.state.currentIndex]
        row.setValue('UserCode_', messageData.fromUser)
        let dataOut = await PageApi.getUserRemark(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        let remarkText = '';
        while (ds.fetch()) {
            if (ds.getString('remark_')) {
                remarkText = ds.getString('remark_')
            }
        }
        return remarkText
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
        return quicReplyList;
    }

    //新增一条快捷回复
    async addQuicReplyItemFun() {
        let row = new DataRow();
        row.setValue('Content_', this.state.quicReplyItemIptText);
        await PageApi.setQuickReplyItem(row);
        this.getUserInfo();
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
        let messageData = this.state.messageDataList[this.state.currentIndex];
        // let date = new Date('')
        // this.getMessageData()
        // let date: any;
        // var nowTime = new Date().getTime() - (this.state.HistoricalRecordsDay * 24 * 60 * 60 * 1000);
        // var now = new Date(nowTime);
        // var yyyy = now.getFullYear();
        // var m: any = now.getMonth() + 1;
        // var day: any = now.getDate();
        // if (m < 10) m = '0' + m;
        // if (day < 10) day = '0' + day;
        // date = yyyy + '-' + m + '-' + day;
        // let row = new DataRow();
        // let HistoricalRecordsList = new DataSet();
        // row.setValue('FromUser_', messageData.fromUser).setValue('Date_', date);
        // let messageData = await PageApi.getMessageDetails(row);
        // HistoricalRecordsList.appendDataSet(messageData);
        // HistoricalRecordsList.appendDataSet(this.state.HistoricalRecordsList);
        // this.setState({
        //     HistoricalRecordsFlag: true,
        //     HistoricalRecordsList,
        //     HistoricalRecordsDay: this.state.HistoricalRecordsDay + 1
        // });
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
        let messageData = this.state.messageDataList[this.state.currentIndex]
        let contactInfo = new DataSet();
        if (messageData.fromUser) {
            let row = new DataRow();
            row.setValue('FromUser_', messageData.fromUser);
            contactInfo = await PageApi.fromDetail(row);
        } else {
            contactInfo.append().setValue('RoleName_', '系统').setValue('Mobile_', '暂无');
        }
        return contactInfo;
    }
}