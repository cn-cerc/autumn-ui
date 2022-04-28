import React, { ReactNode } from "react";
declare type propsType = {
    onClick: (sender: any) => void;
    children?: ReactNode | undefined;
};
export default class TButton extends React.Component<propsType> {
    constructor(props: propsType);
    render(): JSX.Element;
}
export {};
