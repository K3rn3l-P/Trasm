/**************************************************************************
 This file is dependent on the following files
 mootools-1.2.5-yui-compressed.js
 mootools-1.2.5.1-more.js
 AG/version1/assets/AG.css
 (optional) global options
     urlStatic

 Do not pass option variables into constructor. Use global options instead, to support legacy use.
 //Todo fix legacy use so that constructor is used.
 ***************************************************************************/

//default values if undefined
if (typeof urlStatic == 'undefined')
    var urlStatic = "";
if (typeof contentTargetElem == 'undefined')
    var contentTargetElem = "";
if (typeof id_for_contentTargetElem != 'undefined' && $(id_for_contentTargetElem)) {
    contentTargetElem = $(id_for_contentTargetElem);
}

//include external files
// Old mootools doesn't support Asset so add css file with link tag
if (Asset){
    Asset.css(urlStatic+'//shaiyaold.com/css/AG_2014_11_07.css');
}

if (typeof AG == 'undefined')
    var AG = new Class({/*Implements: [Options, Events]*/});

//overlay element
if (typeof AG.Overlay == 'undefined')
    AG.Overlay = new Class({
    Implements: [Options,Events],

    options:  {
        id: 'overlay',
        color: '#000',
        duration: 300,
        opacity: 0.5,
        zIndex: 1800000
    },

    initialize: function(container,options) {
        this.setOptions(options);
        this.container = document.id(container);
        this.overlay = new Element('div',{
            id: this.options.id,
            opacity: 0,
            styles: {
                position: 'absolute',
                background: this.options.color,
                left: 0,
                top: 0,
                'z-index': this.options.zIndex
            },
            events: {
                click: function() {
                    this.fireEvent('click');
                }.bind(this)
            }
        }).inject(this.container);
        this.tween = new Fx.Tween(this.overlay,{
            duration: this.options.duration,
            link: 'cancel',
            property: 'opacity',
            onStart: function() {
                this.resize();
            }.bind(this),
            onComplete: function() {
                if (this.overlay.getStyle('opacity') == this.options.opacity) {
                    this.fireEvent('show');
                } else {
                    this.fireEvent('hide');
//                    this.overlay.setStyle('display', 'none');
                    this.overlay.dispose();
                }
            }.bind(this)
        });
    },
    open: function() {
        this.fireEvent('open');
        this.overlay.setStyles({'opacity': 0, "visibility": "visible", "height": "100%", "width": "100%"});
        this.tween.start(this.options.opacity);
    },
    close: function() {
        this.fireEvent('close');
        this.tween.start(0);
    },

    resize: function() {
        var new_width = document.body.getScrollWidth();
        var new_height = document.body.getScrollHeight();
        this.overlay.style.width = new_width+'px';
        this.overlay.style.height = new_height+'px';
    }
});

