define(['IMSGlobal/jquery_2_1_1', 'qtiInfoControlContext'], function($, qtiInfoControlContext){

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

            this.id = id;
            this.dom = dom;
            this.config = config || {};

            var $container = $(dom);

            $container.find('img').attr('src', assetManager.resolve('studentToolSample/runtime/media/tool-icon.svg'));

            //hook it into the toolbar:
            this.$toolbar = $('#'+this.config.toolbarId);
            this.$toolbar.find('.sts-content').append($container);
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