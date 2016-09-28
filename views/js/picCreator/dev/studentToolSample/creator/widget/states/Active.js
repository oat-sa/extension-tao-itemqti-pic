define([
    'jquery',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/static/states/Active'
], function($, stateFactory, Active){
    'use strict';

    return stateFactory.extend(Active, function(){

        console.log('activce');

    }, function(){

        console.log('inactivce');
    });

});
