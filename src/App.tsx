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

    function initialize() {
      try {
        $("#instance-logo").attr("src", "https://"+localStorage.getItem("instance")+"/apple-touch-icon.png");
        $.get("https://"+localStorage.getItem("instance")+"/api/v1/instance", (data) => {
          console.log(data);
          try {
            charlimit = data["max_toot_chars"];
            $("#charlimit").html(charlimit);
          } catch (e) {}
        });
      } catch(e) {}
    }

    // call the function
/*     execute('notify-send "Test notification"', ()=>{});
    if (window.location.href.includes("#")) {
      $("#front").hide();
    } */
    try {
      if (localStorage.getItem("instance") !== null) {
        $("#front").hide();
        window.location.href = window.location.href+"#back";
      }
    } catch (e) {}

    $("#logout-button").click(() => {
      localStorage.clear();
      window.location.href = window.location.href.split("#")[0];
    });

    initialize();
    $("#front").html(twemoji.parse($("#front").html()));
    $("#instance").on("keypress", (e) => {
      if (e.key === "Enter") {
        localStorage.setItem("instance", $("#instance-text").val());
        window.location.href = window.location.href+"#back";
        initialize();
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
          <div className="wave">👋️</div>
          <h1>Hi, I'm Gibby!</h1>
          <p>...an awesome-looking client for the fediverse!</p><br />
          <div id="instance">
            <p>Let's start by which instance you're using:</p>
            <FormControl placeholder="Instance" id="instance-text" /><br /><br />
            <p>💡️ Press enter to confirm</p>
          </div>
        </div>
        <div id="back">
          <i class="fa fa-sign-out" id="logout-button" aria-hidden="true"></i>
          <img id="instance-logo" draggable="false" />
          <div id="entry">
            <img src="file:///home/koyu/Dropbox/private/rlbunnylook_banner-ppic.png" className="avatar" />
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
