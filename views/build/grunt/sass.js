module.exports = function (grunt) {
    'use strict';

    var root    = grunt.option('root') + '/qtiItemPic/views/';
    var files   = {};

    files[root + 'css/pic-manager.css'] = root + 'scss/pic-manager.scss';
    files[root + 'js/picCreator/dev/studentToolSample/runtime/css/studentToolSample.css'] = root + 'js/picCreator/dev/studentToolSample/runtime/scss/studentToolSample.scss';
    files[root + 'js/picCreator/dev/studentToolSample/creator/css/studentToolSample.css'] = root + 'js/picCreator/dev/studentToolSample/creator/scss/studentToolSample.scss';
    files[root + 'js/picCreator/dev/studentToolbar/runtime/css/common.css'] = root + 'js/picCreator/dev/studentToolbar/runtime/scss/common.scss';
    files[root + 'js/picCreator/dev/studentToolbar/runtime/css/student-toolbar.css'] = root + 'js/picCreator/dev/studentToolbar/runtime/scss/student-toolbar.scss';

    grunt.config.merge({
        sass: {
            qtiitempic : {
                options : {
                    includePaths: [
                        '../../tao/views/node_modules/@oat-sa/tao-core-ui/scss',
                        '../scss/',
                        root + 'js/picCreator/dev/studentToolbar/runtime/scss'
                    ]
                },
                files
            }
        },
        watch: {
            qtiitempicsass: {
                files : [root + 'scss/*.scss', root + 'js/picCreator/dev/**/*.scss', root + 'scss/**/*.scss'],
                tasks : ['sass:qtiitempic', 'notify:qtiitempicsass'],
                options : {
                    debounceDelay : 1000
                }
            }
        },
        notify: {
            qtiitempicsass : {
                options: {
                    title: 'Grunt SASS',
                    message: 'SASS files compiled to CSS'
                }
            }
        }
    });

    grunt.registerTask('qtiitempicsass', ['sass:qtiitempic']);
};
