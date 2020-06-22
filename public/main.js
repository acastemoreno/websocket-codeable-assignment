'use strict';

const ws = new WebSocket(`ws://localhost:3000`);

const name = prompt('Whats your name?');

const log = document.getElementById("log");

ws.onmessage = (event) => {
  let payload = JSON.parse(event.data);
  if (payload.new_user === undefined) {
    log.innerHTML += generateDate() + ` [${payload.username}] ` + payload.text + "<br>";
  } else {
    notifyMe(payload.new_user);
  }
};

ws.onopen = function(e) {
  ws.send(JSON.stringify({new_user: name }));
};

ws.onerror = (error) => {
  console.log("Server error message: ", error.message);
};

const generateDate = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  });
};

document.querySelector("button").onclick = () => {
  let text = document.getElementById("text").value;
  ws.send(JSON.stringify({text: text, username: name }));
  log.innerHTML += generateDate() + " You: " + text + "<br>";
};


function notifyMe(text) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(text);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(text);
      }
    });
  }

}


