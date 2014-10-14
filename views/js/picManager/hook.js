define([
    'i18n',
    'jquery',
    'lodash',
    'helpers',
    'taoQtiItem/qtiCreator/editor/infoControlRegistry',
    'taoQtiItem/qtiCreator/helper/creatorRenderer',
    'taoQtiItem/qtiCreator/model/helper/container',
    'taoQtiItem/qtiCreator/editor/gridEditor/content',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPicCss/pic-manager'
], function(__, $, _, helpers, icRegistry, creatorRenderer, containerHelper, contentHelper, managerTpl){

    var _studentToolTag = 'student-tool';
    var _studentToolbarId = 'studentToolbar';
    var _urls = {
        addRequiredResources : helpers._url('addRequiredResources', 'PicManager', 'qtiItemPic')
    };

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

    function getNewInfoControlNode(typeIdentifier){
        return $('<span data-new="true"  data-qti-class="infoControl.' + typeIdentifier + '" class="widget-box">&nbsp;</span>');
    }

    function initStudentToolManager(config){

        //get item
        itemWidgetLoaded(config, function(itemWidget){

            var item = itemWidget.element;
            var $itemPropPanel = config.dom.getItemPropertyPanel();

            //get list of all info controls available
            icRegistry.loadAll(function(allInfoControls){

                //prepare data for the tpl:
                var tools = {},
                    alreadySet = _.pluck(item.getElements('infoControl'), 'typeIdentifier'),
                    $editable = config.dom.getEditorScope().find('.qti-itemBody');

                //feed the tools lists (including checked or not)
                _.each(allInfoControls, function(creator){

                    var id = creator.getTypeIdentifier(),
                        ic = icRegistry.get(id),
                        manifest = ic.manifest;

                    if(manifest.tags && manifest.tags[0] === _studentToolTag){
                        tools[id] = {
                            label : manifest.label,
                            description : manifest.description,
                            checked : (_.indexOf(alreadySet, id) > 0)
                        };
                    }
                });

                $itemPropPanel.append(managerTpl({
                    tools : tools
                }));
                
                //init event listeners:
                $('[data-role="pic-manager"]').on('change.picmanager', 'input:checkbox', function(){

                    var $checkbox = $(this),
                        name = $checkbox.attr('name'),
                        checked = $checkbox.prop('checked');

                    if(checked){
                        createStudentTool(name);
                    }else{
                        removeStudentTool(name);
                    }
                });
                
                function removeInfoControl(serial){
                    
                    //remove the widget from dom
                    $editable.find('.widget-box[data-serial=' + serial + ']').remove();
                    
                    //remove form model
                    item.removeElement(serial);
                }

                function createStudentTool(name){

                    var infoControls = item.getElements('infoControl'),
                        $placeholderToolbar,
                        $placeholderTool;

                    //search if the required info control "toolbar" is set
                    var studentToolbar = _.find(infoControls, {typeIdentifier : _studentToolbarId});
                    if(!studentToolbar){
                        //if not, create one and add it to the item
                        $placeholderToolbar = getNewInfoControlNode(_studentToolbarId);
                        $editable.append($placeholderToolbar);
                    }

                    //create an info control (student tool) and add it to the them
                    $placeholderTool = getNewInfoControlNode(name);
                    $editable.append($placeholderTool);

                    containerHelper.createElements(item.getBody(), contentHelper.getContent($editable), function(newElts){

                        //load creator hook here to allow creating
                        for(var serial in newElts){

                            var elt = newElts[serial];

                            $.getJSON(_urls.addRequiredResources, {typeIdentifier : elt.typeIdentifier, uri : config.uri}, function(r){

                                var $widget,
                                    widget;

                                if(r.success){

                                    //render it
                                    elt.setRenderer(creatorRenderer.get());

                                    if($placeholderToolbar){

                                        elt.render($placeholderToolbar);
                                        $placeholderToolbar = null;

                                    }else if($placeholderTool){

                                        elt.render($placeholderTool);
                                        $placeholderTool = null;
                                    }

                                    widget = elt.postRender({});
                                    $widget = widget.$container;

                                    //inform height modification
                                    $widget.trigger('contentChange.gridEdit');
                                    $widget.trigger('resize.gridEdit');

                                    console.log(elt, widget);

                                }else{
                                    throw 'failed to add requried resoruce for the info control';
                                }
                            });
                        }

                    });
                }

                function removeStudentTool(name){

                    var infoControls = item.getElements('infoControl'),
                        studentTool = _.find(infoControls, {typeIdentifier : name});
                    
                    //remove it
                    removeInfoControl(studentTool.serial);

                    //search for existing info control, if there is only one with the typeIdentifier "studentToolbar" delete it:
                    if(_.size(infoControls) === 2){
                        _.each(infoControls, function(infoControl){
                            removeInfoControl(infoControl.serial);
                        });
                    }
                }

            });

        });

    }

    var pciManagerHook = {
        init : function(config){
            
            //load infoControl model first into the creator renderer
            creatorRenderer.get().load(function(){

                initStudentToolManager(config);

            }, ['infoControl']);

        }
    };

    return pciManagerHook;
});