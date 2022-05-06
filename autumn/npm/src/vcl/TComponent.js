var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var TComponent = /** @class */ (function () {
    function TComponent(owner, props) {
        if (props === void 0) { props = null; }
        this._components = new Set();
        this._propertys = new Map();
        this._events = new Map();
        this._style = new Map();
        this._visible = true;
        this._props = {};
        this._cssHead = [];
        this.setOwner(owner);
        this._props = props;
        if (props != null) {
            var id = props.id, style = props.style;
            if (id)
                this.setId("auto" == props.id ? this.getUid() : props.id);
            if (style)
                this.setCssStyle(style);
        }
    }
    Object.defineProperty(TComponent.prototype, "owner", {
        get: function () { return this._owner; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setOwner = function (owner) {
        if (this._owner)
            this._owner.removeComponent(this);
        this._owner = owner;
        if (this._owner)
            this._owner.addComponent(this);
        return this;
    };
    Object.defineProperty(TComponent.prototype, "origin", {
        get: function () { return this._origin; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setOrigin = function (value) { this._origin = value; return this; };
    TComponent.prototype.addComponent = function (component) {
        if (component != null && !this._components.has(component)) {
            component._owner = this;
            if (component._origin == null)
                component._origin = this._origin != null ? this._origin : this;
            this._components.add(component);
        }
        return this;
    };
    TComponent.prototype.removeComponent = function (component) {
        if (component != null) {
            if (component._origin == component._owner)
                component._origin = null;
            component._owner = null;
            this._components.delete(component);
        }
        return this;
    };
    TComponent.prototype.getComponents = function () {
        return Array.from(this._components.values());
    };
    TComponent.prototype.getComponentCount = function () {
        return this._components.size;
    };
    Object.defineProperty(TComponent.prototype, "rootLabel", {
        get: function () { return this._rootLabel; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setRootLabel = function (value) { this._rootLabel = value; return this; };
    TComponent.prototype.beginOutput = function (html) {
        if (this._style.size > 0) {
            var css_1 = "";
            this._style.forEach(function (value, key) {
                if (value)
                    css_1 = css_1 + "".concat(key, ":").concat(value, ";");
                else
                    css_1 = css_1 + "".concat(key, ";");
            });
            this.writeProperty('style', css_1);
        }
        else {
            this._propertys.delete('style');
        }
        if (this._rootLabel) {
            html.print("<" + this._rootLabel);
            this._propertys.forEach(function (v, k) {
                html.print(' ' + k + '="' + v + '"');
            });
            html.print(">");
        }
    };
    TComponent.prototype.output = function (html) {
        if (this._visible) {
            this.beginOutput(html);
            for (var _i = 0, _a = this.getComponents(); _i < _a.length; _i++) {
                var item = _a[_i];
                item.output(html);
            }
            this.endOutput(html);
        }
    };
    TComponent.prototype.endOutput = function (html) {
        if (this._rootLabel)
            html.print("</".concat(this._rootLabel, ">"));
        this.cssOutput();
    };
    //输出到 head.style
    TComponent.prototype.cssOutput = function () {
        if (this.cssHead.length == 0)
            return;
        var css = '';
        for (var _i = 0, _a = this._cssHead; _i < _a.length; _i++) {
            var line = _a[_i];
            if (css)
                css += '\n';
            css += line.trim();
        }
        var style_id = this.getUid() + "_style";
        var style = document.getElementById(style_id);
        if (style == undefined) {
            style = document.createElement('style');
            style.id = style_id;
            var node = document.createTextNode(css);
            style.appendChild(node);
            document.head.appendChild(style);
        }
        else {
            style.innerHTML = css;
        }
    };
    TComponent.prototype.toString = function () {
        var html = new HtmlWriter();
        this.output(html);
        return html.getText();
    };
    TComponent.prototype.readProperty = function (key) {
        return this._propertys.get(key);
    };
    TComponent.prototype.writeProperty = function (key, value) {
        if (value)
            this._propertys.set(key, value);
        else
            this._propertys.delete(key);
        return this;
    };
    Object.defineProperty(TComponent.prototype, "id", {
        get: function () { return this.readProperty('id'); },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setId = function (id) { this.writeProperty('id', id); return this; };
    TComponent.prototype.getUid = function () {
        var uid = this.id;
        if (uid == undefined) {
            if (this._owner) {
                var num = this._owner.getComponentCount();
                uid = this._owner.getUid() + "_" + num;
            }
            else {
                uid = "origin";
            }
            this.setId(uid);
        }
        return uid;
    };
    Object.defineProperty(TComponent.prototype, "cssHead", {
        get: function () { return this._cssHead; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(TComponent.prototype, "cssClass", {
        get: function () { return this.readProperty('class'); },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setCssClass = function (cssClass) { this.writeProperty("class", cssClass); return this; };
    Object.defineProperty(TComponent.prototype, "style", {
        get: function () { return this._style; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setCssStyle = function (text) {
        if (text == null) {
            this._style.clear();
            return this;
        }
        for (var _i = 0, _a = text.split(';'); _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.trim().length == 0)
                continue;
            var values = item.split(':');
            if (values.length == 2)
                this._style.set(values[0].trim(), values[1].trim());
            else
                this._style.set(item.trim(), null);
        }
        return this;
    };
    TComponent.prototype.repaint = function (container) {
        if (container === void 0) { container = null; }
        if (container != null)
            this.setContainer(container);
        if (typeof document == "undefined" || document == null) {
            console.log(this.toString());
            return;
        }
        var contentId = this._container ? this._container : this.id;
        if (!contentId) {
            if (this._owner)
                this._owner.repaint();
            else
                console.log("".concat(this.id, ".repaint error: container is null"));
            return;
        }
        var el = document.getElementById(contentId);
        if (!el) {
            console.log("not find element: ".concat(contentId));
            return;
        }
        el.outerHTML = this.toString();
        this.registerEvents(this);
    };
    TComponent.prototype.registerEvents = function (root) {
        if (!root.visible)
            return;
        if (root.id) {
            root._events.forEach(function (fn, event) {
                var eventId = root.id;
                var eventCode = event;
                var events = event.split('.');
                if (events.length == 2) {
                    eventId = eventId + "_" + events[0];
                    eventCode = events[1];
                }
                var el = document.getElementById(eventId);
                if (el)
                    el.addEventListener(eventCode, fn);
                else
                    throw new Error("not find element: ".concat(eventId));
            });
        }
        for (var _i = 0, _a = root.getComponents(); _i < _a.length; _i++) {
            var child = _a[_i];
            this.registerEvents(child);
        }
    };
    TComponent.prototype.addEventListener = function (event, fn) {
        var uid = this.getUid();
        if (uid)
            this._events.set(event, fn);
        else {
            console.log(this);
            throw new Error('this uid is null');
        }
    };
    Object.defineProperty(TComponent.prototype, "container", {
        get: function () { return this._container; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setContainer = function (container) { this._container = container; return this; };
    Object.defineProperty(TComponent.prototype, "visible", {
        get: function () { return this._visible; },
        enumerable: false,
        configurable: true
    });
    TComponent.prototype.setVisible = function (value) { this._visible = value; return this; };
    TComponent.prototype.getComponent = function (id, root) {
        if (root === void 0) { root = null; }
        var current = root;
        if (current == null)
            current = this;
        //先查找当前是否存在
        for (var _i = 0, _a = current.getComponents(); _i < _a.length; _i++) {
            var child = _a[_i];
            if (child.id == id) {
                return child;
            }
        }
        //再查找子阶是否存在
        for (var _b = 0, _c = current.getComponents(); _b < _c.length; _b++) {
            var child = _c[_b];
            var item = child.getComponent(id, child);
            if (item != null)
                return item;
        }
        return null;
    };
    Object.defineProperty(TComponent.prototype, "props", {
        get: function () { return this._props; },
        enumerable: false,
        configurable: true
    });
    return TComponent;
}());
export default TComponent;
var HtmlWriter = /** @class */ (function () {
    function HtmlWriter() {
        this._lines = [];
    }
    HtmlWriter.prototype.print = function (text) {
        this._lines.push(text);
        return this;
    };
    HtmlWriter.prototype.println = function (text) {
        this._lines.push(text + "\n");
        return this;
    };
    HtmlWriter.prototype.getText = function () {
        var text = "";
        this._lines.forEach(function (line) {
            text = text + line;
        });
        return text;
    };
    return HtmlWriter;
}());
export { HtmlWriter };
var TDiv = /** @class */ (function (_super) {
    __extends(TDiv, _super);
    function TDiv(owner, props) {
        if (props === void 0) { props = null; }
        var _this = _super.call(this, owner, props) || this;
        _this.setRootLabel('div');
        return _this;
    }
    return TDiv;
}(TComponent));
export { TDiv };
