export default class DialogDOM {
    static render(react: JSX.Element) {
        let dialog = document.createElement('div');
        dialog.setAttribute('role', 'dialogBox');
        dialog.setAttribute('id', 'dialogBox');
        document.body.appendChild(dialog);
        //@ts-ignore
        ReactDOM.render(react, dialog)
    }
}