define([
    'lodash',
    'jquery',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/states/Sleep'
], function(_, $, stateFactory, SleepState){
    'use strict';

    return stateFactory.extend(SleepState, function(){

        var _widget = this.widget;
        var item = this.widget.element.getRelatedItem();

        _widget.$container.on('click.qti-widget.sleep', function(e){

            var $tool = $(e.target).closest('.sts-button[data-typeidentifier]');

            e.stopPropagation();

            if($tool.length){
                //find the student tool hosted in the toolbar and trigger the active state on it
                var infoControl = _.find(item.getElements('infoControl'), {typeIdentifier : $tool.data('typeidentifier')});
                infoControl.data('widget').changeState('active');
            }
        });

    }, function(){

        this.widget.$container.off('.sleep');
    });
});
