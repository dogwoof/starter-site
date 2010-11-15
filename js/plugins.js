/*
 * jQuery placeholder inline labels plugin.
 * Author: Mark Perkins, mark@allmarkedup.com
 *
 * Will accept a custom 'getText' function if necessary to control
 * exactly how the plugin retrieves the label text.
 *
 */
 
;(function($){
    
    var defaults = {
        labeledClass        : 'inline-labeled',
        withContentClass    : 'with-content',
        dataName            : 'defaultVal',
        getText             : function( field ){
            // default function for getting the text to be used as inline label.
            // can be overridden on a case-by-case basis
            return field.attr('placeholder');
        }
    };
    
    $.fn.inlineLabel = function( options )
    {
        return this.each(function(){
            
            var o           = $.extend(true, {}, defaults, options),
                field       = $(this),
                defaultData = o.getText( field );
            
            field.addClass(o.labeledClass);
            if ( defaultData )
            {
                field.data('defaultVal', defaultData);
                if ( field.val() == '' ) {
                    field.val(defaultData);
                }
                else if ( field.val() !== defaultData ) {
                    field.addClass(o.withContentClass);
                }
                
                field.bind('focus', function(){
                    var _this = $(this);
                    if ( _this.val() == defaultData ) _this.addClass(o.withContentClass).val(''); // value is the default value, clear it out
                }).bind('blur', function(){
                    var _this = $(this);
                    if ( _this.val() == '' ) _this.removeClass(o.withContentClass).val(defaultData);
                });

                field.parents('form').bind('submit', function(){
                    if ( field.val() == defaultData ) field.val(''); // remove default values before submitting
                });
            }
        });
    }
    
})(jQuery);


/*
 * jQuery LiveTwitter 1.6.0
 * - Live updating Twitter plugin for jQuery
 *
 * Copyright (c) 2009-2010 Inge Jørgensen (elektronaut.no)
 * Licensed under the MIT license (MIT-LICENSE.txt)
 *
 * $Date: 2010/10/25$
 */

/*jslint browser: true, devel: true, onevar: false, immed: false, regexp: false */
/*global window: false, jQuery: false */

/*
 * Usage example:
 * $("#twitterSearch").liveTwitter('bacon', {limit: 10, rate: 15000});
 */

