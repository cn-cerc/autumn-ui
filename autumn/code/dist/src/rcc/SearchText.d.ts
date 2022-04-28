import React, { ReactNode } from "react";
declare type propsType = {
    label: string;
    defaultValue?: string;
    onChanged?: (value: string) => void;
    children?: ReactNode | undefined;
};
declare type stateType = {
    value: string;
};
export default class SearchText extends React.Component<propsType, stateType> {
    constructor(props: propsType);
    render(): JSX.Element;
    onClick: (el: Object) => void;
    changeValue: (event: any) => void;
}
export {};
