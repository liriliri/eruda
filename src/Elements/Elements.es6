import Tool from '../DevTools/Tool.es6'
import CssStore from './CssStore.es6'
import stringify from '../lib/stringify.es6'
import Highlight from './Highlight.es6'
import Select from './Select.es6'
import util from '../lib/util'

export default class Elements extends Tool
{
    constructor()
    {
        super();

        util.evalCss(require('./Elements.scss'));

        this.name = 'elements';
        this._tpl = require('./Elements.hbs');
        this._rmDefComputedStyle = true;
        this._highlightElement = false;
        this._selectElement = false;
    }
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;

        $el.html('<div class="eruda-show-area"></div>');
        this._$showArea = $el.find('.eruda-show-area');
        $el.append(require('./BottomBar.hbs')());

        this._htmlEl = document.documentElement;
        this._highlight = new Highlight(this._parent.$parent);
        this._select = new Select();
        this._bindEvent();
        this._initObserver();
        this._initCfg();
    }
    show()
    {
        super.show();

        if (!this._curEl) this._setEl(this._htmlEl);
        this._render();
    }
    set(e)
    {
        this._setEl(e);
        this._render();

        return this;
    }
    overrideEventTarget()
    {
        let winEventProto = getWinEventProto();

        let origAddEvent = this._origAddEvent = winEventProto.addEventListener,
            origRmEvent = this._origRmEvent = winEventProto.removeEventListener;

        winEventProto.addEventListener = function (type, listener, useCapture)
        {
            addEvent(this, type, listener, useCapture);
            origAddEvent.apply(this, arguments);
        };

        winEventProto.removeEventListener = function (type, listener, useCapture)
        {
            rmEvent(this, type, listener, useCapture);
            origRmEvent.apply(this, arguments);
        };
    }
    restoreEventTarget()
    {
        let winEventProto = getWinEventProto();

        if (this._origAddEvent) winEventProto.addEventListener = this._origAddEvent;
        if (this._origRmEvent) winEventProto.removeEventListener = this._origRmEvent;
    }
    _back()
    {
        if (this._curEl === this._htmlEl) return;

        var parentQueue = this._curParentQueue,
            parent = parentQueue.shift();

        while (!isElExist(parent)) parent = parentQueue.shift();

        this.set(parent);
    }
    _bindEvent()
    {
        let self = this,
            parent = this._parent,
            select = this._select;

        this._$el.on('click', '.eruda-child', function ()
        {
            var idx = util.$(this).data('idx'),
                curEl = self._curEl,
                el = curEl.childNodes[idx];

            if (el && el.nodeType === 3)
            {
                let curTagName = curEl.tagName,
                    type;

                switch (curTagName)
                {
                    case 'SCRIPT': type = 'js'; break;
                    case 'STYLE': type = 'css'; break;
                    default: return;
                }

                let sources = parent.get('sources');

                if (sources)
                {
                    sources.set(type, el.nodeValue);
                    parent.showTool('sources');
                }

                return;
            }

            !isElExist(el) ? self._render() : self.set(el);
        }).on('click', '.eruda-listener-content', function ()
        {
            let text = util.$(this).text(),
                sources = parent.get('sources');

            if (sources)
            {
                sources.set('js', text);
                parent.showTool('sources');
            }
        }).on('click', '.eruda-breadcrumb', () =>
        {
            let data = this._elData || JSON.parse(stringify(this._curEl, {getterVal: true})),
                sources = parent.get('sources');

            this._elData = data;

            if (sources)
            {
                sources.set('json', data);
                parent.showTool('sources');
            }
        }).on('click', '.eruda-parent', function ()
        {
            let idx = util.$(this).data('idx'),
                curEl = self._curEl,
                el = curEl.parentNode;

            while (idx-- && el.parentNode) el = el.parentNode;

            !isElExist(el) ? self._render() : self.set(el);
        }).on('click', '.toggle-all-computed-style', () => {
            this._toggleAllComputedStyle()
        }).on('click','.eruda-section h2',(e)=>{
            this._toggleElementInstpctor(e.curTarget.parentNode.className)
        });

        let $bottomBar = this._$el.find('.eruda-bottom-bar');

        $bottomBar.on('click', '.eruda-refresh', () => this._render())
                  .on('click', '.eruda-highlight', () => this._toggleHighlight())
                  .on('click', '.eruda-select', () => this._toggleSelect())
                  .on('click', '.eruda-reset', () => this.set(this._htmlEl));

        select.on('select', target => this.set(target));
    }
    _toggleElementInstpctor(targetClassName){
        /**
         * toggle element inspector
         * @type {[type]}
         */
        let cfg = this.config;
        let UIConfig = cfg.get('UIConfig');
        targetClassName.indexOf('hook-eruda-attributes') != -1 ? cfg.set('UIConfig',Object.assign(UIConfig,UIConfig.attributes = !UIConfig.attributes)) : null;
        targetClassName.indexOf('hook-eruda-computed-style') != -1 ? cfg.set('UIConfig',Object.assign(UIConfig,UIConfig.computedStyle = !UIConfig.computedStyle)) : null;
        targetClassName.indexOf('hook-eruda-styles') != -1 ? cfg.set('UIConfig',Object.assign(UIConfig,UIConfig.styles = !UIConfig.styles)) : null;
        targetClassName.indexOf('hook-eruda-listeners') != -1 ? cfg.set('UIConfig',Object.assign(UIConfig,UIConfig.listeners = !UIConfig.listeners)) : null;

        this._render();
    }
    _toggleAllComputedStyle()
    {
        this._rmDefComputedStyle = !this._rmDefComputedStyle;

        this._render();
    }
    _toggleObserver(flag) 
    {
        let observer = this._observer;

        if (!observer) return;

        flag ? observer.observe(this._htmlEl, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        }) : observer.disconnect();
    }
    _toggleHighlight()
    {
        if (this._selectElement) return;

        this._$el.find('.eruda-highlight').toggleClass('eruda-active');
        this._highlightElement = !this._highlightElement;

        this._render();
    }
    _toggleSelect()
    {
        let select = this._select;

        this._$el.find('.eruda-select').toggleClass('eruda-active');
        if (!this._selectElement && !this._highlightElement) this._toggleHighlight();
        this._selectElement = !this._selectElement;

        if (this._selectElement)
        {
            select.enable();
            this._parent.hide();
        } else
        {
            select.disable();
        }
    }
    _setEl(el)
    {
        this._curEl = el;
        this._elData = null;
        this._curCssStore = new CssStore(el);
        this._highlight.setEl(el);
        this._rmDefComputedStyle = true;

        let parentQueue = [];

        let parent = el.parentNode;
        while (parent)
        {
            parentQueue.push(parent);
            parent = parent.parentNode;
        }
        this._curParentQueue = parentQueue;
    }
    _getData()
    {
        let ret = {};

        let el = this._curEl,
            cssStore = this._curCssStore;

        let {className, id, attributes, tagName} = el;

        let cfg = this.config;

        ret.UIConfig = cfg.get('UIConfig');

        ret.parents = getParents(el);
        ret.children = formatChildNodes(el.childNodes);
        ret.attributes = formatAttr(attributes);
        ret.name = formatElName({tagName, id, className, attributes});

        let events = el.erudaEvents;
        if (events && util.keys(events).length !== 0) ret.listeners = events;

        if (needNoStyle(tagName)) return ret;

        let computedStyle = cssStore.getComputedStyle();
        if (this._rmDefComputedStyle) computedStyle = rmDefComputedStyle(computedStyle);
        processStyleRules(computedStyle);
        ret.computedStyle = computedStyle;

        let styles = cssStore.getMatchedCSSRules();
        styles.unshift(getInlineStyle(el.style));
        styles.forEach(style => processStyleRules(style.style));
        ret.styles = styles;

        return ret;
    }
    _render()
    {
        if (!isElExist(this._curEl)) return this._back();

        this._highlight[this._highlightElement ? 'show' : 'hide']();
        this._renderHtml(this._tpl(this._getData()));
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$showArea.html(html);
    }
    _initObserver() 
    {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if (!MutationObserver) return;

        this._observer = new MutationObserver(mutations =>
        {
            util.each(mutations, mutation => this._handleMutation(mutation));
        });
    }
    _handleMutation(mutation) 
    {
        let i, len, node;

        if (util.isErudaEl(mutation.target)) return;

        if (mutation.type === 'attributes') 
        {
            if (mutation.target !== this._curEl) return;
            this._render();
        } else if (mutation.type === 'childList') 
        {
            if (mutation.target === this._curEl) return this._render();

            let addedNodes = mutation.addedNodes;

            for (i = 0, len = addedNodes.length; i < len; i++) 
            {
                node = addedNodes[i];

                if (node.parentNode === this._curEl) return this._render();
            }

            let removedNodes = mutation.removedNodes;

            for (i = 0, len = removedNodes.length; i < len; i++) 
            {
                if (removedNodes[i] === this._curEl) return this.set(this._htmlEl);
            }
        }
    }
    _initCfg()
    {
        let cfg = this.config = util.createCfg('elements');

        cfg.set(util.defaults(cfg.get(), {
            overrideEventTarget: true,
            observeElement: true
        }));

        cfg.set('UIConfig',{
            computedStyle:true,
            styles:true,
            listeners:true,
            attributes:true,
        });

        if (cfg.get('overrideEventTarget')) this.overrideEventTarget();
        if (cfg.get('observeElement')) this._toggleObserver(true);

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'overrideEventTarget': return val ? this.overrideEventTarget(): this.restoreEventTarget();
                case 'observeElement': return this._toggleObserver(val);
            }
        });

        let settings = this._parent.get('settings');
        settings.text('Elements')
                .switch(cfg, 'overrideEventTarget', 'Catch Event Listeners')
        
        if (this._observer) settings.switch(cfg, 'observeElement', 'Auto Refresh');

        settings.separator();
    }
}

