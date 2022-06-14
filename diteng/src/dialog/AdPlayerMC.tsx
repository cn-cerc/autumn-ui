import React from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import styles from "./AdPlayerMC.css";

type PropsType = {
    token: string
}

type stateType = {
    data: DataSet,
    index: number

}


export default class AdPlayerMC extends React.Component<PropsType, stateType> {
    private timer: any;
    constructor(props: PropsType | Readonly<PropsType>) {
        super(props);
        this.state = {
            data: new DataSet(),
            index: 0
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {
        let data = new DataSet();
        data.append().setValue("项次", 0).setValue('摘要', '简介').setValue("type", "text").setValue("text", "1欢迎来到本公司").setValue("间隔时间", 5)
        data.append().setValue("项次", 1).setValue("摘要", '封面').setValue("type", "img").setValue("text", "2欢迎来到本公司").setValue("url", "https://img95.699pic.com/photo/50067/5784.jpg_wh300.jpg").setValue("间隔时间", 5)
        data.append().setValue("项次", 2).setValue("摘要", '公司简介').setValue("type", "img").setValue("text", "3欢迎来到本公司").setValue("url", "https://img95.699pic.com/photo/50067/5784.jpg_wh300.jpg").setValue("间隔时间", 5)
        data.append().setValue("项次", 3).setValue("摘要", '历史事迹').setValue("type", "img").setValue("text", "4欢迎来到本公司").setValue("url", "https://img95.699pic.com/photo/40119/5023.jpg_wh300.jpg").setValue("间隔时间", 5)
        data.append().setValue("项次", 4).setValue("摘要", '封面').setValue("type", "text").setValue("text", "5欢迎来到本公司").setValue("url", "text~~~").setValue("间隔时间", 5)
        data.append().setValue("项次", 5).setValue("摘要", '历史事迹').setValue("type", "img").setValue("text", "6欢迎来到本公司").setValue("url", "https://img-qn-0.51miz.com/Index/2022/06/08/20220608185124_Index_1083510@2x.jpg").setValue("间隔时间", 5)
        data.first();

        this.setState({
            data: data
        })


        this.timer = setInterval(() => {
            let index = this.state.index;
            index++;
            if (index >= this.state.data.size) {
                index = 0;
            }
            this.setState({
                index: index
            })

        }, 5000);
    }

    render(): JSX.Element {
        return <div className={styles.slideShow}>
            {this.getImg()}
        </div>
    }


    getImg() {
        let row = this.state.data.records[this.state.index];
        let type = row.getString('type');
        let text = row.getString('text');
        if (type == "img") {
            return <div className={styles.slideDiv}>
                <img src={row.getString('url')} />
                <div>{text}</div>
            </div>
        } else if (type == "text") {
            return <div className={styles.slideShowDiv}>{text}</div>
        }
    }


}