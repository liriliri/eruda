import Tool from '../DevTools/Tool'
import util from '../lib/util'

export default class Resources extends Tool
{
    constructor()
    {
        super();

        this._style = util.evalCss(require('./Resources.scss'));

        this.name = 'resources';
        this._localStoreData = [];
        this._hideErudaSetting = false;
        this._sessionStoreData = [];
        this._cookieData = [];
        this._scriptData = [];
        this._stylesheetData = [];
        this._imageData = [];
        this._tpl = require('./Resources.hbs');

        this._observeScript()
    }
    init($el, parent)
    {
        super.init($el);

        this._parent = parent;

        this.refresh();
        this._bindEvent();
        this._initCfg();
    }
    refresh()
    {
        return this.refreshLocalStorage()
                   .refreshSessionStorage()
                   .refreshCookie()
                   .refreshScript()
                   .refreshStylesheet()
                   .refreshImage()._render();
    }
    destroy() 
    {
        super.destroy();

        util.evalCss.remove(this._style);

        this._unobserveScript()
    }
    refreshScript()
    {
        let scriptData = [];

        util.$('script').each(function ()
        {
            let src = this.src;

            if (src !== '') scriptData.push(src);
        });

        scriptData = util.unique(scriptData);

        this._scriptData = scriptData;

        return this;
    }
    refreshStylesheet()
    {
        let stylesheetData = [];

        util.$('link').each(function ()
        {
            if (this.rel !== 'stylesheet') return;

            stylesheetData.push(this.href);
        });

        stylesheetData = util.unique(stylesheetData);

        this._stylesheetData = stylesheetData;

        return this;
    }
    refreshLocalStorage()
    {
        this._refreshStorage('local');

        return this;
    }
    refreshSessionStorage()
    {
        this._refreshStorage('session');

        return this;
    }
    _refreshStorage(type)
    {
        let store = util.safeStorage(type, false);

        if (!store) return;

        let storeData = [];

        // Mobile safari is not able to loop through localStorage directly.
        store = JSON.parse(JSON.stringify(store));

        util.each(store, (val, key) =>
        {
            // According to issue 20, not all values are guaranteed to be string.
            if (!util.isStr(val)) return;

            if (this._hideErudaSetting)
            {
                if (util.startWith(key, 'eruda') || key === 'active-eruda') return;
            }

            storeData.push({
                key: key,
                val: sliceStr(val, 200)
            });
        });

        this['_' + type + 'StoreData'] = storeData;
    }
    refreshCookie()
    {
        let cookieData = [];

        let cookie = document.cookie;
        if (util.trim(cookie) !== '')
        {
            util.each(document.cookie.split(';'), function (val, t)
            {
                val = val.split('=');
                try
                {
                    t = decodeURIComponent(val[1]);
                } catch(e)
                {
                    t = val[1];
                }
                cookieData.push({
                    key: util.trim(val[0]),
                    val: t
                });
            });
        }

        this._cookieData = cookieData;

        return this;
    }
    refreshImage()
    {
        let imageData = [];

        util.$('img').each(function ()
        {
            let $this = util.$(this),
                src = $this.attr('src');

            if ($this.data('exclude') === 'true') return;

            imageData.push(src);
        });

        imageData = util.unique(imageData);
        imageData.sort();
        this._imageData = imageData;

        return this;
    }
    show()
    {
        super.show();

        return this.refresh();
    }
    _bindEvent()
    {
        let self = this,
            $el = this._$el,
            parent = this._parent;

        $el.on('click', '.eruda-refresh-local-storage', () => this.refreshLocalStorage()._render())
           .on('click', '.eruda-refresh-session-storage', () => this.refreshSessionStorage()._render())
           .on('click', '.eruda-refresh-cookie', () => this.refreshCookie()._render())
           .on('click', '.eruda-refresh-script', () => this.refreshScript()._render())
           .on('click', '.eruda-refresh-image', () => this.refreshImage()._render())
           .on('click', '.eruda-delete-storage', function ()
           {
               let $this = util.$(this),
                   key = $this.data('key'),
                   type = $this.data('type');

               if (type === 'local')
               {
                   localStorage.removeItem(key);
                   self.refreshLocalStorage()._render();
               } else
               {
                   sessionStorage.removeItem(key);
                   self.refreshSessionStorage()._render();
               }
           })
           .on('click', '.eruda-delete-cookie', function ()
           {
               let key = util.$(this).data('key');

               delCookie(key);
               self.refreshCookie()._render();
           })
           .on('click', '.eruda-clear-storage', function ()
           {
               let type = util.$(this).data('type');

               if (type === 'local')
               {
                   util.each(self._localStoreData, val => localStorage.removeItem(val.key));
                   self.refreshLocalStorage()._render();
               } else
               {
                   util.each(self._sessionStoreData, val => sessionStorage.removeItem(val.key));
                   self.refreshSessionStorage()._render();
               }
           })
           .on('click', '.eruda-clear-cookie', () =>
           {
               util.each(this._cookieData, val => delCookie(val.key));
               this.refreshCookie()._render();
           })
           .on('click', '.eruda-storage-val', function ()
           {
               let $this = util.$(this),
                   key = $this.data('key'),
                   type = $this.data('type');

               let val = type === 'local' ? localStorage.getItem(key) : sessionStorage.getItem(key);

               try
               {
                   showSources('json', JSON.parse(val));
               } catch(e)
               {
                   showSources('raw', val);
               }
           })
           .on('click', '.eruda-img-link', function ()
           {
               let src = util.$(this).attr('src');

               showSources('img', src);
           })
           .on('click', '.eruda-css-link', linkFactory('css'))
           .on('click', '.eruda-js-link', linkFactory('js'));

        util.orientation.on('change', () => this._render());

        function showSources(type, data)
        {
            let sources = parent.get('sources');
            if (!sources) return;

            sources.set(type, data);

            parent.showTool('sources');

            return true;
        }

        function linkFactory(type)
        {
            return function (e)
            {
                if (!parent.get('sources')) return;
                e.preventDefault();

                let url = util.$(this).attr('href');

                if (!util.isCrossOrig(url))
                {
                    return util.ajax({
                        url,
                        success: data =>
                        {
                            showSources(type, data);
                        },
                        dataType: 'raw'
                    });
                } else
                {
                    showSources('iframe', url);
                }
            };
        }
    }
    _initCfg()
    {
        let cfg = this.config = util.createCfg('resources');

        cfg.set(util.defaults(cfg.get(), {
            hideErudaSetting: true
        }));

        if (cfg.get('hideErudaSetting')) this._hideErudaSetting = true;

        cfg.on('change', (key, val) =>
        {
            switch (key)
            {
                case 'hideErudaSetting': this._hideErudaSetting = val; return;
            }
        });

        let settings = this._parent.get('settings');
        settings.text('Resources')
                .switch(cfg, 'hideErudaSetting', 'Hide Eruda Setting')
                .separator();
    }
    _render()
    {
        let cookieData = this._cookieData,
            scriptData = this._scriptData,
            stylesheetData = this._stylesheetData,
            imageData = this._imageData;

        this._renderHtml(this._tpl({
            localStoreData: this._localStoreData,
            sessionStoreData: this._sessionStoreData,
            cookieData: cookieData,
            cookieState: getState('cookie', cookieData.length),
            scriptData: scriptData,
            scriptState: getState('script', scriptData.length),
            stylesheetData: stylesheetData,
            stylesheetState: getState('stylesheet', stylesheetData.length),
            imageData: imageData,
            imageState: getState('image', imageData.length)
        }));

        if (this._imageData.length === 0) return;

        setTimeout(() =>
        {
            let $li = this._$el.find('.eruda-image-list li');

            $li.css({height: $li.get(0).offsetWidth});
        }, 150);
    }
    _renderHtml(html)
    {
        if (html === this._lastHtml) return;
        this._lastHtml = html;
        this._$el.html(html);
    }
    _observeScript()
    {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        this._scriptObserver = new MutationObserver(mutations => 
        {
            mutations.forEach(mutation => 
            {
                mutation.addedNodes.forEach(node => {
                    if (/^script$/i.test(node.tagName) && node.src !== '')
                    {
                        this._scriptData.push(node.src);
                        this._scriptData = util.unique(this._scriptData);
                        this._render();
                    }
                });
            }); 
        });
        
        this._scriptObserver.observe(document.head, { childList: true });
        this._scriptObserver.observe(document.body, { childList: true });
    }
    _unobserveScript()
    {
        this._scriptObserver.disconnect();
    }
}

