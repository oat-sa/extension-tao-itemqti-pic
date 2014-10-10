define([
    'i18n',
    'jquery',
    'helpers',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPic_css/pic-manager'
], function(__, $, helpers, managerTpl){

    var _urls = {
        addRequiredResources : helpers._url('addRequiredResources', 'PicManager', 'qtiItemPic')
    };

    function addStudentToolManager($itemPropPanel){
        
        //get item
        //get list of all info controls available
        //get list of all info controls set in the item
        //feed the tools lists (including checked or not)
        
        var tools = {
            studentTool1 : {
                label : 'tool 1',
                description : 'this is a tool 1',
                checked : false
            },
            studentTool2 : {
                label : 'tool 2',
                description : 'this is a tool 2',
                checked : true
            },
            studentTool3 : {
                label : 'tool 3',
                description : 'this is a tool 3',
                checked : true
            },
            studentTool4 : {
                label : 'tool 4',
                description : 'this is a tool 4',
                checked : false
            }
        };

        $itemPropPanel.append(managerTpl({
            tools : tools
        }));

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
    }

    var pciManagerHook = {
        init : function(config){

            console.log(config, config.dom.getItemPropertyPanel());

            var $itemPropPanel = config.dom.getItemPropertyPanel();

            addStudentToolManager($itemPropPanel, config.uri);

        }
    };

    return pciManagerHook;
});