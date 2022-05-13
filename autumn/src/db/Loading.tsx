import React from "react";
import WebControl from "../rcc/WebControl";

type LoadingTypeProps = {
    device?: 'phone' | 'pc'
}

export class Loading extends WebControl<LoadingTypeProps> {
    constructor(props: LoadingTypeProps) {
        super(props)
    }

    render(): React.ReactNode {
        if ((this.isPhone && !this.props.device) || this.props.device == 'phone') {
            return (
                <div className='aui-loading-load'>
                    <div className='aui-loading-loadContent'>
                        <span className='aui-loading-loadSvg'>
                            <svg viewBox="25 25 50 50">
                                <circle cx="50" cy="50" r="20" fill="none"></circle>
                            </svg>
                        </span>
                        <span className='aui-loading-loadMessage'>加载中...</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='aui-loading-loadingContainer'>
                    <div className='aui-loading-loading aui-loading-animation1'></div>
                    <div className='aui-loading-loading aui-loading-animation2'></div>
                    <div className='aui-loading-loading aui-loading-animation3'></div>
                    <div className='aui-loading-loading aui-loading-animation4'></div>
                    <div className='aui-loading-loading aui-loading-animation5'></div>
                    <div className='aui-loading-loading aui-loading-animation6'></div>
                    <div className='aui-loading-loading aui-loading-animation7'></div>
                    <div className='aui-loading-loading aui-loading-animation8'></div>
                    <div className='aui-loading-loading aui-loading-animation9'></div>
                    <div className='aui-loading-loading aui-loading-animation10'></div>
                    <div className='aui-loading-loading aui-loading-animation11'></div>
                    <div className='aui-loading-loading aui-loading-animation12'></div>
                </div>
            )
        }
    }
}