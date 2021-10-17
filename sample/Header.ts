import TCustomComponent from "../src/ui/TCustomComponent";

export default class Header extends TCustomComponent {

    html() {
        return (`
        <div role="header">${this.props.title}</div>
        `)
    }

    css() {
        return (`div[role=header] {color:red}`);
    }
}