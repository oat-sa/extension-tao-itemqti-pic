define([
    'lodash',
    'taoQtiItem/qtiCreator/editor/infoControlRegistry',
    'likertScaleInteraction/creator/widget/Widget',
    'tpl!likertScaleInteraction/creator/tpl/markup'
], function(_, registry, Widget, markupTpl){

    var _typeIdentifier = 'studentToolSample';

    var studentToolSampleCreator = {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         * 
         * @returns {String}
         */
        getTypeIdentifier : function(){
            return _typeIdentifier;
        },
        /**
         * (required) Get the widget prototype
         * Used in the renderer
         * 
         * @returns {Object} Widget
         */
        getWidget : function(){
            return Widget;
        },
        /**
         * (optional) Get the default properties values of the pic.
         * Used on new pic instance creation
         * 
         * @returns {Object}
         */
        getDefaultPciProperties : function(pic){
            return {
                movable : false,
                theme : 'tao-light'
            };
        },
        /**
         * (optional) Callback to execute on the 
         * Used on new pic instance creation
         * 
         * @returns {Object}
         */
        afterCreate : function(pic){
            //do some stuff
        },
        /**
         * (required) Gives the qti pic xml template 
         * 
         * @returns {function} handlebar template
         */
        getMarkupTemplate : function(){
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         * 
         * @returns {function} handlebar template
         */
        getMarkupData : function(pic, defaultData){
            defaultData.someData = pic.data('someData');
            return defaultData;
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return studentToolSampleCreator;
});