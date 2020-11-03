'use strict';

function createIcon(hours) {
  function createCanvas(iconsize) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', iconsize);
    canvas.setAttribute('height', iconsize);
    var context = canvas.getContext('2d');
    context.font = 'bold ' + (iconsize * 0.7) + 'px \'Meirio\', \'Ubuntu\', \'Lucida Grande\',';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(hours, iconsize/2, iconsize/3);
    return context.getImageData(0, 0, iconsize, iconsize);
  }
  return {16: createCanvas(16), 48: createCanvas(48)};
}

function update() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diffTime = now - start;
  var oneDay = 1000 * 60 * 60 * 24;

  // 背景色の設定
  chrome.browserAction.setBadgeBackgroundColor({color: '#222'});

  // 残り％が選択されている時
  chrome.storage.sync.get('isPercents', function(settings) {
    if(settings.isPercents) {
      var diff = Math.floor((365.0 - diffTime / oneDay) * 100.0 / 365.0);
      var timeUnit = "%";
      chrome.browserAction.setBadgeText({text: "残り" + String(timeUnit)});
      chrome.browserAction.setIcon({imageData: createIcon(diff)});
    }
  });

  // 残り日数が選択されている時
  chrome.storage.sync.get('isDays', function(settings) {
    if(settings.isDays) {
      var diff = Math.floor((366.0 - diffTime / oneDay));
      var timeUnit = "日";
      chrome.browserAction.setBadgeText({text: "残り" + String(timeUnit)});
      chrome.browserAction.setIcon({imageData: createIcon(diff)});
    }
  });
}

chrome.runtime.onInstalled.addListener(function() {
  update();
  chrome.alarms.create({
    periodInMinutes: 1 //何分ごとに更新を行うか
  });
});

chrome.alarms.onAlarm.addListener(update);
chrome.browserAction.onClicked.addListener(update);
chrome.runtime.onStartup.addListener(update);
chrome.storage.onChanged.addListener(update);