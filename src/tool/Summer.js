import StaticFile from "../static/StaticFile";

function Loading(hintMessage) {
    var self = this;
    this.hideTime = 120; // 秒
    this.messageDiv = $('<div><img src="https://oss.diteng.site/resources/images/loading.gif"/>' + hintMessage + '</div>').css({
        "color": "red",
        "left": "50%",
        "position": "absolute",
        "top": "50%",
        "z-index": "100",
        "transform": 'translate(-50%, -50%)',
        'background-color': '#efefef'
    });
    this.maskDiv = $("<div/>").css({
        "opacity": "0.5",
        "background-color": "#cecece",
        "height": "100%",
        "opacity": "0.3",
        "position": "absolute",
        "top": "0",
        "width": "100%",
        "z-index": "99"
    });
    this.show = function () {
        $("body").append(self.maskDiv, self.messageDiv);
        setTimeout(function () {
            self.maskDiv.remove();
            self.messageDiv.remove();
        }, self.hideTime * 1000);
    }
    this.hide = function () {
        self.maskDiv.remove();
        self.messageDiv.remove();
    }
}

// 操作提示信息方法
function showMsg(msg, remain) {
    if (!msg || msg == '') {
        return;
    }
    var messageBox = $("section[role='message']");
    // 兼容旧版本提示消息
    if (messageBox.length == 0) {
        messageBox = $('<section role="message"></section>');
        var mainBody = $(".main");
        var width = '{0}px'.format(mainBody.width - 330);
        if (isPhone() || mainBody.length == 0) {
            width = "98%";
        }
        messageBox.css({
            'max-width': width,
            'position': 'absolute',
            'margin': '0 auto',
            'bottom': '64px',
            'z-index': '1000000',
            'min-width': '308px'
        });
        if (mainBody.length == 1) {
            mainBody.append(messageBox);
        } else {
            $('body').append(messageBox);
        }
    }

    var messageBoxWidth;
    isPhone() ? messageBoxWidth = $('article>.content').outerWidth(false) / 1.5 : messageBoxWidth = $('article>.content').outerWidth(false) / 2;
    if ($('article>.content').length == 0) {
        isPhone() ? messageBoxWidth = $('section[role="content"').outerWidth(false) / 1.5 : messageBoxWidth = $('section[role="content"').outerWidth(false) / 2;
    }

    messageBox = messageBox.html('').css({
        'opacity': 1,
        'left': "50%",
        "transform": "translateX(-50%)"
    }).show();

    var messageClose = $("<span>×</span>").css({
        "position": "absolute",
        "cursor": "pointer",
        "width": "24px",
        "height": "24px",
        "line-height": "22px",
        "top": "8px",
        "right": "16px",
        "color": "#fff",
        "background-color": "#FFA533",
        "font-size": "20px",
        "border-radius": "50%",
        "text-align": "center",
        "z-index": "102"
    }).click(function () {
        messageBox.stop().animate({
            'opacity': 0
        }, 500, function () {
            messageBox.hide();
        });
    });

    var messageContent = $("<div/>").html(msg).css({
        "overflow": "auto",
        "border": "1px solid #F8DDC0",
        "border-radius": "6px",
        "-webkit-border-radius": "6px",
        "padding": "9.5px 48px 9.5px 16px",
        "background-color": "#FDF5E8",
        "font-size": "14px",
        "line-height": "1.5em",
        "color": "#333",
        "box-sizing": "border-box"
    });

    // 获取底部操作区高度，设置消息提示出现的位置
    var height = $('footer[role="footer"]').css('height');
    messageBox.stop().animate({
        'bottom': height
    }, 500);

    messageBox.append(messageContent).append(messageClose);

    var timer;
    // 保持一直显示
    if (remain) {
        messageBox.unbind();
        clearTimeout(timer);
        return;
    }

    if (msg.indexOf('</a>') == -1) {
        timer = setTimeout(function () {
            messageBox.stop().animate({
                'opacity': 0
            }, 3000, function () {
                messageBox.hide();
            });
        }, 3000);
    }

    //鼠标放入消息框清除定时器
    messageBox.on("mouseover", function () {
        clearTimeout(timer);
    });
    messageBox.on("mouseout", function () {
        if (msg.indexOf('</a>') == -1) {
            timer = setTimeout(function () {
                messageBox.stop().animate({
                    'opacity': 0
                }, 3000, function () {
                    messageBox.hide();
                });
            }, 3000);
        }
    });

}

