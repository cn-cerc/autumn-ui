export default class StaticFile {
    static getImage(imgSrc: string): string {
        let staticPath = '';
        try {
            //@ts-ignore
            if (window.Application.staticPath)
                //@ts-ignore
                staticPath = window.Application.staticPath + '/';
        } catch {
            staticPath = '';
        }
        return staticPath + imgSrc;
    }
}