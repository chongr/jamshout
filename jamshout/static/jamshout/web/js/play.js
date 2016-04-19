// Temp/test id for jamshout SoundCloud requests
var testID = "990486d928daaeafad3b18c9a4d8d3f7";

SC.initialize({
    client_id: testID
});

$('#content-view').click(function (e) {
	if(e.target.classList[0] != "playWhenClicked") return;
	play(e.target.attributes['link'].nodeValue);
})

function play(link) {
	// Get sound object from raw link
	SC.get("http://api.soundcloud.com/resolve.json?url=" + link + "&client_id=" + testID, {},
		function(sound){
			// On success/callback, build stream link
			var suffix = "/stream?client_id=" + testID;
			var stream = sound.uri + suffix;

			// Play song
	    	$("#player").attr("src", stream);
	    	var song = $("#player");
	    	song.get(0).play();
	    }
	);
}

