jQuery(function ($) {
	var $body = $('body'),
		$window = $(window);

	$(document).ready(function () {
		$(".eds_pageLoader").fadeOut("slow").addClass("eds_contentLoaded");
	});

	$window.on('scroll', function () {
		if ($window.scrollTop() == 0)
			$body.removeClass('eds_pageScrolled');
		else
			$body.addClass('eds_pageScrolled');
	});

	smoothScroll.init({
		selector: '.eds_scrollTo'
	});

	$(".eds__userTrigger").click(function () {
		$(".eds_header").toggleClass("eds_userLoginContainerVisible");
	});
	$(".eds__searchTrigger").click(function () {
		$(".eds_header").toggleClass("eds_searchVisible");
	});
	$(".eds__userLoginClose").click(function () {
		$(".eds_header").removeClass("eds_userLoginContainerVisible");
	});
	$(".eds__searchClose").click(function () {
		$(".eds_header").removeClass("eds_searchVisible");
	});
	$(".searchInputContainer input[type='text']").on("focus", function () {
		$(".eds_search").addClass("eds_overflowVisible");
	});
	$('.eds_Tabs').edsTabulator_1();
	$('.eds_Accordion').edsAccordion_1();
	$('.eds_paralaxBackground').parallax({
		speed: 0.15
	});
	$('.eds_paralaxBackground2').parallax({
		speed: 0.15
	});
	$('.eds_headertop').headerSpacer();
	$('.eds_menuAndTools').headerSpacer();
	$('.responsAbilityMenu').responsAbilityMenu();

	$('.pulseOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated pulse',
		offset: 100
	});
	$('.tadaOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated tada',
		offset: 100
	});
	$('.fadeInOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeIn',
		offset: 100
	});
	$('.fadeInDownOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInDown',
		offset: 100
	});
	$('.fadeInLeftOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInLeft',
		offset: 100
	});
	$('.fadeInLeftBigOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInLeftBig',
		offset: 100
	});
	$('.fadeInRightOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInRight',
		offset: 100
	});
	$('.fadeInRightBigOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInRightBig',
		offset: 100
	});
	$('.fadeInUpOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInUp',
		offset: 100
	});
	$('.fadeInUpBigOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated fadeInUpBig',
		offset: 100
	});
	$('.flipInXOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated flipInX',
		offset: 100
	});
	$('.flipInYOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated flipInY',
		offset: 100
	});
	$('.lightSpeedInOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated lightSpeedIn',
		offset: 100
	});
	$('.rotateInOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated rotateIn',
		offset: 100
	});
	$('.rotateInDownLeftOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated rotateInDownLeft',
		offset: 100
	});
	$('.rotateInDownRightOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated rotateInDownRight',
		offset: 100
	});
	$('.rotateInUpLeftOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated rotateInUpLeft',
		offset: 100
	});
	$('.rotateInUpRightOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated rotateInUpRight',
		offset: 100
	});
	$('.slideInDownOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated slideInDown',
		offset: 100
	});
	$('.slideInLeftOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated slideInLeft',
		offset: 100
	});
	$('.slideInRightOnView').addClass("eds_hidden").viewportChecker({
		classToAdd: 'eds_visible animated slideInRight',
		offset: 100
	});
	$('.eds_counter').viewportChecker({
		offset: 100,
		classToAdd: '',
		callbackFunction: function ($el, action) {
			var counterActivated = 'counterActivated';

			if ($el.data(counterActivated))
				return;

			$el.data(counterActivated, true);

			$el
				.prop('Counter', 0)
				.animate(
					{
						Counter: $el.text()
					},
					{
						duration: 2000,
						step: function (now) {
							$el.text(Math.ceil(now));
						}
					}
				);
		}
	});

	$('.eds_progressAnimated').addClass("eds_nullValue").viewportChecker({
		classToRemove: 'eds_nullValue',
		offset: 100
	});

	$('.eds_floatingMenu')
		.on('click', '> span', function () {
			$(this).parent().toggleClass('eds_floatingMenuActive');
		})
		.filter('.eds_onClickCloseMenu')
		.on('click', '> ul > li a.edsfnl_action', function () {
			$(this).parents('.eds_floatingMenu > ul').eq(0).parent().removeClass("eds_floatingMenuActive");
		});

});

