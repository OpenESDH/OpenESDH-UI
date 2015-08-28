module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    install: true,
                    copy: false,
                    targetDir: './libs',
                    cleanTargetDir: true
                }
            }
        },
        jshint: {
            options: {
                curly: true
            },
            dev: {
                src: ['Gruntfile.js', 'src/**/*.js'],
                test: ['test/**/*.js']
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/main.css': 'sass/main.scss'
                }
            }
        },
        karma: {
            options: {
                configFile: 'config/karma-conf.js'
            },
            unit: {
                singleRun: true
            }
        },
        watch: {
            dev: {
                options: {
                    atBegin: true
                },
                files: ['Gruntfile.js', 'src/**/*.js'],
                tasks: ['jshint']
            },
            scripts: {
                options: {
                    spawn: false,
                },
                files: ['**/*.js'],
                tasks: ['jshint'],
            }
        },
        connect: {
            server: {
                options: {
                    base: '.',
                    middleware: function(connect, options, defaultMiddleware) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy
                        ].concat(defaultMiddleware);
                    }
                },
                proxies: [
                    {
                        context: '/alfresco',
//                        host: 'demo.alfresco.dk',
//                        port: 80,
                        host: 'localhost',
                        port: 8080,
                        secure: false
                    }
                ]
            }
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('dev', ['bower', 'configureProxies:server', 'connect:server', 'watch:dev']);
    grunt.registerTask('default', []);
};