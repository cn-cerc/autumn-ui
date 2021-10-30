function Loading(hintMessage) {
    var self = this;
    this.hideTime = 120; // 秒
    this.messageDiv = $('<div><img src="https://oss.diteng.site/resources/images/loading.gif"/>' + hintMessage + '</div>').css({
        "color": "red",
        "left": "50%",
        "position": "absolute",
        "top": "50%",
        "z-index": "100"
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
            'width': width,
            'position': 'absolute',
            'margin': '0 auto',
            'bottom': '2em',
            'padding': '5px 5px 0',
            'min-width': '8em',
            'z-index': '1000000'
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
        'width': messageBoxWidth + 'px',
        'left': ($('body').width() - messageBoxWidth) / 2 + 'px'
    }).show();

    var messageClose = $("<span/>").css({
        "display": "inline-block",
        "background": "url(images/close.png)",
        "background-repeat": "no-repeat",
        "background-position": "center",
        "background-size": "1em 1em",
        "position": "absolute",
        "cursor": "pointer",
        "width": "1em",
        "height": "1em",
        "top": "0px",
        "right": "0px",
        "z-index": "102"
    }).click(function () {
        messageBox.stop().animate({
            'opacity': 0
        }, 500, function(){
            messageBox.hide();
        });
    });

    var messageContent = $("<div/>").html(msg).css({
        "min-height": "2.5em",
        "max-height": "6em",
        "line-height": "1.5em",
        "overflow": "auto",
        "border": "2px solid #faad61",
        "border-radius": ".3em",
        "-webkit-border-radius": ".3em",
        "padding": ".4em",
        "background-color": "#fff",
        "width": "100%",
        "right": "0",
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
            }, 3000, function(){
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
                }, 3000, function(){
                    messageBox.hide();
                });
            }, 3000);
        }
    });

}

export {Loading, showMsg}