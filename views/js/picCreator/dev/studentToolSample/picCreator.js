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
    'studentToolSample/creator/widget/Widget',
    'tpl!studentToolSample/creator/tpl/markup'
], function(_, registry, Widget, markupTpl){
    'use strict';

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
        getDefaultProperties : function(){
            return {
                shuffle:false,
                hints : [
                    "You're never too old to learn.",
                    "If there is no wind, row.",
                    "Fall seven times, stand up eight.",
                    "The journey is the reward."
                ]
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
            
            var manifest = registry.get(_typeIdentifier);

            defaultData = _.defaults(defaultData, {
                typeIdentifier : _typeIdentifier,
                title : manifest.description
            });
            
            return defaultData;
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return studentToolSampleCreator;
});