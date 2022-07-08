export default class StaticFile {
    static getImage(imgSrc: string): string {
        let staticPath = '';
        try {
            //@ts-ignore
            staticPath = window.Application.staticPath
        } catch {
            staticPath = '';
        }
        return staticPath + imgSrc;
    }
}