function processStyleRules(style)
{
    util.each(style, (val, key) => style[key] = processStyleRule(val));
}

let regColor = /rgba?\((.*?)\)/g,
    regCssUrl = /url\("?(.*?)"?\)/g;

function processStyleRule(val)
{
    return val.replace(regColor, '<span class="eruda-style-color" style="background-color: $&"></span>$&')
              .replace(regCssUrl, (match, url) => `url("${wrapLink(url)}")`);
}

const isElExist = val => util.isEl(val) && val.parentNode;

function formatElName(data, {noAttr = false} = {})
{
    let {id, className, attributes} = data;

    let ret = `<span class="eruda-blue">${data.tagName.toLowerCase()}</span>`;

    if (id !== '') ret += `#${id}`;

    if (util.isStr(className))
    {
        util.each(className.split(/\s+/g), (val) =>
        {
            if (val.trim() === '') return;
            ret += `.${val}`;
        });
    }

    if (!noAttr)
    {
        util.each(attributes, (attr) =>
        {
            var name = attr.name;
            if (name === 'id' || name === 'class' || name === 'style') return;
            ret += ` ${name}="${attr.value}"`;
        });
    }

    return ret;
}

var formatAttr = attributes => util.map(attributes, attr =>
{
    let {name, value} = attr;
    value = util.escape(value);

    let isLink = (name === 'src' || name === 'href') && !util.startWith(value, 'data');
    if (isLink) value = wrapLink(value);
    if (name === 'style') value = processStyleRule(value);

    return {name, value};
});

