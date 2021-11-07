import React, { ChangeEventHandler, FocusEventHandler, KeyboardEventHandler } from "react";
import "./MutiPage.css";

const buttonStyle = {
    margin: '0.2rem'
}

export type OnPageChanged = (beginPoint: number, endPoint: number) => void;

export const MinPageSize = 20;

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
        this.state = { pageSize: MinPageSize, pageNo: 1, inputValue: '1' }
    }

    render() {
        let pages = Math.ceil(this.props.total / this.state.pageSize);
        return (
            <div className='MutiPage'>
                <span>共 {this.props.total} 条</span>
                <span style={{ margin: '0.5rem' }} />
                <span>每页 </span>
                <select value={this.state.pageSize} onChange={this.onPageSizeChange} style={{
                    width: "4rem",
                    padding: 0
                }}>
                    <option value={MinPageSize}>{MinPageSize}</option>
                    <option value='50'>50</option>
                    <option value='100'>100</option>
                </select>
                <span> 条</span><span style={{ margin: '0.5rem' }} />
                <span> 第 </span>
                <input type="text" style={{ width: '3rem' }} value={this.state.inputValue} onChange={this.onPageNoChange} onKeyPress={this.onPageNoKeyPress}
                    onBlur={this.onPageNoBlur} />
                <span> / {pages} 页</span>
                <span style={{ margin: '0.5rem' }} />
                <button id='first' onClick={this.onNavigatorClick} style={buttonStyle}>首页</button>
                <button id='prior' onClick={this.onNavigatorClick} style={buttonStyle}>上页</button>
                <button id='next' onClick={this.onNavigatorClick} style={buttonStyle}>下页</button>
                <button id='last' onClick={this.onNavigatorClick} style={buttonStyle}>尾页</button>
            </div>
        );
    }

    onPageSizeChange: ChangeEventHandler<HTMLSelectElement> = (sender: any) => {
        let el: HTMLSelectElement = sender.target;
        let pageSize = Number.parseInt(el.value);
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
}