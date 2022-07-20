import { DataRow, DataSet } from "autumn-ui";
import React from "react";
import styles from "./FrmDriverArrangeCar.css";

type FrmDriverArrangeCarTypeProps = {
    dataJson: string,
}

type FrmDriverArrangeCarTypeState = {
    dataJson: DataSet,
}

export default class FrmDriverArrangeCar extends React.Component<FrmDriverArrangeCarTypeProps, FrmDriverArrangeCarTypeState> {
    constructor(props: FrmDriverArrangeCarTypeProps) {
        super(props);
        let dataJson = new DataSet();
        dataJson.setJson(this.props.dataJson);
        this.state = {
            dataJson,
        }
    }

    render(): React.ReactNode {
        return <React.Fragment>
            {this.state.dataJson.size ? this.getOrderList() : ''}
        </React.Fragment>
    }

    getOrderList() {
        let list = [];
        let ds = new DataSet();
        ds = this.state.dataJson;
        ds.first();
        while (ds.fetch()) {
            list.push(this.getOrderDetail(ds.current))
        }
        return <ul className={styles.orderList} key={this.state.dataJson.getString('delivery_status_')}>{list}</ul>
    }

    handleSelect(row: DataRow) {
        location.href = `FrmDriverArrangeCar.detail?cargoNo=${row.getString('cargo_no_')}&tbNo=${row.getString('tb_no_')}&dcorpno=${row.getString('d_corp_no_')}&it=${row.getDouble('it_')}`;
    }

    getOrderDetail(row: DataRow) {
        return <li key={row.getString('corp_no_')} onClick={this.handleSelect.bind(this, row)}>
            <div className={styles.orderTop}>
                <div>
                    <span>{row.getString('depart_')}</span>
                    <img src='images/order/transportation.png'></img>
                    <span>{row.getString('destination_')}</span>
                </div>
            </div>
            <div className={styles.orderCenter}>
                <div className={styles.orderInfo}>
                    <span><i>发货明细</i>{row.getString('code_')}</span>
                    <span><i>发货时间</i>{row.getString('send_date_time_')}</span>
                    <span><i>到货时间</i>{row.getString('arrive_date_time_')}</span>
                </div>
                {this.getOrderState(row)}
            </div>
            <div className={styles.orderBottom}>
                <div className={styles.freight}>￥<span>{row.getString('amount_')}</span></div>
                {row.getDouble('delivery_status_') == 4 ? '' : <button className={styles.received}>已接单</button>}
            </div>
        </li>
    }

    getOrderState(row: DataRow) {
        let imgSrc = '';
        switch (row.getDouble('delivery_status_')) {
            case 0:
                imgSrc = 'images/order/notShipped.png';
                break;
            case 1:
                imgSrc = 'images/order/shipped.png';
                break;
            case 2:
                imgSrc = 'images/order/discharge.png';
                break;
            case 3:
                imgSrc = 'images/order/awaitAudit.png';
                break;
            case 4:
                imgSrc = 'images/order/completed.png';
                break;
            default:
                imgSrc = 'images/order/notShipped.png';
                break;
        }
        return <img src={imgSrc}></img>
    }
}