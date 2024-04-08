/**************************************************************************
 This file is dependent on the following files
 mootools-1.2.5-yui-compressed.js
 mootools-1.2.5.1-more.js
 AG_boxes.js (newest version)

 ***************************************************************************/

AG.Bulletin = new Class({
    Extends: AG.Box,

    options: {
        xclose: {
            url: '//cms-content.s.aeriastatic.com/2b91d295dcef5ce98a4c6a33f0f7311d/files/portal/image/a/agbox_closebox.png'
        }
    },

    initialize: function(options){
        this.parent(options); //initialize all base programs first
        this.fade(); //loading screen on open

        // Url for iframe source
        if (options && options.url){
            this.options.url = options.url;
        }
        else {
            this.options.url ='';
        }

        // Dimensions for iframe
        if (options && options.height){
            this.options.height = options.height;
        }
        else {
            this.options.height = 300;
        }
        if (options && options.width){
            this.options.width = options.width;
        }
        else {
            this.options.width = 300;
        }
        if (options && options.title){
            this.options.title = options.title;
        }
        else {
            this.options.title = '';
        }

        this.setTitle(this.options.title);
        this.setContent('<iframe scrolling="no" ' +
                        'height="' + this.options.height + '" ' +
                        'width="' + this.options.width + '" ' +
                        'src="' + this.options.url + '"></iframe>');
        this.addClickEvent(this.xclose,this.close); // clicking on xclose closes the box
    }
});