// Hide Header on on scroll down ---------------------------------------------------------------------------------------

$(function () {
	var fixed = $('body'),
		headerHeight = $('.eds_header').outerHeight(),
		delta = 0;

	$(window).scroll(function () {
		if ($(this).scrollTop() > headerHeight + delta) {
			fixed.addClass("eds_fixedHeader");
		} else {
			fixed.removeClass("eds_fixedHeader");
		}
	});
});

//$(window).scroll(function() {
//var scroll = $(window).scrollTop();
//var objectSelect = $("header + div");
//var objectPosition = objectSelect.offset().top;
//if (scroll > objectPosition) {
//	$("body").addClass("eds_up");
//} else {
//	$("body").removeClass("eds_up");
//}
//});

// end of Hide Header on on scroll down --------------------------------------------------------------------------------

// responsAbilityInstance ----------------------------------------------------------------------------------------------

(function ($) {
	var menuInstanceKey = 'responsAbilityInstance',
		$window = $(window);

	$.fn.responsAbilityMenu = function () {
		return this.each(function () {
			var $mainWrapper = $(this),
				$menuWrapper = $('> .raMenuWrapper', $mainWrapper),
				$menuTriggerWrapper = $('> .raMenuTriggerWrapper', $mainWrapper),
				$placeholder = $mainWrapper.next('.responsAbilityMenuPlaceholder'),

				offsetTop,
				formTopMargin = parseInt($('#Form').css('marginTop'), 10),

				resizeMenu = function () {
					var maxHeight = $window.height() - $menuTriggerWrapper.outerHeight(true),
						windowScrollTop;

					if ($menuTriggerWrapper.is(':hidden') || !$mainWrapper.hasClass(menuOpenedClass))
						return;

					maxHeight -= $mainWrapper.outerHeight(true) - $mainWrapper.height();

					windowScrollTop = $window.scrollTop();

					if (offsetTop > windowScrollTop)
						maxHeight = maxHeight - formTopMargin - (offsetTop - windowScrollTop);

					$menuWrapper.css('maxHeight', maxHeight + 'px');
				},

				updateOffsetTop = function () {
					if ($mainWrapper.hasClass('raFixedMenu'))
						return;

					offsetTop = $mainWrapper.offset().top - parseFloat($mainWrapper.css('marginTop')) - formTopMargin;
				},

				menuOpenedClass = 'raMenuOpened',
				itemOpenedClass = 'raItemOpened',
				openMenuItemTimerKey = 'raOpenMenuItemTimer',
				isSideMenu = $mainWrapper.hasClass('sideMenu');

			if ($mainWrapper.data(menuInstanceKey))
				return;

			$mainWrapper.data(menuInstanceKey, true);

			updateOffsetTop();

			if ($placeholder.length > 0)
				$placeholder.height($mainWrapper.outerHeight(true));

			$mainWrapper
				.on('click', '> .raMenuTriggerWrapper > .raMenuTrigger', function () {
					$mainWrapper.toggleClass(menuOpenedClass);

					resizeMenu();
				})
				.on('click', '> .raMenuWrapper .edsmm_childIndicator', function () {
					$(this).parents('li').eq(0).toggleClass(itemOpenedClass)
				});

			if ($mainWrapper.hasClass('hoverOpensItems'))
				$mainWrapper
					.on('mouseenter', '> .raMenuWrapper .edsmm_menuItem', function () {
						var $this = $(this),
							$siblings = $this.siblings('.edsmm_hasChild');

						$siblings = $siblings.add('.edsmm_menuItem.edsmm_hasChild', $siblings)
							.each(function () {
								clearTimeout($(this).data(openMenuItemTimerKey));
							});

						$this.data(
							openMenuItemTimerKey,
							setTimeout(
								function () {
									if ($this.hasClass('edsmm_hasChild'))
										$this.addClass(itemOpenedClass);

									$siblings.removeClass(itemOpenedClass);
								},
								150
							)
						);
					});

			if (isSideMenu)
				$('> .raMenuWrapper .edsmm_menuItem.edsmm_active.edsmm_hasChild', $mainWrapper).addClass(itemOpenedClass);
			else
				$menuWrapper.on('mouseenter', '> ol > li.edsmm_megaMenu', function () {
					var $container = $('> div', this);

					if ($container.length == 0)
						return;

					var avalibleHeight = $window.height() - Math.ceil($container.offset().top) - 10;

					$container.css('max-height', avalibleHeight + $window.scrollTop());
				});

			$window
				.on('scroll', function () {
					updateOffsetTop();

					resizeMenu();

					if ($placeholder.length == 0)
						return;

					if ($window.scrollTop() >= offsetTop) {
						$mainWrapper
							.addClass('raFixedMenu')
							.css('marginTop', Math.abs(formTopMargin));

						$placeholder.addClass('show');
					} else {
						$mainWrapper
							.removeClass('raFixedMenu')
							.css('marginTop', '');

						$placeholder.removeClass('show');
					}
				})
				.on('resize', function () {
					updateOffsetTop();

					resizeMenu();

					if ($menuTriggerWrapper.is(':hidden')) {
						$mainWrapper.removeClass(menuOpenedClass);
						$menuWrapper.css('maxHeight', '');
					}
				});
		});
	};
})(jQuery);

