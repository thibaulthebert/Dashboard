// Take an Id in parameter and send request to database to
// delete the document with this Id
function deletewidget(id) {
    idDelete = {
        id: id
    }
    $.ajax({                                            // Jquery request
        url: "http://localhost:8080/deleteWidget",
        data: idDelete,
        type: "POST",
        dataType: "json",
        sucess: function() {
            return;
        }
    })
    refresh();
};

// This function update the content of GridStack.
// Make an Ajax GET request to get all url's widget and compare widgetName.
// Call API with the good URL and add with a gridstack item with the JSON content
function refresh() {
    var grids = $('.grid-stack').data('gridstack');
    if (grids != null) {
        grids.removeAll();
    }
    $.ajax({
        url: "http://localhost:8080/refreshWidget",
        type: "GET",
        dataType: "json",
        success: function(widgetList) {
            $.each(widgetList, function (i, member) {
                if (member.widgetName == "weather") {
                    $.ajax({
                        type: "GET",
                        url: member.url,
                        dataType: "json",
                        success: function(data) {
                            html = '<div class="grid-stack-item-content panel panel-primary">';
                            html += '<div class="panel-heading">';
                            html += '<h3 style="display:inline;" class="panel-title">Weather</h3>';
                            html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                            html += '</div>';
                            html += '<div class="panel-body">';
                            html += '<p>The temperature at ' + data.name + ' is ' + data.main.temp + ' degrees.</p>';
                            html += '</div>';
                            html += '</div>';
                            var el = $.parseHTML("<div class=\"grid-stack-item-content\">" + html + "</div>");
                            var grids = $('.grid-stack').data('gridstack');
                            grids.addWidget(el, 1, 1, 3, 2, true);
                        },
                        error: function() {console.log("sisi")}
                    });
                } else if (member.widgetName == "steam") {
                    $.ajax({
                        type: "GET",
                        url: member.url,
                        dataType: "json",
                        success: function(data) {
                            html = '<div class="grid-stack-item-content panel panel-primary">';
                            html += '<div class="panel-heading">';
                            html += '<h3 style="display:inline;" class="panel-title">Steam</h3>';
                            html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                            html += '</div>';
                            html += '<div class="panel-body">';
                            html += '<p>Time played on ' + data.response.games[0].name + ' : ' + (data.response.games[0].playtime_forever / 60).toFixed() + ' hours and ' + data.response.games[0].playtime_forever % 60 + ' minutes.</p>';
                            html += '</div>';
                            html += '</div>';
                            var el = $.parseHTML("<div class=\"grid-stack-item-content\"> " + html + "</div>");
                            var grids = $('.grid-stack').data('gridstack');
                            grids.addWidget(el, 1, 1, 3, 2, true);
                        }
                    });
                } else if (member.widgetName == "climat") {
                    $.ajax({
                        type: "GET",
                        url: member.url,
                        dataType: "json",
                        success: function(data) {
                            html = '<div class="grid-stack-item-content panel panel-primary">';
                            html += '<div class="panel-heading">';
                            html += '<h3 style="display:inline;" class="panel-title">Climate</h3>';
                            html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                            html += '</div>';
                            html += '<div class="panel-body">';
                            html += '<p>Climate in ' + data.name + ': ' + data.weather[0].description + '</p>';
                            html += "<p>Wind: " + data.wind.speed + "km/h</p>";
                            html += '</div>';
                            html += '</div>';
                            var el = $.parseHTML("<div class=\"grid-stack-item-content\">" + html + "</div>");
                            var grids = $('.grid-stack').data('gridstack');
                            grids.addWidget(el, 1, 1, 3, 2, true);
                        },
                        error: function(data){
                            console.log("Can't get url climat widget")
                        }
                    })
                } else if (member.widgetName == "clashRoyale") {
                    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": member.url,
                        "method": "GET",
                        "headers": {
                          "auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTg4MCwiaWRlbiI6IjI2Mzc4ODM1Mzk5MDgxOTg0MCIsIm1kIjp7fSwidHMiOjE1NDAwNDMwNDMxMzF9.yCkRozA0XZXNw3ZXceP8BzGOrLT-hcGcb2IrmRNUQ64"
                        }
                    }
                    $.ajax(settings).done(function (data) {
                        html = '<div class="grid-stack-item-content panel panel-primary">';
                        html += '<div class="panel-heading">';
                        html += '<h3 style="display:inline;" class="panel-title">Clash Royale: ' + member.url.split('/')[4] + ' </h3>';
                        html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                        html += '</div>';
                        html += '<div class="panel-body">';
                        html += '<p>Your next chest will be a ' + data.upcoming[0] + " chest</p>";
                        html += "<p></p>";
                        html += '</div>';
                        html += '</div>';
                        var el = $.parseHTML("<div class=\"grid-stack-item-content\">" + html + "</div>");
                        var grids = $('.grid-stack').data('gridstack');
                        grids.addWidget(el, 1, 1, 3, 2, true);
                    });
                } else if (member.widgetName == "twitch") {
                    $.ajax({
                        type: "GET",
                        url: member.url,
                        dataType: "json",
                        headers: {
                            'Client-ID': '5mt4b2xhw06al570zsjhdol1tbvoez'
                        },
                        success: function(data) {
                            html = '<div class="grid-stack-item-content panel panel-primary">';
                            html += '<div class="panel-heading">';
                            html += '<h3 style="display:inline;" class="panel-title">Twitch</h3>';
                            html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                            html += '</div>';
                            html += '<div class="panel-body">';
                            html += '<p>' + member.url.split('/')[5] + "'s channel has " + data._total + ' followers.</p>';
                            html += '</div>';
                            html += '</div>';
                            var el = $.parseHTML("<div class=\"grid-stack-item-content\">" + html + "</div>");
                            var grids = $('.grid-stack').data('gridstack');
                            grids.addWidget(el, 1, 1, 3, 2, true);
                        },
                        error: function(data){
                            console.log("Can't get url climat widget")
                        }
                    })
                } else if (member.widgetName == "article") {
                    $.ajax({
                        type: "GET",
                        url: member.url,
                        dataType: "json",
                        success: function(data) {
                            html = '<div class="grid-stack-item-content panel panel-primary">';
                            html += '<div class="panel-heading">';
                            html += '<h3 style="display:inline;" class="panel-title">Article about ' + member.url.split('everything?q=')[1].split('&')[0] + '</h3>';
                            html += '<span style="float:right" onclick="deletewidget(this.id)" id="' + member._id + '">&times;</span>'
                            html += '</div>';
                            html += '<div class="panel-body">';
                            html += '<p>Article from ' + data.articles[0].author + ' about : "' + data.articles[0].description + '"</p>';
                            html += '<a href="' + data.articles[0].url + '">See the article</a>'
                            html += '</div>';
                            html += '</div>';
                            var el = $.parseHTML("<div class=\"grid-stack-item-content\">" + html + "</div>");
                            var grids = $('.grid-stack').data('gridstack');
                            grids.addWidget(el, 1, 1, 5, 2, true);
                        },
                        error: function(data){
                            console.log("Error request article API")
                        }
                    })
                };
            });
        }
    });
};

