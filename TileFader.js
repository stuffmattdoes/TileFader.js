/*

    TileFader.js

    Description: Swap content in/out from
    Author: Matthew Morrison
    License: MIT
    Twitter: @stuffmattdoesnt
    Version: 1.0

    TODO
    - Allow swapping with active items
    - Allow crossfading
    - Allow crossfading between active object
        ^ Probably create/destroy each item

*/

(function() {
     this.TileFader = function(container, params) {
        //  console.log("Tile fader");

         // ----------
         // Parameters
         // ----------

         var defaults = {
             crossfade : false,
             defaultTransition : true,
             fadePairs: false,
             item: '.tile-fader-item',
             itemActiveClass: 'tile-fader-item-active',
             itemBlock: '.tile-fader-item-block',
             itemsDisplayed : -1,
             itemInactiveClass: 'tile-fader-item-inactive',
             itemTransitionClass: 'tile-fader-item-transition',
             itemTypes : [],
             maintainItemType : false,
             maxInt : 3,
             minInt : 1,
             speed: 1000,
             swapFrequency: 1,
             swapWithActive : true
         }

         var instance = this;
         //  container: '.tile-fader-container',

         // Create options by extending defaults with the passed in arugments
         if (arguments[1] && typeof arguments[1] === "object") {
             this.options = extendDefaults(defaults, arguments[1]);
         }

         // Utility method to extend defaults with user options
         function extendDefaults(source, properties) {
             for (var property in properties) {
                 if (properties.hasOwnProperty(property)) {
                     source[property] = properties[property];
                 }
             }
             return source;
         }


        // ----------------
        // Public Functions
        // ----------------

        this.init = function() {
            // console.log("Create new Tile Fader");

            var itemBlocks = $(this.options.itemBlock),
                item = this.options.item,
                itemActiveClass = this.options.itemActiveClass,
                itemInactiveClass = this.options.itemInactiveClass,
                itemsDisplayed = this.options.itemsDisplayed,
                freqCount = 1;

            // Create a new tile fader
            $.each(itemBlocks, function(index, element) {

                // Check if we specify how many items to show
                // and hide all the extras
                if (itemsDisplayed > -1 && index >= itemsDisplayed) {
                    $(element).hide();
                    // $(element).removeClass('active');
                    $(item, element).addClass(itemInactiveClass);
                    $(item, element).hide();
                }

                // Now that we've sorted out the extras,
                // ensure that we mark the active ones
                if (!$(item, element).hasClass(itemInactiveClass)) {
                    $(item, element).addClass(itemActiveClass);
                }

            });

            // If our itemTypes include a "." in the string, remove it
            if (this.options.itemTypes.length > 0) {
                this.options.itemTypes.forEach(function(element, index) {
                    if (element[0] == '.') {
                        instance.options.itemTypes[index] = element.slice(1);
                    }
                });
            }

            // Start a new random swap timer for each frequency count
            while (freqCount <= this.options.swapFrequency) {
                instance.randomFadeTimer();
                freqCount ++;
            }
        }

        this.randomFadeTimer = function() {
            // console.log("Random fade timer");

            var minInt = this.options.minInt,
                maxInt = this.options.maxInt,
                randomInterval = Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);

            setTimeout(function() {
                instance.randomFade();
                instance.randomFadeTimer();
            }, randomInterval * 1000);

        }

        this.randomFade = function() {
            // console.log("Fade tile");

            var itemsActive = $("." + this.options.itemActiveClass),
                itemsInactive = $("." + this.options.itemInactiveClass),
                indexSwapOut = Math.floor(Math.random() * itemsActive.length),
                indexSwapIn = Math.floor(Math.random() * itemsInactive.length),
                itemSwapOut = $(itemsActive).eq(indexSwapOut),
                itemSwapIn = $(itemsInactive).eq(indexSwapIn),
                itemSwapOutBlock = $(itemSwapOut).parents(this.options.itemBlock),
                itemSwapInBlock = $(itemSwapIn).parents(this.options.itemBlock),
                toSwapIn;

            // Maintain the type of item we're swapping out
            if (this.options.maintainItemType) {
                this.options.itemTypes.forEach(function(e, i) {
                    // console.log("Maintain item type");

                    var tempItemsInactive = $("." + instance.options.itemInactiveClass + "." + e);

                    if ($(itemSwapOut).hasClass(e)) {
                        indexSwapIn = Math.floor(Math.random() * tempItemsInactive.length);
                        itemSwapIn = $(tempItemsInactive).eq(indexSwapIn);
                        itemSwapInBlock = $(itemSwapIn).parents(instance.options.itemBlock);
                    }
                });
            }


            // Fade out
            if (this.options.crossfade) {

                // Crossfade functionality here

            } else {
                var speed = this.options.speed / 2,
                    waitTime;

                $(itemSwapOut).removeClass(this.options.itemActiveClass);
                $(itemSwapOut).addClass(this.options.itemTransitionClass);
                $(itemSwapOut).fadeOut(speed);

                // console.log(this.options.itemTransitionClass);

                waitTime = setTimeout(function() {
                    $(itemSwapOut).prependTo(itemSwapInBlock);
                    $(itemSwapOut).removeClass(instance.options.itemTransitionClass);
                    $(itemSwapOut).addClass(instance.options.itemInactiveClass);
                }, speed);

                // Fade in
                $(itemSwapIn).removeClass(this.options.itemInactiveClass);
                $(itemSwapIn).addClass(this.options.itemTransitionClass);
                $(itemSwapIn).prependTo(itemSwapOutBlock);
                $(itemSwapIn).fadeIn(speed);

                waitTime = setTimeout(function() {
                    $(itemSwapIn).removeClass(instance.options.itemTransitionClass);
                    $(itemSwapIn).addClass(instance.options.itemActiveClass);
                }, speed);

            }
        }


        // --------------
        // Initialization
        // --------------

        instance.init();

    }

})();
