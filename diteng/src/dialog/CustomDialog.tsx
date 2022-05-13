import React from "react";
import { BaseDialogPropsType, BaseDialog, BaseDialogStateType } from "autumn-ui";
import styles from "./CustomDialog.css";

type CustomTypeProps = {
    title: string,
} & Partial<BaseDialogPropsType>

export default class CustomDialog extends BaseDialog<CustomTypeProps, BaseDialogStateType> {
    static defaultProps = {
        isChild: true
    }
    constructor(props: CustomTypeProps) {
        super(props);
        this.setTitle(props.title);
        this.state = {
            height: props.height,
            width: props.width,
        }
    }

    content() {
        return (
            <div className={styles.main}>
                {React.Children.map(this.props.children, child => child)}
            </div>
        )
    }

    getAdornment() {
        return ''
    }
}