import { DataRow, DataSet, DBEdit, WebControl } from "autumn-ui";
import React from "react";
import { ReactNode } from "react";
import FplApi from "../api/FplApi";
import ApplicationConfig from "../static/ApplicationConfig";
import StaticFile from "../static/StaticFile";
import { addScript, GDMap, showMsg } from "../tool/Summer";
import styles from "./FrmCarGpsDevice.css";

type FrmCarGpsDeviceTypeProps = {
    lonlat: string,
}

type FrmCarGpsDeviceTypeState = {
    dataMap: Map<string, corpData>,
    dataIn: DataRow,
    carData: DataSet,
    carMap: Map<string, DataRow>,
    isSearch: boolean,
    currentCarData: carData
}

type corpData = {
    name: string,
    num: number,
    code: string,
    showChild: boolean,
    fleets: Map<string, fleetData>
}

type fleetData = {
    name: string,
    num: number,
    init: boolean,
    data: DataSet,
    searchData: DataSet,
    showChild: boolean,
}

type carData = {
    code: string,
    name: string,
    data: DataRow
}

export default class FrmCarGpsDevice extends WebControl<FrmCarGpsDeviceTypeProps, FrmCarGpsDeviceTypeState> {
    private isInitMap: boolean = false;
    private gdmap: GDMap = new GDMap();
    private timer: any;
    constructor(props: FrmCarGpsDeviceTypeProps) {
        super(props);
        let dataIn = new DataRow();
        dataIn.setValue('plate_number_', '');
        this.state = {
            dataMap: null,
            carMap: null,
            dataIn,
            carData: new DataSet(),
            isSearch: false,
            currentCarData: null,
        }
    }

    render(): ReactNode {
        return <div className={styles.main}>
            <div className={styles.search}>
                <form className={styles.searchDOM} onSubmit={(e) => { e.preventDefault(); this.handleSearch() }}>
                    <img src={StaticFile.getImage('images/icon/search.png')} />
                    <DBEdit dataField='plate_number_' dataRow={this.state.dataIn} placeholder='请输入车牌号'></DBEdit>
                </form>
                <div className={styles.tree}>
                    {this.getTree()}
                </div>
            </div>
            <div className={styles.map}>
                <ul className={styles.mapTitle}>
                    <li className={styles.active}>地图模式</li>
                    <li onClick={this.linkTo.bind(this)}>视频模式</li>
                </ul>
                <div className={styles.mapContainer} id='carMapContainer'></div>
            </div>
        </div>
    }

