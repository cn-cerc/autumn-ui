import TComponent from './TComponent';

export default class TTd extends TComponent {

    constructor(owner:TComponent) {
        super(owner);
        this.rootLabel = "td";
    }
    
}