import React from 'react';
import './App.global.css';
import $ from 'jquery';
import twemoji from 'twemoji';
import { Button, FormControl } from 'react-bootstrap';

var charlimit = 500;

function entrypress() {
  var currentchars = $("#entry-text").val().length;
  var charsleft = charlimit - currentchars;
  if (charsleft < 0) {
    $("#charlimit").css("color", "red");
  } else {
    $("#charlimit").css("color", "#333")
  }
  $("#charlimit").html(charsleft);
}

export default class App extends React.Component {
  componentDidMount() {
    const exec = require('child_process').exec;

    function execute(command, callback) {
        exec(command, (error, stdout, stderr) => {
            callback(stdout);
        });
    }

    var thishref = window.location.href;

    function initialize() {
      try {
        $("#instance-logo").attr("src", "https://"+localStorage.getItem("instance")+"/apple-touch-icon.png");
        $.get("https://"+localStorage.getItem("instance")+"/api/v1/instance", (data) => {
          console.log(data);
          try {
            charlimit = data["max_toot_chars"];
            $("#charlimit").html(charlimit);
            var backend = localStorage.getItem("instance");
            var token = localStorage.getItem("token");
            console.log(token);
            $.ajax({
              url: "https://"+backend+"/api/v1/apps/verify_credentials",
              type: "GET",
              dataType: "JSON",
              beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer "+token);
              },
              data: {},
              success: (callback) => {
                $("#user-picture").attr("src", callback["avatar"]);
              },
              error: () => {
                //logout();
              },
            });
          } catch (e) {}
        });
      } catch(e) {}
    }

    // call the function
/*
    if (window.location.href.includes("#")) {
      $("#front").hide();
    } */

    function sendNotify(text) {
      execute('notify-send "'+text+'"', ()=>{});
    }

    try {
      if (localStorage.getItem("instance") !== null) {
        $("#front").hide();
        window.location.href = window.location.href+"#back";
      }
    } catch (e) {}

    function logout() {
      localStorage.clear();
      window.location.href = window.location.href.split("#")[0];
    }

    $("#logout-button").click(() => {
      logout();
    });

    initialize();

    $("#front").html(twemoji.parse($("#front").html()));
    function login(backend, client_id, client_secret, token) {
      localStorage.setItem("instance", backend);
      $.ajax({
        url: "https://"+backend+"/oauth/token",
        type: "GET",
        dataType: "JSON",
/*         beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer "+token);
        }, */
        data: {"client_id": client_id, "client_secret": client_secret, "redirect_uri": "urn:ietf:wg:oauth:2.0:oob", "grant_type": "authorization_code", "code": token, "scope": "read write follow push"},
        success: (callback) => {
          localStorage.setItem("token", callback["access_token"]);
        },
        error: () => {},
      });
      window.location.href = window.location.href+"#back";
      window.setTimeout(() => {
        initialize();
      }, 500);
    }

    $("#token").hide();
    $("#instance-error").hide();
    $("#instance-text").on("keypress", (e) => {
      if (e.key === "Enter") {
        var backend = $("#instance-text").val().toLowerCase();
        $("#instance-error").hide();
        $.get("https://"+backend+"/api/v1/instance", (data) => {
          console.log(data);
          $("#instance").fadeOut(400, () => {
            $("#token").fadeIn();
            $.ajax({
              url: "https://"+backend+"/api/v1/apps",
              type: "POST",
/*               beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer "+token);
              }, */
              data: {"client_name": "Gibby", "redirect_uris": "urn:ietf:wg:oauth:2.0:oob", "scopes": "read write follow push"},
              success: (callback) => {
                var url = "https://"+backend+"/oauth/authorize?client_id="+callback["client_id"]+"&scope=read+write+follow+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code";
                localStorage.setItem("client_id", callback["client_id"]);
                localStorage.setItem("client_secret", callback["client_secret"]);
                console.log(url);
                window.open(url, "_blank");
              },
              error: () => {},
            });
          })
        }).fail(() => {
          window.setTimeout(() => {
            $("#instance-error").show();
          }, 100);
        });
      }
    });
    $("#token-text").on("keypress", (e) => {
      if (e.key === "Enter") {
        var backend = $("#instance-text").val().toLowerCase();
        var token = $("#token-text").val();
        login(backend, localStorage.getItem("client_id"), localStorage.getItem("client_secret"), token);
        e.preventDefault();
      }
    });
    window.setInterval(() => {
      if (window.location.href.includes("#")) {
        $("#front").fadeOut(400, () => {
          $("#back").fadeIn(400);
        });
      } else {
        $("#back").hide();
      }
    });
  }

  render() {
    return (
      <div>
        <div id="front">
          <div id="instance">
            <div className="wave setup-emoji">👋️</div>
            <h1>Hi, I'm Gibby!</h1>
            <p>...an awesome-looking client for the fediverse!</p><br />
            <p>Let's start by which instance you're using:</p>
            <FormControl placeholder="Instance" className="lower" id="instance-text" /><br /><br />
            <p>💡️ Press enter to confirm</p>
            <p id="instance-error">Error: Invalid instance.</p>
          </div>
          <div id="token">
            <div className="setup-emoji">🔒</div><br />
            <p>Now enter your token here:</p>
            <FormControl placeholder="Token" className="lower" id="token-text" /><br /><br />
            <p>💡️ Press enter to confirm</p>
          </div>
        </div>
        <div id="back">
          <i class="fa fa-sign-out" id="logout-button" aria-hidden="true"></i>
          <img id="instance-logo" draggable="false" />
          <div id="entry">
            <img src="file:///home/koyu/Dropbox/private/rlbunnylook_banner-ppic.png" id="user-picture" className="avatar" />
            <textarea placeholder="What are you doing?" onKeyUp={entrypress} rows="3" cols="53" id="entry-text"></textarea><br />
            <div id="post-button">
              <span id="charlimit">500</span> <Button variant="primary" id="post-submit">Post!</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
