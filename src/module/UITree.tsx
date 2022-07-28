import { WebControl } from "autumn-ui";
import React from "react";
import iconfontCss from "../assets/iconfont/iconfont.css";
import styles from "./UITree.css";

export type UITreeIcons = {
    shrinkIcon: string,
    expendIcon: string
}

export type UITreeType = {
    title: string,
    children?: UITreeType[],
    value: object | string | number
}

export type UIDataType = {
    showChild?: boolean,
    hideIcon?: boolean
} & Partial<UITreeType>

type UITreeTypeProps = {
    data: UITreeType[],
    handleClick?: Function,
    showChild?: Function,
    handleDbClick?: Function,
    treeIcons?: UITreeIcons,
    selectClass?: string
}

type UITreeTypeState = {
    selectVArr: any[]
}

export default class UITree extends WebControl<UITreeTypeProps, UITreeTypeState> {
    constructor(props: UITreeTypeProps) {
        super(props);
        this.state = {
            selectVArr: [],
        }
    }

    componentDidMount(): void {
        this.initData(this.props.data);
    }

    initData(data: any) {
        data.forEach((data: UIDataType) => {
            if (data.children && data.children.length > 0) {
                this.initData(data.children);
            }
            data.showChild = false;
        })
    }

    render() {
        return (
            <div className={styles.main}>
                {this.getTree(this.props.data)}
            </div>
        )
    }

    getTree(treeData: UITreeType[]) {
        let items = treeData.map((data: UITreeType) => {
            let vArr = [data.value];
            let avArr: any[] = [];
            return <React.Fragment key={`${data.title}${data.value.toString()}`}>
                <div className={styles.tree}>
                    <div className={styles.mainTree}>
                        {this.getTreeIcons(data, vArr)}
                        <span className={`${styles.treeText} ${this.getSelectClass(avArr, data.value)}`} onClick={this.setSelectVArr.bind(this, avArr, data.value)} onDoubleClick={this.handleDoubleClick.bind(this, data, avArr)}>{data.title}</span>
                    </div>
                    {this.getChildTree(data, vArr, avArr)}
                </div>
            </React.Fragment>
        })
        return items;
    }

    getChildTree(treeData: UIDataType, valueArr: any[], allValueArr: any[]) {
        let avArr = allValueArr.slice(0, allValueArr.length);
        avArr.push(treeData.value);
        if (treeData.children && treeData.children.length > 0 && treeData.showChild) {
            let items = treeData.children.map((data: UITreeType) => {
                let vArr = valueArr.slice(0, valueArr.length);
                vArr.push(data.value);
                return <React.Fragment key={`${data.title}${data.value.toString()}`}>
                    <div className={styles.tree}>
                        <div className={styles.childTree} style={{ 'paddingLeft': `${avArr.length}rem` }}>
                            {this.getTreeIcons(data, vArr)}
                            <span className={`${styles.treeText} ${this.getSelectClass(avArr, data.value)}`} onClick={this.setSelectVArr.bind(this, avArr, data.value)} onDoubleClick={this.handleDoubleClick.bind(this, data, avArr)}>{data.title}</span>
                        </div>
                        {this.getChildTree(data, vArr, avArr)}
                    </div>
                </React.Fragment>
            })
            return items;
        }
    }

    showChild(data: UIDataType, dataArr: any[]) {
        data.showChild = !data.showChild;
        this.props.showChild(data, dataArr);
    }

    getTreeIcons(treeData: UIDataType, vArr: any[]) {
        if (this.props.treeIcons && !treeData.hideIcon)
            return <span className={`${iconfontCss.iconfont} ${treeData.showChild ? iconfontCss[this.props.treeIcons.shrinkIcon] : iconfontCss[this.props.treeIcons.expendIcon]}`} onClick={this.showChild.bind(this, treeData, vArr)}></span>
    }

    setSelectVArr(avArr: any[], value: string | object | number) {
        let arr = avArr.slice(0, avArr.length);
        arr.push(value);
        if (this.props.handleClick)
            this.props.handleClick(arr);
        this.setState({
            selectVArr: arr
        })
    }

    getSelectClass(avArr: any[], value: string | object | number) {
        let arr = avArr.slice(0, avArr.length);
        arr.push(value);
        return JSON.stringify(this.state.selectVArr) == JSON.stringify(arr) && this.props.selectClass ? this.props.selectClass : '';
    }

    handleDoubleClick(data: UITreeType, avArr: any[]) {
        let vArr = avArr.slice(0, avArr.length);
        vArr.push(data.value);
        if (this.props.handleDbClick)
            this.props.handleDbClick(vArr);
    }
}