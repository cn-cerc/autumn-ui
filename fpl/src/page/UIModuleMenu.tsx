import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./UIModuleMenu.css";

type UIModuleMenuTypeProps = {
    title?: string,
    data: DataSet,
    dataJson: DataRow
}

type UIModuleMenuTypeState = {
    dataJson: DataRow
}

export default class UIModuleMenu extends WebControl<UIModuleMenuTypeProps, UIModuleMenuTypeState> {
    constructor(props: UIModuleMenuTypeProps) {
        super(props);
        this.state = {
            dataJson: this.props.dataJson,
        }
    }

    render(): React.ReactNode {
        return <div className={styles.menuBox}>
            <div className={styles.titleContent}>{this.props.title}</div>
            <div className={styles.stockContent}>
                <ul>
                    {this.getLi()}
                </ul>
            </div>
        </div>
    }

    getLi() {
        let ds = new DataSet();
        let list = [];
        ds = this.props.data;
        if (ds.size >= 1 && ds.getString('name_')) {
            ds.first();
            let index = 1;
            while (ds.fetch()) {
                list.push(<li className={`${styles.stockBox}`} onClick={this.linkTo.bind(this, ds.getString('name_'))} key={ds.getString('name_')}>
                    <div>
                        <img src={ds.getString('img_')} alt="" />
                    </div>
                    <span>{ds.getString('name_')}</span>
                </li>);
                index++;
            }
        }
        return list;
    }

    linkTo(name: string) {
        if (!this.state.dataJson.getBoolean(`${name}_Dis`)) {
            location.href = this.state.dataJson.getString(`${name}_URL`);
        }
    }
}