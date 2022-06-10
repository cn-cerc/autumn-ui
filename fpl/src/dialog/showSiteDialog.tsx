import React from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import styles from "./showSiteDialog.css";
import { data } from "jquery";

type UserTypeProps = {
} & Partial<BaseDialogPropsType>

type UserTypeState = {
    sheng: string,
    shi: string,
    xian: string,
    area1ShowHide: boolean,
    area2ShowHide: boolean,
    area3ShowHide: boolean,
    shengText: string,
    cityText: string,
    xianText: string,
    shengHTML: string,
    shi_HTML: string,
    xian_HTML: string,
    color: any[]
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
            sheng: null,
            shi: null,
            xian: null,
            area1ShowHide: true,
            area2ShowHide: false,
            area3ShowHide: false,
            shengText: '省份',
            cityText: '城市',
            xianText: '县区',
            shengHTML: '',
            shi_HTML: '',
            xian_HTML: '',
            color: [],
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        setTimeout(() => {
            this.onchange()
        }, 100);
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
                        <li id="sheng" onClick={this.toggle.bind(this, 'Area1_')}>{this.state.shengText}</li>
                        <li id="shi" onClick={this.toggle.bind(this, 'Area2_')}>{this.state.cityText}</li>
                        <li id="xian" onClick={this.toggle.bind(this, 'Area3_')}>{this.state.xianText}</li>
                    </div>
                    <div className={`${this.state.area1ShowHide ? styles.show : styles.hide} ${styles.site}`} id='Area1_'>
                        {this.getProvince()}
                    </div>

                    <div className={`${this.state.area2ShowHide ? styles.show : styles.hide} ${styles.site}`} id='Area2_' dangerouslySetInnerHTML={{ __html: this.state.shi_HTML }}>

                    </div>

                    <div className={`${this.state.area3ShowHide ? styles.show : styles.hide} ${styles.site}`} id='Area3_' dangerouslySetInnerHTML={{ __html: this.state.xian_HTML }}>

                    </div>
                </div>
            </div>
        )
    }

    getProvince() {
        let list = this.provinceArr.map((province: string, index: number) => {
            return <a key={index}>{province}</a>
        })
        return list;
    }

    toggle(dom: any) {
        this.setState({
            area1ShowHide: false,
            area2ShowHide: false,
            area3ShowHide: false,
        })
        switch (dom) {
            case 'Area1_':
                this.setState({
                    area1ShowHide: true
                })
                break;
            case 'Area2_':
                this.setState({
                    area2ShowHide: true
                })
                break;
            case 'Area3_':
                this.setState({
                    area3ShowHide: true
                })
                break;
        }
    }

    onchange() {
        let this_ = this
        let but = document.querySelectorAll("#Area1_>a")
        for (let i = 0; i < but.length; i++) {
            //@ts-ignore
            but[i].onclick = function () {
                this_.state.sheng = this.innerHTML
                this_.fetch(this_.state.sheng, '#Area2_', this_)
                this_.setState({
                    shi_HTML: "",
                    xian_HTML: "",
                    area1ShowHide: false,
                    area2ShowHide: true,
                    area3ShowHide: false,
                })
                $("#Area1_>a").css('background', '');
                console.dir(this)
                $(this).css('background', '#3273F4')
                this_.onchange()
                if ($("#sheng").html() == this.innerHTML) {
                    return
                } else {
                    this_.setState({
                        shengText: this.innerHTML,
                        cityText: "城市",
                        xianText: "县区",
                        shi: null,
                        xian: null,
                    })
                }
                return false
            }
        }

        setTimeout(() => {
            let shi = document.querySelectorAll("#Area2_>a")
            for (let k = 0; k < shi.length; k++) {
                //@ts-ignore
                shi[k].onclick = function () {
                    this_.state.shi = this.innerHTML
                    let xxx = this_.state.sheng + "`" + this_.state.shi
                    this_.fetch(xxx, '#Area3_', this_)
                    this_.setState({
                        xian_HTML: "",
                        area1ShowHide: false,
                        area2ShowHide: false,
                        area3ShowHide: true,
                    })
                    $("#Area2_>a").css('background', '')
                    $(this).css('background', '#3273F4')
                    this_.onchange()

                    if ($("#shi").html() == this.innerHTML) {
                        return
                    } else {
                        this_.setState({
                            cityText: this.innerHTML,
                            xianText: "县区",
                            xian: null
                        })
                    }
                    return false
                }
            }
        }, 100);

        setTimeout(() => {
            let xian = document.querySelectorAll("#Area3_>a")
            for (let k = 0; k < xian.length; k++) {
                //@ts-ignore
                xian[k].onclick = function () {
                    this_.state.xian = this.innerHTML
                    this_.setState({
                        xianText: this.innerHTML,
                    })
                    $("#Area3_>a").css('background', '')
                    $(this).css('background', '#3273F4')
                    let x = this_.props.inputId.split(",");
                    $("#" + x[0]).val(this_.state.sheng + "/" + this_.state.shi + "/" + this_.state.xian)
                    $("#" + x[1]).val(this_.state.sheng + "/" + this_.state.shi + "/" + this_.state.xian)
                    this_.handleSelect();
                    return false
                }
            }
        }, 100);

    }

    handleClickBySite() {
        if (this.state.sheng == null) {
            alert("请选择省份")
            return
        }
        if (this.state.shi == null) {
            alert("请选择城市")
            return
        }
        if (this.state.xian == null) {
            alert("请选择县区")
            return
        }

    }

    fetch(site: string, dom: string, this_: this) {
        fetch('./BaseArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'areaCode=' + site,
        }).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data)
            // $.each(data.areaList, function (key, value) {
            //     if (key == 0)
            //         // $(dom).append(
            //         //     "<div>" + value + "</div>");
            //         switch (dom) {
            //             case '#Area2_':
            //                 this_.setState({
            //                     shi_HTML: "<div>" + value + "</div>",
            //                 })
            //                 break;
            //             case '#Area3_':
            //                 this_.setState({
            //                     xian_HTML: "<div>" + value + "</div>",
            //                 })
            //                 break;
            //         }

            //     else
            //         // $(dom).append(
            //         //     "<a>" + value + "</a>");
            //         switch (dom) {
            //             case '#Area2_':
            //                 this_.setState({
            //                     shi_HTML: this_.state.shi_HTML + "<a>" + value + "</a>",
            //                 })
            //                 break;
            //             case '#Area3_':
            //                 this_.setState({
            //                     xian_HTML: this_.state.xian_HTML + <a className={''}> + value + </a>,
            //                 })
            //                 break;
            //         }

            // });

        })
    }

}


