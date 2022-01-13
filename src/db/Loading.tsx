import React from "react";
import WebControl from "../rcc/WebControl";
import styles from './Loading.css';

type LoadingTypeProps = {
    size: number
}

export class Loading extends WebControl {
    constructor(props: LoadingTypeProps) {
        super(props)
    }

    render(): React.ReactNode {
        if (this.isPhone) {
            return (
                <div className={styles.load}>
                    <div className={styles.loadContent}>
                        <span className={styles.loadSvg}>
                            <svg viewBox="25 25 50 50">
                                <circle cx="50" cy="50" r="20" fill="none"></circle>
                            </svg>
                        </span>
                        <span className={styles.loadMessage}>加载中...</span>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={styles.loadingContainer}>
                    <div className={`${styles.loading} ${styles.animation1}`}></div>
                    <div className={`${styles.loading} ${styles.animation2}`}></div>
                    <div className={`${styles.loading} ${styles.animation3}`}></div>
                    <div className={`${styles.loading} ${styles.animation4}`}></div>
                    <div className={`${styles.loading} ${styles.animation5}`}></div>
                    <div className={`${styles.loading} ${styles.animation6}`}></div>
                    <div className={`${styles.loading} ${styles.animation7}`}></div>
                    <div className={`${styles.loading} ${styles.animation8}`}></div>
                    <div className={`${styles.loading} ${styles.animation9}`}></div>
                    <div className={`${styles.loading} ${styles.animation10}`}></div>
                    <div className={`${styles.loading} ${styles.animation11}`}></div>
                    <div className={`${styles.loading} ${styles.animation12}`}></div>
                </div>
            )
        }
    }
}