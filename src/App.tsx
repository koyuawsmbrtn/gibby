import React from 'react';
import './App.global.css';
import $ from 'jquery';
import twemoji from 'twemoji';
import { Button, FormControl } from 'react-bootstrap';

export default class App extends React.Component {
  componentDidMount() {
    const exec = require('child_process').exec;

    function execute(command, callback) {
        exec(command, (error, stdout, stderr) => { 
            callback(stdout); 
        });
    };
    
    // call the function
/*     execute('notify-send "Test notification"', ()=>{});    
    if (window.location.href.includes("#")) {
      $("#front").hide();
    } */
    $("#front").html(twemoji.parse($("#front").html()));
    $("#instance").on("keypress", (e) => {
      if (e.key === "Enter") {
        window.location.href = window.location.href+"#back";
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
          <h1>Default UI</h1>
        </div>
      </div>
    );
  }
}
