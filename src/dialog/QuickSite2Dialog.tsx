import { BaseDialog, BaseDialogPropsType, BaseDialogStateType } from "autumn-ui";
import React from "react";
import ImageConfig from "../static/ImageConfig";
import StaticFile from "../static/StaticFile";
import { GDMap, showMsg } from "../tool/Summer";
import styles from "./QuickSiteDialog.css";
import styles2 from "./QuickSiteDialog2.css";

type QuickSiteDialogTypeProps = {
    siteId: string,
    addressId: string,
    center?: string
} & Partial<BaseDialogPropsType>

type QuickSiteDialogTypeState = {
    site: site,
    driving: any
} & Partial<BaseDialogStateType>

type site = {
    province: string,
    city: string,
    district: string,
    township: string,
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
    district: string    // 区、县
    township: string    //镇、乡
}

export default class QuickSiteDialog2 extends BaseDialog<QuickSiteDialogTypeProps, QuickSiteDialogTypeState> {
    private gdmap: GDMap = new GDMap();
    constructor(props: QuickSiteDialogTypeProps) {
        super(props);
        this.setTitle("选择地址");
        this.state = {
            ...this.state,
            width: this.isPhone ? '100%' : '50rem',
            height: this.isPhone ? '100vh' : '35rem',
            site: {
                province: '',
                city: '',
                district: '',
                name: '',
                township: '',
                lng: 0,
                lat: 0,
                marker: null
            },
            driving: null
        }
    }

    content(): JSX.Element {
        return <div className={styles.main}>
            <div className={`${styles.inputBox} ${styles2.inputDiv}`}>
                <input type="text" id='siteInput' placeholder="请输入查询位置" autoComplete="off" />
                <button onClick={this.handleClick.bind(this)} className={styles.button}>确定</button>
            </div>
            <div id="container" className={styles.container}></div>
        </div>
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.init();
    }

    init() {
        if (this.props.center)
            this.gdmap.initMap('container', {
                center: this.props.center.split(','),
                zoom: 12
            });
        else
            this.gdmap.initMap('container');
        this.gdmap.initPlaceSearch('siteInput', this.setSite.bind(this));
    }

    async setSite(info: addressInfo) {
        if (this.state.site.marker)
            this.state.site.marker.destroy();
        this.setState({
            site: {
                province: info.province,
                city: info.city,
                district: info.district,
                township: info.township,
                name: info.name,
                lng: info.lng,
                lat: info.lat,
                marker: this.gdmap.addMark(info.lng, info.lat, StaticFile.getImage(ImageConfig.ICON_MAPPOINT), [0, 0], [30, 30])
            }
        });
    }

    handleClick() {
        let siteInput = document.getElementById(this.props.siteId) as HTMLInputElement;
        let addressInput = document.getElementById(this.props.addressId) as HTMLInputElement;
        let siteValue = '';
        if (this.state.site.province)
            siteValue = this.state.site.province;
        if (this.state.site.city)
            siteValue += `\\${this.state.site.city}`;
        if (this.state.site.district)
            siteValue += `\\${this.state.site.district}`;
        siteInput.value = siteValue;
        addressInput.value = this.state.site.township + this.state.site.name;
        addressInput.focus();
        this.handleClose();
    }
}