// end of responsAbilityInstance ---------------------------------------------------------------------------------------

// edsTabulator --------------------------------------------------------------------------------------------------------

(function ($, window) {
	var activeClass = 'edsTabulator_active',
		tabTriggerSelector = '.edsTabulator_tabTrigger',
		tabSelector = '.edsTabulator_tab';

	function edsTabulator(elem) {
		var self = this,
			$mainWrapper = $(elem);

		$mainWrapper
			.on('click', tabTriggerSelector, function () {
				var $clicked = $(this),
					itemIndex = $clicked.index(),
					$tabContentWrappers = $('.edsTabulator_tabsWrapper .edsTabulator_tab', $mainWrapper);

				if ($clicked.hasClass(activeClass))
					return;

				$tabContentWrappers.removeClass(activeClass);
				$(tabTriggerSelector, $mainWrapper).removeClass(activeClass);

				$clicked.addClass(activeClass);
				$tabContentWrappers.eq(itemIndex).addClass(activeClass);
			});

		if ($(tabTriggerSelector + '.' + activeClass, $mainWrapper).length == 0) {
			$(tabSelector + '.' + activeClass, $mainWrapper).removeClass(activeClass);

			$(tabTriggerSelector, $mainWrapper).eq(0).addClass(activeClass);
			$(tabSelector, $mainWrapper).eq(0).addClass(activeClass);
		}
	}

	edsTabulator.prototype = {};

	$.fn.edsTabulator_1 = function () {
		var instanceKey = 'edsTabulatorRun';

		return this.each(function () {
			var self = this;

			if (!$.data(self, instanceKey))
				$.data(self, instanceKey, new edsTabulator(self));
		});
	};

})(jQuery, window);

//end of edsTabulator --------------------------------------------------------------------------------------------------

// edsAccordion --------------------------------------------------------------------------------------------------------

(function ($, window) {
	var activeClass = 'edsAccordion_active',
		sectionClass = 'edsAccordion_section',
		sectionContentWrapper = 'edsAccordion_contentWrapper';

	function edsAccordion(elem) {
		var self = this,
			$mainWrapper = $(elem);

		$mainWrapper
			.on('click', '.' + sectionClass + ' > .edsAccordion_title', function (e) {
				var $clicked = $(this),
					$section = $clicked.parent(),
					$sectionContentWrapper = $('> .' + sectionContentWrapper, $section),
					$activeSections = $('.' + sectionClass + '.' + activeClass, $mainWrapper),
					currentlyActive = $section.hasClass(activeClass);
				$('> .' + sectionContentWrapper, $activeSections)
					.stop(true)
					.animate(
						{
							height: 0
						},
						{
							duration: 200,
							complete: function () {
								$sectionContentWrapper.css('height', '0');
							}
						}
					);
				$activeSections.removeClass(activeClass);

				if (currentlyActive)
					return false;

				$sectionContentWrapper
					.stop(true)
					.animate(
						{
							height: $('> .edsAccordion_content', $sectionContentWrapper).outerHeight(true)
						},
						{
							duration: 200,
							complete: function () {
								$sectionContentWrapper.css('height', 'auto');
							}
						}
					);
				$section.addClass(activeClass);

				return false;
			});
	}

	edsAccordion.prototype = {};

	$.fn.edsAccordion_1 = function () {
		var instanceKey = 'edsAccordionRun';

		return this.each(function () {
			var elem = this;

			if (!$.data(elem, instanceKey))
				$.data(elem, instanceKey, new edsAccordion(elem));
		});
	};

})(jQuery, window);

