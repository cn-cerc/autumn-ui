import React from "react";

export default class DialogDOM {
    static render(react: JSX.Element) {
        let dialog = document.createElement('div');
        dialog.setAttribute('role', 'dialogBox');
        document.body.appendChild(dialog);
        //@ts-ignore
        ReactDOM.render(react, dialog)
    }
}

