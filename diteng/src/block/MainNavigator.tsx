import { MenuItem } from "autumn-ui";
import React, { isValidElement } from "react";
import styles from './MainNavigator.css';
import MainSearch from "./MainSearch";

export default class MainNavigator extends React.Component {

    render() {
        let menuCode = window.location.hash;
        let menuName = document.title;
        return (
            <div className={styles.mainNavigator}>
                <div className={styles.navigatorLeft}>
                    <img src={`https://www.diteng.site/public/images/public/dt_logo.png`} />
                    <span>欢迎使用地藤管家</span>
                </div>
                <div className={styles.navigatorCenter}>
                    <div className={styles.menuPath}>
                        <MenuItem code='index' name='首页' />
                        {this.getMenus()}
                        <MenuItem code={menuCode} name={menuName} last={true}/>
                    </div>
                    <MainSearch />
                </div>
                <div className={styles.navigatorRight}>
                    <div className={styles.corpInfo}>
                        <img src={`https://www.diteng.site/public/images/public/chooseAccount.png`} />
                        深圳市渔具有限公司
                    </div>
                    <div className={styles.userInfo}>
                        <img src={`https://www.diteng.site/public/images/userIcon.png`} />
                        91100101-张三
                    </div>
                </div>
            </div>
        )
    }

    getMenus(): React.ReactElement[] {
        let items: React.ReactElement[] = [];
        React.Children.map(this.props.children, (child) => {
            if (isValidElement(child) && child.type == MenuItem)
                items.push(child);
        })
        return items;
    }
}