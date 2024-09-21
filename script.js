window.onload = function () {
  const batteryCanvas = document.getElementById('batteryCanvas');
  const ctx = batteryCanvas.getContext('2d');
  let batteryHistory = [];

  if ('getBattery' in navigator) {
    navigator.getBattery().then(function (battery) {
      updateBatteryStatus(battery);
      drawBatteryCanvas(battery.level * 100, battery.charging);

      // Update on charging/discharging
      battery.addEventListener('chargingchange', function () {
        recordHistory(battery);
        updateBatteryStatus(battery);
        drawBatteryCanvas(battery.level * 100, battery.charging);
      });

      battery.addEventListener('levelchange', function () {
        recordHistory(battery);
        updateBatteryStatus(battery);
        drawBatteryCanvas(battery.level * 100, battery.charging);
      });
    });
  } else {
    document.getElementById('battery-status').textContent = "Battery API not supported.";
  }

  // Detect platform (Mobile or Desktop)
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const platform = isMobile ? 'Phone' : 'Laptop';
  document.getElementById('battery-status').textContent += ` (Platform: ${platform})`;

  // Update Battery Status
  function updateBatteryStatus(battery) {
    const batteryLevel = Math.floor(battery.level * 100) + '%';
    document.getElementById('battery-level').style.width = batteryLevel;

    const statusText = battery.charging ? 'Charging' : 'Discharging';
    document.getElementById('battery-status').textContent = `${statusText} - ${batteryLevel}`;
  }

  // Draw the Battery Canvas
  function drawBatteryCanvas(level, charging) {
    ctx.clearRect(0, 0, batteryCanvas.width, batteryCanvas.height);

    ctx.fillStyle = charging ? '#4caf50' : '#f44336'; // Green if charging, Red if discharging
    ctx.fillRect(0, 0, (batteryCanvas.width * level) / 100, batteryCanvas.height);
  }

  // Record Battery History
  function recordHistory(battery) {
    const date = new Date();
    const historyEntry = {
      time: date.toLocaleTimeString(),
      level: Math.floor(battery.level * 100) + '%',
      charging: battery.charging ? 'Charging' : 'Discharging',
      seconds: date.getSeconds()
    };
    
    batteryHistory.push(historyEntry);

    // Update history in the UI
    const historyList = document.getElementById('history-list');
    const listItem = document.createElement('li');
    listItem.textContent = `${historyEntry.time} - ${historyEntry.charging} (${historyEntry.level}) - ${historyEntry.seconds}s`;
    historyList.appendChild(listItem);
  }
};
