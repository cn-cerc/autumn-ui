import ReactDOM from "react-dom";

export default class DialogDOM {
    static render(react: JSX.Element) {
        let dialog = document.createElement('div');
        dialog.setAttribute('role', 'dialogBox');
        dialog.setAttribute('id', 'dialogBox');
        document.body.appendChild(dialog);
        ReactDOM.render(react, dialog)
    }
}

