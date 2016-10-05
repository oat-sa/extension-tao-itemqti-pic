/*
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016 (original work) Open Assessment Technologies SA;
 *
 */

/**
 * Provides a common "abstract" widget to be extended for all student tool widget.
 * It indeed perform proper initialization of the container for student tool PIC creator
 */
define([
    'jquery',
    'taoQtiItem/qtiCreator/widgets/static/portableInfoControl/Widget'
], function ($, Widget) {
    'use strict';

    var InfoControlWidget = Widget.clone();

    /**
     * Initialize the creator widget
     */
    InfoControlWidget.initCreator = function initCreator() {
        //note : abstract widget class must not register states
        Widget.initCreator.call(this);
    };

    /**
     * Build and prepare the container for the student tool typed PIC
     */
    InfoControlWidget.buildContainer = function buildContainer() {

        var $tool = $(this.element.data('pic').dom);
        $tool.wrap('<span class="widget-box widget-inline">');

        //the container will be the visible student tool button in the student toolbar
        this.$container = $tool.parent();
        this.$container.attr('data-serial', this.element.serial);
        this.$container.css({
            display: 'inline-block',
            float: 'left'
        });
        this.$container.append($('<span class="overlay">').css({
            display: 'inline-block'
        }));

        //need to tag the original as the widget box otherwise it cannot be recognized as a valid authoring element during serialization back to xml on save
        this.$original.addClass('widget-box');
    };

    return InfoControlWidget;
});