import { BaseDialog, BaseDialogPropsType, BaseDialogStateType } from "autumn-ui";
import React from "react";
import "../tool/Summer.css";

type DriverInfoProps = {
    
} & Partial<BaseDialogPropsType>


type StaffTypeState = {
    
} & Partial<BaseDialogStateType>

export default class CeshiDialog extends BaseDialog<DriverInfoProps, StaffTypeState> {
    constructor(props: DriverInfoProps) {
        super(props)
        this.state = {
            ...this.state,
            width: '45rem',
            height: this.isPhone ? '25rem' : '30rem'
        }
    }

    content() {
        return (
            <div>123</div>
        )
    }
}