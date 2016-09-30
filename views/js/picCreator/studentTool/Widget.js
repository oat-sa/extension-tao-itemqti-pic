define([
    'jquery',
    'taoQtiItem/qtiCreator/widgets/static/portableInfoControl/Widget'
], function($, Widget) {
    'use strict';
    
    var InfoControlWidget = Widget.clone();
    
    InfoControlWidget.initCreator = function() {
        
        //note : abstract widget class must not register states
        
        Widget.initCreator.call(this);
    };

    InfoControlWidget.buildContainer = function(){

        var $tool = $(this.element.data('pic').dom);
        $tool.wrap('<span class="widget-box widget-inline">');

        //the container will be the visible student tool button in the student toolbar
        this.$container = $tool.parent();
        this.$container.attr('data-serial', this.element.serial);
        this.$container.css({
            display : 'inline-block',
            float : 'left'
        });
        this.$container.append($('<span class="overlay">').css({
            display : 'inline-block'
        }));

        //need to tag the original as the widget box otherwise it cannot be recognized as a valid authoring element during serialization back to xml on save
        this.$original.addClass('widget-box');
    };

    return InfoControlWidget;
});