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
            var itemUri = this.getHost().getItem().data('uri');
            var areaBroker = this.getAreaBroker();
            var $container = areaBroker.getItemPropertyPanelArea();
            var $itemPanel = areaBroker.getItemPanelArea();
            _.delay(function(){
                picManager($container, $itemPanel, itemUri);
            }, 3000);
        }
    });
});

