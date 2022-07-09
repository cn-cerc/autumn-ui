import React from "react";
import styles from "./Introduction.css";

type IntroductionTypeProps = {
    introduction: string
}

export default class Introduction extends React.Component<IntroductionTypeProps> {
    constructor(props: IntroductionTypeProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <div className={styles.mcIntroduction}>
            <div className={styles.mcTitle}>简介</div>
            <p>{this.props.introduction}</p>
        </div>
    }
}