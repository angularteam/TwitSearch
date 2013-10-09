/*
Twitter authentication
*/
angular.module('Twitter',['ngResource'])

function TwitterAuthenticateCtrl($scope, $resource) {
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