function getState(type, len)
{
    if (len === 0) return '';

    let warn = 0, danger = 0;

    switch (type)
    {
        case 'cookie': warn = 30; danger = 60; break;
        case 'script': warn = 5; danger = 10; break;
        case 'stylesheet': warn = 4; danger = 8; break;
        case 'image': warn = 50; danger = 100; break;
    }

    if (len >= danger) return 'eruda-danger';
    if (len >= warn) return 'eruda-warn';

    return 'eruda-ok';
}

let {hostname, pathname} = window.location;

function delCookie(key)
{
    let hostNames = hostname.split('.'),
        pathNames = pathname.split('/'),
        domain = '',
        pathLen = pathNames.length,
        path;

    if (del()) return;

    for (let i = hostNames.length - 1; i >= 0; i--)
    {
        let hostName = hostNames[i];
        if (hostName === '') continue;
        domain = (domain === '') ? hostName : hostName + '.' + domain ;

        path = '/';
        if (del({domain, path}) || del({domain})) return;

        for (let j = 0; j < pathLen; j++)
        {
            let pathName = pathNames[j];
            if (pathName === '') continue;

            path += pathName;
            if (del({domain, path}) || del({path})) return;

            path += '/';
            if (del({domain, path}) || del({path})) return;
        }
    }

    function del(options = {})
    {
        util.cookie.remove(key, options);

        return !util.cookie.get(key);
    }
}

let sliceStr = (str, len) => str.length < len ? str : str.slice(0, len) + '...';