// 用于处理数据精度丢失的方法类
class AuiMath {
    getMultiple(num1, num2) {
        num1 = String(num1);
        num2 = String(num2);
        let length1 = num1.indexOf(".") > -1 ? num1.length - num1.indexOf(".") - 1 : 0;
        let length2 = num2.indexOf(".") > -1 ? num2.length - num2.indexOf(".") - 1 : 0;
        let multiple = length1 > length2 ? Math.pow(10, length1) : Math.pow(10, length2);
        return multiple;
    }

    add(num1, num2) {
        let multiple = this.getMultiple(num1, num2);
        return (Math.round((num1 * multiple)) + Math.round(num2 * multiple)) / multiple;
    }

    sub(num1, num2) {
        let multiple = this.getMultiple(num1, num2);
        return (Math.round(num1 * multiple) - Math.round(num2 * multiple)) / multiple;
    }

    mul(num1, num2) {
        let multiple = this.getMultiple(num1, num2);
        return (Math.round(num1 * multiple) * Math.round(num2 * multiple)) / Math.pow(multiple, 2);
    }

    div(num1, num2) {
        let multiple = this.getMultiple(num1, num2);
        return (Math.round(num1 * multiple) / Math.round(num2 * multiple)) / Math.pow(multiple, 2);
    }

    toFixed(num, len) {
        num = String(num)
        let number = num.indexOf(".") > -1 ? num.length - num.indexOf(".") - 1 : 0;
        if (number < len) {
            return Number(num);
        }
        num = String(Math.floor(num * Math.pow(10, len + 1)));
        if (num[num.length - 1] > 4) {
            return (Math.floor(num / 10) + 1) / Math.pow(10, len)
        } else {
            return Math.floor(num / 10) / Math.pow(10, len)
        }
    }
}

// 拨打手机号
function callPhoneNumber(mobile) {
    if (window.ApiCloud.isApiCloud()) {
        window.ApiCloud.callPhoneNumber(mobile);
    } else {
        var browser = new ClientProxy();
        if (!browser.active) {
            alert("仅支持安卓系统!");
            return;
        }
        browser.req = {
            "phoneNumber": mobile
        };
        if (!browser.send("callPhoneNumber")) {
            alert(browser.getMessage());
        }
    }
}

class GDMap {
    map;
    geocoder;
    labelLayer;
    initMap(container, config) {
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        let configObj = {
            resizeEnable: true
        }
        if (config)
            configObj = {
                ...configObj,
                ...config
            }
        this.map = new AMap.Map(container, configObj);
    }

