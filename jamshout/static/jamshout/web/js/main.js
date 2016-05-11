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

// Set csrftoken for ajax request
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
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

    //userMenu
    $("#userMenu").click(function(){
      if (localStorage.getItem("loggedUser") != "null") {
        $('#loggedInModal').modal('toggle');
      }
      else {
        $('#userModal').modal('toggle');
      }
    });

    //genreButtons
    $(".genre-button").click(function(){
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

    $('#login').click(function (e){
      email = $('#email').val();
      password = $('#password').val();
      login(email, password);
    });

    $('#logout').click(function (e){
      logout();
    });
}

function switchUserModal() {
    $("#userModal").modal("toggle");
    $("#loggedInModal").modal("toggle");
}

function logout() {
  $.ajax({
    url: '/rest-auth/logout/',
    type: 'POST',
    dataType: "json",
    data: {csrfmiddlewaretoken: csrftoken, token: localStorage.getItem('loggedUser')['key']},
    success: function(data){
         localStorage.setItem('loggedUser', null);
         csrftoken = getCookie('csrftoken');
         switchUserModal();
    },
    error: function(data){
      console.log(data);
    }
  });
}

function login(email, password) {
  $.ajax({
    url: '/rest-auth/login/',
    type: 'POST',
    dataType: "json",
    data: {csrfmiddlewaretoken: csrftoken, email: email, password: password, username: email.split('@')[0]},
    success: function(data){
	       localStorage.setItem('loggedUser', JSON.stringify(data))
         csrftoken = getCookie('csrftoken');
         switchUserModal();
    },
    error: function(data){
      console.log(data);
    }
  });
}

function refresh() {
    filterType = localStorage.getItem("filterType");
    sortType = localStorage.getItem("sortType");
    $.ajax({
        url: '/songs/all_songs/',
        type:"GET",
        dataType:"json",
        error: function(data){
            $("#noInternetModal").modal("show");
        },
        success: function(data){
            displayJams(data);
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

        vote = localStorage.getItem("vote:" + jams[jam].id);
        if(vote === "upvoted")
            upvoted = "upvoted";
        else if (vote === "downvoted")
            downvoted = "downvoted";
        else
            localStorage.removeItem("vote:" + jams[jam].id);


        //jamTab header
        var html = "<div class='playOnClick jamTab' link=\"" + jams[jam].link + "\"" + ">";
        //song
        html += "<span class='playOnClick'><h4 class='playOnClick'>" + jams[jam].song_name + "</h4>";
        //artist
        html += "<h5 class='playOnClick'>" + jams[jam].artist + "</h5></span>";
        //votingWrapper header
        html += "<div class='votingWrapper'>";
        //upvote
        html += "<button type='button' class='glyphicon glyphicon-menu-up voteButton upV " + upvoted + "' id='upvote" + jams[jam].id + "'";
        html += "onclick='upVote(\"" + jams[jam].id + "\", \"" + jams[jam].vote_count + "\");'></button>";
        //voteTotal
        html += "<h5 class='voteTotal' id='voteTotal" + jams[jam].id + "'>" + jams[jam].vote_count + "</h5>";
        //downvote
        html += "<button type='button' class='glyphicon glyphicon-menu-down voteButton " + downvoted + "' id='downvote" + jams[jam].id + "'";
        html += "onclick='downVote(\"" + jams[jam].id + "\", \"" + jams[jam].vote_count + "\");'></button></div><hr/></div>";

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