// either modal box or embed content via Ajax
if (typeof AG.Box == 'undefined')
    AG.Box = new Class({
    Implements: [Options,Events],

    options: {
        is_modal: true, // default true
        contentTargetElem: contentTargetElem,
        width: 360,  //default width since inputs are set at 300px width by default
        height: 'auto',
        draggable: false,
        title: '......', //default title is none is specified
        fadeDelay: 400,
        fadeDuration: 400,
        keys: {
            esc: function() { this.close(); }
        },
        content: '......',
        zIndex: 1900000,
        pad: 100,
        overlayAll: false,
        constrain: false,
        resetOnScroll: true,
        refreshOnClose: false,
        baseClass: 'agbox',
        url: 'http://shaiyaold.com'
    },

    initialize: function(options) {
        if (this.options.contentTargetElem != '') {
            this.options.is_modal = false;
        }
        else {
            var overlay_opacity = 0.8;

            this.fullscreenOverlay = new AG.Overlay(document.body,{
                color: '#fff',
                opacity: overlay_opacity,
                zIndex: 1800000
            });

            //clicking on overlay closes the box
            this.addClickEvent(this.fullscreenOverlay.overlay,this.close);
        }

        this.setOptions(options);
        // if there is contentTargetElem, this should be embedded one, then overide options
        if (!this.options.is_modal) {
            this.options.keys = {};
            this.options.baseClass = 'agbox embed';
        }

        this.state = false;
        this.resizeOnOpen = true;
        this.ie6 = typeof document.body.style.maxHeight == "undefined";
        this.draw();
    },

    //functions to set html content
    setTitle: function(html) {
        this.title.set('html',html);
        this._resize();
    },
    setContent: function(html) {
        this.messageBox.set('html',html);
        this._resize();
    },

    //sets error based on an array of key value pairs where edit[key] is the name of the bad field and value is the message for the field
    //call with no arguments to clear all errors
    setErrors: function(json_array) {
        //determine if error box is visible or not
        if (json_array) {
            this.removeClass(this.errorBox,'display_none');
        } else {
            this.addClass(this.errorBox,'display_none');
        }

        var error_message = "<ul>";
        for (k in json_array) {
            error_message += '<li>' + json_array[k] + '</li>';
        }
        error_message += "</ul>";
        this.errorBox.set('html',error_message);
        //also try to set error classes on form elements
        this.setErrorClasses(json_array);
        this._resize();
    },

    //set class of elements to error based on keys in the json array
    //error is set if key is equal to the string inside the first string enclosed in brackets
    //does nothing if form doesn't exist
    setErrorClasses: function(json_array) {
        if (this.getForm()) {
            //remove error class from all fields
            var elements = this.getFormData();
            for (name in elements) {
                var element = this.getForm()[name];
                if (element) {
                    this.removeClass(element,'error');

                    //add error class to desired fields
                    for (key in json_array) {
                        var begin_key = name.indexOf('[');
                        var end_key = name.indexOf(']');
                        if (begin_key >= 0 && end_key >= 0) {
                            var key_name = name.substring(begin_key+1,end_key);
                            if (key_name == key) {
                                this.addClass(element,'error');
                            }
                        }
                    }
                }
            }
        }
    },

    //util function for adding a class to an element
    addClass: function(element,class_name) {
        if(!element.className.contains(class_name," ")){
            element.className=(element.className+" "+class_name).clean();
        }
    },

    //util function for removing a class from an element
    removeClass: function(element,class_name) {
        element.className=element.className.replace(new RegExp("(^|\\s)"+class_name+"(?:\\s|$)"),"$1");
    },

    //manual version of getElementsByClassName that only searches the modal box
    getElementsByClassName: function(class_name) {
        var results = [];
        var all_elements = this.getBox().getElements('*');
        for (i=0; i < all_elements.length; i++) {
            element = all_elements[i];
            if (element.className.contains(class_name," "))
                results.push(element);
        }
        return results;
    },

    //gets the first form in the modal box
    getForm: function() {
        return this.contentBox.getElement('form');
    },

    //gets name values pairs in the first form element in the modal box
    //appends object agr to the return data
    //passed in object values will overide form values on conflict
    getFormData: function(object) {
        var data = new Object();
        var form_elements = this.getForm().elements;

        for (var i = 0; i < form_elements.length; i++) {
            data[form_elements[i].name] = form_elements[i].value;
        }

        for (key in object) {
            data[key] = object[key];
        }
        return data;
    },

    //binds a click event onto a html element
    addClickEvent: function(element,funct) {
        element.onclick = funct.bind(this);
    },

    //binds a click event to all elements in the box with the specified class
    addClickEventsToClass: function(class_name,funct) {
        var elements = this.getElementsByClassName(class_name);
        for (i=0; i < elements.length; i++) {
            this.addClickEvent(elements[i],funct);
        }
    },

    //prepends a close button before element with value title
    prependCloseButton: function(element,title,append_class) {
        if (this.options.is_modal) {
            if (!title)
                title = 'Cancel';

            var btn_close = new Element('input',{
                type: 'button',
                name: 'ajax_close_button',
                value: title,
                'class': 'button ' + append_class,
                events: {
                    click: (this.close).bind(this)
                }
            });

            element.parentNode.insertBefore(btn_close,element);
            this._resize();
        }
    },

    //sends an ajax request
    //with optional on Failure response
    sendRequest: function(url, data, onSuccess, onFailure) {
        var sender = new Request.JSON({
            url: url,
            data: data
        });

        //default behavior onFailure
        if (!onFailure) {
            onFailure = function(response) {
                this.unfade();
                this.setContent('unexpected error occurred!');
            }
        }

        sender.addEvent('success', onSuccess.bind(this));
        sender.addEvent('failure', onFailure.bind(this));
        sender.send();
    },

    draw: function() {
        var drawTarget = (this.options.contentTargetElem != '') ? this.options.contentTargetElem : document.body;
        this.box = new Element('table', {
            'class': this.options.baseClass,
            styles: {
                'z-index': this.options.zIndex,
                opacity: 0
            },
            tween: {
                duration: this.options.fadeDuration,
                onComplete: function() {
                    if(this.box && this.box.getStyle('opacity') == 0) {
                        this.box.setStyles({ top: -9000, left: -9000 });
                    }
                }.bind(this)
            }
        }).inject(drawTarget, 'bottom');

        //draw rows and cells;  use native JS to avoid IE7 and I6 offsetWidth and offsetHeight issues
        var verts = ['top','center','bottom'], hors = ['Left','Center','Right'], len = verts.length;
        for(var x = 0; x < len; x++) {
            var row = this.box.insertRow(x);
            for(var y = 0; y < len; y++) {
                var cssClass = verts[x] + hors[y], cell = row.insertCell(y);
                cell.className = cssClass;
                if (cssClass == 'centerCenter') {
                    this.contentBox = new Element('div',{
                        'class': 'agboxContent',
                        styles: {
                            width: this.options.width
                        }
                    });
                    cell.appendChild(this.contentBox);
                }
                else {
                    document.id(cell).setStyle('opacity',0.4);
                }
            }
        }

        //draw X close button
        if (this.options.xclose && this.options.xclose.url){
            this.xclose = new Element('img',{
               'class': 'agboxCloseButton',
                src: this.options.xclose.url
            }).inject(this.contentBox);
        }

        //draw title
        if(this.options.title) {
            this.title = new Element('h2',{
                'class': 'agboxTitle',
                html: this.options.title
            }).inject(this.contentBox);
            if(this.options.draggable && window['Drag'] != null) {
                this.draggable = true;
                new Drag(this.box,{ handle: this.title });
                this.title.addClass('agboxDraggable');
            }
        }

        //draw error box
        this.errorBox = new Element('div',{
            'class': 'agboxErrorBox display_none'
        }).inject(this.contentBox);

        //draw message box
        this.messageBox = new Element('div',{
            'class': 'agboxMessageBox',
            html: this.options.content || '',
            styles: {
                height: this.options.height
            }
        }).inject(this.contentBox);

        //draw overlay
        this.overlay = new Element('div',{
            html: '&nbsp;',
            styles: {
                display: 'none',
                opacity: 0
            },
            'class': 'agboxOverlay',
            tween: {
                link: 'chain',
                duration: this.options.fadeDuration,
                onComplete: function() {
                    if(this.box && this.overlay.getStyle('opacity') == 0) this.box.focus();
                }.bind(this)
            }
        }).inject(this.contentBox);
        if(!this.options.overlayAll) {
            this.overlay.setStyle('top',(this.title ? this.title.getSize().y - 1: 0));
        }

        //focus node
        this.focusNode = this.box;

        return this;
    },

    // closes and destorys box
    close: function(fast) {
        if(this.isOpen) {
            if (this.options.refreshOnClose)
                document.location.reload();
            if (typeof this.fullscreenOverlay != 'undefined') {
                this.fullscreenOverlay.close();
            }
            if (fast !== "undefined" && fast) {
                this.box.setStyle("opacity", 0);
            } else {
                this.box.tween("opacity", 0);
            }
            this.fireEvent('close');
            this.destroy();
            this.isOpen = false;
        }
        return this;
    },

    //opens box after creation
    open: function(fast) {
        if(!this.isOpen) {
            if (typeof this.fullscreenOverlay != 'undefined') {
                this.fullscreenOverlay.open();
            }
            if (fast !== "undefined" && fast) {
                this.box.setStyle("opacity", 1);
            } else {
                this.box.tween("opacity", 1);
            }
            if(this.resizeOnOpen) this._resize();
            this.fireEvent('open');
            this._attachEvents();
            (function() {
                this._setFocus();
            }).bind(this).delay(this.options.fadeDuration + 10);
            this.isOpen = true;
        }
        return this;
    },

    _setFocus: function() {
        this.focusNode.setAttribute('tabIndex',0);
        this.focusNode.focus();
    },

    // Show and hide overlay
    fade: function(fade,delay) {
        this._ie6Size();
        (function() {
            this.overlay.setStyle('display', 'block');
            this.overlay.setStyle('opacity',fade || 1);
        }.bind(this)).delay(delay || 0);
        this.fireEvent('fade');
        return this;
    },
    unfade: function(delay) {
        (function() {
            this.overlay.setStyle('display', 'none');
            this.overlay.setStyle('opacity',0);
        }.bind(this)).delay(delay || this.options.fadeDelay);
        this.fireEvent('unfade');
        return this;
    },
    _ie6Size: function() {
        if(this.ie6) {
            var size = this.contentBox.getSize();
            var titleHeight = (this.options.overlayAll || !this.title) ? 0 : this.title.getSize().y;
            this.overlay.setStyles({
                height: size.y - titleHeight,
                width: size.x
            });
        }
    },

    // Attaches events when opened
    _attachEvents: function() {
        this.keyEvent = function(e){
            if(this.options.keys[e.key]) this.options.keys[e.key].call(this);
        }.bind(this);
        this.focusNode.addEvent('keyup',this.keyEvent);

        this.resizeEvent = this.options.constrain ? function(e) {
            if (typeof this.fullscreenOverlay != 'undefined') {
                this.fullscreenOverlay.resize();
            }
            this._resize();
        }.bind(this) : function() {
            if (typeof this.fullscreenOverlay != 'undefined') {
                this.fullscreenOverlay.resize();
            }
            this._position();
        }.bind(this);
        window.addEvent('resize',this.resizeEvent);

        if(this.options.resetOnScroll) {
            this.scrollEvent = function() {
                this._position();
            }.bind(this);
            window.addEvent('scroll',this.scrollEvent);
        }

        return this;
    },

    // Detaches events upon close
    _detachEvents: function() {
        this.focusNode.removeEvent('keyup',this.keyEvent);
        window.removeEvent('resize',this.resizeEvent);
        if(this.scrollEvent) window.removeEvent('scroll',this.scrollEvent);
        return this;
    },

    // Repositions the box
    _position: function() {
        var windowSize = window.getSize(),
            scrollSize = window.getScroll(),
            boxSize = this.box.getSize();
        this.box.setStyles({
            left: scrollSize.x + ((windowSize.x - boxSize.x) / 2),
            top: scrollSize.y + ((windowSize.y - boxSize.y) / 2)
        });
        this._ie6Size();
        return this;
    },

    // Resizes the box, then positions it
    _resize: function() {
        var width = this.options.width;
        this.contentBox.setStyle('width',width);

        var height = this.options.height;
        this.messageBox.setStyle('height',height);

        this._position();
    },

    // Expose message box
    toElement: function () {
        return this.messageBox;
    },

    // Expose entire modal box
    getBox: function() {
        return this.box;
    },

    // Cleanup
    destroy: function() {
        this._detachEvents();
        this.box.dispose();
        delete this.box;
    }
});
