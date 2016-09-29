define([
    'jquery',
    'lodash',
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/static/states/Active',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'tpl!studentToolSample/creator/tpl/propertiesForm'
], function($, _, stateFactory, Active, formElement, formTpl){
    'use strict';

    var StudentToolSampleStateActive = stateFactory.extend(Active, function(){

        this.initForm();

    }, function(){

        //destroy form
        this.widget.$form.off().empty();
    });

    StudentToolSampleStateActive.prototype.initForm = function initForm(){

        var self = this,
            _widget = this.widget,
            $form = _widget.$form,
            tool = _widget.element,
            syncHints = function syncHints(){
                var $formContainer = $form.children('.student-tool-hint');
                var hints = {};
                var i = 0;
                //check that the form exists before sync to prevent from removing all hints if the callback is executed after the form has been destroyed
                if($formContainer.length){
                    $formContainer.find('[name=hint]').each(function(){
                        hints[i] = $(this).val();
                        i++;
                    });
                    tool.prop('hints', hints);
                }
            };

        $form.off().html(formTpl({
            shuffle : (tool.prop('shuffle') === true || tool.prop('shuffle') === 'true'),
            hints : _.values(tool.prop('hints'))
        }));

        formElement.initWidget($form);

        //init data change callbacks
        formElement.setChangeCallbacks($form, tool, {
            shuffle : function(tool, shuffle){
                tool.prop('shuffle', shuffle);
            }
        });

        //init the custom event listener
        $form.on('click', '[data-role=delete]', function(){
            $(this).parent('.panel').remove();
            syncHints();
        }).on('click', '[data-role=add]', function(){
            var hints = tool.prop('hints') || {};
            hints[_.size(hints)] = '';
            self.initForm();
        }).on('keyup change', _.throttle(syncHints, 400));
    };

    return StudentToolSampleStateActive;
});
