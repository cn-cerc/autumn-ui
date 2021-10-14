import TComponent from "./TComponent";

export default class TA extends TComponent {
    
    constructor(owner) {
        super(owner);
        this.setRootLabel('a');
    }
    
}