import { DataSet } from "autumn-ui";
import React from "react";
import styles from "./AdPlayerMC.css";

type PropsType = {
    json: string
}

type stateType = {
    data: DataSet,
    index: number,

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
        let dataJson = new DataSet()
        dataJson.setJson(this.props.json);
        let number = dataJson.getHead().getNumber("play_interval_")
        if (number == 0) {
            number = 5000
        } else {
            number = number * 1000
        }

        this.setState({
            data: dataJson,
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
        }, number);
    }

    render(): JSX.Element {
        return <div className={styles.slideShow}>
            {this.getImg()}
        </div>
    }

    getImg() {
        if (this.state.data.size <= 0) {
            return <div className={styles.slideShowDiv}>
                <div><img src="images/advert/advert.png" alt="" /></div>
                <div className={styles.advert}>暂无看板</div>
            </div>
        } else {
            let row = this.state.data.records[this.state.index];
            let type = row.getNumber('media_nature_');
            if (type == 1) {
                let content = row.getString('content_')
                let pic = row.getString('pic_')
                return <div className={styles.slideDiv}>
                    <img src={pic} />
                    <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            } else if (type == 0) {
                let text = row.getString('content_');
                return <div className={styles.slideShowDiv} dangerouslySetInnerHTML={{ __html: text }}></div>
            }
        }
    }
}