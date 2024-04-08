// JavaScript Document

// Tips
MooTools.More={version:"1.2.5.1",build:"254884f2b83651bf95260eed5c6cceb838e22d8e"};(function(){var a=function(c,b){return(c)?($type(c)=="function"?c(b):b.get(c)):"";
};this.Tips=new Class({Implements:[Events,Options],options:{onShow:function(){this.tip.setStyle("display","block");},onHide:function(){this.tip.setStyle("display","none");
},title:"title",text:function(b){return b.get("rel")||b.get("href");},showDelay:100,hideDelay:100,className:"tip-wrap",offset:{x:16,y:16},windowPadding:{x:0,y:0},fixed:false},initialize:function(){var b=Array.link(arguments,{options:Object.type,elements:$defined});
this.setOptions(b.options);if(b.elements){this.attach(b.elements);}this.container=new Element("div",{"class":"tip"});},toElement:function(){if(this.tip){return this.tip;
}return this.tip=new Element("div",{"class":this.options.className,styles:{position:"absolute",top:0,left:0}}).adopt(new Element("div",{"class":"tip-top"}),this.container,new Element("div",{"class":"tip-bottom"}));
},attach:function(b){$$(b).each(function(d){var f=a(this.options.title,d),e=a(this.options.text,d);d.erase("title").store("tip:native",f).retrieve("tip:title",f);
d.retrieve("tip:text",e);this.fireEvent("attach",[d]);var c=["enter","leave"];if(!this.options.fixed){c.push("move");}c.each(function(h){var g=d.retrieve("tip:"+h);
if(!g){g=this["element"+h.capitalize()].bindWithEvent(this,d);}d.store("tip:"+h,g).addEvent("mouse"+h,g);},this);},this);return this;},detach:function(b){$$(b).each(function(d){["enter","leave","move"].each(function(e){d.removeEvent("mouse"+e,d.retrieve("tip:"+e)).eliminate("tip:"+e);
});this.fireEvent("detach",[d]);if(this.options.title=="title"){var c=d.retrieve("tip:native");if(c){d.set("title",c);}}},this);return this;},elementEnter:function(c,b){this.container.empty();
["title","text"].each(function(e){var d=b.retrieve("tip:"+e);if(d){this.fill(new Element("div",{"class":"tip-"+e}).inject(this.container),d);}},this);$clear(this.timer);
this.timer=(function(){this.show(b);this.position((this.options.fixed)?{page:b.getPosition()}:c);}).delay(this.options.showDelay,this);},elementLeave:function(c,b){$clear(this.timer);
this.timer=this.hide.delay(this.options.hideDelay,this,b);this.fireForParent(c,b);},fireForParent:function(c,b){b=b.getParent();if(!b||b==document.body){return;
}if(b.retrieve("tip:enter")){b.fireEvent("mouseenter",c);}else{this.fireForParent(c,b);}},elementMove:function(c,b){this.position(c);},position:function(e){if(!this.tip){document.id(this);
}var c=window.getSize(),b=window.getScroll(),f={x:this.tip.offsetWidth,y:this.tip.offsetHeight},d={x:"left",y:"top"},g={};for(var h in d){g[d[h]]=e.page[h]+this.options.offset[h];
if((g[d[h]]+f[h]-b[h])>c[h]-this.options.windowPadding[h]){g[d[h]]=e.page[h]-this.options.offset[h]-f[h];}}this.tip.setStyles(g);},fill:function(b,c){if(typeof c=="string"){b.set("html",c);
}else{b.adopt(c);}},show:function(b){if(!this.tip){document.id(this);}if(!this.tip.getParent()){this.tip.inject(document.body);}this.fireEvent("show",[this.tip,b]);
},hide:function(b){if(!this.tip){document.id(this);}this.fireEvent("hide",[this.tip,b]);}});})();

