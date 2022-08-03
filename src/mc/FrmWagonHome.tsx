import { WebControl } from "autumn-ui";
import React from "react";
import { DataSet } from "../../autumn";
import UIIntroduction from "../module/UIIntroduction";
import StaticFile from "../static/StaticFile";
import styles from "./FrmWagonHome.css";

type FrmWagonHomeTypeProps = {
    introduction: string,
    jsonData: string
}

type FrmWagonHomeTypeState = {
    activityNum: number,
    opNum: number,
    productNum: number,
    serveNum: number,
    dataSet: DataSet,
}

export default class FrmWagonHome extends WebControl<FrmWagonHomeTypeProps, FrmWagonHomeTypeState> {
    constructor(props: FrmWagonHomeTypeProps) {
        super(props);
        let dataSet = new DataSet();
        dataSet.setJson(this.props.jsonData);
        this.state = {
            activityNum: 0,
            opNum: 0,
            productNum: 0,
            serveNum: 0,
            dataSet
        }
        console.log(this.state.dataSet);
    }

    render(): React.ReactNode {
        return <React.Fragment>
            <UIIntroduction introduction={this.props.introduction}></UIIntroduction>
            <div className={styles.main}>
                <div className={styles.content}>
                    <div className={styles.leftBox}>
                        <div className={styles.items}>
                            <header>
                                活动公告 · <span>{this.state.activityNum}条</span>
                                {!this.state.activityNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                {this.getHtml(0)}
                            </ul>
                        </div>
                        <div className={styles.items}>
                            <header>
                                操作指引 · <span>{this.state.opNum}条</span>
                                {!this.state.opNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                {this.getHtml(1)}
                            </ul>
                        </div>
                    </div>
                    <div className={styles.centerBox}>
                        <div className={styles.items}>
                            <header>
                                商品优惠 · <span>{this.state.productNum}条</span>
                                {!this.state.productNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                {this.getHtml(2)}
                            </ul>
                        </div>
                    </div>
                    <div className={styles.rightBox}>
                        <div className={styles.items}>
                            <header>
                                服务优惠 · <span>{this.state.serveNum}条</span>
                                {!this.state.serveNum ? '' : <p className={styles.rightBtn} onClick={this.moreMsg.bind(this)}>
                                    查看更多 <img src={StaticFile.getImage('images/arrow_right.png')} alt="" />
                                </p>}
                            </header>
                            <ul>
                                {this.getHtml(3)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    }

    componentDidMount(): void {
        this.getCount();
    }

    getHtml(type: number) {
        let list: any = [];
        let ds = this.state.dataSet;
        let notData = true, key: number = 1;
        ds.first();
        while (ds.fetch()) {
            if (type == ds.getDouble('type_')) {
                let img = null;
                if (ds.getString('content_').match(/<img [^>]*>/) && ds.getString('content_').match(/<img [^>]*>/)[0]) {
                    img = ds.getString('content_').match(/<img [^>]*>/)[0];
                }
                list.push(<li className={styles.item} onClick={this.toDetailFun.bind(this, ds.getDouble('advert_no_'))} key={key + ds.getString('type_') + ds.getString('UID_')}>
                    <div className={styles.mainText}>
                        <div>
                            {ds.getString('title_')}
                        </div>
                        <p>{ds.getString('create_time_')} · {ds.getString('corp_name_')}</p>
                    </div>
                    {img ?
                        <div className={styles.imgBox} dangerouslySetInnerHTML={{ __html: img }}>
                        </div> : ''}
                </li>)
                notData = false;
                key++;
            }
        }

        if (notData) {
            list.push(<li className={styles.textCenter}>暂无数据</li>);
        }

        return list;
    }

    getCount() {
        let ds = this.state.dataSet;
        ds.first();
        let activityNum = 0, opNum = 0, productNum = 0, serveNum = 0;
        while (ds.fetch()) {
            switch (ds.getString('type_')) {
                case '0':
                    activityNum += 1;
                    break;
                case '1':
                    opNum += 1;
                    break;
                case '2':
                    productNum += 1;
                    break;
                case '3':
                    serveNum += 1;
                    break;
            }
        }
        this.setState({
            activityNum,
            opNum,
            productNum,
            serveNum,
        });
    }

    moreMsg() {
        location.href = `FrmDriverAdvert`;
    }

    toDetailFun(advert_no: number) {
        location.href = `FrmDriverAdvert.modify?advert_no_=${advert_no}`;
    }
}