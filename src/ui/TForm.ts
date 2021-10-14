import TComponent from "./TComponent";

export default class TForm extends TComponent {

    constructor(owner: TComponent) {
        super(owner);
        this.setRootLabel('form');
    }

    setMethod(method: string) {
        this.writerProperty('method', method);
        return this;
    }

    getMethod(): string {
        return this.readProperty('method');
    }

    setAction(action: string) {
        this.writerProperty('action', action);
        return this;
    }

    getAction(): string {
        return this.readProperty('action');
    }

}