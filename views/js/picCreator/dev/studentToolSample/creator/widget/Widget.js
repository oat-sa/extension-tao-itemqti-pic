define([
    'taoQtiItem/qtiCreator/widgets/static/portableInfoControl/Widget',
    'studentToolSample/creator/widget/states/states',
    'css!studentToolSample/creator/css/studentToolSample'
], function(Widget, states){

    var StudentToolSampleWidget = Widget.clone();

    StudentToolSampleWidget.initCreator = function(){
        this.registerStates(states);
        Widget.initCreator.call(this);
    };

    return StudentToolSampleWidget;
});