    // 根据位置获取经纬度
    getGeocoder(site, callBack) {
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        AMap.plugin('AMap.Geocoder', () => {
            new AMap.Geocoder().getLocation(site, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    callBack(result)
                } else {
                    callBack(result)
                }
            })
        })
    }

    async getAsyncGeocoder(site) {
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        let obj = {
            status: 0,
            site: [],
            address: ''
        };
        await new Promise((resolve, reject) => {
            AMap.plugin('AMap.Geocoder', () => {
                new AMap.Geocoder().getLocation(site, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        resolve(result);
                    } else {
                        reject(result);
                    }
                })
            })
        }).then((result) => {
            obj.status = 1;
            obj.site = [result.geocodes[0].location.lng, result.geocodes[0].location.lat];
            obj.address = result.geocodes[0].formattedAddress
        }).catch((result) => {
            obj.status = 0;
            obj.site = [];
            obj.address = '';
        });
        return obj;
    }

    // 根据位置获取经纬度
    getAddress(lng, lat, callBack) {
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        AMap.plugin('AMap.Geocoder', () => {
            new AMap.Geocoder().getAddress([lng, lat], function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    callBack(result)
                } else {
                    callBack(result)
                }
            })
        })
    }

    // 给输入框绑定输入提示插件
    initPlaceSearch(inputId, callBack) {
        if (!this.map)
            throw new Error('请先初始化地图容器');
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        let autoOptions = {
            input: inputId
        };
        AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], () => {
            let auto = new AMap.AutoComplete(autoOptions);
            let placeSearch = new AMap.PlaceSearch({
                map: this.map,
                showCover: false,
                children: 0,
                pageSize: 1,
            })
            auto.on('select', (e) => {
                let infomation = {};
                if (!e.poi.location) {
                    this.getGeocoder(e.poi.name, (result) => {
                        infomation.lng = result.geocodes[0].location.lng;
                        infomation.lat = result.geocodes[0].location.lat;
                        infomation.province = result.geocodes[0].addressComponent.province;
                        infomation.city = result.geocodes[0].addressComponent.city;
                        infomation.district = result.geocodes[0].addressComponent.district;
                        infomation.township = result.geocodes[0].addressComponent.township;
                        infomation.name = '';
                        if (e.poi.name != infomation.province && e.poi.name != infomation.city && e.poi.name != infomation.district && e.poi.name != infomation.township)
                            infomation.name = e.poi.name;
                        callBack(infomation);
                    })
                    return;
                }
                infomation.lng = e.poi.location.lng;
                infomation.lat = e.poi.location.lat;
                infomation.name = e.poi.name;
                this.getAddress(infomation.lng, infomation.lat, (result) => {
                    infomation.province = result.regeocode.addressComponent.province;
                    infomation.city = result.regeocode.addressComponent.city;
                    infomation.district = result.regeocode.addressComponent.district;
                    infomation.township = result.regeocode.addressComponent.township;
                    callBack(infomation);
                });
            })
        })
    }

    addMark(lng, lat, iconSrc, offset, size) {
        if (!this.map)
            throw new Error('请先初始化地图容器');
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        let marker = new AMap.Marker({
            map: this.map,
            position: [lng, lat],
            content: `<img src='${iconSrc}' width='${size[0]}' height='${size[1]}'>`,
            anchor: 'center',
            offset: new AMap.Pixel(offset[0], offset[1]),
        });
        this.map.setZoomAndCenter(16, [lng, lat]);
        return marker;
    }

    addLableMark(config, content) {
        if (!this.map)
            throw new Error('请先初始化地图容器');
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        if (!this.labelLayer) {
            this.labelLayer = new AMap.LabelsLayer({
                zooms: [3, 20],
                zIndex: 1000,
                collision: false,
                allowCollision: false,
            });
            this.map.add(this.labelLayer);
        }
        let mark = new AMap.LabelMarker({
            opacity: 1,
            zIndex: 10,
            fold: true,
            icon: {
                type: 'image',
                image: StaticFile.getImage("images/mapPoint.png"),
                size: [24, 24],
                anchor: 'center',
            },
            ...config
        })
        mark.on('click', () => {
            let infoWindow = new AMap.InfoWindow({
                offset: new AMap.Pixel(0, -15),
                content
            });
            infoWindow.open(this.map, [config.position[0], config.position[1]]);
        })
        this.labelLayer.add(mark);
    }

    showLine(startLng, startLat, endLng, endLat, callBack) {
        if (!this.map)
            throw new Error('请先初始化地图容器');
        if (!AMap)
            throw new Error('缺少高德地图依赖文件');
        AMap.plugin('AMap.Driving', () => {
            let driving = new AMap.Driving({
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: this.map,
                hideMarkers: true
            });
            var startLngLat = [startLng, startLat];
            var endLngLat = [endLng, endLat];
            driving.search(startLngLat, endLngLat);
            callBack(driving);
        })
    }

    // 在App中打开高德地图并根据起始点与截止点路径规划
    async routePlanInApp(startSite, endSite) {
        let sendGeocoder = await this.getAsyncGeocoder(startSite);
        let receiveGeocoder = await this.getAsyncGeocoder(endSite);
        let slon, slat, sname, dlon, dlat, dname;
        if (sendGeocoder.status > 0 && receiveGeocoder.status > 0) {
            slon = sendGeocoder.site[0];
            slat = sendGeocoder.site[1];
            sname = sendGeocoder.address;
            dlon = receiveGeocoder.site[0];
            dlat = receiveGeocoder.site[1];
            dname = receiveGeocoder.address;
        }
        if (slon && slat && sname && dlon && dlat && dname) {
            if (window.ApiCloud.isApiCloud()) {
                api.openApp({
                    androidPkg: 'android.intent.action.VIEW',
                    appParam: {
                        slon,
                        slat,
                        sname,
                        dlon,
                        dlat,
                        dname,
                        t: 0,
                        sourceApplication: api.appName
                    },
                    iosUrl: 'iosamap://path',
                    uri: `amapuri://route/plan/?slon=${slon}&slat=${slat}&sname=${sname}&dlon=${dlon}&dlat=${dlat}&dname=${dname}&t=0`
                }, function (ret, err) {
                    showMsg('请先安装高德地图');
                });
            } else {
                location.href = `https://uri.amap.com/navigation?from=${slon},${slat},${sname}&to=${dlon},${dlat},${dname}&mode=car&callnative=1`
            }

        } else {
            showMsg('地图上面找不到起始或结束位置，建议更换精确坐标');
        }

    }

    clear() {
        if (!this.map)
            return;
        this.map.clearMap();
    }
}

function addScript(url, callBack) {
    let script = document.createElement('script');
    script.setAttribute('src', url);
    script.setAttribute('type', 'text/javascript');
    script.onload = callBack;
    document.body.appendChild(script);
}

export { Loading, showMsg, AuiMath, callPhoneNumber, GDMap, addScript };
