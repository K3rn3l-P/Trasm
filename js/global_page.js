window.addEvent("domready", function(){	
	var dropDelay = 120;
	
	// Dropdown Menu
	$$('#header .menu0').addEvents({
		'mouseenter': function(){
			this.store('hasmouse', true);
			this.fireEvent('menutoggle', false, dropDelay);
		},
		'mouseleave': function(){
			if(!this.hasClass('no-mouseleave'))
				this.store('hasmouse', false);
				this.fireEvent('menutoggle', false, dropDelay);
		},
		'menutoggle': function(){
			if(this.retrieve('hasmouse')){
				var currentActive = document.getElement('.mactive');
			
				if(currentActive) currentActive.removeClass('mactive');
				this.addClass('mactive'); 			
			} else {
				this.removeClass('mactive');
			}
		}
	});
	
	// Side Menu
	$$('#menu-wrap .side-menu').addEvents({
		'mouseenter': function(){
			this.store('hasmouse', true);
			this.fireEvent('menutoggle', false, dropDelay);
		},
		'mouseleave': function(){
			if(!this.hasClass('no-mouseleave'))
				this.store('hasmouse', false);
				this.fireEvent('menutoggle', false, dropDelay);
		},
		'menutoggle': function(){
			if(this.retrieve('hasmouse')){
				var currentActive = document.getElement('.smactive');
			
				if(currentActive) currentActive.removeClass('smactive');
				this.addClass('smactive');
			} else {
				this.removeClass('smactive');
			}
		}		
	});

	$$('.shift-focus').addEvents({
		'click': function(e){
			e.preventDefault();
			document.getElement(this.get('rel')).focus();
		}	
	});	
	
	// Language Bar		
	if($('language-select')){
		$$('#language-select .menu2 a').each(function(element){
			element.addEvent('click',function(event){ 
				event.stop();
				
				var targetUrl = element.getProperty('rel');
				var targetLang = element.getProperty('lang');
				
				Cookie.write('lang', targetLang, {domain: document.domain.match(/\w+.com+/)[0], path: '/'});
				window.location = targetUrl;				
				
			});
		});
	}	
});	