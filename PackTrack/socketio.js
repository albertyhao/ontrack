var socket = io.connect('http://localhost:8080/');

chrome.browserAction.onClicked.addListener(function(tab) {
    socket.send('hi');
});