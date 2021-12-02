import React, { MouseEventHandler } from "react";
import styles from "./BaseDialog.css";

export type BaseDialogPropsType = {
    inputId: string,
    width?: string,
    height?: string,
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

export default abstract class BaseDialog<T extends BaseDialogPropsType = BaseDialogPropsType , S extends BaseDialogStateType = BaseDialogStateType> extends React.Component<T, S> {
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
        width: "50%",
        height: "37.5rem",
    } as S;
    private _title: string = '弹窗';
    private _dialogRole: string = '';
    get title(): string { return this._title }
    setTitle(value: string): BaseDialog<T, S> {
        this._title = value;
        return this;
    }
    /** 弹窗主体内容 */
    abstract content():JSX.Element;
    render() {
        this._dialogRole = "dialog" + document.querySelectorAll("[role='dialog']").length;
        return (
            <React.Fragment>
                <div role="dialog">
                    <div className={styles.main} style={this.getStyle.bind(this)()} role={this._dialogRole}>
                        <div className={styles.title} onMouseDown={(e) => this.handleMouseDown(e)}>
                            <span>{this._title}</span>
                            <span className={styles.close} onClick={this.handleClose.bind(this)}>×</span>
                        </div>
                        <div className={styles.content}>
                            {this.content()}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    componentDidMount() {
        $(document).on("mousemove", (e) => this.handleMouseMove(e));
        $(document).on("mouseup", (e) => this.handleMouseUp(e));
        let dialogData = {
            x: ($(window).outerWidth() - $("." + styles.main).outerWidth()) / 2,
            y: ($(window).outerHeight() - $("." + styles.main).outerHeight()) / 2
        }
        this.setState({ 
            ...this.state,
            dialogData: Object.assign({...this.state.dialogData, ...dialogData}),
        });
    }

    handleMouseDown: MouseEventHandler<HTMLDivElement> = (sender: any) => {
        if (!$(sender.target).hasClass(styles.btnClose)) {
            this.state.dialogData.moving = true;
            this.state.dialogData.startX = sender.pageX;
            this.state.dialogData.startY = sender.pageY;
        }
    }

    handleMouseMove: any = (sender: any) => {
        if (this.state.dialogData.moving) {
            sender.stopPropagation();
            sender.preventDefault();
            if (sender.pageX !== 0 && sender.pageY !== 0) {
                this.state.dialogData.moveX = sender.pageX - this.state.dialogData.startX;
                this.state.dialogData.moveY = sender.pageY - this.state.dialogData.startY;
                $("." + styles.main).css({
                    "left": this.state.dialogData.x + this.state.dialogData.moveX,
                    "top": this.state.dialogData.y + this.state.dialogData.moveY
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
        let box = $(`[role="${this._dialogRole}"]`).closest("[role='dialogBox']");
        if (box.length > 0) box.remove();
    }

    // 用于弹窗选择完成之后关闭窗口
    handleSelect() {
        var evt = new Event("input", {"bubbles":true, "cancelable":true});
        document.getElementById(this.props.inputId).dispatchEvent(evt);
        this.handleClose();
    }
}