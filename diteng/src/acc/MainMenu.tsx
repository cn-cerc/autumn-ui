import React, { MouseEventHandler } from "react";
import DataSet from "../db/DataSet";
import styles from './MainMenu.css';

type propsType = {}

type stateType = {
    dataSet: DataSet;
    current: string;
}

export default class MainMenu extends React.Component<propsType, stateType> {
    private _dataSet: DataSet;

    constructor(props: propsType) {
        super(props);
        this._dataSet = new DataSet();
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TBase').setValue('name', '基本资料');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TPur').setValue('name', '进货管理');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TOrd').setValue('name', '销售管理');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TRetail').setValue('name', '零售管理');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TStock').setValue('name', '库存管理');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TMenuGather').setValue('name', '智能终端');
        this._dataSet.append().setValue('id', 'jxc').setValue('group', '进销存管理').setValue('code', 'TMake').setValue('name', '生产管理');

        this._dataSet.append().setValue('id', 'acc').setValue('group', '财务管理').setValue('code', 'TFrmStockTotal').setValue('name', '财务管理');
        this._dataSet.append().setValue('id', 'acc').setValue('group', '财务管理').setValue('code', 'TAcc').setValue('name', '企业总帐');
        this._dataSet.append().setValue('id', 'acc').setValue('group', '财务管理').setValue('code', 'pa').setValue('name', '资产管理');

        this._dataSet.append().setValue('id', 'common').setValue('group', '公共模组').setValue('code', 'TLink').setValue('name', '互联平台');
        this._dataSet.append().setValue('id', 'common').setValue('group', '公共模组').setValue('code', 'it').setValue('name', '系统设置');
        this._dataSet.append().setValue('id', 'common').setValue('group', '公共模组').setValue('code', 'my').setValue('name', '个人中心');

        this.state = { current: "", dataSet: this._dataSet }
    }

    render() {
        return (
            <div className={styles.main}>
                {this.getGroups()}
            </div>
        )
    }

    getGroups(): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        //取得所有的菜单分组
        let groups: Map<string, string> = new Map<string, string>();
        let group: string;
        for (let item of this._dataSet.records) {
            if (item.getString('group') == group)
                continue;
            group = item.getString('id');
            groups.set(group, item.getString('group'));
        }

        groups.forEach((value, group) => {
            let className = styles.groupItem;
            if (this.state.current == group)
                className = styles.groupSelected;
            items.push(
                <section key={group}>
                    <div key={group} role={group} className={styles.title} onClick={this.groupClick}>
                        {value}
                    </div>
                    <ul key={group + '.2'}>
                        {this.getGroup(group)}
                    </ul>
                </section>
            );
        })
        return items;
    }

    getGroup(group: string): React.ReactNode[] {
        let items: React.ReactNode[] = [];
        let i = 1;
        for (let item of this._dataSet.records) {
            if (item.getString('id') != group)
                continue;
            let menuCode = item.getString('code');
            let menuName = item.getString('name');
            let menuIcon = `https://www.diteng.site/public/images/module/${menuCode}.png`;
            items.push(
                <li key={i++} className={styles.menuItem} role={menuCode}>
                    <img src={menuIcon} />
                    <a href={menuCode}>{menuName}</a>
                </li>
            )
        }
        return items;
    }

    groupClick: MouseEventHandler<HTMLElement> = (sender: any) => {
        let el: HTMLElement = sender.target;
        // 菜单收起和展开逻辑
        let ul = $(el).siblings();
        let section = $(el).closest("section");
        if(section.hasClass("shrunk")) {
            section.removeClass("shrunk").css({
                "overflow": "inherit"
            }).stop().animate({
                "height": $(el).height() + ul.height()
            }, 500)
        } else {
            section.addClass("shrunk").stop().css({
                "overflow": "hidden"
            }).animate({
                "height": $(el).height()
            }, 500)
        }

        let current = el.getAttribute('role');
        this.setState({ ...this.state, current })
    }

}
