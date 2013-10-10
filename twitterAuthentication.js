/*
Twitter authentication
*/
angular.module('Twitter',['compile']).
 filter('linkify', function() {
	return function(input, hashTags) {
	var out = input;
	var exp = '\S*#(?:\[[^\]]+\]|\S+)';

	for(var i=0;i<hashTags.length; i++)
	{
		var tag = hashTags[i].text;
		out = out.replace("#"+hashTags[i].text, "<a href=\'#\' ng-click=\"searchHashtags(\'" + hashTags[i].text + "\')\">#" + hashTags[i].text + "</a>");
	}
	return out;
	}
	});

function TwitterAuthenticateCtrl($scope) {
	var cb = new Codebird();
	cb.setConsumerKey("0WEBuCyNrPRAUwWR2VDKnA", "ZJ2sQECiN4Eh8OUMaCdoHr3WYKeTRBMHKlVormMQI");

	// Get Application only authorization token
	cb.__call(
	    "oauth2_token",
	    {},
	    function (reply) {
    		localStorage["bearerToken"] = reply.access_token;
    		cb.setBearerToken(reply.access_token);
	    }
	);


	if (localStorage["screen_name"])
	{
		cb.setToken(localStorage["authToken"], localStorage["authSecret"]);

		var welcomeDivElement = document.getElementById("welcomeDiv");
		welcomeDivElement.className = "visible"

		$scope.screen_name = localStorage["screen_name"];
	}
	else 
	{
		var signinDivElement = document.getElementById("signinDiv");
		signinDivElement.className = "visible"
	}

	$scope.clearCookie=function()
	{
		localStorage.clear();
	}


	$scope.twitterSignIn=function ()
	{
		// authenticate
		// gets a request token
		cb.__call(
		    "oauth_requestToken",
		    {oauth_callback: "oob"},
		    function (reply) {
		        // stores it
		        cb.setToken(reply.oauth_token, reply.oauth_token_secret);

		        // gets the authorize screen URL
		        cb.__call(
		            "oauth_authorize",
		            {},
		            function (auth_url) {
		                window.codebird_auth = window.open(auth_url);
		            }
		        );
		    }
		);
	};

	$scope.setScreenName=function(screen_name)
	{
		$scope.screen_name = screen_name;
		$scope.$apply();
	};

	$scope.searchHashtags = function(tagText)
	{
		$scope.$apply($scope.searchField = tagText);
		$scope.twitterSearchTwits();
	};

	$scope.twitterAuthenticate=function ()
	{
		self = this;

		cb.__call(
			"oauth_accessToken",
			{oauth_verifier: $scope.pinfield},
	    	function (reply) {
	    		if (reply)
	    		{
		        	// store the authenticated token, which may be different from the request token (!)
		        	cb.setToken(reply.oauth_token, reply.oauth_token_secret);

		        	// store the token in HTML5 local storage
		        	localStorage["authToken"] = reply.oauth_token;
		        	localStorage["authSecret"] = reply.oauth_token_secret;
		        	localStorage["screen_name"] = reply.screen_name;
	        	

		        	var signinDivElement = document.getElementById("signinDiv");
					signinDivElement.className = "hidden";

		        	var welcomeDivElement = document.getElementById("welcomeDiv");
					welcomeDivElement.className = "visible";

					self.setScreenName(reply.screen_name);
	        	}
	        	else 
	        	{
	        		alert("Unable to access twitter!");
	        	}

	    	}
		);
	};

	$scope.twitterGetTimeline=function()
	{
		cb.__call(
		    "statuses_homeTimeline",
		    {},
		    function (reply) {
		        console.log(reply);
		    }
		);

	};

	$scope.setTweetData=function(tweetData)
	{
		$scope.tweetData = tweetData;
		$scope.$apply();
	};

	$scope.twitterSearchTwits=function()
	{
		var self = this;
		var searchField = "q=" + $scope.searchField;
		cb.__call(
		    "search_tweets",
		    searchField,
		    function (reply) {
		        self.setTweetData(reply.statuses)
		    },
		    true // this parameter required as this is application level call.
		);
	};
}

  // declare a new module, and inject the $compileProvider
angular.module('compile', [], function($compileProvider) {
  // configure new 'compile' directive by passing a directive
  // factory function. The factory function injects the '$compile'
  $compileProvider.directive('compile', function($compile) {
    // directive factory creates a link function
    return function(scope, element, attrs) {
      scope.$watch(
        function(scope) {
           // watch the 'compile' expression for changes
          return scope.$eval(attrs.compile);
        },
        function(value) {
          // when the 'compile' expression changes
          // assign it into the current DOM
          element.html(value);

          // compile the new DOM and link it to the current
          // scope.
          // NOTE: we only compile .childNodes so that
          // we don't get into infinite loop compiling ourselves
          $compile(element.contents())(scope);
        }
      );
    };
  })
});
