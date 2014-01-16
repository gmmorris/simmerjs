load('http://localhost:9096/mp/qunit/qunit/env.rhino.1.2.js');
load('http://localhost:9096/mp/qunit/qunit/qunit.js');

var starttime = new Date().getTime();

// Envjs/QUnit Bridge.
Envjs({
            // Straight from the Envjs guide.
            scriptTypes: {
                "": true,
                "text/javascript": true
            },
            // Straight from the Envjs guide.
            beforeScriptLoad: {
                'sharethis': function (script) {
                    script.src = '';
                    return false;
                }
            },

            // Hook QUnit logging to console.
            afterScriptLoad: {
                'qunit': function () {
                    var countTests = 1, countAsserts = 0, testName, moduleName;

                    QUnit.moduleStart = function(name){
                        moduleName = name;
                    };
                    // Grab current test name.
                    QUnit.testStart = function(name, testEnvironment) {
                        testName = name;
                        countAsserts = 0;
                    };
                    // Override log to display to stdout.
                    QUnit.log = function (result, message) {
                        // Strip out HTML in results messages.
                        message = message.replace(/<\/?.*?>/g, '');
                        countAsserts++;

                        if(!result) {
                            console.log("  * {%s}(Assert #%s)[%s] %s",
                                testName, countAsserts++,
                                result ? 'PASS' : 'FAIL', message);
                        }
                    };
                    QUnit.testDone = function(name, failed, passed, total){

                        var message;
                        if(failed != 0) {
                            message = ' passed only ' + passed + ' out of ' + (total? total : failed + passed);
                        } else {
                            message = '';
                        }

                        console.log("  * {%s}(Test #%s)[%s] %s",
                            testName, countTests++,
                            failed ? 'FAIL' : 'PASS',message);

                    };
                    QUnit.moduleDone = function(name, failed, passed, total){

                    };
                    QUnit.done = function (fail, total){
                        var endtime = new Date().getTime();
                        var pass = total - fail;

                        console.log("\n" +
                            "*****************\n" +
                            "* QUnit Results *\n" +
                            "*****************\n" +
                            "* PASSED: %s assertions (in %s tests) \n" +
                            "* FAILED: %s assertions\n" +
                            "* Completed %s tests total in %s seconds.\n\n",
                            pass, countTests, fail, countTests, total,
                            parseFloat(endtime-starttime) / 1000.0);

                        if (pass != total) {
                            console.log("\n" +
                                    "*****************\n" +
                                    "* Tests Failed  *\n" +
                                    "*****************\n");
                            java.lang.System.exit(0);
                        }
                    };
                },

                // Straight from the Envjs guide.
                '.': function (script) {
                    script.type = 'text/envjs';
                }
            }
        });
