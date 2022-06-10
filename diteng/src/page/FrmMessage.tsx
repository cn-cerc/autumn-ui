import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DefaultMessage from "./DefaultMessage";
import styles from "./FrmMessage.css";
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
    remarkText:string,
    quicReplyList:Array<{text:string,uid:string}>
    quicReplyEditFlag:boolean,
    HistoricalRecordsDay:number,
    quicReplyItemIptText:string,
    msgTypeStuteFlag:boolean
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
            quicReplyList:[],
            quicReplyEditFlag:false,
            HistoricalRecordsDay:1,
            quicReplyItemIptText:'',
            msgTypeStuteFlag:true,
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

        var now = new Date();
        var yyyy = now.getFullYear();
        var m:any = now.getMonth()+1;
        var day:any = now.getDate(); 
        if(m<10) m = '0'+m;
        if(day<10) day = '0'+day;
        date = yyyy+'-'+m+'-'+day;

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
        }, () => {
            this.getUserRemarkFun();
            this.getQuicReplyListFun();
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
                if(!this.state.msgTypeStuteFlag){
                    UnRead = ds.getDouble('UnReadNum_') > 99 ? 99 : ds.getDouble('UnReadNum_');
                    // continue;
                }
                list.push(<li key={ds.recNo} className={num == this.state.currentContact ? styles.selectContact : ''} onClick={this.handleClick.bind(this, ds.getString('FromUser_'), ds.getString('LatestDate_'), name, num)}>
                    <div className={styles.contactImage}>{name.substring(name.length - 2)}</div>
                    <div>
                        {UnRead?<span className={styles.UnReadNum }>{UnRead}</span>:''}
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
                    <div><span className={this.state.msgTypeStuteFlag?styles.msgTypeStute:''} onClick={this.msgTypeStuteFun.bind(this)}>所有消息</span></div>
                    <div><span className={this.state.msgTypeStuteFlag?'':styles.msgTypeStute} onClick={this.msgTypeStuteFun.bind(this)}>未读消息</span></div>
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
                        <span className={styles.editBtn} onClick={this.quicReplyEdit.bind(this)}>{this.state.quicReplyEditFlag?'完成':'编辑'}</span>
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
                <p><span>备注</span><button onClick={this.setUserRemarkFun.bind(this)} className={this.state.remarkText==''?styles.disEvents:''}>保存</button></p>
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
        let datalist = this.state.quicReplyList;
        let List:any = [];
        datalist.forEach((item)=>{
            List.push(<li className={styles.quicReplyItem} key={item.uid}><p onClick={(e) => this.quicReplySend(e)}>{item.text}</p><span className={`${styles.delQuicReplyItemBtn} ${this.state.quicReplyEditFlag?'':styles.hide}`} onClick={this.delQuicReplyItemFun.bind(this,item.uid)}>删除</span></li>);
        })
        List.push(<li key="11-01" className={`${styles.quicReplyItem} ${this.state.quicReplyEditFlag?'':styles.hide}`}><p><input type="text" value={this.state.quicReplyItemIptText} onChange={(e)=>{this.setState({
            quicReplyItemIptText:e.target.value
        })}} className={styles.quicReplyItemIpt} placeholder="请输入快捷回复内容..." /></p><span className={`${styles.addQuicReplyItemBtn} ${this.state.quicReplyEditFlag?'':styles.hide}`} onClick={this.addQuicReplyItemFun.bind(this)}>添加</span></li>);
        return <ul className={this.state.quicReplyEditFlag?styles.editUlSkin:''}>
            {List}
        </ul>
    }

    getMessageList() {
        let list = [];
        let ds = new DataSet();
        ds.appendDataSet(this.state.messageData);
        ds.first();
        while (ds.fetch()) {
            let siteR = false, systemMsg = false,msgStatus=ds.getString('Subject_');
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
                case 'MVTask':
                    messageName = TaskMessage;
                    break;
                case 'MVWorkflow':
                    messageName = SignMessage;
                    break;
                default:
                    messageName = DefaultMessage;
                    break;
            }
            list.push(<li key={ds.recNo}>
                <div className={styles.msgTime}>{ds.getString('AppDate_')}</div>
                {React.createElement(messageName, {
                    row: ds.current,
                    name,
                    hideName: false,
                    siteR,
                    msgStatus
                })}
                {/* <SignMessage row={ds.current} name={name} hideName={false} siteR={siteR}></SignMessage> */}
                {/* <DefaultMessage row={ds.current} code='Content_' name={name} hideName={false} siteR={siteR} systemMsg={systemMsg} msgStatus={ds.getString('Status_')} mvClass={mvClass}></DefaultMessage> */}
            </li>)
        }
        return <ul className={styles.messageList}><li key="10-1" className={styles.historicalRecordsBox}><span className={styles.historicalRecordsBtn} onClick={this.getHistoricalRecordsFun.bind(this)}>查看更多记录</span></li>{list}</ul>
    }

    handleClick(fromUser: string, date: string, name: string, num: number) {
        this.setState({
            remarkText:'',
            quicReplyItemIptText:''
        })
        if (!this.isPhone)
            this.getMessageData(fromUser, date, name, num);
        else {
            this.setState({
                currentContact: num
            },()=>{
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
        if(this.state.sendText == '') return false;
        let row = new DataRow();
        row.setValue('ToUser_', this.state.fromUser).setValue('Content_', this.state.sendText);
        let dataOut = await PageApi.replyMessage(row);
        this.setState({
            messageText: '',
            sendText: '',
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

    async setUserRemarkFun() {
        let row = new DataRow();
        row.setValue('corp_no_', '目前不知道').setValue('UserCode_', this.state.fromUser)
            .setValue('from_user_', this.props.userCode).setValue('Remark_', this.state.remarkText);
        let dataOut = await PageApi.setUserRemark(row);
    }

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
                    remarkText: ds.getString('remark_')
                })
            }
        }
    }

    //获取快捷回复列表
    async getQuicReplyListFun(){
        let quicReplyList:Array<{text:string,uid:string}> = [];
        let row = new DataRow();
        let dataOut = await PageApi.getQuickReplyList(row);
        let ds = new DataSet();
        ds.appendDataSet(dataOut);
        ds.first();
        while (ds.fetch()) {
            quicReplyList.push({text:ds.getString('reply_content_'),uid:ds.getString('uid_')});
        }
       this.setState({
            quicReplyList
       }) 
    }

    //新增一条快捷回复
    async addQuicReplyItemFun(){
        console.log(this.state.quicReplyItemIptText);
        let List:Array<string> = [];
        let row = new DataRow();
        row.setValue('Content_',this.state.quicReplyItemIptText);//.setValue('UID_','');
        let dataOutawait = await PageApi.setQuickReplyItem(row);
        this.setState({
            quicReplyItemIptText:''
        },()=>{
            this.getQuicReplyListFun();
        })
    }
    //删除某条快捷回复
    async delQuicReplyItemFun(uid:string){
        let List:Array<string> = [];
        let row = new DataRow();
        row.setValue('UID_',uid);
        let dataOutawait = await PageApi.delQuickReplyItem(row);
        //待完成
    }
    //编辑快捷回复
    quicReplyEdit(){
        this.setState({
            quicReplyEditFlag: !this.state.quicReplyEditFlag
        })
    }
    //获取历史消息 每次点击都获取当前查询时间 前一天
    async getHistoricalRecordsFun(){
        let date:any;
        var nowTime = new Date().getTime() - (this.state.HistoricalRecordsDay * 24 * 60 * 60 * 1000);
        var now = new Date(nowTime);
        var yyyy = now.getFullYear();
        var m:any = now.getMonth()+1;
        var day:any = now.getDate();
        if(m<10) m = '0'+m;
        if(day<10) day = '0'+day;
        date = yyyy+'-'+m+'-'+day;
        // this.getMessageData(this.state.fromUser, date, this.state.contactName, 0);
        let row = new DataRow();
        row.setValue('FromUser_', this.state.fromUser).setValue('Date_', date);
        let messageData = await PageApi.getMessageDetails(row);
        this.setState({
            messageData,
            contactDate: date,
            HistoricalRecordsDay : this.state.HistoricalRecordsDay + 1
        });
    }

    //切换消息类型
    msgTypeStuteFun(){
        this.setState({
            msgTypeStuteFlag: !this.state.msgTypeStuteFlag
        },()=>{
            this.getContactList();
        })
    }
}