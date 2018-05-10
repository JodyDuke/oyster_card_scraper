var user = require('./login_details');

var testindex = 0;
var loadInProgress = false;//This is set to true when a page is still loading

//Settings start
var webPage = require('webpage');
var page = webPage.create();
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36';
page.settings.javascriptEnabled = true;
page.settings.loadImages = false;//Script is much faster with this field set to false
phantom.cookiesEnabled = true;
phantom.javascriptEnabled = true;
//Settings end

console.log('All settings loaded, start with execution');
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

steps = [
    function(){
        console.log('step 1: open webpage');
        page.open('https://contactless.tfl.gov.uk', function(status) {

        });
    },
    function(){
        console.log('step 2: login');
        page.evaluate(function (login, password) {
            document.getElementById("startpage-login-username").value = login;
            document.getElementById("startpage-login-password").value = password;
            document.getElementById("sign-in").submit()
        }, user.me.login, user.me.password)
    },
    function(){
        console.log('step 3: check login was successful');
        if (page.title === 'My Dashboard - My Account - Transport for London') {
            console.log('login successful');
        }
        else {
            console.log('login failed')
            //push textindex past the rest of the function calls
            testindex = 10
        }
    },
    function(){
        console.log('setp 4: check for notifications')
        page.evaluate(function() {
            var cards = document.getElementById("dashboard-notification-message").textContent;
            var oyster = document.getElementById("dashboard-oyster-notification-message").textContent;
            console.log('Contactless cards - ', cards)
            console.log('Oyster cards - ', oyster)
        })
    }
]

interval = setInterval(executeRequestsStepByStep, 50);

function executeRequestsStepByStep() {
    if (loadInProgress == false && typeof steps[testindex] == "function") {
        //console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function") {
        console.log("test complete!");
        phantom.exit();
    }
}


page.onLoadStarted = function () {
    loadInProgress = true;
    console.log('Loading started');
};
page.onLoadFinished = function () {
    loadInProgress = false;
    console.log('Loading finished');
};
page.onConsoleMessage = function (msg) {
    console.log(msg);
};