// end of edsAccordion -------------------------------------------------------------------------------------------------

// jQuery Simple Parallax Plugin ---------------------------------------------------------------------------------------
// Author: Heather Corey

(function ($) {

	$.fn.parallax = function (options) {

		var windowHeight = $(window).height();

		// Establish default settings
		var settings = $.extend({
			speed: 0.15
		}, options);

		// Iterate over each object in collection
		return this.each(function () {

			// Save a reference to the element
			var $this = $(this);

			// Set up Scroll Handler
			$(document).scroll(function () {

				var scrollTop = $(window).scrollTop();
				var offset = $this.offset().top;
				var height = $this.outerHeight();

				// Check if above or below viewport
				if (offset + height <= scrollTop || offset >= scrollTop + windowHeight) {
					return;
				}

				var yBgPosition = Math.round((offset - scrollTop) * settings.speed);

				// Apply the Y Background Position to Set the Parallax Effect
				$this.css('background-position', 'center ' + yBgPosition + 'px');

			});
		});
	}
}(jQuery));

// end of jQuery Simple Parallax Plugin --------------------------------------------------------------------------------

// viewportChecker -----------------------------------------------------------------------------------------------------

/*
    The MIT License (MIT)

    Copyright (c) 2014 Dirk Groenen

    Permission is hereby granted, free of charge, to any person obtaining a copy of
    this software and associated documentation files (the "Software"), to deal in
    the Software without restriction, including without limitation the rights to
    use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
    the Software, and to permit persons to whom the Software is furnished to do so,
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
*/

