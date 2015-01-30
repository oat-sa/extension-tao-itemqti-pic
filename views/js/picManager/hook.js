define([
    'jquery',
    'lodash',
    'ui/tooltipster',
    'taoQtiItem/qtiCreator/editor/infoControlRegistry',
    'taoQtiItem/qtiCreator/helper/creatorRenderer',
    'taoQtiItem/qtiCreator/model/helper/container',
    'taoQtiItem/qtiCreator/editor/gridEditor/content',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPicCss/pic-manager'
], function($, _, tooltip, icRegistry, creatorRenderer, containerHelper, contentHelper, managerTpl){

    var _studentToolTag = 'student-tool';
    var _studentToolbarId = 'studentToolbar';



    function itemWidgetLoaded(config, callback){
        var $editor = config.dom.getEditorScope();
        if($editor.data('widget')){
            callback($editor.data('widget'));
        }else{
            $(document).one('widgetloaded.qticreator', function(e, item){
                callback(item);
            });
        }
    }

    /**
     * Create a dummy place holder
     *
     * @param typeIdentifier
     * @returns {*|HTMLElement}
     */
    function getNewInfoControlNode(typeIdentifier){
        return $('<span/>')
            .addClass('widget-box')
            .attr('data-new', true)
            .attr('data-qti-class', 'infoControl.' + typeIdentifier);
    }

    function initStudentToolManager(config){

        /**
         * Number of all controls
         *
         * @type {number}
         */
        var controlCount = 0,
            controlPosition = 0;

        var $placeholderToolbar,
            $placeholderTool;

        //get item
        itemWidgetLoaded(config, function(itemWidget){

            var item = itemWidget.element;
            var $itemPropPanel = config.dom.getItemPropertyPanel();

            //get list of all info controls available
            icRegistry.loadAll(function(allInfoControls){

                //get item body container
                var $itemBody = config.dom.getEditorScope().find('.qti-itemBody');

                //prepare data for the tpl:
                var tools = {},
                    alreadySet = _.pluck(item.getElements('infoControl'), 'typeIdentifier');

                //feed the tools lists (including checked or not)
                _.each(allInfoControls, function(creator){

                    var name = creator.getTypeIdentifier(),
                        ic = icRegistry.get(name),
                        manifest = ic.manifest;

                    if(manifest.tags && manifest.tags[0] === _studentToolTag){
                        tools[name] = {
                            label : manifest.label,
                            description : manifest.description,
                            checked : (_.indexOf(alreadySet, name) > 0)
                        };
                    }

                    // store the name also in the value for convenience
                    allInfoControls[name].name = name;

                    // originally only the toolbar is up for installation
                    allInfoControls[name].checked = name === _studentToolbarId;

                    // originally none of the controls is installed
                    allInfoControls[name].installed = false;

                    // have the resources already been copied, i.e. has tool been installed before?
                    allInfoControls[name].copied = false;


                    // the number of all controls
                    controlCount++;
                });

                var $managerPanel = managerTpl({
                    tools : tools
                });
                $itemPropPanel.append($managerPanel);

                //init tooltips
                tooltip($itemPropPanel);

                //init event listeners:
                $('[data-role="pic-manager"]').on('change.picmanager', 'input:checkbox', function(e){

                    e.stopPropagation();

                    var $checkbox = $(this),
                        name = $checkbox.attr('name'),
                        checked = $checkbox.prop('checked');

                    allInfoControls[name].checked = $checkbox.prop('checked');

                    processAllControls();
                });



                /**
                 * Iterate over all controls and launch the actual installer/un-installer
                 */
                function processAllControls() {

                    // _.forOwn callback args are value, key
                    _.forOwn(allInfoControls, function(control) {

                        // is there any action required at all?
                        // if not and if there are still items left proceed to the next one
                        if(control.checked === control.installed) {
                            return true;
                        }

                        // either install or uninstall control
                        controlPosition++;
                        if(controlPosition > controlCount) {
                            controlPosition = 0;
                        }
                        processControl(control);

                        // break here and wait for the next call executed from processControl
                        return false;
                    });

                }

                /**
                 * Render tool|toolbar
                 *
                 * @param elt
                 */
                function renderControl(elt) {
                    var $widgetContainer,
                        widget;

                    //add the student tool css scope
                    elt.attr('class', 'sts-scope');

                    //render it
                    elt.setRenderer(creatorRenderer.get());

                    if(elt.typeIdentifier === _studentToolbarId){
                        elt.render($placeholderToolbar);
                        $placeholderToolbar = null;

                    }
                    else{
                        elt.render($placeholderTool);
                        $placeholderTool = null;
                    }

                    widget = elt.postRender({});
                    $widgetContainer = widget.$container;

                    //inform height modification
                    $widgetContainer.trigger('contentChange.gridEdit');
                    $widgetContainer.trigger('resize.gridEdit');
                }



                /**
                 * Remove a student tool
                 *
                 * @param control
                 */
                function removeControl(control){

                    var infoControls = item.getElements('infoControl'),
                        studentTool = _.find(infoControls, {
                            typeIdentifier : control.name
                        }),
                        remove = function() {
                            //call ic hook destroy() method
                            studentTool.data('pic').destroy();

                            //remove the widget from dom
                            $itemBody.find('.widget-box[data-serial=' + studentTool.serial + ']').remove();

                            //remove form model
                            item.removeElement(studentTool.serial);
                        };

                    //remove it
                    remove();

                    //search for existing info control, if there is only one with the typeIdentifier "studentToolbar" delete it:
                    if(_.size(infoControls) === 2){
                        _.each(infoControls, function(){
                            remove();
                        });
                    }
                }

                /**
                 * install|un-install a single control
                 *
                 * @param control
                 * @returns {boolean}
                 */
                function processControl(control){

                    // what needs to be done to the control? install|uninstall
                    if(!control.checked) {
                        removeControl(control);
                        allInfoControls[control.name].installed = false;
                        return processAllControls();
                    }

                    // is this the toolbar or a tool?
                    // we know at this point already whether it requires installation at all
                    // because otherwise it had been skipped inside processAllControls()
                    if(control.name === _studentToolbarId) {
                        //if not, create one and add it to the item
                        $placeholderToolbar = getNewInfoControlNode(_studentToolbarId);
                        $itemBody.prepend($placeholderToolbar);
                    }
                    //create an info control (student tool) and add it to the them
                    $placeholderTool = getNewInfoControlNode(control.name);
                    $itemBody.prepend($placeholderTool);

                    // install procedure
                    containerHelper.createElements(item.getBody(), contentHelper.getContent($itemBody), function(newElts){

                        // although newElts appears to be a collection it holds only _one_ element
                        // due to the callback mechanism between processControl() and processAllControls()
                        _.each(newElts, function(elt){

                            // if the required resources have not been copied yet
                            if(!control.copied) {
                                $.when(icRegistry.addRequiredResources(elt.typeIdentifier, config.uri))
                                    .then(function( data, textStatus, jqXHR ) {

                                        if(jqXHR.status !== 200) {
                                            throw 'Failed to add required resources for the info control';
                                        }

                                        allInfoControls[control.name].copied = true;

                                        renderControl(elt);
                                        allInfoControls[control.name].installed = true;

                                        // continue with the next element of allInfoControls
                                        processAllControls();

                                    });
                            }
                            else {
                                renderControl(elt);
                                allInfoControls[control.name].installed = true;
                                processAllControls();
                            }

                        });
                    });


                }

            });

        });

    }

    var pciManagerHook = {
        init : function(config){

            //load infoControl model first into the creator renderer
            creatorRenderer
                .get()
                .load(function(){

                    initStudentToolManager(config);

                }, ['infoControl']);

        }
    };

    return pciManagerHook;
});