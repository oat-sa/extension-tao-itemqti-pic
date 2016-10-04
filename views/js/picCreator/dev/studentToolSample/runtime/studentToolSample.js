define(['IMSGlobal/jquery_2_1_1', 'OAT/lodash', 'qtiInfoControlContext'], function($, _, qtiInfoControlContext){
    'use strict';

    var studentToolSample = {
        id : -1,
        getTypeIdentifier : function(){
            return 'studentToolSample';
        },
        /**
         * Initialize the PIC
         * 
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function(id, dom, config, assetManager){

            var self = this,
                $container,
                $stsScope,
                timeout,
                hints;

            this.id = id;
            this.dom = dom;
            this.config = config || {};

            //init dom
            $container = $(dom);
            $container.find('img').attr('src', assetManager.resolve('studentToolSample/runtime/media/tool-icon.svg'));

            //hook it into the toolbar:
            this.$toolbar = $('#'+this.config.toolbarId);
            this.$toolbar.find('.sts-content').append($container);
            $stsScope = $container.closest('.sts-scope');

            //setup hinting engine
            hints = resetListing();
            $container.click(function(){
                var hint;
                if(!hints.length){
                    hints = resetListing();
                }
                hint = hints.shift();
                showHint(hint);
            });

            function resetListing(){
                var values = _.values(self.config.hints || []);
                if(self.config.shuffle){
                    return _.shuffle(values);
                }
                return values;
            }

            function showHint(hint){
                $stsScope.children('.hint-box').remove();
                $stsScope.append($('<div class="sts-studentToolSample hint-box"><span><></div>').html(hint));
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function(){
                    //todo use transition
                    $stsScope.children('.hint-box').fadeOut(1000, function(){
                        $(this).remove();
                    });
                }, 5000);
            }


        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the initial naked markup remains
         * Event listeners are removed and the state and the response are reset
         * 
         * @param {Object} interaction
         */
        destroy : function(){

            $(this.dom).remove();
        },
        /**
         * Restore the state of the interaction from the serializedState.
         * 
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function(state){
        },
        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         * 
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState : function(){

            return {};
        }
    };

    qtiInfoControlContext.register(studentToolSample);
});