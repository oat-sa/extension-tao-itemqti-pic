<div class="student-tool-hint">
    <div class="panel">
        <label>
            <input name="shuffle" type="checkbox" {{#if shuffle}}checked="checked"{{/if}}/>
            <span class="icon-checkbox"></span>
            {{__ "Shuffle"}}
        </label>
        <span class="icon-help tooltipstered" data-tooltip="~ .tooltip-content:first" data-tooltip-theme="info"></span>
        <span class="tooltip-content">
            {{__ "shuffle the hints"}}
        </span>
    </div>

    <div class="panel">
        <h3>{{__ "Hints"}}</h3>

        {{#each hints}}
        <div class="panel">
            <span class="icon-bin" data-role="delete"></span>
            <textarea name="hint">{{.}}</textarea>
        </div>
        {{/each}}

        <div class="panel">
            <button type="button" class="btn-info small" data-role="add" value="add">
                <span class="icon-add"></span>
                {{__ "new hint"}}
            </button>
        </div>
    </div>
</div>