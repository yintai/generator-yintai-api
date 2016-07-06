'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var pascalCase = require('pascal-case');
var path = require('path');

var APIGenerator = module.exports = yeoman.generators.Base.extend({

    initializing: function () {
        this.appname = _.kebabCase(path.basename(process.cwd()));
    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        var logo = "  _   _       ______ _____             \n" +
            " | \\ | |     |  ____|  __ \\            \n" +
            " |  \\| | ___ | |__  | |  | | _____   __\n" +
            " | . ` |/ _ \\|  __| | |  | |/ _ \\ \\ / /\n" +
            " | |\\  | (_) | |    | |__| |  __/\\ V / \n" +
            " |_| \\_|\\___/|_|    |_____/ \\___| \\_/  \n" +
            "                                       \n";
        this.log(chalk.green(logo) + 'Welcome to the supreme ' + chalk.red('generator-yintai-springboot') + ' generator!' + '\n' + chalk.yellow('Usually the default prompt is recommended. '));

        var prompts = [
            {
                type: 'string',
                name: 'organizationName',
                message: '(1/11) What is the organization\'s name of service?',
                default: 'yintai'
            },
            {
                type: 'string',
                name: 'extraMavenRepo',
                message: '(2/11) What private maven repository would you like to use? (eg. http://nexus.yintai.org:8081/nexus/content/groups/public/)'
            },
            {
                type: 'string',
                name: 'authorName',
                message: '(3/11) What is the author\'s name of service?',
                default: this.user.git.name()
            },
            {
                type: 'string',
                name: 'authorEmail',
                message: '(4/11) What is the author\'s email of service?',
                default: this.user.git.email()
            },
            {
                type: 'string',
                name: 'baseName',
                message: '(5/11) What is the base name of service?',
                default: this.appname
            },
            {
                type: 'string',
                name: 'packageName',
                message: '(6/11) What is the package name of service?',
                default: function (response) {
                    return 'com.' + response.organizationName + '.' + response.baseName.replace(/\-/g, '');
                }
            },
            {
                type: 'string',
                name: 'description',
                message: '(7/11) What is the description of service?'
            },
            {
                type: 'confirm',
                name: 'hasSample',
                message: '(8/11) Would you like to contains a sample?',
                default: true
            }
        ];

        this.prompt(prompts, function (props) {
            // To access props later use this.props.someOption;
            this.props = props;
            this.props.applicationName = pascalCase(this.appname) + 'Application';
            done();
        }.bind(this));
    },

    writing: function () {
        var sourceDir = "src/main/groovy/";
        var resourcesDir = "src/main/resources/";
        var testDir = "src/test/groovy/";
        var packageDir = this.props.packageName.replace(/\./g, '/') + '/';

        var sampleDir = sourceDir + "com/yintai/sample/";
        var sampleDestDir = sourceDir + packageDir + "sample/";

        //gradle
        this.template('build.gradle', 'build.gradle', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});
        this.template('gradle.properties', 'gradle.properties', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});
        this.fs.copy(this.templatePath('gradlew'), this.destinationPath('gradlew'));
        this.fs.copy(this.templatePath('gradlew.bat'), this.destinationPath('gradlew.bat'));
        this.fs.copy(this.templatePath('gradle/wrapper/gradle-wrapper.jar'), this.destinationPath('gradle/wrapper/gradle-wrapper.jar'));
        this.fs.copy(this.templatePath('gradle/wrapper/gradle-wrapper.properties'), this.destinationPath('gradle/wrapper/gradle-wrapper.properties'));

        //TODO test

        //readme
        this.template('README.md', 'README.md', this.props, {'interpolate': /<%=([\s\S]+?)%>/g});

        //git
        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));

        //sample
        if (this.props.hasSample) {
            this.template(sampleDir + "service/UserCriteria.groovy", sampleDestDir + "service/UserCriteria.groovy", this.props);
            this.template(sampleDir + "service/UserDTO.groovy", sampleDestDir + "service/UserDTO.groovy", this.props);
            this.template(sampleDir + "service/UserService.groovy", sampleDestDir + "service/UserService.groovy", this.props);
            this.template(sampleDir + "facade/UserDTO.groovy", sampleDestDir + "facade/UserDTO.groovy", this.props);
            this.template(sampleDir + "facade/UserFacade.groovy", sampleDestDir + "facade/UserFacade.groovy", this.props);
        }

    },

    install: function () {
        // this.installDependencies();
    }
});