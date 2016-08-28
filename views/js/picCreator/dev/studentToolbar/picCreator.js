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
define([
    'lodash',
    'taoQtiItem/portableElementRegistry/icRegistry',
    'studentToolbar/creator/widget/Widget',
    'tpl!studentToolbar/creator/tpl/student-toolbar'
], 
function(_, registry, Widget, markupTpl){
    'use strict';

    /**
     * Retrieve data from manifest
     */
    var manifest = registry.get('studentToolbar');

    /**
     * Configuration of the container
     */
    var is = {
        transparent: false, 
        movable: true, 
        rotatable: {
            tl: false,
            tr: false,
            br: false,
            bl: false
        },
        adjustable: {
            x:  false,
            y:  false,
            xy: false
        } 
    };
    is.transmutable = _.some(is.rotatable, Boolean) || _.some(is.adjustable, Boolean);

    var studentToolbarCreator = {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         * 
         * @returns {String}
         */
        getTypeIdentifier : function(){
            return manifest.typeIdentifier;
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
         * (optional) Get the default properties values of the PIC.
         * Used on new PIC instance creation
         * 
         * @returns {Object}
         */
        getDefaultProperties : function(pic){
            return {};
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
         * (required) Returns the QTI PIC XML template 
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
            
            defaultData = _.defaults(defaultData, {
                id: 'studentToolbar1',
                typeIdentifier : manifest.typeIdentifier,
                title : manifest.label,
                is: is,
                //referenced as a required file in manifest.media[]
                icon : manifest.typeIdentifier + '/runtime/media/student-toolbar.svg',
                alt : manifest.short || manifest.label
            });

            return defaultData;
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return studentToolbarCreator;
});