function formatChildNodes(nodes)
{
    let ret = [];

    for (let i = 0, len = nodes.length; i < len; i++)
    {
        var child = nodes[i],
            nodeType = child.nodeType;

        if (nodeType === 3 || nodeType === 8)
        {
            var val = child.nodeValue.trim();
            if (val !== '') ret.push({
                text: val,
                isCmt: nodeType === 8,
                idx: i
            });
            continue;
        }

        var isSvg = !util.isStr(child.className);

        if (nodeType === 1 &&
            child.id !== 'eruda' &&
            (isSvg || child.className.indexOf('eruda') < 0))
        {
            ret.push({
                text: formatElName(child),
                isEl: true,
                idx: i
            });
        }
    }

    return ret;
}

function getParents(el)
{
    let ret = [],
        i = 0,
        parent = el.parentNode;

    while (parent && parent.nodeType === 1)
    {
        ret.push({
            text: formatElName(parent, {noAttr: true}),
            idx: i++
        });

        parent = parent.parentNode;
    }

    return ret.reverse();
}

function getInlineStyle(style)
{
    let ret = {
        selectorText: 'element.style',
        style: {}
    };

    for (let i = 0, len = style.length; i < len; i++)
    {
        let s = style[i];

        ret.style[s] = style[s];
    }

    return ret;
}

var defComputedStyle = require('./defComputedStyle.json');

function rmDefComputedStyle(computedStyle)
{
    let ret = {};

    util.each(computedStyle, (val, key) =>
    {
        if (val === defComputedStyle[key]) return;

        ret[key] = val;
    });

    return ret;
}

var NO_STYLE_TAG = ['script', 'style', 'meta', 'title', 'link', 'head'];

var needNoStyle = tagName => NO_STYLE_TAG.indexOf(tagName.toLowerCase()) > -1;

function addEvent(el, type, listener, useCapture = false)
{
    if (!util.isFn(listener) || !util.isBool(useCapture)) return;

    let events = el.erudaEvents = el.erudaEvents || {};

    events[type] = events[type] || [];
    events[type].push({
        listener: listener,
        listenerStr: listener.toString(),
        useCapture: useCapture
    });
}

function rmEvent(el, type, listener, useCapture = false)
{
    if (!util.isFn(listener) || !util.isBool(useCapture)) return;

    let events = el.erudaEvents;

    if (!(events && events[type])) return;

    let listeners = events[type];

    for (let i = 0, len = listeners.length; i < len; i++)
    {
        if (listeners[i].listener === listener)
        {
            listeners.splice(i, 1);
            break;
        }
    }

    if (listeners.length === 0) delete events[type];
    if (util.keys(events).length === 0) delete el.erudaEvents;
}

var getWinEventProto = () => util.safeGet(window, 'EventTarget.prototype') || window.Node.prototype;

var wrapLink = link => `<a href="${link}" target="_blank">${link}</a>`;
