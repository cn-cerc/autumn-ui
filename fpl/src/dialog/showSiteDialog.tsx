import React from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import styles from "./showSiteDialog.css";

type UserTypeProps = {
    inputVal: string
} & Partial<BaseDialogPropsType>

type UserTypeState = {
    listCity: string[],
    listCounty: string[],
    Area: string,
    City: string,
    County: string,
    AreaText: string,
    cityText: string,
    CountyText: string,
    showHideIndex: number,
    colorArea: boolean[],
    colorCity: boolean[],
    colorCounty: boolean[]
} & Partial<BaseDialogStateType>


export default class showSiteDialog extends BaseDialog<UserTypeProps, UserTypeState> {
    private provinceArr: string[] = ['上海', '云南', '内蒙古', '北京', '吉林', '四川', '天津', '宁夏', '安徽', '山东', '山西', '广东', '新疆', '江苏', '江西',
        '河北', '河南', '浙江', '海南', '湖北', '湖南', '澳门', '甘肃', '福建', '西藏', '贵州', '辽宁', '重庆', '陕西', '青海', '香港', '黑龙江', '臺灣',];

    constructor(props: UserTypeProps) {
        super(props);
        this.state = {
            ...this.state,
            width: '45rem',
            height: '35rem',
            Area: null,
            City: null,
            County: null,
            AreaText: '省份',
            cityText: '城市',
            CountyText: '县区',
            listCity: ['请选择'],
            listCounty: ['请选择'],
            showHideIndex: 0,
            colorArea: [],
            colorCity: [],
            colorCounty: []
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let cookie = this.props.inputVal.split("/")
        if (cookie.length == 3) {
            this.getData(cookie[0], 'City')
            this.getData(cookie[0] + "`" + cookie[1], 'County')
            setTimeout(() => {
                let index0 = this.provinceArr.findIndex(value => value == cookie[0])
                let colorArea = new Array(this.provinceArr.length).fill(false)
                colorArea[index0] = true
                let index1 = this.state.listCity.findIndex(value => value == cookie[1])
                let colorCity = new Array(this.state.listCity.length).fill(false)
                colorCity[index1] = true
                let index2 = this.state.listCounty.findIndex(value => value == cookie[2])
                let colorCounty = new Array(this.state.listCounty.length).fill(false)
                colorCounty[index2] = true
                this.setState({
                    Area:cookie[0],
                    AreaText:cookie[0],
                    City:cookie[1],
                    cityText:cookie[1],
                    County:cookie[2],
                    CountyText:cookie[2],
                    showHideIndex: 2,
                    colorArea: colorArea,
                    colorCity: colorCity,
                    colorCounty: colorCounty,
                })
            }, 100);
        }
    }

    content() {
        return (
            <div className={styles.main} role='content'>
                <div className={styles.showSiteDialog}>
                    <div className={styles.goSite}>
                        请选择地址：
                        <button className={styles.submit} onClick={this.handleClickBySite.bind(this)}>确定</button>
                    </div>

                    <div className={styles.select}>
                        <li onClick={this.toggle.bind(this, 0)}>{this.state.AreaText}&gt;&gt;</li>
                        <li onClick={this.toggle.bind(this, 1)}>{this.state.cityText}&gt;&gt;</li>
                        <li onClick={this.toggle.bind(this, 2)}>{this.state.CountyText}</li>
                    </div>

                    <div className={styles.site}>
                        {this.getShowHide()}
                    </div>
                </div>
            </div>
        )
    }

    getShowHide() {
        let dom;
        switch (this.state.showHideIndex) {
            case 0:
                dom = <React.Fragment>{this.getProvince()}</React.Fragment>
                break;
            case 1:
                dom = <React.Fragment>{this.getListCity()}</React.Fragment>
                break;
            case 2:
                dom = <React.Fragment>{this.getListCounty()}</React.Fragment>
                break;
        }
        return dom;
    }

    getProvince() {
        let list = this.provinceArr.map((data: string, index: number) => {
            return <a className={this.state.colorArea[index] ? styles.color : styles} onClick={this.Area.bind(this, index)} key={index}>{data}</a>
        })
        return list;
    }

    getListCity() {
        let list = this.state.listCity.map((data: string, index: number) => {
            if (index == 0) {
                return <a key={index}>{data}</a>
            } else {
                return <a className={this.state.colorCity[index] ? styles.color : styles} onClick={this.City.bind(this, index)} key={index}>{data}</a>
            }
        })
        return list;
    }

    getListCounty() {
        let list = this.state.listCounty.map((data: string, index: number) => {
            if (index == 0) {
                return <a key={index}>{data}</a>
            } else {
                return <a className={this.state.colorCounty[index] ? styles.color : styles} onClick={this.County.bind(this, index)} key={index}>{data}</a>
            }
        })
        return list;
    }

    Area(index: number) {
        let colorList = new Array(this.provinceArr.length).fill(false)
        colorList[index] = true
        this.state.Area = this.provinceArr[index]
        this.getData(this.state.Area, 'City')
        this.setState({
            showHideIndex: 1,
            colorArea: colorList
        })
        if (this.state.AreaText == this.provinceArr[index]) {
            return
        } else {
            this.setState({
                AreaText: this.provinceArr[index],
                cityText: "城市",
                CountyText: "县区",
                City: null,
                County: null,
                colorCity: [],
                colorCounty: [],
                listCounty: []
            })
        }
        return false
    }

    City(index: number) {
        let colorList = new Array(this.state.listCity.length).fill(false)
        colorList[index] = true
        this.state.City = this.state.listCity[index]
        let site = this.state.Area + "`" + this.state.City
        this.getData(site, 'County')
        this.setState({
            showHideIndex: 2,
            colorCity: colorList
        })
        if (this.state.cityText == this.state.listCity[index]) {
            return
        } else {
            this.setState({
                cityText: this.state.listCity[index],
                CountyText: "县区",
                County: null,
                colorCounty: []
            })
        }
        return false
    }

    County(index: number) {
        let colorList = new Array(this.state.listCounty.length).fill(false)
        colorList[index] = true
        this.state.County = this.state.listCounty[index]
        this.setState({
            CountyText: this.state.listCounty[index],
            colorCounty: colorList
        })
        let inputArr = this.props.inputId.split(",");
        $("#" + inputArr[0]).val(this.state.Area + "/" + this.state.City + "/" + this.state.County)
        $("#" + inputArr[1]).val(this.state.Area + "/" + this.state.City + "/" + this.state.County)
        this.handleSelect();
        return false
    }

    toggle(num: number) {
        this.setState({
            showHideIndex: num
        })
    }

    getData(site: string, dom: string) {
        fetch('./BaseArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'areaCode=' + site,
        }).then((data) => {
            return data.json();
        }).then((data) => {
            switch (dom) {
                case 'City':
                    this.setState({
                        listCity: data.areaList
                    })
                    break;
                case "County":
                    this.setState({
                        listCounty: data.areaList
                    })
                    break;
            }
        })
    }

    handleClickBySite() {
        console.log(this.props.children)
        if (this.state.Area == null) {
            alert("请选择省份")
            return
        }
        if (this.state.City == null) {
            alert("请选择城市")
            return
        }
        if (this.state.County == null) {
            alert("请选择县区")
            return
        }
    }
}


