define([
    'jquery',
    'lodash',
    'i18n',
    'core/plugin',
    'qtiItemPic/picManager/picManager'
], function($, _, __, pluginFactory, picManager) {
    'use strict';

    return pluginFactory({
        name : 'picManager',

        /**
         * Initialize the plugin (called during runner's init)
         */
        init : function init(){
            //the old picManager requires the renderer to be fully ready before intializing, so all logic moved to render()
        },
        render : function(){
            var item = this.getHost().getItem();
            var areaBroker = this.getAreaBroker();
            var $container = areaBroker.getItemPropertyPanelArea();
            var $itemPanel = areaBroker.getItemPanelArea();
            picManager($container, $itemPanel, item);
        }
    });
});

