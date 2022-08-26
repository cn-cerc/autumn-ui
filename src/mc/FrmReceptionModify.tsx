import { DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./FrmReceptionModify.css";

type PropsType = {
}

type stateType = {
    dataSetLeft: DataSet,
    dataSetLeftShow: DataSet,
}

export default class FrmReceptionModify extends WebControl<PropsType, stateType> {
    constructor(props: PropsType | Readonly<PropsType>) {
        super(props);
        this.state = {
            dataSetLeft: new DataSet(),
            dataSetLeftShow: new DataSet(),
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {

    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return <div className={styles.main}>
                <div className={styles.orderForm}>
                    <div className={styles.beforeBlue}><span>订单信息</span></div>
                    <li><span>订单号</span><span>BT562346563</span></li>
                    <li><span>登记时间</span><span>2022-08-25 08:30</span></li>
                    <li><span>订单类型</span><span>一般维修</span></li>
                    <li><span>预计完工</span><span>2022-08-28 08:30</span></li>
                    <div><span>备注</span><span>备注信息文案，备注信息文案，</span></div>
                </div>
                <div className={styles.userDiv}>
                    <div className={styles.beforeBlue}><span>客户信息</span></div>
                    <li><span>客户名称</span><span>谢晓明</span></li>
                    <li><span>车牌号</span><span>粤B56325</span></li>
                    <li><span>联系电话</span><span>18229111020</span></li>
                    <li><span>司机姓名</span><span>谢晓明</span></li>
                    <li><span>车型</span><span>牵引车</span></li>
                </div>
                <div className={styles.contentDiv}>
                    <div className={styles.beforeBlue}><span>维修项目</span></div>
                    <li>
                        <li><span>喷漆</span><span>维修中</span></li>
                        <div className={styles.content}>
                            <li><span>标准工时</span><span>3.00</span></li>
                            <li><span>数量</span><span>2</span></li>
                            <li><span>维修人员</span><span>张三</span></li>
                        </div>
                        <li><span>备注信息文案备注信息文案备注信息文案</span></li>
                    </li>
                    <li>
                        <li><span>喷漆</span><span>维修中</span></li>
                        <div className={styles.content}>
                            <li><span>标准工时</span><span>3.00</span></li>
                            <li><span>数量</span><span>2</span></li>
                            <li><span>维修人员</span><span>张三</span></li>
                        </div>
                        <li><span>备注信息文案备注信息文案备注信息文案</span></li>
                    </li>
                </div>
            </div>
        }
    }
}