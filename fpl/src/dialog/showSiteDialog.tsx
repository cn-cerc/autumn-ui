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
} & Partial<BaseDialogStateType>


export default class showSiteDialog extends BaseDialog<UserTypeProps, UserTypeState> {

    constructor(props: UserTypeProps) {
        super(props);
        ;
        this.state = {
            ...this.state,
            width: '45rem',
            height: '35rem',
            sheng: null,
            shi: null,
            xian: null,
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        setTimeout(() => {
            this.onchange()
            $("#Area2_").hide()
            $("#Area3_").hide()
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
                        <li id="sheng" onClick={this.toggle.bind(this, 'Area1_')}>省级</li>
                        <li id="shi" onClick={this.toggle.bind(this, 'Area2_')}>城市</li>
                        <li id="xian" onClick={this.toggle.bind(this, 'Area3_')}>县区</li>
                    </div>
                    <div className={styles.site} id='Area1_'>
                        <a>上海</a>
                        <a>云南</a>
                        <a>内蒙古</a>
                        <a>北京</a>
                        <a>吉林</a>
                        <a>四川</a>
                        <a>天津</a>
                        <a>宁夏</a>
                        <a>安徽</a>
                        <a>山东</a>
                        <a>山西</a>
                        <a>广东</a>
                        <a>新疆</a>
                        <a>江苏</a>
                        <a>江西</a>
                        <a>河北</a>
                        <a>河南</a>
                        <a>浙江</a>
                        <a>海南</a>
                        <a>湖北</a>
                        <a>湖南</a>
                        <a>澳门</a>
                        <a>甘肃</a>
                        <a>福建</a>
                        <a>西藏</a>
                        <a>贵州</a>
                        <a>辽宁</a>
                        <a>重庆</a>
                        <a>陕西</a>
                        <a>青海</a>
                        <a>香港</a>
                        <a>黑龙江</a>
                        <a>臺灣</a>
                    </div>

                    <div className={styles.site} id='Area2_'>

                    </div>

                    <div className={styles.site} id='Area3_'>

                    </div>
                </div>
            </div>
        )
    }

    toggle(dom: any) {
        $("#Area1_").hide()
        $("#Area2_").hide()
        $("#Area3_").hide()
        $('#' + dom).show()
    }

    onchange() {
        let this_ = this
        let but = document.querySelectorAll("#Area1_>a")
        for (let i = 0; i < but.length; i++) {
            //@ts-ignore
            but[i].onclick = function () {
                $("#Area2_").html(" ")
                $("#Area3_").html(" ")
                this_.state.sheng = this.innerHTML
                this_.fetch(this_.state.sheng, '#Area2_')
                $("#Area1_").hide()
                $("#Area2_").show()
                $("#Area3_").hide()
                $("#Area1_>a").css('background', '')
                $(this).css('background', '#3273F4')
                this_.onchange()
                if ($("#sheng").html() == this.innerHTML) {
                    return
                } else {
                    $("#sheng").html(this.innerHTML)
                    $("#shi").html("城市")
                    $("#xian").html("县区")
                    this_.setState({
                        shi: null,
                        xian: null
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
                    $("#Area3_").html(" ")
                    this_.state.shi = this.innerHTML
                    let xxx = this_.state.sheng + "`" + this_.state.shi
                    this_.fetch(xxx, '#Area3_')
                    $("#Area1_").hide()
                    $("#Area2_").hide()
                    $("#Area3_").show()
                    $("#Area2_>a").css('background', '')
                    $(this).css('background', '#3273F4')
                    this_.onchange()
                    
                    if ($("#shi").html() == this.innerHTML) {
                        return
                    } else {
                        $("#shi").html(this.innerHTML)
                        $("#xian").html("县区")
                        this_.setState({
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
                    $("#xian").html(this.innerHTML)
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

    fetch(site: string, dom: string) {
        fetch('./BaseArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'areaCode=' + site,
        }).then((data) => {
            return data.json();
        }).then((data) => {
            $.each(data.areaList, function (key, value) {
                if (key == 0)
                    $(dom).append(
                        "<div>" + value + "</div>");
                else
                    $(dom).append(
                        "<a>" + value + "</a>");
            });

        })
    }

}


