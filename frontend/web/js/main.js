$(document).ready(function() {
    //get sortType
    sortType = localStorage.getItem("sortType");
    if(sortType === null){
        localStorage.setItem("sortType", "newest");
        sortType = "newest";
    }

    //get filterType
    filterType = localStorage.getItem("filterType");
    if(filterType === null){
        localStorage.setItem("filterType", "All");
        filterType = "all";
    }

    //initialize
    bindHandlers();
    refresh();
});

function bindHandlers(){
    //shout
    $("#shoutIcon, #shoutBackIcon").click(function(){
        $("nav").toggle();
        $("#shoutPopup").toggle();
    });

    //jamJar
    $("#jarIcon, #jarBackIcon").click(function(){
        $("nav").toggle();
        $("#jarPopup").toggle();
    });

    //set newHot button according to preference
    sortType = localStorage.getItem("sortType");
    if(sortType === "hottest")
        $("#newHot").removeClass("glyphicon-hourglass").addClass("glyphicon-fire");
    else
        $("#newHot").removeClass("glyphicon-fire").addClass("glyphicon-hourglass");

    //newHot
    $("#newHot").click(function(){
        $("#newHot").toggleClass("glyphicon-fire").toggleClass("glyphicon-hourglass");
        sortType = localStorage.getItem("sortType");

        if(sortType === "newest")
            localStorage.setItem("sortType", "hottest");
        else
            localStorage.setItem("sortType", "newest");

        sortType = localStorage.getItem("sortType");
        refresh();
    });

    //genreMenu
    $("#genreMenu").click(function(){
        $('#genreModal').modal('toggle');
    });

    //genreButtons
    $(".gB").click(function(){
        localStorage.setItem("filterType", $(this).text());
        $("#genreModal").modal('toggle');
        refresh();
    });

    //noInternet refresh
    $('#noInternetModal').on('hidden.bs.modal', function (e) {
        refresh(); 
    });
    $("#refresh").click(function(){
        $("#noInternetModal").modal("hide");
    });

    //play song onClick
    $('#content-view').click(function (e) {
        if(e.target.classList[0] === "playOnClick") 
            play(e.target.attributes['link'].nodeValue);
    });
}

function refresh() {
    filterType = localStorage.getItem("filterType");
    sortType = localStorage.getItem("sortType");

    $.ajax({
        url: url,
        type:"GET",
        dataType:"json",
        headers: {'X-Parse-Application-Id': appId, 'X-Parse-REST-API-Key': restKey},
        error: function(data){
            $("#noInternetModal").modal("show");
        },
        success: function(data){
            displayJams(data.results);
        }
    }); 
}

function displayJams(jams) {

    //prepare content-view & jams
    $("#content-view").empty();
    jams = filterJams(jams);
    sortJams(jams);

    //write jams to content-view
    for(var jam in jams) {

        var vote, upvoted = "", downvoted = ""; 

        vote = localStorage.getItem("vote:" + jams[jam].objectId);
        if(vote === "upvoted")
            upvoted = "upvoted";
        else if (vote === "downvoted")
            downvoted = "downvoted";
        else
            localStorage.removeItem("vote:" + jams[jam].objectId);


        //jamTab header
        var html = "<div class='playOnClick jamTab' link=\"" + jams[jam].link + "\"" + ">";
        //song
        html += "<span class='playOnClick'><h4 class='playOnClick'>" + jams[jam].song + "</h4>";
        //artist
        html += "<h5 class='playOnClick'>" + jams[jam].artist + "</h5></span>";
        //votingWrapper header  
        html += "<div class='votingWrapper'>";
        //upvote
        html += "<button type='button' class='glyphicon glyphicon-menu-up voteButton upV " + upvoted + "' id='upvote" + jams[jam].objectId + "'";
        html += "onclick='upVote(\"" + jams[jam].objectId + "\", \"" + jams[jam].votes + "\");'></button>";
        //voteTotal
        html += "<h5 class='voteTotal' id='voteTotal" + jams[jam].objectId + "'>" + jams[jam].votes + "</h5>";
        //downvote
        html += "<button type='button' class='glyphicon glyphicon-menu-down voteButton " + downvoted + "' id='downvote" + jams[jam].objectId + "'";
        html += "onclick='downVote(\"" + jams[jam].objectId + "\", \"" + jams[jam].votes + "\");'></button></div><hr/></div>";

        $("#content-view").append(html);
    }
}

// Sort & Filtering functions

function sortNewest(a,b) {
    return a.createdAt < b.createdAt;
}

function sortHottest(a,b) {
    return a.votes < b.votes;
}

function sortJams(jams) {
    if(sortType === "newest")
        jams.sort(sortNewest);
    else
        jams.sort(sortHottest);
}

function filterByGenre(jam) {
    return ( jam.genre.toUpperCase() == filterType.toUpperCase());
}

function filterJams(jams) {
    if (filterType === "All")
        return jams;
    else 
        return jams.filter(filterByGenre);
}