// Squeezebox 1.1
var SqueezeBox = {
    presets: {
        onOpen: $empty,
        onClose: $empty,
        onUpdate: $empty,
        onResize: $empty,
        onMove: $empty,
        onShow: $empty,
        onHide: $empty,
        size: {
            x: 600,
            y: 450
        },
        sizeLoading: {
            x: 200,
            y: 150
        },
        marginInner: {
            x: 20,
            y: 20
        },
        marginImage: {
            x: 50,
            y: 75
        },
        handler: false,
        target: null,
        closable: true,
        closeBtn: true,
        zIndex: 65555,
        overlayOpacity: 0.7,
        classWindow: '',
        classOverlay: '',
        overlayFx: {},
        resizeFx: {},
        contentFx: {},
        parse: false,
        parseSecure: false,
        shadow: true,
        document: null,
        ajaxOptions: {}
    },

    initialize: function (presets) {
        if (this.options) return this;
        this.presets = $merge(this.presets, presets);
        this.doc = this.presets.document || document;
        this.options = {};
        this.setOptions(this.presets).build();
        this.bound = {
            window: this.reposition.bind(this, [null]),
            scroll: this.checkTarget.bind(this),
            close: this.close.bind(this),
            key: this.onKey.bind(this)
        };
        this.isOpen = this.isLoading = false;
        return this
    },
    build: function () {
        this.overlay = new Element('div', {
            id: 'sbox-overlay',
            styles: {
                display: 'none',
                zIndex: this.options.zIndex
            }
        });
		this.gradient = new Element('div', {
			id: 'sbox-gradient'
		}).inject(this.overlay);
        this.win = new Element('div', {
            id: 'sbox-window',
            styles: {
                display: 'none',
                zIndex: this.options.zIndex + 2
            }
        });
        if (this.options.shadow) {
            if (Browser.Engine.webkit420) {
                this.win.setStyle('-webkit-box-shadow', '0 0 10px rgba(0, 0, 0, 0.7)')
            } else if (!Browser.Engine.trident4) {
                var shadow = new Element('div', {
                    'class': 'sbox-bg-wrap'
                }).inject(this.win);
                var relay = function (e) {
                    this.overlay.fireEvent('click', [e])
                }.bind(this);
                ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'].each(function (dir) {
                    new Element('div', {
                        'class': 'sbox-bg sbox-bg-' + dir
                    }).inject(shadow).addEvent('click', relay)
                })
            }
        }
        this.content = new Element('div', {
            id: 'sbox-content'
        }).inject(this.win);
        this.closeBtn = new Element('a', {
            id: 'sbox-btn-close',
            href: '#'
        }).inject(this.win);
        this.fx = {
            overlay: new Fx.Tween(this.overlay, $merge({
                property: 'opacity',
                onStart: Events.prototype.clearChain,
                duration: 250,
                link: 'cancel'
            }, this.options.overlayFx)).set(0),
            win: new Fx.Morph(this.win, $merge({
                onStart: Events.prototype.clearChain,
                duration: 750,
                transition: Fx.Transitions.Quint.easeOut,
                link: 'cancel',
                unit: 'px'
            }, this.options.resizeFx)),
            content: new Fx.Tween(this.content, $merge({
                property: 'opacity',
                duration: 250,
                link: 'cancel'
            }, this.options.contentFx)).set(0)
        };
        $(this.doc.body).adopt(this.overlay, this.win)
    },
    assign: function (to, options) {
        return ($(to) || $$(to)).addEvent('click', function () {
            return !SqueezeBox.fromElement(this, options)
        })
    },
    open: function (subject, options) {
        this.initialize();
        if (this.element != null) this.trash();
        this.element = $(subject) || false;
        this.setOptions($merge(this.presets, options || {}));
        if (this.element && this.options.parse) {
            var obj = this.element.getProperty(this.options.parse);
            if (obj && (obj = JSON.decode(obj, this.options.parseSecure))) this.setOptions(obj)
        }
        this.url = ((this.element) ? (this.element.get('href')) : subject) || this.options.url || '';
        this.assignOptions();
        var handler = handler || this.options.handler;
        if (handler) return this.setContent(handler, this.parsers[handler].call(this, true));
        var ret = false;
        return this.parsers.some(function (parser, key) {
            var content = parser.call(this);
            if (content) {
                ret = this.setContent(key, content);
                return true
            }
            return false
        }, this)
    },
    fromElement: function (from, options) {
        return this.open(from, options)
    },
    assignOptions: function () {
        this.overlay.set('class', this.options.classOverlay);
        this.win.set('class', this.options.classWindow);
        if (Browser.Engine.trident4) this.win.addClass('sbox-window-ie6')
    },
    close: function (e) {
        var stoppable = ($type(e) == 'event');
        if (stoppable) e.stop();
        if (!this.isOpen || (stoppable && !$lambda(this.options.closable).call(this, e))) return this;
        this.fx.overlay.start(0).chain(this.toggleOverlay.bind(this));
        this.win.setStyle('display', 'none');
        this.fireEvent('onClose', [this.content]);
        this.trash();
        this.toggleListeners();
        this.isOpen = false;
        return this
    },
    trash: function () {
        this.element = this.asset = null;
        this.content.empty();
        this.options = {};
        this.removeEvents().setOptions(this.presets).callChain()
    },
    onError: function () {
        this.asset = null;
        this.setContent('string', this.options.errorMsg || 'An error occurred')
    },
    setContent: function (handler, content) {
        if (!this.handlers[handler]) return false;
        this.content.className = 'sbox-content-' + handler;
        this.applyTimer = this.applyContent.delay(this.fx.overlay.options.duration, this, this.handlers[handler].call(this, content));
        if (this.overlay.retrieve('opacity')) return this;
        this.toggleOverlay(true);
        this.fx.overlay.start(this.options.overlayOpacity);
        return this.reposition()
    },
    applyContent: function (content, size) {
        if (!this.isOpen && !this.applyTimer) return;
        this.applyTimer = $clear(this.applyTimer);
        this.hideContent();
        if (!content) {
            this.toggleLoading(true)
        } else {
            if (this.isLoading) this.toggleLoading(false);
            this.fireEvent('onUpdate', [this.content], 20)
        }
        if (content) {
            if (['string', 'array'].contains($type(content))) this.content.set('html', content);
            else if (!this.content.hasChild(content)) this.content.adopt(content)
        }
        this.callChain();
        if (!this.isOpen) {
            this.toggleListeners(true);
            this.resize(size, true);
            this.isOpen = true;
            this.fireEvent('onOpen', [this.content])
        } else {
            this.resize(size)
        }
    },
    resize: function (size, instantly) {
        this.showTimer = $clear(this.showTimer || null);
        var box = this.doc.getSize(),
            scroll = this.doc.getScroll();
        this.size = $merge((this.isLoading) ? this.options.sizeLoading : this.options.size, size);
        var to = {
            width: this.size.x,
            height: this.size.y,
            left: (scroll.x + (box.x - this.size.x - this.options.marginInner.x) / 2).toInt(),
            top: (scroll.y + (box.y - this.size.y - this.options.marginInner.y) / 2).toInt()
        };
        this.hideContent();
        if (!instantly) {
            this.fx.win.start(to).chain(this.showContent.bind(this))
        } else {
            this.win.setStyles(to).setStyle('display', '');
            this.showTimer = this.showContent.delay(50, this)
        }
        return this.reposition()
    },
    toggleListeners: function (state) {
        var fn = (state) ? 'addEvent' : 'removeEvent';
        this.closeBtn[fn]('click', this.bound.close);
        this.overlay[fn]('click', this.bound.close);
        this.doc[fn]('keydown', this.bound.key)[fn]('mousewheel', this.bound.scroll);
        this.doc.getWindow()[fn]('resize', this.bound.window)[fn]('scroll', this.bound.window)
    },
    toggleLoading: function (state) {
        this.isLoading = state;
        this.win[(state) ? 'addClass' : 'removeClass']('sbox-loading');
        if (state) this.fireEvent('onLoading', [this.win])
    },
    toggleOverlay: function (state) {
        var full = this.doc.getSize().x;
        this.overlay.setStyle('display', (state) ? '' : 'none');
        this.doc.body[(state) ? 'addClass' : 'removeClass']('body-overlayed');
        if (state) {
            this.scrollOffset = this.doc.getWindow().getSize().x - full;
            this.doc.body.setStyle('margin-right', this.scrollOffset)
        } else {
            this.doc.body.setStyle('margin-right', '')
        }
    },
    showContent: function () {
        if (this.content.get('opacity')) this.fireEvent('onShow', [this.win]);
        this.fx.content.start(1)
    },
    hideContent: function () {
        if (!this.content.get('opacity')) this.fireEvent('onHide', [this.win]);
        this.fx.content.cancel().set(0)
    },
    onKey: function (e) {
        switch (e.key) {
        case 'esc':
            this.close(e);
        case 'up':
        case 'down':
            return false
        }
    },
    checkTarget: function (e) {
        return this.content.hasChild(e.target)
    },
    reposition: function () {
        var size = this.doc.getSize(),
            scroll = this.doc.getScroll(),
            ssize = this.doc.getScrollSize();
        this.overlay.setStyles({
            width: ssize.x + 'px',
            height: ssize.y + 'px'
        });
		this.win.setStyles({
            left: (scroll.x + (size.x - this.win.offsetWidth) / 2 - this.scrollOffset).toInt() + 'px',
            top: (scroll.y + (size.y - this.win.offsetHeight) / 2).toInt() + 'px'
        });
		this.gradient.setStyles({
			top: window.getScroll().y + 'px',
			height: window.getHeight() + 'px'
		});
        return this.fireEvent('onMove', [this.overlay, this.win])
    },
    removeEvents: function (type) {
        if (!this.$events) return this;
        if (!type) this.$events = null;
        else if (this.$events[type]) this.$events[type] = null;
        return this
    },
    extend: function (properties) {
        return $extend(this, properties)
    },
    handlers: new Hash(),
    parsers: new Hash()
};
SqueezeBox.extend(new Events($empty)).extend(new Options($empty)).extend(new Chain($empty));
SqueezeBox.parsers.extend({
    image: function (preset) {
        return (preset || (/\.(?:jpg|png|gif)$/i).test(this.url)) ? this.url : false
    },
    clone: function (preset) {
        if ($(this.options.target)) return $(this.options.target);
        if (this.element && !this.element.parentNode) return this.element;
        var bits = this.url.match(/#([\w-]+)$/);
        return (bits) ? $(bits[1]) : (preset ? this.element : false)
    },
    ajax: function (preset) {
        return (preset || (this.url && !(/^(?:javascript|#)/i).test(this.url))) ? this.url : false
    },
    iframe: function (preset) {
        return (preset || this.url) ? this.url : false
    },
    string: function (preset) {
        return true
    }
});
SqueezeBox.handlers.extend({
    image: function (url) {
        var size, tmp = new Image();
        this.asset = null;
        tmp.onload = tmp.onabort = tmp.onerror = (function () {
            tmp.onload = tmp.onabort = tmp.onerror = null;
            if (!tmp.width) {
                this.onError.delay(10, this);
                return
            }
            var box = this.doc.getSize();
            box.x -= this.options.marginImage.x;
            box.y -= this.options.marginImage.y;
            size = {
                x: tmp.width,
                y: tmp.height
            };
            for (var i = 2; i--;) {
                if (size.x > box.x) {
                    size.y *= box.x / size.x;
                    size.x = box.x
                } else if (size.y > box.y) {
                    size.x *= box.y / size.y;
                    size.y = box.y
                }
            }
            size.x = size.x.toInt();
            size.y = size.y.toInt();
            this.asset = $(tmp);
            tmp = null;
            this.asset.width = size.x;
            this.asset.height = size.y;
            this.applyContent(this.asset, size)
        }).bind(this);
        tmp.src = url;
        if (tmp && tmp.onload && tmp.complete) tmp.onload();
        return (this.asset) ? [this.asset, size] : null
    },
    clone: function (el) {
        if (el) return el.clone();
        return this.onError()
    },
    adopt: function (el) {
        if (el) return el;
        return this.onError()
    },
    ajax: function (url) {
        var options = this.options.ajaxOptions || {};
        this.asset = new Request.HTML($merge({
            method: 'get',
            evalScripts: false
        }, this.options.ajaxOptions)).addEvents({
            onSuccess: function (resp) {
                this.applyContent(resp);
                if (options.evalScripts !== null && !options.evalScripts) $exec(this.asset.response.javascript);
                this.fireEvent('onAjax', [resp, this.asset]);
                this.asset = null
            }.bind(this),
            onFailure: this.onError.bind(this)
        });
        this.asset.send.delay(10, this.asset, [{
            url: url
        }])
    },
    iframe: function (url) {
        this.asset = new Element('iframe', $merge({
            src: url,
            frameBorder: 0,
            width: this.options.size.x,
            height: this.options.size.y
        }, this.options.iframeOptions));
        if (this.options.iframePreload) {
            this.asset.addEvent('load', function () {
                this.applyContent(this.asset.setStyle('display', ''))
            }.bind(this));
            this.asset.setStyle('display', 'none').inject(this.content);
            return false
        }
        return this.asset
    },
    string: function (str) {
        return str
    }
});
SqueezeBox.handlers.url = SqueezeBox.handlers.ajax;
SqueezeBox.parsers.url = SqueezeBox.parsers.ajax;
SqueezeBox.parsers.adopt = SqueezeBox.parsers.clone;

SqueezeBox.parsers.swf = function (preset) {
    return (preset || this.url.test(/\.swf/)) ? this.url : false;
};
SqueezeBox.handlers.swf = function (url) {
    var size = this.options.size;
    return new Swiff(url, {
        id: 'sbox-swf',
        width: size.x,
        height: size.y,
        params: {
            allowfullscreen: true
        }
    });
};


window.addEvent('domready', function(){
	//Primary Links Drop-Downs
	var dropdowns = $$('#menu-tree > li');
	dropdowns.each(function(li){
		var a = li.getElement('a');
		var ul = li.getElement('ul');
		
		li.addClass('primary-li');
		a.addClass('primary-a');
		li.getElements('.expanded ul').destroy();
		
		if(ul){
			var dropdown = new Element('div', {
				'class': 'drop-down',
				'html': '<div class="drop-down-head"></div><div class="drop-down-body"><ul class="drop-down-content">' + ul.innerHTML + '</ul></div><div class="drop-down-foot"></div>'
			}).inject(li, 'bottom');
			ul.destroy();
			
			li.getElement('li').addClass('first');
			
			li.addEvents({
				'mouseenter': function(){
					this.addClass('hovered');	
				},
				'mouseleave': function(){
					this.removeClass('hovered')
				}
			});
		}
		
		
	});
	$('primaryLinks').addClass('ready');
	
	// Size Dropdown Menu
	if($('primaryLinks').getElement('a')){
        w = 0; total = 0;w_arr = [];
        $$('#menu-tree .primary-a').each(function(a){w = a.getSize().x; w_arr.push(w); total += w;});
        pad = (primaryMenuSize - total - 2) / primaryMenuLinks;
        $$('#menu-tree .primary-li').each(function(li) {li.setStyle('width', ((w_arr.shift() + pad) / primaryMenuSize) * 100 + '%')});
		$('menu-tree').setStyle('visibility', 'visible');
	}
	
	// Header Links
	var headerLinks = $$('.header-link');
	headerLinks.each(function(el){
		el.fx = new Fx.Tween(el, {
			'property':'opacity',
			'duration':200,
			'link':'cancel'
		}).set(.01);
		
		el.addEvents({
			'mouseenter':function(){el.fx.start(1);},
			'mouseleave':function(){el.fx.start(.01);}
		});
	});
	
	// Tips
	var myTips = new Tips('.tip', {
		'className': 'node hover-tip',
		'windowPadding': {'x': 50, 'y': 50}
	});
	
	//Javascript Tabs
	$$('.javascript-tabs').each(function(tabs){
		tabs.panels = $(tabs.getProperty('rel'));
		tabs.links = tabs.getElements('a');
		
		tabs.links.each(function(tab){
			tab.panel = tabs.panels.getElementById(tab.getProperty('rel'));
			
			if(tab.panel.hasClass('tab-show') && !tab.hasClass('active')){
				tab.addClass('active');
			}
			
			tab.addEvent('click', function(e){
				e.preventDefault();
				
				tabs.getElement('.active').removeClass('active');
				tab.addClass('active');
			
				tabs.panels.getElements('.tab-show').each(function(shown){
					shown.removeClass('tab-show');
				});
				
				tab.panel.addClass('tab-show');
		
			});	
		});
	});
	
	// Fix Inside Page Header Backgrounds
	$$('.block').each(function(block){
		if(block.getElement('.block-content')){
			block.content = block.getElement('.block-content');
			
			if (Browser.Engine.trident) {
				block.content.bg = block.content.getStyle('background-position-x') + " " + block.content.getStyle('background-position-y');
			} else {
				block.content.bg = block.content.getStyle('background-position');
			}
			
			block.content.pos = block.content.bg.split(" ");
			block.content.top = block.content.getCoordinates(block).top;
			
			block.content.setStyle('background-position', block.content.pos[0] + " " + -1 * block.content.top + 'px');
			
			block.body = block.getElement('.block-body');
			
			if (Browser.Engine.trident) {
				block.body.bg = block.body.getStyle('background-position-x') + " " + block.body.getStyle('background-position-y');
			} else {
				block.body.bg = block.body.getStyle('background-position');
			}
			
			block.body.pos = block.body.bg.split(" ");
			block.body.top = block.body.getCoordinates(block).top;
			
			block.body.setStyle('background-position', block.body.pos[0] + " " + -1 * block.body.top + 'px');
			
			
		}
	});
	
	
	// Media Functions
	if($('mediaViewer')){
		var mediaViewer = $('mediaViewer');
		var xFluff = mediaViewer.getStyle('padding-left').toInt() + mediaViewer.getStyle('padding-right').toInt() + mediaViewer.getStyle('border-left-width').toInt() + mediaViewer.getStyle('border-right-width').toInt();
		var yFluff = mediaViewer.getStyle('padding-top').toInt() + mediaViewer.getStyle('padding-bottom').toInt() + mediaViewer.getStyle('border-top-width').toInt() + mediaViewer.getStyle('border-bottom-width').toInt();
		
		mediaViewer.width = mediaViewer.getSize().x.toInt() - xFluff;
		mediaViewer.height = mediaViewer.getSize().y.toInt() - yFluff;
		mediaViewer.frontpage = $('page-front');
		
		$$('.media').addEvents({
			'click': function(e){
				mediaViewer.removeClass('loaded');
				
				if(e !== 'init') e.preventDefault();
				
				this.uri = this.get('href');
				if(!(this.hasClass('carousel'))) this.params = JSON.decode(this.get('rel'));
				
				if(this.hasClass('video')){
					this.fireEvent('prepareVideo', e);
				} else if(this.hasClass('wallpaper')){
					this.fireEvent('prepareWallpaper', e);
				} else if(this.hasClass('carousel')){
					this.fireEvent('prepareCarousel', e);
				} else {
					this.fireEvent('prepareImage', e);	
				}
			},
			'prepareVideo': function(e){
				var uri = this.uri;
				var ratio = (this.params && this.params.ratio) ? this.params.ratio : '16:9';
				var height = 300;
				
				if(mediaViewer.frontpage){
					ratio = ratio.split(':');
					ratio = ratio[0] / ratio[1];
				} else {
					ratio = ratio.split(':');
					ratio = ratio[1] / ratio[0];	
				}

				
				
				if(uri.contains('youtube.com')){
					uri = uri.replace('&', '?');
					uri = uri.replace('watch?v=', 'v/index.html');
					uri = uri + '&rel=0&showinfo=0&showsearch=0&fs=1&iv_load_policy=3&ap=%2526fmt%3D18';
					
					if(e !== 'init') uri = uri + '&autoplay=1';
					
					if(mediaViewer.frontpage){
						height = mediaViewer.height;
						width = (mediaViewer.height - 25) * ratio;
					} else {
						height = (mediaViewer.width * ratio) + 25;
					}
				} else if(uri.contains('CustomVideoPlayer.html')){
					if(e != 'init') uri += '&autoplay=1';
					
					if(mediaViewer.frontpage){
						height = mediaViewer.height;
						width = (mediaViewer.height - 25) * ratio;
					} else {
						height = (mediaViewer.width * ratio) + 25;
					}
				} else if(uri.contains('gametrailers.com/video')){
					uri = uri.split("https://s.pinto-lime.ts.net/");
					uri = "https://www.youtube.com/c/gametrailers" + uri[uri.length - 1];
					
					if(mediaViewer.frontpage){
						height = mediaViewer.height;
						width = mediaViewer.height * ratio;
					} else {
						height = mediaViewer.width * ratio;
					}
				} else if(uri.contains('facebook.com')){
					uri = uri.replace('video/videoec92.html?v=', 'v/index.html');
					
					if(mediaViewer.frontpage){
						height = mediaViewer.height;
						width = mediaViewer.height * ratio;
					} else {
						height = mediaViewer.width * ratio;
					}
				} else if(uri.contains('vimeo.com')){
					var id= uri;
					id = id.replace('http://', '');
					id = id.replace('www.', '');
					id = id.replace('vimeo.com/index.html', '');
					uri = 'http://vimeo.com/moogaloop.swf?clip_id=' + id + '&fullscreen=1&portrait=0';
					
					if(e !== 'init') uri = uri + '&autoplay=1';
					
					if(mediaViewer.frontpage){
						height = mediaViewer.height;
						width = mediaViewer.height * ratio;
					} else {
						height = mediaViewer.width * ratio;
					}
				}
				
				mediaViewer.innerHTML = '';
				if(mediaViewer.frontpage) mediaViewer.setStyle('width', width);
				var video = new Swiff(uri, {
					'width': (mediaViewer.frontpage) ? width : '100%',
					'height': height + 'px',
					'params': {
						'allowfullscreen': true	
					}
				});
				
				var inject = new Object({
					'element': video,
					'class': 'video',
					'type': 'video',
					'init': e
				});
				
				this.fireEvent('inject', inject);
			},
			'prepareImage': function(e){
				var width = (this.params && this.params.width) ? this.params.width : '';
				var height = (this.params && this.params.height) ? this.params.height : '100%';
				
				var image = new Element('img', {
					'src': this.uri,
					'styles': {
						'width': width,
						'height': height
					}
				});
				
				if(width > mediaViewer.width){
					var caption = new Element('a', {
						'class': 'fullsize',
						'href': this.uri,
						'target': '_blank',
						'html': '<span class="fullsize-tip">View full size image &raquo;</span>'
					});
				}
				
				var inject = new Object({
					'element': image,
					'class': 'image',
					'type': 'image',
					'caption': (caption) ? caption : false,
					'init': e
				});
				
				this.fireEvent('inject', inject)
			},
			'prepareCarousel': function(e){
				var width = (this.params && this.params.width) ? this.params.width : '';
				var height = (this.params && this.params.height) ? this.params.height : '100%';
				
				var link = new Element('a', {
					'href': this.uri,
					'html': '&nbsp;',
					'styles': {
						'display': 'block',
						'width': width,
						'height': height,
						'background-image': 'url(' + this.get('rel') + ')',
						'background-position': 'left top'
					}
				});
				
				var inject = new Object({
					'element': link,
					'class': 'image',
					'type': 'image',
					'init': e
				});
				
				this.fireEvent('inject', inject)
			},
			'prepareWallpaper': function(e){
				var sizes = this.params.sizes;
				var sizesHTML = '<option>Hello</option>';
				
				//for(i=0;i<sizes.length;i++)
				//	sizesHTML += '<option value="' + sizes[i].url + '">' + sizes[i].size + '</option>';
				
				var image = new Element('img', {
					'src': this.uri
				});
				
				var picker = new Element('div', {
					'class': 'size-picker',
					'html': '<label>Download this wallpaper</label>'
				});

				var selectSizes = new Element('select', {
					'class': 'size-picker-select',
					'html': sizesHTML
				}).inject(picker, 'top');


//				var selectSizes = new Element('select', {
//					'class': 'size-picker-select',
//					'html': sizesHTML,
//					'events': {
//						'change': function(){
//							if(this.value) document.location = this.value;
//						}
//					}
//				}).inject(picker, 'top');
				
				var inject = new Object({
					'element': image,
					'class': 'wallpaper',
					'type': 'wallpaper',
					'caption': picker,
					'init': e
				});
				
				this.fireEvent('inject', inject)
			},
			'highlight': function(){
				if(this.getParent().getParent().getParent().getParent().getElement('.highlight')) this.getParent().getParent().getParent().getParent().getElement('.highlight').removeClass('highlight');
				if(this.hasClass('image')) {
					this.addClass('highlight');
				} else {
					this.getParent('.image').addClass('highlight');
				}
			},
			'inject':function(media){
				mediaViewer.innerHTML = '';
				
				media.element.inject(mediaViewer);
				if(media.caption) media.caption.inject(mediaViewer, 'bottom');
				
				//if((media.init !== 'init') == !(mediaViewer.frontpage))
					//window.scrollTo(0, mediaViewer.getCoordinates().top - 30);
					
				if(mediaViewer.frontpage){
					mediaViewer.removeClass('show-image');
					mediaViewer.removeClass('show-video');
					
					if(media.type === 'image' && media.type){
						mediaViewer.setStyle('width', '');
						mediaViewer.addClass('show-' + media.type);
					}
				}
				this.fireEvent('highlight');
				
				mediaViewer.addClass('loaded');
				
				
			}
		});
		
		if($('container').getElement('.media'))
			$('container').getElement('.media').fireEvent('click', 'init');
		
		
	} else {
		
		$$('.media').each(function(el){
			if(el.hasClass('video')){
				var url = el.get('href');
				var params = JSON.decode(el.get('rel'));
				var ratio = (params && params.ratio) ? params.ratio : '16:9';
				var width = 550;
				
				ratio = ratio.split(':');
				ratio = ratio[1] / ratio[0];
				
				if(url.contains('youtube.com')){
					url = url.replace('&', '?');
					url = url.replace('watch?v=', 'v/index.html');
					url = url + '&rel=0&showinfo=0&fs=1&showsearch=0&iv_load_policy=3&ap=%2526fmt%3D18&autoplay=1';
					
					height = (width * ratio) + 25;
				} else if(url.contains('facebook.com')){
					url = url.replace('video/videoec92.html?v=', 'v/index.html');
					
					height = width * ratio;
				} else if(url.contains('vimeo.com')){
					var id= url;
					id = id.replace('http://', '');
					id = id.replace('www.', '');
					id = id.replace('vimeo.com/index.html', '');
					url = 'http://vimeo.com/moogaloop.swf?clip_id=' + id + '&fullscreen=1&portrait=0&autoplay=1';
					
					height = width * ratio;
				}
				
				el.set('href', url);
				el.set('rel', '{url:"' + url + '",handler:"swf",size:{x:' + width + ',y:' + height + '}}');
				
				el.removeClass('media');
			} 
		});
		SqueezeBox.assign($$('a.video'), {
			parse: 'rel',
			overlayOpacity: 1
		});
		
		SqueezeBox.assign($$('a.media'));
	}

	
	
	// Itemmall Features
	var items = $$('#page-inside .item');
	
	if($('itemmall-inside') && items){
		var sample = document.getElement('.item');
		sample.borders = sample.getStyle('border-top-width').toInt() + sample.getStyle('border-bottom-width').toInt();
		sample.margins = sample.getStyle('margin-top').toInt() + sample.getStyle('margin-bottom').toInt();
		sample.padding = sample.getStyle('padding-top').toInt() + sample.getStyle('padding-bottom').toInt();
		sample.fluff = sample.borders + sample.margins + sample.padding;
		
		$$('.item-row').each(function(row){
			var setHeight = row.getSize().y - sample.fluff;
			row.getElements('.item').each(function(el){el.setStyle('height', setHeight)});
		});
	}
		
	
	if(document.getElement('.item-purchase')){
		items.each(function(itm){
			if(itm.getElement('.item-purchase').getElement('input.form-text')){
				itm.form = itm.getElement('.item-purchase');
				itm.qty = itm.form.getElement('input.form-text');
				itm.subtract = itm.form.getElement('.item-control-subtract');
				itm.add = itm.form.getElement('.item-control-add');
				
				// Validate Quantity
				itm.qty.addEvents({
					'focus': function(e){
						if(this.value === '0')
							this.value = '';
					},
					'blur': function(e){
						if(this.value > this.get('rel').toInt())
							this.value = this.get('rel').toInt();
					},
					'keydown': function(e){
						this.store('prevValue', this.value);
						
						if((e.code >= 48 && e.code <= 57) || (e.code >= 96 && e.code <= 105) || e.code == 46 || e.code == 8 || e.code == 38 || e.code == 40)
							this.store('key', 'number');
						else
							this.store('key', 'text');
						
						// Up arrow increase
						if(e.code === 38 && this.value < this.get('rel').toInt())
							this.value++;
							
						// Down arrow decrease
						if(e.code === 40 && this.value > 0)
							this.value--;
						
					},
					'keypress': function(e){
						if(this.retrieve('key') === 'number'){
							if(this.value > this.get('rel').toInt())
								this.value = this.get('rel').toInt();
						} else {
							this.value = this.retrieve('prevValue');
						}
					},
					'keyup': function(e){
						if(this.retrieve('key') === 'number'){
							if(this.value > this.get('rel').toInt())
								this.value = this.get('rel').toInt();
						} else {
							this.value = this.retrieve('prevValue');	
						}
					}
				});
				
				// Quantity Controls
				itm.subtract.addEvent('click', function(e){
					if(itm.qty.value > 0)
						itm.qty.value--;
				});
				
				itm.add.addEvent('click', function(e){
					if(itm.qty.value < itm.qty.get('rel').toInt())
						itm.qty.value++;
				});
			}
		});
	}
	
	// FAQ lists
	$$('.faq-list dt').each(function(faq){
		faq.visible = false;
		faq.answers = new Array();
		
		var check = faq;
		
		while(check && check.getNext()){
			var next = check.getNext();
			
			if(next.get('tag') === 'dd'){
				faq.answers.push(next);
				check = next;
			} else {
				check = false;
			}
		}
		
		faq.addEvent('click', function(e){
			if(faq.visible){
				faq.answers.each(function(answer){answer.setStyle('display', 'none')});
				faq.visible = false;
			} else {
				faq.answers.each(function(answer){answer.setStyle('display', 'block')});
				faq.visible = true;
			}
		});
	});

	/* Keyboard Tooltips */
	if($$('.keyboard-layout a')){
		// Build Keyboard Tips
		$$('.keyboard-layout a').each(function(key){
			key.title = key.getAttribute('title');
			key.button = key.className;
			key.description = key.getAttribute('rel');
			
			key.tip = '<div class="format"><dl class="keyboard"><dt>' + key.title + '</dt><dd class="description">' + key.description + '</dd></dl></div>';
			key.setAttribute('rel', key.tip);
			key.setAttribute('title', '');
		});
		
		var tips = new Tips($$('.keyboard-layout a'), {
			className: 'hover-tip key-tip'
		});
	}
});



window.addEvent('load', function(){
	// Slide Fixes for IE
	$$('.slide-window').each(function(win){
		win.container = win.getElement('.slide-panels-container');
		
		//alert(win.container.getSize().y);
	});
	
	// Universal Ad Loader
	var adsPath = 'https://s.pinto-lime.ts.net/misc/ads/';
	
	$$('.advertisement').each(function(element){
		if(element.getProperty('rel')){
			element.Src = adsPath + element.getProperty('rel') + '.html';
			element.Frame = new Element('iframe', {
				src: element.Src,
				width: '100%',
				height: '100%',
				scrolling: 'no',
				frameborder: '0',
				marginwidth: '0',
				marginheight: '0'
			});
			element.innerHTML = '';
			element.Frame.inject(element);		
		}
	});
	
	// Item Mall: put in onload so as to make sure the image size is ready when determining the icon img position
	var maxItemHeightByRow = [];
	var row = -1;
	var rowItemNum = 0;
	var itemCount = 0;
	var itemTopPosition = -1;
	$$('#itemmall-inside .item').each(function(el){
		el.container = el.getElement('.item-image-window');
		el.container.size = el.container.getSize();
		el.image = el.container.getElement('img');
		el.image.size = el.image.getSize();
		el.image.fx = new Fx.Tween(el.image, {duration:750, property:'opacity'}).set(0);

		(el.image.size.x > el.container.size.x) ? el.image.setStyle('left', -.5 * (el.image.size.x - el.container.size.x)) : el.image.setStyle('left', .5 * (el.container.size.x - el.image.size.x));
		(el.image.size.y > el.container.size.y) ? el.image.setStyle('top', -.5 * (el.image.size.y - el.container.size.y)) : el.image.setStyle('top', .5 * (el.container.size.y - el.image.size.y));
		el.image.fx.start(1);

		el.getElements('a').each(function(a){
			a.setProperty('title', '');
		});

		itemCount++;
		// set item dynamic height value according to content: fixing item height overflow issue: NCSQA-285 & NCSQA-281
		// get the maximum height for each row
		if ( (row > 0 && (itemCount - 1) % rowItemNum == 0) || (row <= 0 && el.offsetTop > itemTopPosition) ) {
			maxItemHeightByRow[++row] = 0;
			itemTopPosition = el.offsetTop;
		}
		if ( row == 0 ) {
			// determine the number of item per row with the first row
			rowItemNum++;
		}
		if ( el.clientHeight && el.clientHeight > maxItemHeightByRow[row] ) {
			maxItemHeightByRow[row] = el.clientHeight;
		}
	});

	// set item height for each row to be the maximum height for that particular row
	row = -1;
	itemCount = 0;
	if ( maxItemHeightByRow.length > 0 ) {
		$$('.item').each(function(el) {
			itemCount++;
			if ( (itemCount - 1) % rowItemNum == 0 ) {
				row++;
			}
			el.set('style', 'height:' + maxItemHeightByRow[row] + 'px;');
		});
	}
	
	// Sliding Content Galleries
	$$('.slide-panels').each(function(sli){
		var current = 0;
		
		sli.win = sli.getElement('.slide-window');
		sli.pager = sli.getElement('.slide-pager');
		sli.container = sli.getElement('.slide-panels-container');
		sli.pages = sli.getElements('.slide-panel');
		sli.current = current;
		
		sli.fx = new Fx.Tween(sli.container, {
			'duration': 500,
			'property': 'margin-left',
			'link': 'cancel',
			'unit': '%',
			'transition': 'quad:out'
		});
		
		if(sli.pager){
			sli.setStyle('height', sli.container.getSize().y + sli.pager.getSize().y);
			
			sli.next = sli.getElement('.slide-arrow-next');
			sli.prev = sli.getElement('.slide-arrow-prev');
			
			
			sli.pager.setStyles({
				'display':		'block',
				'float': 		'none',
				'margin': 		'0 auto',
				'visibility':	'visible',
				'width': 		sli.pager.getSize().x
			});
		
		
			// Pages Click
			var pageNum = 0;
			var maxHeight = 0;
			
			sli.pager.getElements('.slide-page').each(function(page){
				var targetPage = pageNum;
				
				page.addEvent('click', function(e){
					sli.fireEvent('goto', targetPage);
				});
				
				pageNum++;
			});
			
			// Next Button
			sli.next.addEvent('click', function(){
				var target = sli.current + 1;
				sli.fireEvent('goto', target);
			});
			
			// Prev Button
			sli.prev.addEvent('click', function(){
				var target = sli.current - 1;
				sli.fireEvent('goto', target);
			});
			
			sli.addEvents({
				'goto': function(target){
					if(target === -1){
						var last = sli.pages.length - 1;
						sli.fx.start(last * -100);
						sli.fireEvent('setPager', last);
					} else if(sli.getElement('.slide-panel-' + target)){
						sli.fx.start(target * -100);
						sli.fireEvent('setPager', target);
					} else {
						sli.fx.start(0);
						sli.fireEvent('setPager', 0);
					}
				},
				'setPager': function(target){
					sli.pager.getElement('.current').removeClass('current');
					sli.pager.getElement('.slide-page-' + target).addClass('current');
					sli.current = target;
				}
			});
		}
	});
});