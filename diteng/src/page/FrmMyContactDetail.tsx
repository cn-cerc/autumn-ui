import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import { showMsg } from "../tool/Summer";
import Utils from "../tool/Utils";
import styles from "./FrmMyContact.css";
import PageApi from "./PageApi";


type FrmMyContactTypeProps = {
    searchType: number
}

type FrmMyContactTypeState = {
    searchTypeIndex: number,
    currentUserId: string,
    AllMessageDetail: DataSet,
    leaveBottom: number,
}

export default class FrmMyContact extends WebControl<FrmMyContactTypeProps, FrmMyContactTypeState>{
    private colorArr = ['#d57f10', '#0755aa', '#0755aa', '#3fba0c', '#0755aa', '#d00c89', '#0755aa'];
    constructor(props: FrmMyContactTypeProps) {
        super(props);
        this.state = {
            // searchType:['公司同事','客户清单','厂商清单','其他人员'],
            searchTypeIndex: this.props.searchType,
            currentUserId: null,
            AllMessageDetail: new DataSet(),     //消息列表DataSet
            leaveBottom: 0
        }
    }

    componentDidMount(): void {
        this.getAllMessageDetail();
    }

    loopIndex(index: number) {
        return (index + 1) % 7;
    }

    render(): React.ReactNode {
        return <div className={styles.main}>
            {this.getRightBox()}
        </div>
    }

    async getAllMessageDetail() {
        let row = new DataRow();
        row.setValue('type', this.state.searchTypeIndex).setValue('MaxRecord_', 100);
        let dataOut = await PageApi.searchBook(row);
        let AllMessageDetail = dataOut;
        this.setState({
            AllMessageDetail
        })
    }

    //获取右边分组联系人列表
    getRightBox() {
        let ds = new DataSet();
        ds = this.state.AllMessageDetail;
        let list = [];
        ds.first();
        let colorIndex = 0;
        while (ds.fetch()) {
            let name = ds.getString('name_');
            let userCode = ds.getString('user_code_');
            let text = ds.getString('corp_name_');
            list.push(<li key={userCode} onClick={this.handleClick.bind(this, ds.getString('update_time_'), userCode, name, ds.getString('UID_'))}>
                <div className={styles.contactImage} style={{ 'backgroundColor': this.colorArr[colorIndex] }}>{name.substring(name.length - 2)}</div>
                <div className={styles.alignItem}>
                    <div className={styles.contactTitle}>
                        <span>{name}</span>
                    </div>
                    {text ? <div>{text}</div> : ''}
                </div>
            </li>);
            colorIndex = this.loopIndex(colorIndex);
        }
        if(!list.length) {
            list.push(<li className={styles.noContact} key='noContact'>暂无当前分类的联系人...</li>)
        }
        return <ul className={`${styles.AllContactList} ${list.length > 0 ? styles.contactDetailList : ''}`} onScroll={(e) => {
            this.scrollEventFun(e);
        }}>
            {list}
        </ul>
    }

    // 点击最近联系人触发的事件
    async handleClick(date: string, id: string, name: string, uid: string) {
        if (id == '') {
            location.href = `FrmMyContact.modify?uid=${uid}`;
        } else {
            location.href = `./FrmMyMessage.details?fromUser=${id}&toUser=${id}&date=${date}&name=${name}`
        };


    }

    // 设置右边区域滚动到底部
    initMessageScroll() {
        let el = document.getElementsByClassName(styles.AllContactList)[0] as HTMLDivElement;
        el.scrollTop = el.scrollHeight - this.state.leaveBottom;
    }

    // 右边区域滚动事件
    scrollEventFun(e: any) {
        let el = e.target as HTMLDivElement;
        this.setState({
            leaveBottom: el.scrollHeight - el.scrollTop
        })
    }


}