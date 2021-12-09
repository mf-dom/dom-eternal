const toString = Object.prototype.toString;

function isString(val) {
    return typeof val === 'string';
}

function isNumber(val) {
    return typeof val === 'number';
}

function isBoolean(val) {
    return typeof val === 'boolean';
}

function isUndefined(val) {
    return typeof val === 'undefined';
}

function isArray(val) {
    return toString.call(val) === '[object Array]';
}

function isObject(val) {
    return toString.call(val) === '[object Object]';
}

function isNull(val) {
    return toString.call(val) === '[object Null]';
}

var JsonViewer = {
    options: {
        theme: 'dark',
        container: null,
        data: '{}',
        expand: true,
    },

    init: function(container){
        this.options.container = container;
    },

    renderRight: function(theme, right, val) {
        if (isNumber(val)) {
            right.setAttribute('class', theme + 'rightNumber');
        } else if (isBoolean(val)) {
            right.setAttribute('class', theme + 'rightBoolean');
        } else if (val === 'null') {
            right.setAttribute('class', theme + 'rightNull');
        } else {
            right.setAttribute('class', theme + 'rightString');
        }
        right.innerText = val;
    },

    renderChildren : function(theme, key, val, right, indent, left) {
        let self = this;
        let folder = this.createElement('span');
        let rotate90 = this.options.expand ? 'rotate90' : '';
        let addHeight = this.options.expand ? 'add-height' : '';
        folder.setAttribute('class', theme + 'folder ' + rotate90);
        folder.onclick = function (e) {
            let nextSibling = e.target.parentNode.nextSibling;
            self.toggleItem(nextSibling, e.target);
        }
        let len = 0;
        let isObj = false;
        if (isObject(val)) {
            len = Object.keys(val).length;
            isObj = true;
        } else {
            len = val.length;
        }
        left.innerHTML = isObj ? key + '&nbsp;&nbsp{' + len + '}' : key + '&nbsp;&nbsp[' + len + ']';
        left.prepend(folder);
        right.setAttribute('class', theme + 'rightObj ' + addHeight);
        self.parse(val, right, indent + 0, theme);
    },

    parse : function(dataObj, parent, indent, theme) {
        const self = this;
        this.forEach(dataObj, function (val, key) {
            const { left, right } = self.createItem(indent, theme, parent, key, typeof val !== 'object');
            if (typeof val !== 'object') {
                self.renderRight(theme, right, val);
            } else {
                self.renderChildren(theme, key, val, right, indent, left);
            }
        });
    },

    createItem : function(indent, theme, parent, key, basicType) {
        let self = this;
        let current = this.createElement('div');
        let left = this.createElement('div');
        let right = this.createElement('div');
        let wrap = this.createElement('div');

        current.style.marginLeft = indent * 2 + 'px';
        left.innerHTML = `${key}<span class="jv-${theme}-symbol">&nbsp;:&nbsp;</span>`;
        if (basicType) {
            current.appendChild(wrap);
            wrap.appendChild(left);
            wrap.appendChild(right);
            parent.appendChild(current);
            current.setAttribute('class', theme + 'current');
            wrap.setAttribute('class', 'jv-wrap');
            left.setAttribute('class', theme + 'left');
        } else {
            current.appendChild(left);
            current.appendChild(right);
            parent.appendChild(current);
            current.setAttribute('class', theme + 'current');
            left.setAttribute('class', theme + 'left jv-folder');
            left.onclick = function (e) {
                let nextSibling = e.target.nextSibling;
                self.toggleItem(nextSibling, e.target.querySelector('span'));
            }
        }

        return {
            left,
            right,
            current,
        };
    },

    render : function (dataRecv) {
        this.options.data = dataRecv;
        this.options.container.innerHTML = "";
        let data = this.options.data;
        let theme = 'jv-' + this.options.theme + '-';
        let indent = 0;
        let parent = this.options.container;
        let key = 'object';
        let dataObj;

        parent.setAttribute('class', theme + 'con');
        try {
            dataObj = JSON.parse(data);
        } catch (error) {
            throw new Error('It is not a json format');
        }
        if (isArray(dataObj)) {
            key = 'array';
        }
        const { left, right } = this.createItem(indent, theme, parent, key);
        this.renderChildren(theme, key, dataObj, right, indent, left);
    },

    toggleItem : function (ele, target) {
        if(ele && ele.classList){
            ele.classList.toggle('add-height');
        }

        if(target && target.classList){
            target.classList.toggle('rotate90');
        }
    },

    createElement : function (type) {
        return document.createElement(type);
    },

    forEach : function (obj, fn) {
        if (isUndefined(obj) || isNull(obj)) {
            return;
        }
        if (typeof obj === 'object' && isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    fn.call(null, obj[key] || 'null', key, obj);
                }
            }
        }
    }
};
