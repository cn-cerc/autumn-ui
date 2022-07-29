import { BaseDialog, BaseDialogPropsType, BaseDialogStateType } from "autumn-ui";
import React from "react";
import StaticFile from "../static/StaticFile";
import { GDMap, showMsg } from "../tool/Summer";
import styles from "./QuickSiteDialog.css";

type QuickSiteDialogTypeProps = {

}

type QuickSiteDialogTypeState = {
    siteArr: [site, site],
    driving: any
} & Partial<BaseDialogStateType>

type site = {
    province: string,
    city: string,
    district: string,
    name: string,
    lng: number,
    lat: number,
    marker: any;
}

type addressInfo = {
    lng: number,    // 经度
    lat: number,    // 纬度
    name: string,   // 详细位置
    province: string,   // 省
    city: string,   // 市
    district: string    // 区
}

export default class QuickSiteDialog extends BaseDialog<BaseDialogPropsType, QuickSiteDialogTypeState> {
    private gdmap: GDMap = new GDMap();
    constructor(props: QuickSiteDialogTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            width: this.isPhone ? '100%' : '50rem',
            height: '35rem',
            siteArr: [{
                province: '',
                city: '',
                district: '',
                name: '',
                lng: 0,
                lat: 0,
                marker: null
            }, {
                province: '',
                city: '',
                district: '',
                name: '',
                lng: 0,
                lat: 0,
                marker: null
            }],
            driving: null
        }
    }

    content(): JSX.Element {
        return <div className={styles.main}>
            <div className={styles.inputBox}>
                <input type="text" id='startInput' placeholder="请输入起点"/>
                <input type="text" id='endInput' placeholder="请输入终点"/>
            </div>
            <div id="container" className={styles.container}></div>
            <button onClick={this.handleClick.bind(this)} className={styles.button}>确定</button>
        </div>
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.init();
    }

    init() {
        this.gdmap.initMap('container');
        this.gdmap.initPlaceSearch('startInput', this.setStart.bind(this));
        this.gdmap.initPlaceSearch('endInput', this.setEnd.bind(this));
    }

    async setStart(info: addressInfo) {
        if (this.state.siteArr[0].marker)
            this.state.siteArr[0].marker.destroy();
        this.state.siteArr[0] = {
            province: info.province,
            city: info.city,
            district: info.district,
            name: info.name,
            lng: info.lng,
            lat: info.lat,
            marker: this.gdmap.addMark(info.lng, info.lat, StaticFile.getImage('images/public/startSite.png'), [-24, -48])
        }
        this.setState(this.state, () => {
            this.showLine();
        });
    }

    async setEnd(info: addressInfo) {
        if (this.state.siteArr[1].marker)
            this.state.siteArr[1].marker.destroy();
        this.state.siteArr[1] = {
            province: info.province,
            city: info.city,
            district: info.district,
            name: info.name,
            lng: info.lng,
            lat: info.lat,
            marker: this.gdmap.addMark(info.lng, info.lat, StaticFile.getImage('images/public/endSite.png'), [-24, -48])
        }
        this.setState(this.state, () => {
            this.showLine();
        });
    }

    showLine() {
        if (this.state.siteArr[0].province && this.state.siteArr[1].province) {
            if (this.state.driving)
                this.state.driving.clear();
            this.gdmap.showLine(this.state.siteArr[0].lng, this.state.siteArr[0].lat, this.state.siteArr[1].lng, this.state.siteArr[1].lat, (driving: any) => {
                this.setState({
                    driving
                })
            })
        }
    }

    handleClick() {
        if(!this.state.siteArr[0].province && !this.state.siteArr[1].province) {
            showMsg('起点和终点不可都为空！');
            return;
        }
        let inputArr: string[] = this.props.inputId.split(',');
        if (inputArr[0] && this.state.siteArr[0].province) {
            let input1 = document.getElementById(inputArr[0]) as HTMLInputElement;
            let value = '';
            if (this.state.siteArr[0].province)
                value = this.state.siteArr[0].province;
            if (this.state.siteArr[0].city)
                value += `/${this.state.siteArr[0].city}`;
            if (this.state.siteArr[0].district)
                value += `/${this.state.siteArr[0].district}`;
            input1.value = value;
        }
        if (inputArr[1] && this.state.siteArr[0].province) {
            let input2 = document.getElementById(inputArr[1]) as HTMLInputElement;
            input2.value = this.state.siteArr[0].name;
        }
        if (inputArr[2] && this.state.siteArr[1].province) {
            let input3 = document.getElementById(inputArr[2]) as HTMLInputElement;
            let value = '';
            if (this.state.siteArr[1].province)
                value = this.state.siteArr[1].province;
            if (this.state.siteArr[1].city)
                value += `/${this.state.siteArr[1].city}`;
            if (this.state.siteArr[1].district)
                value += `/${this.state.siteArr[1].district}`;
            input3.value = value;
        }
        if (inputArr[3] && this.state.siteArr[1].province) {
            let input4 = document.getElementById(inputArr[3]) as HTMLInputElement;
            input4.value = this.state.siteArr[1].name;
        }
        this.handleClose();
    }
}