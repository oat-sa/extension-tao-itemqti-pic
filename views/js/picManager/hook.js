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
    'css!qtiItemPic_css/pic-manager'
], function(__, $, _, helpers, icRegistry, creatorRenderer, containerHelper, contentHelper, managerTpl){

    var _studentToolTag = 'student-tool';
    var _studentToolbarId = 'studentToolbar';
    var _urls = {
        addRequiredResources : helpers._url('addRequiredResources', 'PicManager', 'qtiItemPic')
    };

    function itemLoaded(config, callback){
        var $editor = config.dom.getEditorScope();
        if($editor.data('item')){
            callback($editor.data('item'));
        }else{
            $(document).on('itemloaded.qticreator', function(e, item){
                callback(item);
            });
        }
    }

    function getNewInfoControlNode(typeIdentifier){
        return $('<span data-new="true"  data-qti-class="infoControl" data-typeIdentifier="' + typeIdentifier + '" class="widget-box">&nbsp;</span>');
    }

    function addStudentToolManager(config){

        //get item
        itemLoaded(config, function(item){

            var $itemPropPanel = config.dom.getItemPropertyPanel();

            //get list of all info controls available
            icRegistry.loadAll(function(infoControls){

                //prepare data for the tpl:
                var tools = {},
                    alreadySet = _.pluck(item.getElements('infoControl'), 'typeIdentifier');

                //feed the tools lists (including checked or not)
                _.each(infoControls, function(creator){

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
            });

            var $editable = $('.qti-itemBody');

            function removeInfoControl(serial){

                $editable.find('.widget-box[data-serial+' + serial + ']').remove();
                item.removeElement(serial);
            }

            //init event listeners:
            $('[data-role="pic-manager"]').on('change.picmanager', 'input:checkbox', function(){

                var $checkbox = $(this),
                    name = $checkbox.attr('name'),
                    checked = $checkbox.prop('checked'),
                    infoControls = item.getElements('infoControl'),
                    $placeholderToolbar,
                    $placeholderTool;

                if(checked){

                    //search if the required info control "toolbar" is set
                    var studentToolbar = _.find(infoControls, {typeIdentifier : _studentToolbarId});
                    if(!studentToolbar){

                        //if not, create one and add it to the item
                        var $placeholderToolbar = getNewInfoControlNode(_studentToolbarId);
                        $editable.append($placeholderToolbar);

                    }

                    //create an info control (student tool) and add it to the them
                    var $placeholderTool = getNewInfoControlNode(name);
                    $editable.append($placeholderTool);

                    //create them
                    containerHelper.createElements(item.getBody(), contentHelper.getContent($editable), function(newElts){

                        creatorRenderer.get().load(function(){
                            
                            //load creator hook here to allow creating
                            
                            for(var serial in newElts){

                                var elt = newElts[serial],
                                    $widget,
                                    widget;

                                elt.setRenderer(this);

                                if($placeholderToolbar){

                                    elt.render($placeholderToolbar);
                                    elt.typeIdentifier = _studentToolbarId;

                                    $placeholderToolbar = null;

                                }else if($placeholderTool){

                                    elt.render($placeholderTool);
                                    elt.typeIdentifier = name;

                                    $placeholderTool = null;
                                }

                                widget = elt.postRender();
                                $widget = widget.$container;

                                //inform height modification
                                $widget.trigger('contentChange.gridEdit');
                                $widget.trigger('resize.gridEdit');
                            }

                        }, this.getUsedClasses());
                    });

                }else{

                    //remove it
                    var studentTool = _.find(infoControls, {typeIdentifier : name});
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

            addStudentToolManager(config);
        }
    };

    return pciManagerHook;
});