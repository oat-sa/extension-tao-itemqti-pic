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
define(['taoQtiItem/portableLib/jquery_2_1_1', 'taoQtiItem/portableLib/lodash', 'qtiInfoControlContext'], function($, _, qtiInfoControlContext){
    'use strict';

    /**
     * Global config for the hinter
     *
     * @private
     */
    var _config = {
        timeout : 5000,
        fadeoutDuration : 1000
    };

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

            var self = this,
                $container,
                timeout,
                hints;

            this.id = id;
            this.dom = dom;
            this.config = config || {};

            //init dom
            $container = $(dom);
            $container.find('.sts-button').append($('<img>', {
                src : assetManager.resolve('studentToolSample/runtime/media/tool-icon.svg'),
                alt: 'Show Hint'
            }));

            //hook it into the toolbar:
            this.$toolbar = $('#'+this.config.toolbarId);
            this.$toolbar.find('.sts-content').append($container);

            //setup hinting engine
            hints = resetListing();
            $container.click(function(){
                var hint;
                if(!hints.length){
                    hints = resetListing();
                }
                hint = hints.shift();
                showHint(hint);
            });

            /**
             * Reset the list of hints to be displayed and returns the array
             *
             * @returns {Array}
             */
            function resetListing(){
                var values = _.values(self.config.hints || []);
                if(self.config.shuffle){
                    return _.shuffle(values);
                }
                return values;
            }

            /**
             * Displays the hint
             *
             * @param hint
             */
            function showHint(hint){
                $container.children('.hint-box').remove();
                $container.append($('<div class="sts-studentToolSample hint-box">').text(hint));
                if(timeout){
                    clearTimeout(timeout);
                }
                timeout = setTimeout(function(){
                    $container.children('.hint-box').fadeOut(_config.fadeoutDuration, function(){
                        $(this).remove();
                    });
                }, _config.timeout);
            }


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
