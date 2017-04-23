'use strict';

let
    path = require('path');

module.exports = function (grunt) {
    
    // collect dependencies from node_modules
    let nm = path.resolve(__dirname, 'node_modules'),
        vendorAliases = ['dom', 'keyboardevent-key-polyfill', 'on', 'BaseComponent'],
        sourceMaps = true,
        watch = false,
        port = '8200',
        watchPort = 35751,
        babelTransform = [["babelify", { "presets": ["latest"] }]],
        devBabel = false;
    
    grunt.initConfig({
        
        browserify: {
            // source maps have to be inline.
            // grunt-exorcise promises to do this, but it seems overly complicated
            vendor: {
                // different convention than "dev" - this gets the external
                // modules to work properly
                // Note that vendor does not run through babel - not expecting
                // any transforms. If we were, that should either be built into
                // the app or be another vendor-type file
                src: ['.'],
                dest: 'tests/dist/vendor.js',
                options: {
                    // expose the modules
                    alias: vendorAliases.map(function (module) {
                        return module + ':';
                    }),
                    // not consuming any modules
                    external: null,
                    browserifyOptions: {
                        debug: sourceMaps
                    }
                }
            },
            dev: {
                files: {
                    //'tests/dist/output.js': ['tests/src/lifecycle.js']
					'tests/dist/output.js':['src/color-picker.js']
                },
                options: {
                    // not using browserify-watch; it did not trigger a page reload
                    watch: false,
                    keepAlive: false,
                    external: vendorAliases,
                    browserifyOptions: {
                        debug: sourceMaps
                    },
                    // transform not using babel in dev-mode.
                    // if developing in IE or using very new features,
                    // change devBabel to `true`
                    transform: devBabel ? babelTransform : [],
                    postBundleCB: function (err, src, next) {
                        console.timeEnd('build');
                        next(err, src);
                    }
                }
            },
            deploy: {
                files: {
                    'dist/core.js': ['src/deploy.js']
                },
                options: {
					transform: babelTransform,
                    browserifyOptions: {
						standalone: 'core',
                        debug: false
                    }
                }
            }
        },

		less: {
			main: {
				options: {
					sourceMap: true,
					// path used to link to individual less files in the browser
					sourceMapBasepath: '/',
					sourceMapFilename: 'tests/dist/output.map',
					sourceMapURL: 'localhost:' + port + '/tests/dist/output.map',
					//livereload: false
				},
				files: {
					'dist/color-picker.css': 'styles/color-picker.less'
				}
			}
		},

	// 	lessConfig.main.options.sourceMapFilename = mainOutput + '.map';
	// lessConfig.main.options.sourceMapURL = host + '/' + mainOutput + '.map';
        
        watch: {
            scripts: {
                files: ['tests/src/*.js', 'src/*.js', 'tests/*.html'],
                tasks: ['build-dev']
            },
			less:{
				files: 'styles/color-picker.less',
				tasks: ['less'],
				options: {
					livereload: false
				},
			},
			css:{
				files: 'dist/color-picker.css',
				tasks: []
			},
            options: {
                livereload: watchPort
            }
        },

        'http-server': {
            main: {
                // where to serve from (root is least confusing)
                root: '.',
                // port (if you run several projects at once these should all be different)
                port: port,
                // host (0.0.0.0 is most versatile: it gives localhost, and it works over an Intranet)
                host: '0.0.0.0',
                cache: -1,
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: false
                // route requests to another server:
                //proxy: dev.machine:80
            }
        },

        concurrent: {
            target: {
                tasks: ['watch', 'http-server'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // watch build task
    grunt.registerTask('build-dev', function (which) {
        console.time('build');
		grunt.task.run('less:main');
        grunt.task.run('browserify:dev');

    });

    // task that builds vendor and dev files during development
    grunt.registerTask('build', function (which) {
        grunt.task.run('browserify:vendor');
        grunt.task.run('build-dev');
    });

    // The general task: builds, serves and watches
    grunt.registerTask('dev', function (which) {
        grunt.task.run('build');
        grunt.task.run('concurrent:target');
    });

    // alias for server
    grunt.registerTask('serve', function (which) {
        grunt.task.run('http-server');
    });

	grunt.registerTask('deploy', function (which) {
		const compile = require('./scripts/compile');
		compile('BaseComponent');
		compile('properties');
		compile('template');
		compile('refs');
		compile('item-template');
	});



	grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-contrib-less');
};