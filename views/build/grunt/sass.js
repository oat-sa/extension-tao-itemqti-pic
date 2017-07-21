module.exports = function (grunt) {
    'use strict';

    var sass    = grunt.config('sass') || {};
    var watch   = grunt.config('watch') || {};
    var notify  = grunt.config('notify') || {};
    var root    = grunt.option('root') + '/qtiItemPic/views/';

    sass.qtiitempic = {
        options : {
            includePaths: [
                '../scss/',
                root + 'js/picCreator/dev/studentToolbar/runtime/scss'
            ]
        },
        files : {}
    };
    sass.qtiitempic.files[root + 'css/pic-manager.css'] = root + 'scss/pic-manager.scss';
    sass.qtiitempic.files[root + 'js/picCreator/dev/studentToolSample/runtime/css/studentToolSample.css'] = root + 'js/picCreator/dev/studentToolSample/runtime/scss/studentToolSample.scss';
    sass.qtiitempic.files[root + 'js/picCreator/dev/studentToolSample/creator/css/studentToolSample.css'] = root + 'js/picCreator/dev/studentToolSample/creator/scss/studentToolSample.scss';
    sass.qtiitempic.files[root + 'js/picCreator/dev/studentToolbar/runtime/css/common.css'] = root + 'js/picCreator/dev/studentToolbar/runtime/scss/common.scss';
    sass.qtiitempic.files[root + 'js/picCreator/dev/studentToolbar/runtime/css/student-toolbar.css'] = root + 'js/picCreator/dev/studentToolbar/runtime/scss/student-toolbar.scss';

    watch.qtiitempicsass = {
        files : [root + 'scss/*.scss', root + 'js/picCreator/dev/**/*.scss', root + 'scss/**/*.scss'],
        tasks : ['sass:qtiitempic', 'notify:qtiitempicsass'],
        options : {
            debounceDelay : 1000
        }
    };

    notify.qtiitempicsass = {
        options: {
            title: 'Grunt SASS',
            message: 'SASS files compiled to CSS'
        }
    };

    grunt.config('sass', sass);
    grunt.config('watch', watch);
    grunt.config('notify', notify);

    grunt.registerTask('qtiitempicsass', ['sass:qtiitempic']);
};