    componentDidMount(): void {
        this.init();
        this.timer = setInterval(this.initMap.bind(this), 30000);
        addScript(`https://webapi.amap.com/maps?v=2.0&key=${ApplicationConfig.MAPKEY}`, () => {
            this.isInitMap = true;
            this.initMap();
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    init() {
        FplApi.getCorpAndCus().then((data) => {
            data.first();
            let dataMap = new Map();
            while (data.fetch()) {
                let corpName = data.getString('corp_name_');
                let corpNum = data.getDouble('total_num_');
                let corpCode = data.getString('corp_no_');
                let cusName = data.getString('cus_name_');
                let cusNum = data.getDouble('num_');
                let corpObj: corpData = dataMap.get(corpCode);
                if (!corpObj) {
                    let map = new Map();
                    map.set(cusName, {
                        name: cusName,
                        num: cusNum,
                        data: new DataSet(),
                        init: false,
                        showChild: false,
                        searchData: new DataSet()
                    })
                    let corpData: corpData = {
                        name: corpName,
                        num: corpNum,
                        code: corpCode,
                        showChild: false,
                        fleets: map
                    }
                    dataMap.set(corpCode, corpData);
                } else {
                    corpObj.fleets.set(cusName, {
                        name: cusName,
                        num: cusNum,
                        init: false,
                        data: new DataSet(),
                        showChild: false,
                        searchData: new DataSet()
                    })
                }
            }
            this.setState({
                dataMap
            })
        })
    }

    getTree() {
        if (!this.state.dataMap)
            return;
        let values = Array.from(this.state.dataMap.values());
        let arr1 = values.map((corpData) => {
            return this.getLevel1(corpData);
        });
        return <div>{arr1}</div>
    }

    getLevel1(corpData: corpData) {
        return <React.Fragment key={corpData.code}>
            <div className={styles.corpLine}>
                <img src={StaticFile.getImage('images/public/header_menu.png')} className={`${styles.icon} ${corpData.showChild ? '' : styles.hideIcon}`} onClick={() => {
                    corpData.showChild = !corpData.showChild;
                    this.setState(this.state);
                }} />
                <div><span>{corpData.name}({corpData.num})</span></div>
            </div>
            <div style={{ display: corpData.showChild ? 'block' : 'none' }}>{this.getLevel2(corpData.fleets, corpData.code)}</div>
        </React.Fragment>
    }

    getLevel2(fleets: Map<string, fleetData>, code: string) {
        let lists = Array.from(fleets.values());
        let list = lists.map((fleetData) => {
            let dataList = [];
            let ds = new DataSet();
            let key = `${code}-${fleetData.name}`;
            ds.appendDataSet(fleetData.searchData);
            ds.first();
            while (ds.fetch()) {
                dataList.push(<li key={`${key}-${ds.recNo}`}>
                    <span onClick={this.handleClick.bind(this, ds.current, code, fleetData.name)} className={this.isHover(code, fleetData.name, ds.getString('plate_number_')) ? styles.carHover : ''}>{ds.getString('plate_number_')}</span>
                </li>)
            }
            return <div key={key}>
                <div className={styles.cusLine}>
                    <img src={StaticFile.getImage('images/public/header_menu.png')} className={`${styles.icon} ${fleetData.showChild ? '' : styles.hideIcon}`} onClick={this.cusClick.bind(this, fleetData, code)} />
                    <div><span>{fleetData.name}({fleetData.num})</span></div>
                </div>
                <ul style={{ display: fleetData.showChild ? 'block' : 'none' }} className={styles.carList}>{dataList}</ul>
            </div>
        })
        return list
    }

    async cusClick(fleetData: fleetData, code: string) {
        if (!fleetData.init && !fleetData.showChild) {
            let dataIn = new DataRow();
            dataIn.setValue('corp_no_', code);
            dataIn.setValue('cus_name_', fleetData.name);
            let dataOut = await FplApi.getCarGpsDevice(dataIn);
            fleetData.data = dataOut;
            let plateNumber = this.state.dataIn.getString('plate_number_');
            if (plateNumber) {
                let searchData = new DataSet();
                dataOut.first();
                while (dataOut.fetch()) {
                    if (dataOut.getString('plate_number_').indexOf(plateNumber) > -1)
                        searchData.append().copyRecord(dataOut.current);
                }
                fleetData.searchData = searchData;
            } else {
                fleetData.searchData = dataOut;
            }
            fleetData.init = true;
        } else {
            let plateNumber = this.state.dataIn.getString('plate_number_');
            let data = new DataSet();
            data.appendDataSet(fleetData.data);
            if (plateNumber) {
                let searchData = new DataSet();
                data.first();
                while (data.fetch()) {
                    if (data.getString('plate_number_').indexOf(plateNumber))
                        searchData.append().copyRecord(data.current);
                }
                fleetData.searchData = searchData;
            } else {
                fleetData.searchData = data;
            }
        }
        fleetData.showChild = !fleetData.showChild;
        this.setState(this.state);
    }

    handleClick(row: DataRow, code: string, name: string) {
        let dataRow = this.state.carMap.get(row.getString('plate_number_'));
        if (dataRow) {
            this.gdmap.map.setZoom(16);
            this.gdmap.map.setCenter([dataRow.getString('lon_'), dataRow.getString('lat_')]);
        }
        this.setState({
            currentCarData: {
                data: row,
                code,
                name
            }
        })
    }

    async handleSearch() {
        this.setState({
            isSearch: true
        })
        let dataOut = await FplApi.getByPlateNumber(this.state.dataIn);
        dataOut.first();
        let map = new Map();
        let values = Array.from(this.state.dataMap.values());
        values.forEach((corpData) => {
            let values2 = Array.from(corpData.fleets.values());
            values2.forEach((fleetData) => {
                fleetData.showChild = false;
            })
        });
        while (dataOut.fetch()) {
            let corpCode = dataOut.getString('corp_no_');
            let cusName = dataOut.getString('cus_name_');
            let corpData = this.state.dataMap.get(corpCode);
            let fleetData = corpData.fleets.get(cusName);
            if (!map.get(`${corpCode}_${cusName}`))
                fleetData.searchData = new DataSet();
            fleetData.searchData.append().copyRecord(dataOut.current);
            if (!corpData.showChild)
                corpData.showChild = true;
            if (!fleetData.showChild)
                fleetData.showChild = true;
            map.set(`${corpCode}_${cusName}`, true);
        }
        this.setState(this.state);
    }

    isHover(code: string, name: string, plataName: string) {
        let bool = false;
        if (this.state.currentCarData && this.state.currentCarData.code == code && this.state.currentCarData.name == name && this.state.currentCarData.data.getString('plate_number_') == plataName)
            bool = true;
        return bool;
    }

    initMap() {
        if (!this.isInitMap)
            return;
        if (!this.gdmap.map)
            this.gdmap.initMap('carMapContainer', {
                zoom: 8,
                center: this.props.lonlat.split(',')
            });

        FplApi.getQueryCarsLocation().then((queryCarsLocation) => {
            let carMap = new Map();
            queryCarsLocation.first();
            while (queryCarsLocation.fetch()) {
                carMap.set(queryCarsLocation.getString('plate_number_'), queryCarsLocation.current);
            }
            this.setState({
                carData: queryCarsLocation,
                carMap
            }, () => {
                this.initCarData();
            })
        })
    }

    async initCarData() {
        let carData = this.state.carData;
        this.setState({
            carData,
        }, () => {
            this.initCarSite();
        })
    }

    initCarSite() {
        this.gdmap.clear();
        let ds = new DataSet();
        ds.appendDataSet(this.state.carData);
        ds.first();
        while (ds.fetch()) {
            this.gdmap.addLableMark({
                position: [ds.getDouble('lon_'), ds.getDouble('lat_')],
            }, `<div class="input-card content-window-card">
                    <div style="color:#666;">
                        <h4 style="font-size: 1.2em;color: #333;padding-right: 1rem;margin-bottom:10px;">车牌号: ${ds.getString('plate_number_')}</h4>
                        <p style="margin-bottom:5px; white-space: nowrap;">最后GPS时间: ${ds.getString('gtm_')}</p>
                        <p style="margin-bottom:5px; white-space: nowrap;">总公里数: ${ds.getString('mlg_')}</p>
                        <p style="margin-bottom:5px; white-space: nowrap;">速度: ${ds.getString('spd_')}</p>
                        <p style="margin-bottom:5px; white-space: nowrap;">海拔: ${ds.getString('hgt_')}</p>
                        <p style="margin-bottom:5px; white-space: nowrap;">地址: ${ds.getString('address_')}</p>
                        <p style="margin-bottom:5px; white-space: nowrap;">状态信息: ${ds.getString('remark_')}</p>
                    </div>
                </div>`)
        }
    }

    linkTo() {
        if (!this.state.currentCarData) {
            showMsg('请先选择要查看的车辆');
            return;
        }
        window.open(`FrmCarInstant.toVideo?plateNumber=${this.state.currentCarData.data.getString('plate_number_')}&colorCode=${this.state.currentCarData.data.getString('color_code_')}`, '_target');
    }
}