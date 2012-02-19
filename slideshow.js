Slippy = {
    Slideshow: (function() {
        return {
            events: ['prev', 'next']
            ,speed: 5
            ,width: 720
            ,stepWidth: 1
            ,pos: 0
            ,moved: 0
			,slides: {}
            ,prev: function(slippyId) {
				Slippy.Slideshow.get(slippyId).update(slippyId, 'right')
            }
            ,next: function(slippyId) {
				Slippy.Slideshow.get(slippyId).update(slippyId, 'left')
            }
            ,stop: function(slippyId) {
				if(slippy = Slippy.Slideshow.get(slippyId)) {
                	if(slippy.timer) window.clearTimeout(slippy.timer);
	            	slippy.moved = 0;
				}
            }
            ,start: function(slippyId) {
				Slippy.Slideshow.get(slippyId).update(slippyId)
            }
            ,move: function(slippyId, direction) {
                if(direction == null) return;

				if(slippy = Slippy.Slideshow.get(slippyId)) {

					slippy.timer = window.setTimeout(
						'Slippy.Slideshow.move("'+slippyId+'","'+direction+'")', 
						slippy.speed);

					slippy.moved += slippy.stepWidth;

					// deck width is the full size of all the slides
					var deckWidth = (this.slides[slippyId].length * slippy.width)
					switch(direction) {
						case 'left':
							// take a step to the left
							slippy.pos -= slippy.stepWidth;
							if(slippy.pos <= - (deckWidth)) slippy.pos = 0;
							for(var i = 0; i < this.slides[slippyId].length; i++) {
									var itemPos = (i*slippy.width)+slippy.pos;
									// if this is way off to the left - flip it to the right
									if(itemPos <= - (deckWidth - slippy.width)) {
										itemPos += deckWidth; 
									}
									this.slides[slippyId][i].style.left = itemPos+ 'px';
							}
							break;
						case 'right':
							// take a step to the right
							slippy.pos += slippy.stepWidth;
							if(slippy.pos >= deckWidth) slippy.pos = 0;
							for(var i = 0; i < this.slides[slippyId].length; i++) {
									// add the new pos to the item
									var itemPos = (i*slippy.width)+slippy.pos;
									// if this is way off to the right - flip it to the left
									if(itemPos >= (deckWidth - slippy.width)) {
										itemPos -= deckWidth; 

									}
									this.slides[slippyId][i].style.left = itemPos+ 'px';
							}
							break;
						default: break;
					}

					if(slippy.moved >= slippy.width) Slippy.Slideshow.stop(slippyId);
				}
            }
            ,update: function(slippyId) {
                var direction = null;
                if(arguments.length > 1 && typeof arguments[1] == 'string') {
					direction = arguments[1];
				}
				slippy = Slippy.Slideshow.get(slippyId)
				if(slippy.moved == 0) Slippy.Slideshow.move(slippyId, direction);
            }
			,click: function(action, slippyId) {
				return function() {
						event.preventDefault();
						Slippy.Slideshow.get(slippyId)[action](slippyId)
				}
			}
			,get: function(slippyId) {
				return this.slippies[slippyId]
			}
            ,init: function(containerId) {
				var params = ['debug','speed', 'width', 'height'];
				for(var i = 0; i < params.length; i++) {
					var p = params[i];
	                if (arguments.length && typeof arguments[1][p] != 'undefined') {
						this[p] = arguments[1][p];					
					}
				}

				var container = document.getElementById(containerId);
                var frame= container.getElementsByClassName('frame')[0];
                var controls = container.getElementsByClassName('controls')[0];

				var slippyId = container.id;
                for(var i=0; i<this.events.length; i++) {
                    var action= this.events[i];
					
                    if(elem = controls.getElementsByClassName(action)[0]) {
						if(elem.addEventListener) {
	                    	elem.addEventListener('click', Slippy.Slideshow.click(action, slippyId), false);
						}
						else if(elem.attachEvent) {
							elem.attachEvent('onclick', Slippy.Slideshow.click(action));
						}
					}
                }

                this.slides[slippyId] = frame.getElementsByClassName('slide');
                container.style.width = (this.width) + 'px';
                frame.style.width = (this.slides[slippyId].length * this.width) + 'px';

                // fix widths & heights
				for(var i=0; i<this.slides[slippyId].length;i++) {
					var slide = this.slides[slippyId][i];
                    if(this.width>0) slide.width  = this.width; 
                    if(this.height>0) slide.height = this.height; 
                    slide.style.left = (i*this.width)+'px';
                };

				if(this.slides[slippyId].length < 2) controls.style.display = 'none';

				var clone = {}
				for(var prop in this) {
					if(typeof prop != 'Function') {
						clone[prop] = this[prop]
					}
				}

				if(typeof this.slippies == 'undefined') this.slippies = {};
				this.slippies[slippyId] = clone;
 
                this.start(slippyId)
            }
        }
    })()
}
