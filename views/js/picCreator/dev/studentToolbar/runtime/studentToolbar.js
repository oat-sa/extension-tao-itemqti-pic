define(['jquery'], function($){

    /**
     * The global qtiInfoControlContext
     * Global object qtiInfoControlContext cannot be passed as AMD dependency because the pci libs are loaded under a different requirejs context.
     * This means that the dependencies of qtiInfoControlContext would also need to be compied into this one which is too complicated.
     * 
     * @type {Object} - the globally scoped qtiInfoControlContext
     */
    var _picContext = window.qtiInfoControlContext;

    var studentToolbar = {
        id : -1,
        getTypeIdentifier : function(){
            return 'studentToolbar';
        },
        /**
         * Render the PCI : 
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function(id, dom, config){

            this.id = id;
            this.dom = dom;
            this.config = config || {};

            var $container = $(dom);
            
            console.log('init toolbar');
        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains 
         * Event listeners are removed and the state and the response are reset
         * 
         * @param {Object} interaction
         */
        destroy : function(){

            var $container = $(this.dom);
            $container.off().empty();
        },
        /**
         * Restore the state of the interaction from the serializedState.
         * 
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function(state){

            console.log('state set to', state)
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

    _picContext.register(studentToolbar);
});