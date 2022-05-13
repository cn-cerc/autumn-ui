import React from "react";
import { Column, ColumnPropsType, ColumnType } from "./DBGrid";

export type ImagePropsType = {
    imgWidth?: string,
    imgHeight?: string,
} & ColumnPropsType

export class ColumnImage extends Column {
    static defaultProps = {
        tag: ColumnType.td,
        colSpan: 1,
        textAlign: 'right',
        imgWidth: '100',
        imgHeight: '100',
    }

    constructor(props: ImagePropsType) {
        super(props)
    }

    getValue(): React.ReactNode {
        let url = this.props.dataRow.getString(this.props.code);
        if (url) {
            return (
                // @ts-ignore
                <img src={url} width={this.props.imgWidth} height={this.props.imgHeight} />
            )
        } else
            return ''
    }
}