/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

const speedDial = document.getElementById("speed-dial");
const speedNum = document.getElementById("speed-num");
const rpmDial = document.getElementById("rpm-dial");
const rpmNum = document.getElementById("rpm-num");


async function getTelemetry(isDescriptive: boolean) {
  // Comment and uncomment here to run the test server or real server
  // const mainDomain = "https://live.racerender.com";
  const mainDomain = "http://localhost:3456";
  const response = await fetch(
    `${mainDomain}/ViewData.php?ID=194936516&MapLap=9999993&ListLap=999999&GetDescInfo=${
      isDescriptive ? 1 : 0
    }`
  );

  const responseText = await response.text();

  // Hack to make this JSON compat
  const parsedData = JSON.parse(
    responseText.replace(`"Color": 0xFF2020`, '"Color": "0xFF2020"')
  );

  const rpm = parseFloat(parsedData["Ext"][0].Value)/*  * 1.60934 */;
  const rpmAngle = `${rpm*0.03-30}deg`;

  rpmDial.style.setProperty("--dial-angle", rpmAngle);
  rpmNum.innerText = rpm.toFixed(0).toString();

  // speed depends on uploader-side setting, for our case is already kph
  const speed = parseFloat(parsedData["Ext"][1].Value)/*  * 1.60934 */;
  const speedAngle = `${speed*1.286-25.71}deg`;

  speedDial.style.setProperty("--dial-angle", speedAngle);
  speedNum.innerText = speed.toFixed(0).toString();
}

function startTelemetry() {
  document.getElementById("telemetry-status").innerHTML = "Telemetry started";

  // Perform the initial ping
  getTelemetry(true);

  // Ping the telemetry server every 0.5 seconds
  setInterval(() => getTelemetry(false), 500);
}

document.getElementById("start-telemetry").onclick = startTelemetry;
