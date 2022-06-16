import React from "react";
import { BaseDialogPropsType, DataRow, DataSet, BaseDialogStateType, BaseDialog, SearchPanel, DBEdit, DBGrid, Column } from "autumn-ui";
import styles from "./AdPlayerMC.css";
import DialogApi from "./DialogApi";

type PropsType = {
    json: string
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
            index: 0,
        };
    }

    componentWillMount() {
        this.init();
    }

    async init() {

        let dataJson = new DataSet();
        dataJson.setJson(this.props.json);

        this.setState({
            data: dataJson
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
        let type = row.getNumber('media_nature_');

        if (type == 1) {
            let content: any = row.getString('content_')
            try {
                content = eval('(' + content + ')')
            }
            catch (e) {
                console.log("---当前内容格式有误---")
                throw e;//抛出异常
            }
            finally {
                return <div className={styles.slideDiv}>
                    <img src={content.url} />
                    <div>{content.subtitles}</div>
                </div>
            }

        } else if (type == 0) {
            let text = row.getString('content_');
            return <div className={styles.slideShowDiv} dangerouslySetInnerHTML={{ __html: text }}></div>
        }
    }
}