(function ($) {
	$.fn.viewportChecker = function (useroptions) {
		if ($(this).length > 0 && $(this).hasClass('edsBB_ProgressTemp'))
			return;
		// Define options and extend with user
		var options = {
			classToAdd: 'visible',
			classToRemove: 'invisible',
			classToAddForFullView: 'full-visible',
			removeClassAfterAnimation: false,
			offset: 100,
			repeat: false,
			invertBottomOffset: true,
			callbackFunction: function (elem, action) { },
			scrollHorizontal: false,
			scrollBox: window
		};
		$.extend(options, useroptions);

		// Cache the given element and height of the browser
		var $elem = this,
			boxSize = { height: $(options.scrollBox).height(), width: $(options.scrollBox).width() };

        /*
         * Main method that checks the elements and adds or removes the class(es)
         */
		this.checkElements = function () {
			var viewportStart, viewportEnd;

			// Set some vars to check with
			if (!options.scrollHorizontal) {
				viewportStart = Math.max(
					$('html').scrollTop(),
					$('body').scrollTop(),
					$(window).scrollTop()
				);
				viewportEnd = (viewportStart + boxSize.height);
			}
			else {
				viewportStart = Math.max(
					$('html').scrollLeft(),
					$('body').scrollLeft(),
					$(window).scrollLeft()
				);
				viewportEnd = (viewportStart + boxSize.width);
			}

			// Loop through all given dom elements
			$elem.each(function () {
				var $obj = $(this),
					objOptions = {},
					attrOptions = {};

				//  Get any individual attribution data
				if ($obj.data('vp-add-class'))
					attrOptions.classToAdd = $obj.data('vp-add-class');
				if ($obj.data('vp-remove-class'))
					attrOptions.classToRemove = $obj.data('vp-remove-class');
				if ($obj.data('vp-add-class-full-view'))
					attrOptions.classToAddForFullView = $obj.data('vp-add-class-full-view');
				if ($obj.data('vp-keep-add-class'))
					attrOptions.removeClassAfterAnimation = $obj.data('vp-remove-after-animation');
				if ($obj.data('vp-offset'))
					attrOptions.offset = $obj.data('vp-offset');
				if ($obj.data('vp-repeat'))
					attrOptions.repeat = $obj.data('vp-repeat');
				if ($obj.data('vp-scrollHorizontal'))
					attrOptions.scrollHorizontal = $obj.data('vp-scrollHorizontal');
				if ($obj.data('vp-invertBottomOffset'))
					attrOptions.scrollHorizontal = $obj.data('vp-invertBottomOffset');

				// Extend objOptions with data attributes and default options
				$.extend(objOptions, options);
				$.extend(objOptions, attrOptions);

				// If class already exists; quit
				if ($obj.data('vp-animated') && !objOptions.repeat) {
					return;
				}

				// Check if the offset is percentage based
				if (String(objOptions.offset).indexOf("%") > 0)
					objOptions.offset = (parseInt(objOptions.offset) / 100) * boxSize.height;

				// Get the raw start and end positions
				var rawStart = (!objOptions.scrollHorizontal) ? $obj.offset().top : $obj.offset().left,
					rawEnd = (!objOptions.scrollHorizontal) ? rawStart + $obj.height() : rawStart + $obj.width();

				// Add the defined offset
				var elemStart = Math.round(rawStart) + objOptions.offset,
					elemEnd = (!objOptions.scrollHorizontal) ? elemStart + $obj.height() : elemStart + $obj.width();

				if (objOptions.invertBottomOffset)
					elemEnd -= (objOptions.offset * 2);

				// Add class if in viewport
				if ((elemStart < viewportEnd) && (elemEnd > viewportStart)) {

					// Remove class
					$obj.removeClass(objOptions.classToRemove);
					$obj.addClass(objOptions.classToAdd);

					// Do the callback function. Callback wil send the jQuery object as parameter
					objOptions.callbackFunction($obj, "add");

					// Check if full element is in view
					if (rawEnd <= viewportEnd && rawStart >= viewportStart)
						$obj.addClass(objOptions.classToAddForFullView);
					else
						$obj.removeClass(objOptions.classToAddForFullView);

					// Set element as already animated
					$obj.data('vp-animated', true);

					if (objOptions.removeClassAfterAnimation) {
						$obj.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
							$obj.removeClass(objOptions.classToAdd);
						});
					}

					// Remove class if not in viewport and repeat is true
				} else if ($obj.hasClass(objOptions.classToAdd) && (objOptions.repeat)) {
					$obj.removeClass(objOptions.classToAdd + " " + objOptions.classToAddForFullView);

					// Do the callback function.
					objOptions.callbackFunction($obj, "remove");

					// Remove already-animated-flag
					$obj.data('vp-animated', false);
				}
			});

		};

        /**
         * Binding the correct event listener is still a tricky thing.
         * People have expierenced sloppy scrolling when both scroll and touch
         * events are added, but to make sure devices with both scroll and touch
         * are handles too we always have to add the window.scroll event
         *
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/25
         * @see  https://github.com/dirkgroenen/jQuery-viewport-checker/issues/27
         */

		// Select the correct events
		if ('ontouchstart' in window || 'onmsgesturechange' in window) {
			// Device with touchscreen
			$(document).bind("touchmove MSPointerMove pointermove", this.checkElements);
		}

		// Always load on window load
		$(options.scrollBox).bind("load scroll", this.checkElements);

		// On resize change the height var
		$(window).resize(function (e) {
			boxSize = { height: $(options.scrollBox).height(), width: $(options.scrollBox).width() };
			$elem.checkElements();
		});

		// trigger inital check if elements already visible
		this.checkElements();

		// Default jquery plugin behaviour
		return this;
	};
})(jQuery);

// end of viewportChecker ----------------------------------------------------------------------------------------------

// headerSpacerInstance ------------------------------------------------------------------------------------------------

