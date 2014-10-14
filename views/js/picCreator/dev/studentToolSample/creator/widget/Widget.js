define([
    'taoQtiItem/qtiCreator/widgets/static/Widget',
    'studentToolSample/creator/widget/states/states'
], function(Widget, states){

    var StudentToolSampleWidget = Widget.clone();

    StudentToolSampleWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return StudentToolSampleWidget;
});