// Get the event of adding widget button.
// All of this funtion take the user input in variable and create an URL with it.
// The URL in sent in database.
$(document).ready(function() {
    $("#weatherBtn").click(function() {
        var cityName = $("#cityName").val();
        if (cityName != '') {
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=1182516fef4e7a80364989938ae3ed4d",
                type: "GET",
                datatype: "json",
                success: function() {
                    url = {
                        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=1182516fef4e7a80364989938ae3ed4d",
                    }
                    $.ajax({
                        url: "http://localhost:8080/addWeatherWidget",
                        type: "POST",
                        data: url,
                        dataType: "json",
                        success: function() {},
                        error: function() {
                            console.log("Invalid request weather");
                        }
                    });
                    refresh();
                    },
                error: function() {
                    alert("Enter a valid city name");
                }
            }
            )} else {
                alert("Enter city name");
        }
    });

    // When user click on the button, call this function
    // Make a request to server and with the new urls
    $("#articleBtn").click(function() {
        var keyWord = $("#keyWord").val();
        if (keyWord != '') {
            url = {
                url: "https://newsapi.org/v2/everything?q=" + keyWord + "&apiKey=22fb77f109e34addb98b627d64d31deb"
            }
            $.ajax({
                url: "http://localhost:8080/addArticleWidget",
                type: "POST",
                data: url,
                dataType: "json",
                success: function() {
                    return;
                },
                error: function() {
                    console.log("Invalid request weather");
                }
            });
            refresh();
        } else {
            alert("Enter a keyword");
        }
        refresh();
    });

    $("#cRBtn").click(function() {
        var playerId = $("#playerId").val();

        if (playerId != '') {
            var url = {
                url: "https://api.royaleapi.com/player/" + playerId + "/chests",
            };
            $.ajax({
                url: "http://localhost:8080/addCRWidget",
                type: "POST",
                data: url,
                dataType: "json",
                success: function() {
                    return;
                }
            });
        } else {
            alert("Enter a player ID");
        };
        refresh();
    });

    $("#climatBtn").click(function() {
        var cityName = $("#cityNameClimat").val();
        if (cityName != '') {
            url = {
                url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=1182516fef4e7a80364989938ae3ed4d",
            };
            $.ajax({
                url: "http://localhost:8080/addClimatWidget",
                type: "POST",
                data: url,
                dataType: "json",
                success: function() {
                    return;
                }, error: function() {
                    console.log("Invalid request weather");
                }
            });
        } else {
            alert("Enter city name");
        };
        refresh();
    });

    $("#steamBtn").click(function() {
        gameNameVal = $("#gameName").val();
        if (gameNameVal != '') {
            $.ajax({
                url: "http://localhost:8080/getSteamId",
                type: "GET",
                dataType: "json",
                success: function(steamId) {
                    $.ajax({
                        url: "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=BEE06F70C9F445C4A245111CAE8BCEEB&steamid=" + steamId.id + "&include_appinfo=1&format=json",
                        type: "GET",
                        dataType: "json",
                        success: function(res) {
                            for (elem in res.response.games) {
                                if (gameNameVal === res.response.games[elem].name) {
                                    urlCall =  {
                                        url: "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=BEE06F70C9F445C4A245111CAE8BCEEB&steamid=" + steamId.id + "&include_appinfo=1&format=json&appids_filter[0]=" + res.response.games[elem].appid
                                    }
                                    $.ajax({
                                        url: "http://localhost:8080/addSteamWidget",
                                        type: "POST",
                                        dataType: "json",
                                        data: urlCall,
                                        success: function() {
                                            return;
                                        }
                                    });
                                };
                            };
                        },
                        error: function() {
                            alert("Invalid game name")
                        }
                    });
                }
            });
        } else {
            console.log("Error with database");
        }
        refresh();
    });

    $("#twitchBtn").click(function() {
        var channelName = $("#twitchChannelName").val();
        $.ajax({
            url: "http://localhost:8080/getTwitchName",
            type: "GET",
            dataType: "json",
            success: function(res) {
                $.ajax({
                    url: "https://api.twitch.tv/kraken/users/" + res.twitchName + "/follows/channels",
                    type: "GET",
                    dataType: "json",
                    headers: {
                        'Client-ID': '5mt4b2xhw06al570zsjhdol1tbvoez'
                    },
                    success: function(res) {
                        for (elem in res.follows) {
                            if (res.follows[elem].channel.display_name === channelName || res.follows[elem].channel.name === channelName) {
                                urlCall = {
                                    url: "https://api.twitch.tv/kraken/channels/" + res.follows[elem].channel.name + "/follows"
                                }
                                $.ajax({
                                    url: "http://localhost:8080/addTwitchWidget",
                                    type: "POST",
                                    dataType: "json",
                                    data: urlCall,
                                    success: function(res) {
                                        console.log(res);
                                    }
                                })
                            }
                        }
                    },
                    error: function() {
                        alert("Invalid name")
                    }
                });
            },
        });
        refresh();
    });

    // Always call the refresh function when the user refresh the web page.
    refresh();

    // Make a request to server to delete all the widget of a user.
    $("#removeAllWidget").click(function() {
        var grids = $('.grid-stack').data('gridstack');
        $.ajax({
            url: "http://localhost:8080/removeAllWidget",
            type: "POST",
            dataType: "json",
            success: function() {
                return;
            },
        });
        grids.removeAll();
        refresh();
    });
});