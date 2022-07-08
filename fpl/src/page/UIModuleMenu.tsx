import { DataRow, DataSet, WebControl } from "autumn-ui";
import React from "react";
import styles from "./UIModuleMenu.css";

type UIModuleMenuTypeProps = {
    title?: string,
    dataSet: DataSet,
}

type UIModuleMenuTypeState = {
    
}

export default class UIModuleMenu extends WebControl<UIModuleMenuTypeProps, UIModuleMenuTypeState> {
    constructor(props: UIModuleMenuTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={styles.menuBox}>
            {this.props.title ? <div className={styles.titleContent}>{this.props.title}</div> : ''}
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
        ds = this.props.dataSet;
        if (ds.size >= 1 && ds.getString('Name_')) {
            ds.first();
            let index = 1;
            while (ds.fetch()) {
                list.push(<li onClick={this.linkTo.bind(this, ds.current)} key={ds.getString('Name_')}>
                    <div>
                        <img src={ds.getString('Image_')} alt="" />
                    </div>
                    <span>{ds.getString('Name_')}</span>
                </li>);
                index++;
            }
        }
        return list;
    }

    linkTo(row: DataRow) {
        if (!row.getBoolean(`${row.getString('Name_')}_Dis`)) {
            location.href = row.getString(`${row.getString('Name_')}_URL`);
        }
    }
}