(function ($) {
	if (!$.fn.reverse) {
		$.fn.reverse = function () {
			return this.pushStack(this.get().reverse(), arguments);
		};
	}
	$.fn.liveTwitter = function (query, options, callback) {
		var domNode = this;
		$(this).each(function () {
			var settings = {};

			// Handle changing of options
			if (this.twitter) {
				settings = $.extend(this.twitter.settings, options);
				this.twitter.settings = settings;
				if (query) {
					this.twitter.query = query;
				}
				this.twitter.limit = settings.limit;
				this.twitter.mode  = settings.mode;
				if (this.twitter.interval) {
					this.twitter.refresh();
				}
				if (callback) {
					this.twitter.callback = callback;
				}

			// ..or create a new twitter object
			} else {
				// Extend settings with the defaults
				settings = $.extend({
					mode:      'search', // Mode, valid options are: 'search', 'user_timeline'
					rate:      15000,    // Refresh rate in ms
					limit:     10,       // Limit number of results
					refresh:   true,
					timeLinks: true,
					service:   ''
				}, options);

				// Default setting for showAuthor if not provided
				if (typeof settings.showAuthor === "undefined") {
					settings.showAuthor = (settings.mode === 'user_timeline') ? false : true;
				}

				// Set up a dummy function for the Twitter API callback
				if (!window.twitter_callback) {
					window.twitter_callback = function () {
						return true;
					};
				}

				this.twitter = {
					settings:      settings,
					query:         query,
					limit:         settings.limit,
					mode:          settings.mode,
					interval:      false,
					container:     this,
					lastTimeStamp: 0,
					callback:      callback,

					// Convert the time stamp to a more human readable format
					relativeTime: function (timeString) {
						var parsedDate = Date.parse(timeString);
						var delta = (Date.parse(Date()) - parsedDate) / 1000;
						var r = '';
						if  (delta < 60) {
							r = delta + ' seconds ago';
						} else if (delta < 120) {
							r = 'a minute ago';
						} else if (delta < (45 * 60)) {
							r = (parseInt(delta / 60, 10)).toString() + ' minutes ago';
						} else if (delta < (90 * 60)) {
							r = 'an hour ago';
						} else if (delta < (24 * 60 * 60)) {
							r = '' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
						} else if (delta < (48 * 60 * 60)) {
							r = 'a day ago';
						} else {
							r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
						}
						return r;
					},

					// Update the timestamps in realtime
					refreshTime: function () {
						var twitter = this;
						$(twitter.container).find('span.time').each(function () {
							var time_element = twitter.settings.timeLinks ? $(this).find('a') : $(this);
							time_element.html(twitter.relativeTime(this.timeStamp));
						});
					},

					// Handle reloading
					refresh: function (initialize) {
						var twitter = this;
						if (this.settings.refresh || initialize) {
							var url = '';
							var params = {};
							if (twitter.mode === 'search') {
								if (this.query && this.query !== '') {
									params.q = this.query;
								}
								if (this.settings.geocode) {
									params.geocode = this.settings.geocode;
								}
								if (this.settings.lang) {
									params.lang = this.settings.lang;
								}
								if (this.settings.rpp) {
									params.rpp = this.settings.rpp;
								} else {
									params.rpp = this.settings.limit;
								}
								
								// Convert params to string
								var paramsString = [];
								for (var param in params) {
									if (params.hasOwnProperty(param)) {
										paramsString[paramsString.length] = param + '=' + encodeURIComponent(params[param]);
									}
								}
								paramsString = paramsString.join("&");
								if (settings.service.length > 0) {
									url = "http://" + settings.service + "/api/search.json?";
								} else {
									url = "http://search.twitter.com/search.json?";
								}
								url += paramsString + "&callback=?";
							} else if (twitter.mode === 'user_timeline') {
								if (settings.service.length > 0) {
									url = "http://" + settings.service + "/api/statuses/user_timeline/" + encodeURIComponent(this.query) + ".json?count=" + twitter.limit + "&callback=?";
								} else {
									url = "http://api.twitter.com/1/statuses/user_timeline/" + encodeURIComponent(this.query) + ".json?count=" + twitter.limit + "&callback=?";
								}
							} else if (twitter.mode === 'list') {
								var username = encodeURIComponent(this.query.user);
								var listname = encodeURIComponent(this.query.list);
								url = "http://api.twitter.com/1/" + username + "/lists/" + listname + "/statuses.json?per_page=" + twitter.limit + "&callback=?";
							}
							$.getJSON(url, function (json) {
								var results = null;
								if (twitter.mode === 'search') {
									results = json.results;
								} else {
									results = json;
								}
								var newTweets = 0;
								$(results).reverse().each(function () {
									var screen_name = '';
									var profile_image_url = '';
									var created_at_date = '';
									var tweet_url = '';
									if (twitter.mode === 'search') {
										screen_name = this.from_user;
										profile_image_url = this.profile_image_url;
										created_at_date = this.created_at;
									} else {
										screen_name = this.user.screen_name;
										profile_image_url = this.user.profile_image_url;
										// Fix for IE
										created_at_date = this.created_at.replace(/^(\w+)\s(\w+)\s(\d+)(.*)(\s\d+)$/, "$1, $3 $2$5$4");
									}
									if (settings.service.length > 0) {
										tweet_url = 'http://' + settings.service + '/notice/' + this.id;
									} else {
										tweet_url = 'http://twitter.com/' + screen_name + '/statuses/' + this.id;
									}
									var userInfo = this.user;
									var linkified_text = this.text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function (m) { 
										return m.link(m); 
									});
									if (settings.service.length > 0) {
										linkified_text = linkified_text.replace(/@[A-Za-z0-9_]+/g, function (u) {
											return u.link('http://' + settings.service + '/' + u.replace(/^@/, ''));
										});
									} else {
										linkified_text = linkified_text.replace(/@[A-Za-z0-9_]+/g, function (u) {
											return u.link('http://twitter.com/' + u.replace(/^@/, ''));
										});
									}
									if (settings.service.length > 0) {
										linkified_text = linkified_text.replace(/#[A-Za-z0-9_\-]+/g, function (u) {
											return u.link('http://http://' + settings.service + '/search/notice?q=' + u.replace(/^#/, '%23'));
										});
									} else {
										linkified_text = linkified_text.replace(/#[A-Za-z0-9_\-]+/g, function (u) {
											return u.link('http://search.twitter.com/search?q=' + u.replace(/^#/, '%23'));
										});
									}
									
									if (!twitter.settings.filter || twitter.settings.filter(this)) {
										if (Date.parse(created_at_date) > twitter.lastTimeStamp) {
											newTweets += 1;
											var tweetHTML = '<div class="tweet tweet-' + this.id + '">';
											if (twitter.settings.showAuthor) {
												var profile_url = '';
												if (settings.service.length > 0) {
													profile_url = 'http://' + settings.service + '/' + screen_name;
												} else {
													profile_url = 'http://twitter.com/' + screen_name;
												}
												tweetHTML += 
													'<img width="24" height="24" src="' + profile_image_url + '" />' +
													'<p class="text"><span class="username"><a href="' + profile_url + '">' + screen_name + '</a>:</span> ';
											} else {
												tweetHTML += 
													'<p class="text"> ';
											}

											var timeText = twitter.relativeTime(created_at_date);
											var timeHTML = twitter.settings.timeLinks ? '<a href="' + tweet_url + '">' + timeText + '</a>' : timeText;

											tweetHTML += 
												linkified_text +
												' <span class="time">' + timeHTML + '</span>' +
												'</p>' +
												'</div>';
											$(twitter.container).prepend(tweetHTML);
											var timeStamp = created_at_date;
											$(twitter.container).find('span.time:first').each(function () {
												this.timeStamp = timeStamp;
											});
											if (!initialize) {
												$(twitter.container).find('.tweet-' + this.id).hide().fadeIn();
											}
											twitter.lastTimeStamp = Date.parse(created_at_date);
										}
									}
								});
								if (newTweets > 0) {
									// Limit number of entries
									$(twitter.container).find('div.tweet:gt(' + (twitter.limit - 1) + ')').remove();
									// Run callback
									if (twitter.callback) {
										twitter.callback(domNode, newTweets);
									}
									// Trigger event
									$(domNode).trigger('tweets');
								}
							});
						}	
					},
					start: function () {
						var twitter = this;
						if (!this.interval) {
							this.interval = setInterval(function () {
								twitter.refresh();
							}, twitter.settings.rate);
							this.refresh(true);
						}
					},
					stop: function () {
						if (this.interval) {
							clearInterval(this.interval);
							this.interval = false;
						}
					},
					clear: function () {
						$(this.container).find('div.tweet').remove();
						this.lastTimeStamp = null;
					}
				};
				var twitter = this.twitter;
				this.timeInterval = setInterval(function () {
					twitter.refreshTime();
				}, 5000);
				this.twitter.start();
			}
		});
		return this;
	};
})(jQuery);


/**
 * jQuery lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and adapted to me for use like a plugin from jQuery.
 * @name jquery-lightbox-0.5.js
 * @author Leandro Vieira Pinho - http://leandrovieira.com
 * @version 0.5
 * @date April 11, 2008
 * @category jQuery plugin
 * @copyright (c) 2008 Leandro Vieira Pinho (leandrovieira.com)
 * @license CCAttribution-ShareAlike 2.5 Brazil - http://creativecommons.org/licenses/by-sa/2.5/br/deed.en_US
 * @example Visit http://leandrovieira.com/projects/jquery/lightbox/ for more informations about this jQuery plugin
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
	/**
	 * $ is an alias to jQuery object
	 *
	 */
	$.fn.lightBox = function(settings) {
		// Settings to configure the jQuery lightBox plugin how you like
		settings = jQuery.extend({
			// Configuration related to overlay
			overlayBgColor: 		'#000',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
			overlayOpacity:			0.8,		// (integer) Opacity value to overlay; inform: 0.X. Where X are number from 0 to 9
			// Configuration related to navigation
			fixedNavigation:		false,		// (boolean) Boolean that informs if the navigation (next and prev button) will be fixed or not in the interface.
			// Configuration related to images
			imageLoading:			'/img/lightbox/lightbox-ico-loading.gif',		// (string) Path and the name of the loading icon
			imageBtnPrev:			'/img/lightbox/lightbox-btn-prev.gif',			// (string) Path and the name of the prev button image
			imageBtnNext:			'/img/lightbox/lightbox-btn-next.gif',			// (string) Path and the name of the next button image
			imageBtnClose:			'/img/lightbox/lightbox-btn-close.gif',		// (string) Path and the name of the close btn
			imageBlank:				'/img/lightbox/lightbox-blank.gif',			// (string) Path and the name of a blank image (one pixel)
			// Configuration related to container image box
			containerBorderSize:	10,			// (integer) If you adjust the padding in the CSS for the container, #lightbox-container-image-box, you will need to update this value
			containerResizeSpeed:	400,		// (integer) Specify the resize duration of container image. These number are miliseconds. 400 is default.
			// Configuration related to texts in caption. For example: Image 2 of 8. You can alter either "Image" and "of" texts.
			txtImage:				'Image',	// (string) Specify text "Image"
			txtOf:					'of',		// (string) Specify text "of"
			// Configuration related to keyboard navigation
			keyToClose:				'c',		// (string) (c = close) Letter to close the jQuery lightBox interface. Beyond this letter, the letter X and the SCAPE key is used to.
			keyToPrev:				'p',		// (string) (p = previous) Letter to show the previous image
			keyToNext:				'n',		// (string) (n = next) Letter to show the next image.
			// Don´t alter these variables in any way
			imageArray:				[],
			activeImage:			0
		},settings);
		// Caching the jQuery object with all elements matched
		var jQueryMatchedObj = this; // This, in this context, refer to jQuery object
		/**
		 * Initializing the plugin calling the start function
		 *
		 * @return boolean false
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); // This, in this context, refer to object (link) which the user have clicked
			return false; // Avoid the browser following the link
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
			// Hime some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			// Call the function to create the markup structure; style some elements; assign events in some elements.
			_set_interface();
			// Unset total images in imageArray
			settings.imageArray.length = 0;
			// Unset image active information
			settings.activeImage = 0;
			// We have an image set? Or just an image? Let´s see it.
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
				// Add an Array (as many as we have), with href and title atributes, inside the Array that storage the images references		
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			// Call the function that prepares image exibition
			_set_image_to_view();
		}
		/**
		 * Create the jQuery lightBox plugin interface
		 *
		 * The HTML markup will be like that:
			<div id="jquery-overlay"></div>
			<div id="jquery-lightbox">
				<div id="lightbox-container-image-box">
					<div id="lightbox-container-image">
						<img src="../fotos/XX.jpg" id="lightbox-image">
						<div id="lightbox-nav">
							<a href="#" id="lightbox-nav-btnPrev"></a>
							<a href="#" id="lightbox-nav-btnNext"></a>
						</div>
						<div id="lightbox-loading">
							<a href="#" id="lightbox-loading-link">
								<img src="../images/lightbox-ico-loading.gif">
							</a>
						</div>
					</div>
				</div>
				<div id="lightbox-container-image-data-box">
					<div id="lightbox-container-image-data">
						<div id="lightbox-image-details">
							<span id="lightbox-image-details-caption"></span>
							<span id="lightbox-image-details-currentNumber"></span>
						</div>
						<div id="lightbox-secNav">
							<a href="#" id="lightbox-secNav-btnClose">
								<img src="../images/lightbox-btn-close.gif">
							</a>
						</div>
					</div>
				</div>
			</div>
		 *
		 */
		function _set_interface() {
			// Apply the HTML markup into body tag
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			// Assigning click events in elements to close overlay
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			// Assign the _finish function to lightbox-loading-link and lightbox-secNav-btnClose objects
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			// If window was resized, calculate the new overlay dimensions
			$(window).resize(function() {
				// Get page sizes
				var arrPageSizes = ___getPageSize();
				// Style overlay and show it
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				// Get page scroll
				var arrPageScroll = ___getPageScroll();
				// Calculate top and left offset for the jquery-lightbox div object and show it
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		/**
		 * Prepares image exibition; doing a image´s preloader to calculate it´s size
		 *
		 */
		function _set_image_to_view() { // show the loading
			// Show the loading
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			// Image preload process
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				// Perfomance an effect in the image container resizing it
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
				//	clear onLoad, IE behaves irratically with animated gifs otherwise
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image´s width that will be showed
		 * @param integer intImageHeight The image´s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image´s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image´s height and the left and right padding value
			// Diferences
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			// Perfomance the effect
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();

			// Instead to define this configuration in CSS file, we define here. And it´s need to IE. Just.
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
			
			// Show the prev button, if not the first image in set
			if ( settings.activeImage != 0 ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnPrev').css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage - 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnPrev').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage - 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			
			// Show the next button, if not the last image in set
			if ( settings.activeImage != ( settings.imageArray.length -1 ) ) {
				if ( settings.fixedNavigation ) {
					$('#lightbox-nav-btnNext').css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' })
						.unbind()
						.bind('click',function() {
							settings.activeImage = settings.activeImage + 1;
							_set_image_to_view();
							return false;
						});
				} else {
					// Show the images button for Next buttons
					$('#lightbox-nav-btnNext').unbind().hover(function() {
						$(this).css({ 'background' : 'url(' + settings.imageBtnNext + ') right 15% no-repeat' });
					},function() {
						$(this).css({ 'background' : 'transparent url(' + settings.imageBlank + ') no-repeat' });
					}).show().bind('click',function() {
						settings.activeImage = settings.activeImage + 1;
						_set_image_to_view();
						return false;
					});
				}
			}
			// Enable keyboard navigation
			_enable_keyboard_navigation();
		}
		/**
		 * Enable a support to keyboard navigation
		 *
		 */
		function _enable_keyboard_navigation() {
			$(document).keydown(function(objEvent) {
				_keyboard_action(objEvent);
			});
		}
		/**
		 * Disable the support to keyboard navigation
		 *
		 */
		function _disable_keyboard_navigation() {
			$(document).unbind();
		}
		/**
		 * Perform the keyboard actions
		 *
		 */
		function _keyboard_action(objEvent) {
			// To ie
			if ( objEvent == null ) {
				keycode = event.keyCode;
				escapeKey = 27;
			// To Mozilla
			} else {
				keycode = objEvent.keyCode;
				escapeKey = objEvent.DOM_VK_ESCAPE;
			}
			// Get the key in lower case form
			key = String.fromCharCode(keycode).toLowerCase();
			// Verify the keys to close the ligthBox
			if ( ( key == settings.keyToClose ) || ( key == 'x' ) || ( keycode == escapeKey ) ) {
				_finish();
			}
			// Verify the key to show the previous image
			if ( ( key == settings.keyToPrev ) || ( keycode == 37 ) ) {
				// If we´re not showing the first image, call the previous
				if ( settings.activeImage != 0 ) {
					settings.activeImage = settings.activeImage - 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
			// Verify the key to show the next image
			if ( ( key == settings.keyToNext ) || ( keycode == 39 ) ) {
				// If we´re not showing the last image, call the next
				if ( settings.activeImage != ( settings.imageArray.length - 1 ) ) {
					settings.activeImage = settings.activeImage + 1;
					_set_image_to_view();
					_disable_keyboard_navigation();
				}
			}
		}
		/**
		 * Preload prev and next images being showed
		 *
		 */
		function _preload_neighbor_images() {
			if ( (settings.imageArray.length -1) > settings.activeImage ) {
				objNext = new Image();
				objNext.src = settings.imageArray[settings.activeImage + 1][0];
			}
			if ( settings.activeImage > 0 ) {
				objPrev = new Image();
				objPrev.src = settings.imageArray[settings.activeImage -1][0];
			}
		}
		/**
		 * Remove jQuery lightBox plugin HTML markup
		 *
		 */
		function _finish() {
			$('#jquery-lightbox').remove();
			$('#jquery-overlay').fadeOut(function() { $('#jquery-overlay').remove(); });
			// Show some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'visible' });
		}
		/**
		 / THIRD FUNCTION
		 * getPageSize() by quirksmode.com
		 *
		 * @return Array Return an array with page width, height and window width, height
		 */
		function ___getPageSize() {
			var xScroll, yScroll;
			if (window.innerHeight && window.scrollMaxY) {	
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			var windowWidth, windowHeight;
			if (self.innerHeight) {	// all except Explorer
				if(document.documentElement.clientWidth){
					windowWidth = document.documentElement.clientWidth; 
				} else {
					windowWidth = self.innerWidth;
				}
				windowHeight = self.innerHeight;
			} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			} else if (document.body) { // other Explorers
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}	
			// for small pages with total height less then height of the viewport
			if(yScroll < windowHeight){
				pageHeight = windowHeight;
			} else { 
				pageHeight = yScroll;
			}
			// for small pages with total width less then width of the viewport
			if(xScroll < windowWidth){	
				pageWidth = xScroll;		
			} else {
				pageWidth = windowWidth;
			}
			arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight);
			return arrayPageSize;
		};
		/**
		 / THIRD FUNCTION
		 * getPageScroll() by quirksmode.com
		 *
		 * @return Array Return an array with x,y page scroll values.
		 */
		function ___getPageScroll() {
			var xScroll, yScroll;
			if (self.pageYOffset) {
				yScroll = self.pageYOffset;
				xScroll = self.pageXOffset;
			} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
				yScroll = document.documentElement.scrollTop;
				xScroll = document.documentElement.scrollLeft;
			} else if (document.body) {// all other Explorers
				yScroll = document.body.scrollTop;
				xScroll = document.body.scrollLeft;	
			}
			arrayPageScroll = new Array(xScroll,yScroll);
			return arrayPageScroll;
		};
		 /**
		  * Stop the code execution from a escified time in milisecond
		  *
		  */
		 function ___pause(ms) {
			var date = new Date(); 
			curDate = null;
			do { var curDate = new Date(); }
			while ( curDate - date < ms);
		 };
		// Return the jQuery object for chaining. The unbind method is used to avoid click conflict when the plugin is called more than once
		return this.unbind('click').click(_initialize);
	};
})(jQuery); // Call and execute the function immediately passing the jQuery object