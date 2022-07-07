import { SessionStorage } from "./tool/Utils";

export default class StaticPath {
    static getImage(imgSrc: string): string {
        let src = imgSrc;
        let session = new SessionStorage('Application');
        if(session.get('staticPath')) {
            src = session.get('staticPath') + src;
        } else {
            src = `https://cdn.diteng.site/resources/${src}`;
        }
        return src;
    }
}