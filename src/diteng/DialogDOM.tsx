export default class DialogDOM {
    static render(react: string) {
        let dialog = document.createElement("div");
        dialog.setAttribute("role", "dialogBox");
        document.body.appendChild(dialog);
        //@ts-ignore
        ReactDOM.render(react, dialog)
    }
}

