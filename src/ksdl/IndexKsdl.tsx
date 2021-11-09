import React from "react";

export default class IndexKsdl extends React.Component {
    render() {
        return (
            <div>
                <div>********** ksdl import menus **********</div>
                <ul>
                    <li>1: 当前配置: D:\ksdl\import</li>
                    <li>2: 扫描所有xls文件(限2003版本)</li>
                    <li>3: 导入所有xls文件(限2003版本)</li>
                    <li>4: 删除所有的导入的原始数据(慎重操作)</li>
                </ul>
                <div>please input(exit=退出系统): </div>
            </div>
        )
    }
}