import React from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import styles from "./AdPlayerMC.css";
import DialogApi from "./DialogApi";

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
        data.append().setValue("项次", 0).setValue('摘要', '简介').setValue("media_nature_", 1).setValue("content_", "{url:\"https://img95.699pic.com/photo/50050/2419.jpg_wh300.jpg\",subtitles:\"1欢迎加入本公司~~~~\"}")
        data.append().setValue("项次", 1).setValue("摘要", '封面').setValue("media_nature_", 0).setValue("content_", "\u003cdiv font-size\u003d40\u003e2欢迎来到本公司\u003c/div\u003e")
        data.append().setValue("项次", 2).setValue("摘要", '公司简介').setValue("media_nature_", 1).setValue("content_", "{url:\"https://img95.699pic.com/photo/50029/8534.jpg_wh300.jpg\",subtitles:\"3欢迎加入本公司~~~~\"}")
        data.append().setValue("项次", 3).setValue("摘要", '历史事迹').setValue("media_nature_", 1).setValue("content_", "{url:\"https://img95.699pic.com/photo/50032/3300.jpg_wh300.jpg\",subtitles:\"4欢迎加入本公司~~~~\"}")
        data.append().setValue("项次", 4).setValue("摘要", '封面').setValue("media_nature_", 0).setValue("content_", "\u003cdiv font-size\u003d40\u003e5欢迎来到本公司\u003c/div\u003e")
        data.append().setValue("项次", 5).setValue("摘要", '历史事迹').setValue("media_nature_", 1).setValue("content_", "{url:\"https://img95.699pic.com/photo/50059/8012.jpg_wh300.jpg\",subtitles:\"6欢迎加入本公司~~~~\"}")

        this.setState({
            data: data
        })

        let x = DialogApi.getPlayList()
        console.log(x)

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
        let type = row.getNumber('media_nature_');

        if (type == 1) {
            let content: any = row.getString('content_')
            content = eval("(" + content + ")")
            return <div className={styles.slideDiv}>
                <img src={content.url} />
                <div>{content.subtitles}</div>
            </div>
        } else if (type == 0) {
            let text = row.getString('content_');
            return <div className={styles.slideShowDiv} dangerouslySetInnerHTML={{ __html: text }}></div>
        }
    }
}