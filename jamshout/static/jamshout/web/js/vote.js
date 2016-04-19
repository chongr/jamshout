function saveVote(objectId, newTotal) {

	var data = JSON.stringify({objectId: String(objectId), votes: newTotal});
	$.ajax({
		url: url + '/' + String(objectId),
		type:"PUT",
		data: data,
		contentType:"application/json",
		dataType:"json",
		headers: {'X-Parse-Application-Id': appId, 'X-Parse-REST-API-Key': restKey}
	})
}

function removeJam(objectId) {
	console.log(objectId);
	$.ajax({
		url: url + String(objectId),
		type:"DELETE",
		headers: {'X-Parse-Application-Id': appId, 'X-Parse-REST-API-Key': restKey}
	})
}

function upVote(objectId, voteTotal) {
	var total;

	//for loading previous likes on refresh()
	var vote = localStorage.getItem("vote:" + String(objectId));
	if(vote === "upvoted")
		localStorage.setItem("vote:" + String(objectId), "none");
	else if (vote === "downvoted" || vote === null)
		localStorage.setItem("vote:" + String(objectId), "upvoted");

	// if song already upvoted (aka -1 net effect)
	if ($("#upvote" + objectId).css('color') == 'rgb(103, 78, 167)') {

		$("#upvote" + objectId).css('color', '#BFB5DA');
		total = parseInt($("#voteTotal" + objectId).text()) - 1;

	// if song already downvoted (aka +2 net effect)
	} else if ($("#downvote" + objectId).css('color') == 'rgb(255, 0, 0)') {

		$("#downvote" + objectId).css('color', '#BFB5DA');
		$("#upvote" + objectId).css('color', '#674EA7');
		total = parseInt($("#voteTotal" + objectId).text()) + 2;

	// if first-time upvote (aka +1)
	} else {

		$("#upvote" + objectId).css('color', '#674EA7');
		total = parseInt($("#voteTotal" + objectId).text()) + 1;
	}

	// update voteTotal display
	$("#voteTotal" + objectId).text(total);

	// register vote in backend
	saveVote(objectId, total);
}


function downVote(objectId, voteTotal) {
	var total;

	//for loading previous likes on refresh()
	var vote = localStorage.getItem("vote:" + String(objectId));
	if(vote === "downvoted")
		localStorage.setItem("vote:" + String(objectId), "none");
	else if (vote === "upvoted" || vote === null)
		localStorage.setItem("vote:" + String(objectId), "downvoted");

	// if song already downvoted (aka +1 net effect)
	if ($("#downvote" + objectId).css('color') == 'rgb(255, 0, 0)') {
		
		$("#downvote" + objectId).css('color', '#BFB5DA');
		total = parseInt($("#voteTotal" + objectId).text()) + 1;

	// if song already upvoted (aka -2)
	} else if ($("#upvote" + objectId).css('color') == 'rgb(103, 78, 167)') {

		$("#upvote" + objectId).css('color', '#BFB5DA');
		$("#downvote" + objectId).css('color', 'red');
		total = parseInt($("#voteTotal" + objectId).text()) - 2;	

	// if first-time downvote (aka -1)
	} else {

		$("#downvote" + objectId).css('color', 'red');
		total  = parseInt($("#voteTotal" + objectId).text()) - 1;
	}

	// update voteTotal display
	$("#voteTotal" + objectId).text(total);

	//remove jam if needed
	if(total == -3)
		removeJam(objectId);
	else
		saveVote(objectId, total);
}