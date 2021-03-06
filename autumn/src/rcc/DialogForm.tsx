import React, { DragEventHandler, isValidElement, MouseEventHandler, ReactNode } from "react";
import DataRow from "../db/DataRow";
import DataSet from "../db/DataSet";
import DataSource from "../db/DataSource";

export type OnSelectDataSetEvent = (values: DataSet) => void;

type DialogFormProps = {
    title: string;
    style?: object;
    dataSource?: DataSource;
    onSelect?: OnSelectDataSetEvent;
    active: () => boolean;
    setActive: (active: boolean) => void;
    children?: ReactNode | undefined
}

type stateType = {
    active: () => boolean,
    move: any,
    site: {
        x: number,
        y: number
    }
}

export class DialogForm extends React.Component<DialogFormProps, stateType> {

    constructor(props: DialogFormProps) {
        super(props)
        this.state = {
            active: this.props.active,
            move: {
                moving: false,
                startX: '',
                startY: '',
                moveX: '',
                moveY: ''
            },
            site: {
                x: 0,
                y: 0
            }
        }
    }

    render() {
        return (<div className='aui-dialogForm-main'>
            <button className='aui-dialogFrom-btnShow' onClick={this.btnShow}>
                <img src="https://www.diteng.site/public/images/searchIocn.png" />
            </button>
            <div className={this.props.active() ? 'aui-dialogForm-client' : 'aui-hidden'}
                style={this.getStyle.bind(this)()}
                id="dialogMain"
                >
                <div className='aui-dialogForm-main'>
                    <div className='aui-dialogForm-title' onMouseDown={(e)=>this.handleMouseDown(e)}>
                        <span>{this.props.title}</span>
                        <span className='aui-dialogForm-btnClose' onClick={(e)=>this.btnClose(e)}>X</span>
                    </div>
                    <div className='aui-dialogForm-content'>
                        {React.Children.map(this.props.children, child => {
                            if (isValidElement(child))
                                return React.cloneElement(child, { onSelect: this.onSelect })
                            else
                                return child
                        })}
                    </div>
                </div>
            </div>
        </div >)
    }

    componentDidMount() {
        this.state.site.x = ($(window).outerWidth() - $("#dialogMain").width()) / 2;
        this.state.site.y = ($(window).outerHeight() - $("#dialogMain").height()) / 2;
        $(document).on("mousemove", (e)=>this.handleMouseMove(e));
        $(document).on("mouseup", (e)=>this.handleMouseUp(e));
    }

    onSelect = (values: DataRow) => {
        if (this.props.onSelect) {
            let ds = new DataSet()
            ds.append().copyRecord(values)
            this.setState({ ...this.state, active: () => false })
            this.props.onSelect(ds);
        }
    }

    btnShow: any = (sender: any) => {
        if (this.props.setActive)
            this.props.setActive(true);
    }

    btnClose: any = (sender: any) => {
        sender.preventDefault();
        sender.stopPropagation();
        if (this.props.setActive)
            this.props.setActive(false);
    }

    handleMouseDown: MouseEventHandler<HTMLDivElement> = (sender: any) => {
        if(!$(sender.target).hasClass('aui-dialogForm-btnClose')) {
            this.state.move.moving = true;
            this.state.move.startX = sender.pageX;
            this.state.move.startY = sender.pageY;
        }
    }

    handleMouseMove: any = (sender: any) => {
        if(this.state.move.moving) {
            sender.stopPropagation();
            sender.preventDefault();
            if(sender.pageX !== 0 && sender.pageY !== 0) {
                this.state.move.moveX = sender.pageX - this.state.move.startX;
                this.state.move.moveY = sender.pageY - this.state.move.startY;
                $("#dialogMain").css({
                    "left": this.state.site.x + this.state.move.moveX,
                    "top": this.state.site.y + this.state.move.moveY
                })
            }
        }
    }

    handleMouseUp: any = (sender: any) => {
        if(this.state.move.moving) {
            this.state.move.moving = false;
            this.state.site.x = this.state.site.x + this.state.move.moveX;
            this.state.site.y = this.state.site.y + this.state.move.moveY;
            this.setState({...this.state})
        }
    }

    getStyle() {
        let style: any = {
            height: '80%', 
            width: '80%',
        };
        if(this.state.site.x) {
            style.left = this.state.site.x;
        }
        if(this.state.site.y) {
            style.top = this.state.site.y;
        }
        return Object.assign(style, this.props.style);
    }

}