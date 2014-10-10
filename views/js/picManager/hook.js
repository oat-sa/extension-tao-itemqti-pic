define([
    'i18n',
    'helpers',
    'tpl!qtiItemPic/picManager/tpl/manager',
    'css!qtiItemPic_css/pic-manager'
], function(__, helpers, managerTpl){

    var _urls = {
        addRequiredResources : helpers._url('addRequiredResources', 'PicManager', 'qtiItemPic')
    };

    function addStudentToolManager($itemPropPanel){
        
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