import React from "react";
import WebControl from "../rcc/WebControl";
declare type LoadingTypeProps = {
    device?: 'phone' | 'pc';
};
export declare class Loading extends WebControl<LoadingTypeProps> {
    constructor(props: LoadingTypeProps);
    render(): React.ReactNode;
}
export {};