(function ($) {
	var instanceKey = 'headerSpacerInstance',
		$window = $(window);

	$.fn.headerSpacer = function () {
		return this.each(function () {
			var $mainWrapper = $(this),
				$placeholder = $($mainWrapper.data('placeholderSelector')),
				align = function () {
					$placeholder.height($mainWrapper.outerHeight(true));
				};

			if ($mainWrapper.data(instanceKey))
				return;

			$mainWrapper.data(instanceKey, true);

			$(document).ready(function ($) {
				align();
				setTimeout(
					function () {
						align();
					},
					600
				);
			});

			$window
				.on('scroll', function () {
					align();
					setTimeout(
						function () {
							align();
						},
						600
					);
				})
				.on('resize', function () {
					align();
					setTimeout(
						function () {
							align();
						},
						600
					);
				});
		});
	};
})(jQuery);

// end of headerSpacerInstance -----------------------------------------------------------------------------------------

// backToTop fadeIn-fadeOut --------------------------------------------------------------------------------------------

jQuery(document).ready(function ($) {
	// browser window scroll (in pixels) after which the "back to top" link is shown
	var offset = 500,
		//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
		offset_opacity = 1200,
		//duration of the top scrolling animation (in ms)
		scroll_top_duration = 700,
		//grab the "back to top" link
		$back_to_top = $('.eds_backToTop');

	//hide or show the "back to top" link
	$(window).scroll(function () {
		($(this).scrollTop() > offset) ? $back_to_top.addClass('eds_backToTopVisible') : $back_to_top.removeClass('eds_backToTopVisible eds_backToTopFadeOut');
		if ($(this).scrollTop() > offset_opacity) {
			$back_to_top.addClass('eds_backToTopFadeOut');
		}
	});

});

// end of backToTop fadeIn-fadeOut -------------------------------------------------------------------------------------

