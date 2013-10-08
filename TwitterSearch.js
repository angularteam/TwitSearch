angular.module('Twitter',['ngResource'])

// This class is incharge of making the rest call and such
function TwitterCtrl($scope, $resource)
{
	$scope.twitter = $resource('https://api.twitter.com/1.1/search/tweets.json',
		{q: 'microsoft', count: 20},
		{get: {method: 'JSONP'}});

	// Set oauth header here

	$scope.twitter.get();
}

// This is in charge of setting up the sample data in the project
function SampleCtrl($scope)
{
	$scope.sampleData = [
		{text:'learn angular in a way everyone thinks you are awesome', img:'http://a0.twimg.com/profile_images/1463796856/Triuvare_Avatar_normal.jpg'},
		{text:'build an angular app', img:'https://si0.twimg.com/profile_images/2928116129/bc82df528404fcecaf87d4f52b77b6cc_normal.jpeg'}];

}