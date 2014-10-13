define([
    'i18n',
    'jquery',
    'lodash',
    'helpers',
    'taoQtiItem/qtiCreator/editor/infoControlRegistry',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPic_css/pic-manager'
], function(__, $, _, helpers, icRegistry, managerTpl){

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

    function addStudentToolManager(config){

        //get item
        itemLoaded(config, function(item){

            var $itemPropPanel = config.dom.getItemPropertyPanel();

            //get list of all info controls available
            icRegistry.loadAll(function(infoControls){
                
                //prepare data for the tpl:
                var tools = {};

                //get list of all info controls set in the item
                var infoControlSet = _.pluck(item.getElements('infoControl'), 'typeIdentifier');

                //feed the tools lists (including checked or not)
                _.each(infoControls, function(creator){

                    var id = creator.getTypeIdentifier(),
                        ic = icRegistry.get(id),
                        manifest = ic.manifest;
                     
                    if(manifest.tags && manifest.tags[0] === 'student-tool'){
                        tools[id] = {
                            label : manifest.label,
                            description : manifest.description,
                            checked : (_.indexOf(infoControlSet, id) > 0)
                        };
                    }

                });
                
                $itemPropPanel.append(managerTpl({
                    tools : tools
                }));
            });

            //init event listeners:
            $('[data-role="pic-manager"]').on('change.picmanager', 'input:checkbox', function(){

                var $checkbox = $(this),
                    name = $checkbox.attr('name'),
                    checked = $checkbox.prop('checked');

                if(checked){
                    //get item

                    //search if the required info control "toolbar" is set

                    //if not, create one and add it to the item

                    //create an info control (student tool) and add it to the them

                }else{
                    //remove it

                    //search for existing info control, if there is only one with the typeIdentifier "studentToolbar" delete it
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