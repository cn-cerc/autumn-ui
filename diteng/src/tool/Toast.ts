import toastCss from './Toast.css';
import iconfontCss from '../iconfont/iconfont.css';

type paramsType = {
    text: string,
    site?: 'left' | 'center' | 'right'
} | string

export default class Toast {
    static success(params: paramsType) {
        Toast.toast(params, 'success');
    }

    static error(parmas: paramsType) {
        Toast.toast(parmas, 'error');
    }

    static warn(parmas: paramsType) {
        Toast.toast(parmas, 'warn');
    }

    static info(parmas: paramsType) {
        Toast.toast(parmas, 'info');
    }

    static toast(parmas: paramsType, type: 'success' | 'error' | 'warn' | 'info') {
        let text: string;
        let toastBoxId: string;
        if (typeof parmas == "object") {
            text = parmas.text;
            if (parmas.site) {
                switch (parmas.site) {
                    case 'left':
                        toastBoxId = 'toast_lists_left';
                        break;
                    case 'center':
                        toastBoxId = 'toast_lists';
                        break;
                    case 'right':
                        toastBoxId = 'toast_lists_right';
                        break;
                }
            } else
                toastBoxId = 'toast_lists';
        } else {
            text = parmas;
            toastBoxId = 'toast_lists';
        }
        let toastList = document.getElementById(toastBoxId);
        if (!toastList) {
            toastList = document.createElement("div")
            toastList.setAttribute("id", toastBoxId)
            document.getElementsByTagName("body")[0].appendChild(toastList)
        }
        let dom = document.createElement("div")
        let i = document.createElement("i");
        dom.appendChild(i)
        switch (type) {
            case "success":
                dom.setAttribute("class", `${toastCss.toast} ${toastCss.success}`)
                i.setAttribute("class", `${iconfontCss.iconfont} ${iconfontCss.iconSuccess}`);
                break;
            case "error":
                dom.setAttribute("class", `${toastCss.toast} ${toastCss.error}`)
                i.setAttribute("class", `${iconfontCss.iconfont} ${iconfontCss.iconError}`);
                break;
            case "warn":
                dom.setAttribute("class", `${toastCss.toast} ${toastCss.warn}`)
                i.setAttribute("class", `${iconfontCss.iconfont} ${iconfontCss.iconWarn}`);
                break;
            default:
                dom.setAttribute("class", `${toastCss.toast} ${toastCss.info}`)
                i.setAttribute("class", `${iconfontCss.iconfont} ${iconfontCss.iconInfo}`);
                break;
        }
        let span = document.createElement("span");
        span.innerText = text;
        dom.appendChild(span)
        toastList.appendChild(dom)
        let timeOut = setTimeout(function () {
            dom.classList.add(toastCss.toastRemove)
            setTimeout(function () {
                dom.remove()
                let toastList = document.getElementById(toastBoxId);
                if (toastList.getElementsByClassName(toastCss.toast).length <= 0) {
                    toastList.remove()
                }
            }, 200)
        }, 2000)
        dom.onmouseenter = function () {
            clearTimeout(timeOut)
        }

        dom.onmouseleave = function () {
            timeOut = setTimeout(function () {
                dom.classList.add(toastCss.toastRemove)
                setTimeout(function () {
                    dom.remove()
                    let toastList = document.getElementById(toastBoxId);
                    if (toastList.getElementsByClassName(toastCss.toast).length <= 0) {
                        toastList.remove()
                    }
                }, 200)
            }, 2000)
        }
    }
}