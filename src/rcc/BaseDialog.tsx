import React, { MouseEventHandler } from "react";
import styles from "./BaseDialog.css";
import WebControl from "./WebControl";

export type BaseDialogPropsType = {
    inputId?: string,
    width?: string,
    height?: string,
    isChild?: boolean,
}

type MoveData = {
    moving: boolean,
    startX: number,
    startY: number,
    moveX: number,
    moveY: number,
    x: number,
    y: number
}

export type BaseDialogStateType = {
    dialogData?: MoveData;
    width?: string,
    height?: string
}

export default abstract class BaseDialog<T extends BaseDialogPropsType = BaseDialogPropsType, S extends BaseDialogStateType = BaseDialogStateType> extends WebControl<T, S> {
    state = {
        dialogData: {
            moving: false,
            startX: 0,
            startY: 0,
            moveX: 0,
            moveY: 0,
            x: 0,
            y: 0
        },
        width: '50%',
        height: this.isPhone ? '25rem' : '37.5rem',
    } as S;
    private _title: string = '弹窗选择';
    private _dialogRole: string = '';
    private _load: boolean = false;
    private _showAsChild: boolean = false;
    private _searchTimeOut: number = 259200000 //查询缓存超时时间(3天);
    get title(): string { return this._title }
    setTitle(value: string): BaseDialog<T, S> {
        this._title = value;
        return this;
    }
    get load(): boolean { return this._load }
    setLoad(value: boolean): BaseDialog<T, S> {
        this._load = value;
        this.setState({ ...this.state });
        return this;
    }
    setStorage(key: string, value: any): void {
        window.localStorage.setItem(this.getStorageKey(key), value);
    }
    getStorage(key: string): string {
        return window.localStorage.getItem(this.getStorageKey(key));
    }
    delStorage(key: string): void {
        window.localStorage.removeItem(this.getStorageKey(key))
    }
    getStorageKey(key: string): string {
        let account = localStorage.getItem('ErpKey_Account1');
        return `ditengDialog_${account}_${key}`
    }
    get searchTimeOut(): number { return this._searchTimeOut }
    /** 弹窗主体内容 */
    abstract content(): JSX.Element;
    render() {
        this._dialogRole = 'dialog' + document.querySelectorAll("[role='dialog']").length;
        return (
            <React.Fragment>
                {this.getAdornment()}
                {this.getDialog()}
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.initSite();
    }

    handleMouseDown: MouseEventHandler<HTMLDivElement> = (sender: any) => {
        if (!$(sender.target).hasClass(styles.btnClose)) {
            this.state.dialogData.moving = true;
            this.state.dialogData.startX = sender.pageX;
            this.state.dialogData.startY = sender.pageY;
            this.state.dialogData.moveX = 0;
            this.state.dialogData.moveY = 0;
        }
    }

    handleMouseMove: any = (sender: any) => {
        if (this.state.dialogData.moving) {
            sender.stopPropagation();
            sender.preventDefault();
            if (sender.pageX !== 0 && sender.pageY !== 0) {
                this.state.dialogData.moveX = sender.pageX - this.state.dialogData.startX;
                this.state.dialogData.moveY = sender.pageY - this.state.dialogData.startY;
                $('.' + styles.main).eq($('.' + styles.main).length - 1).css({
                    'left': this.state.dialogData.x + this.state.dialogData.moveX,
                    'top': this.state.dialogData.y + this.state.dialogData.moveY
                })
            }
        }
    }

    handleMouseUp: any = (sender: any) => {
        if (this.state.dialogData.moving) {
            this.state.dialogData.moving = false;
            this.state.dialogData.x = this.state.dialogData.x + this.state.dialogData.moveX;
            this.state.dialogData.y = this.state.dialogData.y + this.state.dialogData.moveY;
            this.setState({ ...this.state });
        }
    }

    initSite() {
        $(document).on('mousemove', (e) => this.handleMouseMove(e));
        $(document).on('mouseup', (e) => this.handleMouseUp(e));
        let offsetTop = ($(window).outerHeight() - $('.' + styles.main).outerHeight()) / 2;
        let dialogData = {
            x: ($(window).outerWidth() - $('.' + styles.main).outerWidth()) / 2,
            y: offsetTop < 0 ? 0 : offsetTop,
        }
        this.setState({
            ...this.state,
            dialogData: Object.assign({ ...this.state.dialogData, ...dialogData }),
        });
    }

    getStyle() {
        let width = this.state.width;
        let height = this.state.height;
        let style: any = {
            width,
            height
        };
        if (this.state.dialogData.x) {
            style.left = this.state.dialogData.x;
        }
        if (this.state.dialogData.y) {
            style.top = this.state.dialogData.y;
        }
        return style;
    }

    // 用于关闭窗口
    handleClose() {
        if (this.props.isChild) {
            this._showAsChild = false;
            this.setState({ ...this.state });
        } else {
            let box = document.getElementById('dialogBox');
            //@ts-ignore
            ReactDOM.unmountComponentAtNode(box);
            if (box) box.remove();
        }
    }

    // 用于弹窗选择完成之后关闭窗口
    handleSelect() {
        var evt = new Event('input', { 'bubbles': true, 'cancelable': true });
        let inputIds = this.props.inputId.split(',');
        if (inputIds.length == 1) {
            document.getElementById(this.props.inputId).dispatchEvent(evt);
        } else {
            inputIds.forEach((inputId) => {
                document.getElementById(inputId).dispatchEvent(evt);
            })
        }
        this.handleClose();
    }

    getDialog() {
        if (!this.props.isChild || this._showAsChild) {
            return (
                <div role='dialog' id='dialog'>
                    <div className={styles.main} style={this.getStyle.bind(this)()} role={this._dialogRole}>
                        <div className={styles.title} onMouseDown={(e) => this.handleMouseDown(e)}>
                            <span>{this._title}</span>
                            {this.getOperate()}
                        </div>
                        <div className={styles.content}>
                            {this.content()}
                            {this.getLoad()}
                        </div>
                    </div>
                </div>
            )
        }
    }

    getOperate() {
        return <span className={styles.close} onClick={this.handleClose.bind(this)}>×</span>
    }

    getLoad() {
        if (this._load) {
            return (
                <div className={styles.load}>
                    <img src='https://www.diteng.site/911001/images/loading.gif' />
                    <span>系统正在查询中,请稍后...</span>
                </div>
            )
        }
    }

    getAdornment(): React.ReactNode {
        if (this.props.isChild)
            return <img src='https://www.diteng.site/911001/images/searchIocn.png' onClick={this.showAsChild.bind(this)} className={styles.showDialog} />
    }

    showAsChild() {
        this._showAsChild = true;
        this.setState({ ...this.state }, () => {
            this.initSite();
        });
    }
}