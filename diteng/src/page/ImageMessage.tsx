import { DataRow } from "autumn-ui";
import React from "react";
import Message, { messageTypeProps } from "./Message";
import styles from "./Message.css";

export default class ImageMessage extends Message<messageTypeProps> {
    private imagesHeight: number = this.isPhone ? 20 : 600;     // 手机版为rem单位，pc为px
    constructor(props: messageTypeProps) {
        super(props);
    }
    getMessage(): JSX.Element {
        let row = new DataRow();
        row.copyValues(this.props.row);
        let obj = JSON.parse(row.getString('Content_'));
        return <div className={styles.imageMessage}><img src={obj?.url} style={this.getImageStyle(obj?.width, obj?.height)}/></div>
    }

    getImageStyle(width: number, height: number) {
        let style = {
            width: '',
            height: ''
        }
        if(this.isPhone) {
            let remCoefficient = document.body.clientWidth / 360 * 16;
            style.height = `${height / remCoefficient}rem`;
            style.width = `${width / remCoefficient}rem`;
            if(width > (width / remCoefficient)) {
                style.height = `${height / width * this.imagesHeight}rem`;
                style.width = `${this.imagesHeight}rem`;
            }
        } else {
            style.height = `${height}px`;
            style.width = `${width}px`;
            if(width > this.imagesHeight) {
                style.height = `${height / width * this.imagesHeight}px`;
                style.width = `${this.imagesHeight}px`;
            }
        }
        return style;
    }
}