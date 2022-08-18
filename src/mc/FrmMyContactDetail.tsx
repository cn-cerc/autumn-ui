import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import DitengApi from "../api/DitengApi";
import styles from "./FrmMyContact.css";


type FrmMyContactTypeProps = {
    searchType: number
}

type FrmMyContactTypeState = {
    searchTypeIndex: number,
    currentUserId: string,
    AllMessageDetail: DataSet,
    copyData: DataSet,
    leaveBottom: number,
    searchRow: DataRow
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
            copyData: new DataSet(),
            leaveBottom: 0,
            searchRow: new DataRow()
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
        let dataOut = await DitengApi.searchBook(row);
        let AllMessageDetail = dataOut;
        let copyData = new DataSet();
        copyData.appendDataSet(dataOut);
        this.setState({
            AllMessageDetail,
            copyData
        })
    }

    //获取右边分组联系人列表
    getRightBox() {
        let ds = new DataSet();
        ds.appendDataSet(this.state.copyData);
        let list = [];
        ds.first();
        let colorIndex = 0;
        let searchText = this.state.searchRow.getString('searchText_');
        while (ds.fetch()) {
            let name = ds.getString('name_');
            let userCode = ds.getString('user_code_');
            let text = ds.getString('corp_name_');
            list.push(<li key={name+userCode+searchText} onClick={this.handleClick.bind(this, ds.getString('update_time_'), userCode, name, ds.getString('UID_'))}>
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
        if (!list.length) {
            list.push(<li className={styles.noContact} key='noContact'>暂无当前分类的联系人...</li>)
        }
        return <React.Fragment>
            <form onSubmit={(e) => { e.preventDefault(); this.handleSearch(); }} className={styles.search}>
                <input type='text' value={this.state.searchRow.getString('searchText_')} onChange={this.handleChange.bind(this)} placeholder='请输入查询条件' />
                <button type='submit'>查询</button>
            </form>
            <ul className={`${styles.AllContactList} ${list.length > 0 ? styles.contactDetailList : ''}`} onScroll={(e) => {
                this.scrollEventFun(e);
            }} key={searchText}>
                {list}
            </ul>
        </React.Fragment>
    }

    // 查询条件改变触发事件
    handleChange(e: any) {
        let oldSearchText = this.state.searchRow.getString('searchText_');
        let newText = e.target.value;
        this.state.searchRow.setValue('searchText_', newText);
        if (newText.trim() != oldSearchText.trim()) {
            this.state.searchRow.setValue('searchText_', newText);
            this.setState(this.state, () => {
                this.handleSearch();
            })
        } else {
            this.setState(this.state);
        }
    }

    // 过滤联系人列表
    handleSearch() {
        let searchText_ = this.state.searchRow.getString('searchText_').trim();
        let data = new DataSet();
        let copyData = new DataSet();
        data.appendDataSet(this.state.AllMessageDetail);
        data.first();
        data.records.forEach((row) => {
            if (row.getString('name_').indexOf(searchText_) > -1 || row.getString('corp_name_').indexOf(searchText_) > -1)
                copyData.append().copyRecord(row);
        });
        this.setState({
            copyData
        });
    }

    // 点击最近联系人触发的事件
    async handleClick(date: string, id: string, name: string) {
        if (id == '') return;
        location.href = `./FrmMyMessage.details?fromUser=${encodeURIComponent(id)}&toUser=${encodeURIComponent(id)}&date=${encodeURIComponent(date)}&name=${encodeURIComponent(name)}`;

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