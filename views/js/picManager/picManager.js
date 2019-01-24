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
    'jquery',
    'lodash',
    'core/promise',
    'core/logger',
    'ui/tooltipster',
    'taoQtiItem/portableElementRegistry/icRegistry',
    'taoQtiItem/qtiCreator/helper/creatorRenderer',
    'taoQtiItem/qtiCreator/model/helper/container',
    'taoQtiItem/qtiCreator/editor/gridEditor/content',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPicCss/pic-manager'
], function ($, _, Promise, loggerFactory, tooltip, icRegistry, creatorRenderer, containerHelper, contentHelper, managerTpl) {
    'use strict';

    var _studentToolTag = 'student-tool';
    var _studentToolbarId = 'studentToolbar';
    var logger = loggerFactory('picManager');

    /**
     * Toggle the disabled state of checkboxes
     *
     * @param $checkBoxes
     * @param state
     */
    function toggleCheckboxState($checkBoxes, state) {

        $checkBoxes.each(function() {

            // @todo this is tmp code that needs to go as soon all tools are available
            // see also further down above check event for another portion of the code
            if(this.className.indexOf('not-available') > -1) {
                return true;
            }
            // end tmp code

            this.disabled = state;
        });
    }

    function itemWidgetLoaded($itemPanel, callback) {
        callback();
    }

    /**
     * Create a dummy place holder
     *
     * @param typeIdentifier
     * @returns {*|HTMLElement}
     */
    function getNewInfoControlNode(typeIdentifier) {
        return $('<span/>')
            .addClass('widget-box sts-tmp-element sts-placeholder-' + typeIdentifier)
            .attr('data-new', true)
            .attr('data-qti-class', 'infoControl.' + typeIdentifier);
    }

    /**
     *
     * @param $container
     * @param $itemPanel
     * @param itemUri
     */
    function initStudentToolManager($container, $itemPanel, item) {

        var $placeholder;
        //get item
        //editor panel..
        itemWidgetLoaded($itemPanel, function () {

            var uri = item.data('uri');
            //item prop panel, aka container
            var $itemPropPanel = $container;

            //get list of all info controls available
            icRegistry.loadCreators().then(function(allInfoControls){

                //get item body container
                //editor panel..
                var $itemBody = $itemPanel.find('.qti-itemBody');

                //prepare data for the tpl:
                var tools = {},
                    toolArray,
                    alreadySet = _.pluck(item.getElements('infoControl'), 'typeIdentifier'),
                    allInfoControlsSize,
                    $managerPanel,
                    i = 0;

                _.each(allInfoControls, function(creator){
                    var name = creator.getTypeIdentifier(),
                        manifest = icRegistry.get(name),
                        controlExists = _.indexOf(alreadySet, name) > -1,
                        defaultProperties = creator.getDefaultProperties(),
                        position = defaultProperties.position || 100 + i;

                    if (manifest.disabled) {
                        return;
                    }

                    if (manifest.tags && manifest.tags[0] === _studentToolTag) {
                        tools[name] = {
                            label: manifest.label,
                            description: manifest.description,
                            checked: controlExists,
                            position: position,
                            name: name
                        };
                    }

                    // store the name also in the value for convenience
                    allInfoControls[name].name = name;

                    // determine where to position a tool on the toolbar
                    allInfoControls[name].position = position;

                    // on load we assume that everything that already exists is also checked
                    // this counts also for the toolbar which has no actual checkbox
                    allInfoControls[name].checked = controlExists;

                    // have the resources already been copied,
                    // i.e. is the tool currently installed
                    allInfoControls[name].installed = controlExists;

                    // must be false, even if tool has been installed
                    // before, resources might have changed
                    allInfoControls[name].copied = false;

                    i++;
                });

                toolArray = _.sortBy(tools, 'position');

                allInfoControlsSize = _.size(allInfoControls);

                $managerPanel = managerTpl({
                    tools: toolArray
                });
                $itemPropPanel.append($managerPanel);

                //init tooltips
                tooltip.lookup($itemPropPanel);

                //init event listeners:
                var $checkBoxes = $('[data-role="pic-manager"]').find('input:checkbox');

                $checkBoxes.on('change.picmanager', function(e) {

                    e.stopPropagation();

                    // install toolbar if required
                    if (this.checked && !allInfoControls[_studentToolbarId].installed) {
                        allInfoControls[_studentToolbarId].checked = true;
                    }

                    allInfoControls[this.name].checked = this.checked;

                    toggleCheckboxState($checkBoxes, true);

                    processAllControls();

                });


                /**
                 * Iterate over all controls and launch the actual installer/un-installer
                 */
                function processAllControls() {

                    var cnt = 0;

                    // _.forOwn callback args are value, name
                    // name is also available as value.name
                    _.forOwn(allInfoControls, function (control) {

                        // is there any action required at all?
                        // if not and if there are still items
                        // left proceed to the next one
                        if (control.checked === control.installed) {
                            cnt++;
                            return true;
                        }

                        processControl(control);

                        // break here and wait for the next call
                        // to be executed from processControl()
                        return false;
                    });

                    if(cnt === allInfoControlsSize) {
                        toggleCheckboxState($checkBoxes, false);
                    }
                }


                /**
                 * Render tool|toolbar
                 *
                 * @param elt
                 */
                function renderControl(elt) {

                    var stsClassName = (elt.typeIdentifier === _studentToolbarId) ? 'sts-scope' : 'sts-scope sts-tmp-element';

                    //add the student tool css scope
                    elt.attr('class', stsClassName);

                    elt.prop('position', allInfoControls[elt.typeIdentifier].position);
                    elt.prop('toolbarId', 'sts-' + _studentToolbarId);

                    //render it
                    elt.setRenderer(creatorRenderer.get());

                    elt.render($placeholder);


                    $placeholder = null;

                    Promise.all(elt.postRender({})).then(function(){
                        var widget = elt.data('widget');

                        allInfoControls[elt.typeIdentifier].installed = true;

                        //inform height modification
                        widget.$container.trigger('contentChange.gridEdit');
                        widget.$container.trigger('resize.gridEdit');

                        if(elt.typeIdentifier !== _studentToolbarId) {
                            toggleCheckboxState($checkBoxes, false);
                        }

                        // continue with the next element of allInfoControls
                        processAllControls();

                    }).catch(function(err){
                        logger.error(err);
                    });
                }


                /**
                 * Remove a student tool
                 *
                 * @param control
                 */
                function removeControl(control) {

                    var infoControls = item.getElements('infoControl'),

                        remove = function (_control) {
                            var studentTool = _.find(infoControls, {
                                typeIdentifier: _control.name
                            });
                            //call ic hook destroy() method
                            studentTool.data('pic').destroy();

                            //remove the widget from dom
                            $('#sts-' + _control.name).remove();
                            $itemBody.find('.widget-box[data-serial=' + studentTool.serial + ']').remove();

                            //remove form model
                            item.removeElement(studentTool.serial);

                            allInfoControls[_control.name].checked = false;
                            allInfoControls[_control.name].installed = false;
                        };

                    //remove it
                    remove(control);
                    // in case there only two elements left, one of them
                    // must be the toolbar and needs to be removed too
                    if (_.size(infoControls) > 2) {
                        processAllControls();
                        return;
                    }

                    // reset to checked:true on click of any tool
                    remove(allInfoControls[_studentToolbarId]);

                    toggleCheckboxState($checkBoxes, false);
                    processAllControls();
                }

                /**
                 * install|un-install a single control
                 *
                 * @param control
                 * @returns {boolean}
                 */
                function processControl(control) {

                    // what needs to be done to the control? install|uninstall
                    if (!control.checked) {
                        removeControl(control);
                        return true;
                    }

                    //create an info control (student tool|toolbar) and add it to the them
                    $placeholder = getNewInfoControlNode(control.name);
                    $itemBody.prepend($placeholder);

                    // install procedure
                    containerHelper.createElements(
                        item.getBody(),
                        contentHelper.getContent($itemBody),
                        function (newElts) {
                            // although newElts appears to be a collection it holds
                            // only _one_ element due to the callback mechanism
                            // between processControl() and processAllControls()
                            _.each(newElts, function (elt) {

                                // update look-up list
                                allInfoControls[control.name].copied = true;
                                renderControl(elt);

                            });
                        });
                }

            }, true);

        });

    }

    return function picManager($container, $itemPanel, itemUri) {
        //load infoControl model first into the creator renderer
        creatorRenderer
            .get()
            .load(function () {
                initStudentToolManager($container, $itemPanel, itemUri);
            }, ['infoControl']);
    };

});