// smoothScroll --------------------------------------------------------------------------------------------------------

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory(root));
	} else if (typeof exports === 'object') {
		module.exports = factory(root);
	} else {
		root.smoothScroll = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

	'use strict';

	//
	// Variables
	//

	var smoothScroll = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings, eventTimeout, fixedHeader, headerHeight;

	// Default settings
	var defaults = {
		selector: '[data-scroll]',
		selectorHeader: '[data-scroll-header]',
		speed: 500,
		easing: 'easeInOutCubic',
		offset: 0,
		updateURL: true,
		callback: function () { }
	};


	//
	// Methods
	//

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
					// If deep merge and property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(true, extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the height of an element.
	 * @private
	 * @param  {Node} elem The element to get the height of
	 * @return {Number}    The element's height in pixels
	 */
	var getHeight = function (elem) {
		return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function (elem, selector) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if (firstChar === '[') {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split('=');

			if (attribute.length > 1) {
				value = true;
				attribute[1] = attribute[1].replace(/"/g, '').replace(/'/g, '');
			}
		}

		// Get closest match
		for (; elem && elem !== document; elem = elem.parentNode) {

			// If selector is a class
			if (firstChar === '.') {
				if (supports) {
					if (elem.classList.contains(selector.substr(1))) {
						return elem;
					}
				} else {
					if (new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test(elem.className)) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if (firstChar === '#') {
				if (elem.id === selector.substr(1)) {
					return elem;
				}
			}

			// If selector is a data attribute
			if (firstChar === '[') {
				if (elem.hasAttribute(attribute[0])) {
					if (value) {
						if (elem.getAttribute(attribute[0]) === attribute[1]) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if (elem.tagName.toLowerCase() === selector) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Escape special characters for use with querySelector
	 * @private
	 * @param {String} id The anchor ID to escape
	 * @author Mathias Bynens
	 * @link https://github.com/mathiasbynens/CSS.escape
	 */
	var escapeCharacters = function (id) {
		var string = String(id);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then throw an
			// `InvalidCharacterError` exception and terminate these steps.
			if (codeUnit === 0x0000) {
				throw new InvalidCharacterError(
					'Invalid character: the input contains U+0000.'
				);
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index === 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit === 0x002D
				)
			) {
				// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit === 0x002D ||
				codeUnit === 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// http://dev.w3.org/csswg/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	};

	/**
	 * Calculate the easing pattern
	 * @private
	 * @link https://gist.github.com/gre/1650294
	 * @param {String} type Easing pattern
	 * @param {Number} time Time animation should take to complete
	 * @returns {Number}
	 */
	var easingPattern = function (type, time) {
		var pattern;
		if (type === 'easeInQuad') pattern = time * time; // accelerating from zero velocity
		if (type === 'easeOutQuad') pattern = time * (2 - time); // decelerating to zero velocity
		if (type === 'easeInOutQuad') pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time; // acceleration until halfway, then deceleration
		if (type === 'easeInCubic') pattern = time * time * time; // accelerating from zero velocity
		if (type === 'easeOutCubic') pattern = (--time) * time * time + 1; // decelerating to zero velocity
		if (type === 'easeInOutCubic') pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; // acceleration until halfway, then deceleration
		if (type === 'easeInQuart') pattern = time * time * time * time; // accelerating from zero velocity
		if (type === 'easeOutQuart') pattern = 1 - (--time) * time * time * time; // decelerating to zero velocity
		if (type === 'easeInOutQuart') pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time; // acceleration until halfway, then deceleration
		if (type === 'easeInQuint') pattern = time * time * time * time * time; // accelerating from zero velocity
		if (type === 'easeOutQuint') pattern = 1 + (--time) * time * time * time * time; // decelerating to zero velocity
		if (type === 'easeInOutQuint') pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; // acceleration until halfway, then deceleration
		return pattern || time; // no easing, no acceleration
	};

	/**
	 * Calculate how far to scroll
	 * @private
	 * @param {Element} anchor The anchor element to scroll to
	 * @param {Number} headerHeight Height of a fixed header, if any
	 * @param {Number} offset Number of pixels by which to offset scroll
	 * @returns {Number}
	 */
	var getEndLocation = function (anchor, headerHeight, offset) {
		var location = 0;
		if (anchor.offsetParent) {
			do {
				location += anchor.offsetTop;
				anchor = anchor.offsetParent;
			} while (anchor);
		}
		location = location - headerHeight - offset;
		return location >= 0 ? location : 0;
	};

	/**
	 * Determine the document's height
	 * @private
	 * @returns {Number}
	 */
	var getDocumentHeight = function () {
		return Math.max(
			root.document.body.scrollHeight, root.document.documentElement.scrollHeight,
			root.document.body.offsetHeight, root.document.documentElement.offsetHeight,
			root.document.body.clientHeight, root.document.documentElement.clientHeight
		);
	};

	/**
	 * Convert data-options attribute into an object of key/value pairs
	 * @private
	 * @param {String} options Link-specific options as a data attribute string
	 * @returns {Object}
	 */
	var getDataOptions = function (options) {
		return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse(options);
	};

	/**
	 * Update the URL
	 * @private
	 * @param {Element} anchor The element to scroll to
	 * @param {Boolean} url Whether or not to update the URL history
	 */
	var updateUrl = function (anchor, url) {
		if (root.history.pushState && (url || url === 'true') && root.location.protocol !== 'file:') {
			root.history.pushState(null, null, [root.location.protocol, '//', root.location.host, root.location.pathname, root.location.search, anchor].join(''));
		}
	};

	var getHeaderHeight = function (header) {
		return header === null ? 0 : (getHeight(header) + header.offsetTop);
	};

	/**
	 * Start/stop the scrolling animation
	 * @public
	 * @param {Element} toggle The element that toggled the scroll event
	 * @param {Element} anchor The element to scroll to
	 * @param {Object} options
	 */
	smoothScroll.animateScroll = function (toggle, anchor, options) {

		// Options and overrides
		var overrides = getDataOptions(toggle ? toggle.getAttribute('data-options') : null);
		var settings = extend(settings || defaults, options || {}, overrides); // Merge user options with defaults
		anchor = '#' + escapeCharacters(anchor.substr(1)); // Escape special characters and leading numbers

		// Selectors and variables
		var anchorElem = anchor === '#' ? root.document.documentElement : root.document.querySelector(anchor);
		var startLocation = root.pageYOffset; // Current location on the page
		if (!fixedHeader) { fixedHeader = root.document.querySelector(settings.selectorHeader); }  // Get the fixed header if not already set
		if (!headerHeight) { headerHeight = getHeaderHeight(fixedHeader); } // Get the height of a fixed header if one exists and not already set
		var endLocation = getEndLocation(anchorElem, headerHeight, parseInt(settings.offset, 10)); // Scroll to location
		var animationInterval; // interval timer
		var distance = endLocation - startLocation; // distance to travel
		var documentHeight = getDocumentHeight();
		var timeLapsed = 0;
		var percentage, position;

		// Update URL
		updateUrl(anchor, settings.updateURL);

		/**
		 * Stop the scroll animation when it reaches its target (or the bottom/top of page)
		 * @private
		 * @param {Number} position Current position on the page
		 * @param {Number} endLocation Scroll to location
		 * @param {Number} animationInterval How much to scroll on this loop
		 */
		var stopAnimateScroll = function (position, endLocation, animationInterval) {
			var currentLocation = root.pageYOffset;
			if (position == endLocation || currentLocation == endLocation || ((root.innerHeight + currentLocation) >= documentHeight)) {
				clearInterval(animationInterval);
				anchorElem.focus();
				settings.callback(toggle, anchor); // Run callbacks after animation complete
			}
		};

		/**
		 * Loop scrolling animation
		 * @private
		 */
		var loopAnimateScroll = function () {
			timeLapsed += 16;
			percentage = (timeLapsed / parseInt(settings.speed, 10));
			percentage = (percentage > 1) ? 1 : percentage;
			position = startLocation + (distance * easingPattern(settings.easing, percentage));
			root.scrollTo(0, Math.floor(position));
			stopAnimateScroll(position, endLocation, animationInterval);
		};

		/**
		 * Set interval timer
		 * @private
		 */
		var startAnimateScroll = function () {
			animationInterval = setInterval(loopAnimateScroll, 16);
		};

		/**
		 * Reset position to fix weird iOS bug
		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
		 */
		if (root.pageYOffset === 0) {
			root.scrollTo(0, 0);
		}

		// Start scrolling animation
		startAnimateScroll();

	};

	/**
	 * If smooth scroll element clicked, animate scroll
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, settings.selector);
		if (toggle && toggle.tagName.toLowerCase() === 'a') {
			event.preventDefault(); // Prevent default click event
			smoothScroll.animateScroll(toggle, toggle.hash, settings); // Animate scroll
		}
	};

	/**
	 * On window scroll and resize, only run events at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {Object} settings
	 */
	var eventThrottler = function (event) {
		if (!eventTimeout) {
			eventTimeout = setTimeout(function () {
				eventTimeout = null; // Reset timeout
				headerHeight = getHeaderHeight(fixedHeader); // Get the height of a fixed header if one exists
			}, 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	smoothScroll.destroy = function () {

		// If plugin isn't already initialized, stop
		if (!settings) return;

		// Remove event listeners
		root.document.removeEventListener('click', eventHandler, false);
		root.removeEventListener('resize', eventThrottler, false);

		// Reset varaibles
		settings = null;
		eventTimeout = null;
		fixedHeader = null;
		headerHeight = null;
	};

	/**
	 * Initialize Smooth Scroll
	 * @public
	 * @param {Object} options User settings
	 */
	smoothScroll.init = function (options) {

		// feature test
		if (!supports) return;

		// Destroy any existing initializations
		smoothScroll.destroy();

		// Selectors and variables
		settings = extend(defaults, options || {}); // Merge user options with defaults
		fixedHeader = root.document.querySelector(settings.selectorHeader); // Get the fixed header
		headerHeight = getHeaderHeight(fixedHeader);

		// When a toggle is clicked, run the click handler
		root.document.addEventListener('click', eventHandler, false);
		if (fixedHeader) { root.addEventListener('resize', eventThrottler, false); }

	};


	//
	// Public APIs
	//

	return smoothScroll;

});

// end of smoothScroll -------------------------------------------------------------------------------------------------