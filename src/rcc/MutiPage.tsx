import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "react";
import styles from "./MutiPage.css";

export type OnPageChanged = (beginPoint: number, endPoint: number) => void;
export const DefaultPageSize = 100;

export const USER_PAGE_SIZE_KEY = 'user:pageSize';

type propsType = {
    onPageChanged: OnPageChanged
    total: number;
}

type stateType = {
    pageSize: number;
    pageNo: number;
    inputValue: string;
}

export default class MutiPage extends React.Component<propsType, stateType> {
    constructor(props: propsType) {
        super(props);
        let value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        let size = Number(value);
        if (!size) {
            size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(size));
        }
        this.state = { pageSize: size, pageNo: 1, inputValue: '1' }
    }

    render() {
        let pages = Math.ceil(this.props.total / this.state.pageSize);
        return (
            <div className={styles.main}>
                <span>共 {this.props.total} 条</span>
                <span style={{ margin: '0.5rem' }} />
                <span>每页 </span>
                <select value={this.state.pageSize} onChange={this.onPageSizeChange} style={{
                    width: "4rem",
                    padding: 0
                }}>
                    <option value='20'>20</option>
                    <option value='50'>50</option>
                    <option value={DefaultPageSize}>{DefaultPageSize}</option>
                    <option value='200'>200</option>
                    <option value='500'>500</option>
                </select>
                <span> 条</span><span style={{ margin: '0.5rem' }} />
                <span> 第 </span>
                <input type="text" style={{ width: '3rem' }} value={this.state.inputValue} onChange={this.onPageNoChange} onKeyPress={this.onPageNoKeyPress}
                    onBlur={this.onPageNoBlur} />
                <span> / {pages} 页</span>
                <span style={{ margin: '0.5rem' }} />
                <button id='first' onClick={this.onNavigatorClick}>首页</button>
                <button id='prior' onClick={this.onNavigatorClick}>上页</button>
                <button id='next' onClick={this.onNavigatorClick}>下页</button>
                <button id='last' onClick={this.onNavigatorClick}>尾页</button>
            </div>
        );
    }

    onPageSizeChange: ChangeEventHandler<HTMLSelectElement> = (sender: any) => {
        let el: HTMLSelectElement = sender.target;
        let pageSize = Number.parseInt(el.value);
        if (pageSize) {
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(pageSize));
        }
        let pageNo = this.state.pageNo;
        let maxPage = Math.ceil(this.props.total / pageSize);
        if (pageNo > maxPage)
            pageNo = maxPage;
        this.setState({ ...this.state, pageSize, pageNo, inputValue: '' + pageNo });
        this.pageChanged(pageSize, pageNo);
    }

    onPageNoChange: ChangeEventHandler<HTMLInputElement> = (sender: any) => {
        let el: HTMLSelectElement = sender.target;
        this.setState({ ...this.state, inputValue: el.value });
    }

    onPageNoKeyPress: KeyboardEventHandler<HTMLInputElement> = (sender: any) => {
        let el: HTMLSelectElement = sender.target;
        if (sender.charCode == 13)
            this.updatePageNo(Number.parseInt(this.state.inputValue))
    }

    onPageNoBlur: FocusEventHandler<HTMLInputElement> = () => {
        this.updatePageNo(Number.parseInt(this.state.inputValue))
    }

    updatePageNo(pageNo: number) {
        let maxPage = Math.ceil(this.props.total / this.state.pageSize);
        if (pageNo > 0 && pageNo <= maxPage) {
            if (pageNo != this.state.pageNo) {
                this.setState({ ...this.state, pageNo });
                this.pageChanged(this.state.pageSize, pageNo);
            }
        } else {
            let inputValue = '' + this.state.pageNo;
            if (inputValue != this.state.inputValue)
                this.setState({ ...this.state, inputValue });
        }
    }

    onNavigatorClick = (el: any) => {
        let pageNo = this.state.pageNo;
        switch (el.target.id) {
            case 'first':
                pageNo = 1;
                break;
            case 'prior':
                if (pageNo > 1)
                    pageNo -= 1;
                break;
            case 'next':
                let maxPage = Math.ceil(this.props.total / this.state.pageSize);
                if (pageNo < maxPage)
                    pageNo += 1;
                break;
            case 'last':
                pageNo = Math.ceil(this.props.total / this.state.pageSize);
                break;
            default:
                throw Error('error: ' + el.target.id);
        }
        let dbgrid = document.querySelector('div[role="dbgrid"]');
        if (dbgrid) dbgrid.scroll({ top: 0 });
        let grid = document.querySelector('div[role="grid"]');
        if (grid) grid.scroll({ top: 0 });
        if (pageNo != this.state.pageNo) {
            this.setState({ ...this.state, pageNo, inputValue: '' + pageNo })
            this.pageChanged(this.state.pageSize, pageNo);
        }
    }

    pageChanged(pageSize: number, pageNo: number) {
        if (!this.props.onPageChanged)
            return;

        let total = this.props.total;
        let beginPoint = pageSize * (pageNo - 1) + 1;
        let endPoint = pageNo * pageSize > total ? total : pageNo * pageSize;

        this.props.onPageChanged(beginPoint, endPoint)
    }

    reload() {
        let value = localStorage.getItem(USER_PAGE_SIZE_KEY);
        let size = Number(value);
        if (!size) {
            size = DefaultPageSize;
            localStorage.setItem(USER_PAGE_SIZE_KEY, String(size));
        }
        this.setState({ pageSize: size, pageNo: 1, inputValue: '1' });
    }
}