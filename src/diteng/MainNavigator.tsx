import React, { isValidElement } from "react";
import MenuItem from "../rcc/MenuItem";
import MainSearch from "./MainSearch";
import './MainNavigator.css';

export default class MainNavigator extends React.Component {

    render() {
        let menuCode = window.location.hash;
        let menuName = document.title;
        return (
            <div className='mainNavigator'>
                <img src="diteng-icon.png" />
                <span>欢迎使用地藤管家</span>
                <div className='menuPath'>
                    <MenuItem code='index' name='首页' />
                    {this.getMenus().map(item => item)}
                    <MenuItem code={menuCode} name={menuName} />
                </div>
                <MainSearch />
                <div className='corpInfo'>
                    <img src="switchCorp.png" />
                    深圳市渔具有限公司
                </div>
                <div className='userInfo'>
                    <img src="my.png" />
                    91100101-张三
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