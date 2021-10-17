import TCustomComponent from "../src/ui/TCustomComponent";

export default class Header extends TCustomComponent {

    html() {
        return (`
        <div>${this.props.title}</div>
        `)
    }
}