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

import { lerp } from "./math";
import "./index.css";

const speedBar = document.getElementById("speed-bar");
const speedDial = document.getElementById("speed-dial");
const speedNum = document.getElementById("speed-num");
const rpmBar = document.getElementById("rpm-bar");
const rpmDial = document.getElementById("rpm-dial");
const rpmNum = document.getElementById("rpm-num");
// need to update CSS too if you change this
const update_interval = 500;

// Used to perform animations such as lerping the dial number
function animate() {

  const rpmText = window.getComputedStyle(rpmBar).getPropertyValue("transform");
  if (rpmText == "none") {
    rpmNum.innerText = "0"
  } else {
    rpmNum.innerText = rpmText.split(/[(.,]/)[1];
  }

  const speedText = window.getComputedStyle(speedBar).getPropertyValue("transform");
  if (speedText == "none") {
    speedNum.innerText = "0"
  } else {
    speedNum.innerText = speedText.split(/[(.,]/)[1];
  }

  window.requestAnimationFrame(animate);
}

// Fuck it, kick start the animation function right from the start ¯\_(ツ)_/¯
window.requestAnimationFrame(animate);

async function getTelemetry(isDescriptive: boolean) {
  // Comment and uncomment here to run the test server or real server
  const mainDomain = "https://live.racerender.com";
  // const mainDomain = "http://localhost:3456";
  const response = await fetch(
    `${mainDomain}/ViewData.php?ID=194936516&MapLap=9999999&ListLap=999999&GetDescInfo=${
      isDescriptive ? 1 : 0
    }`
  );

  const responseText = await response.text();

  // Hack to make this JSON compat
  const parsedData = JSON.parse(
    responseText.replace(`0xFF2020`, '"0xFF2020"')
  );

  // exit early if offline
  if (parsedData["Status"] == "User Offline") {
    console.log("Offline - no data");
    return;
  }
  // or no OBD data (which we actually need)
  if (parsedData["Ext"].length == 0) {
    return;
  }

  const rpm = parseFloat(parsedData["Ext"][0].Value); /*  * 1.60934 */
  const rpmAngle = `${rpm * 0.03 - 30}deg`;

  rpmDial.style.setProperty("--dial-angle", rpmAngle);
  rpmBar.style.setProperty("--dial-bar", `${rpm}`);

  // speed depends on uploader-side setting, for our case is already kph
  const speed = parseFloat(parsedData["Ext"][1].Value); /*  * 1.60934 */
  const speedAngle = `${speed * 1.286 - 25.71}deg`;

  speedDial.style.setProperty("--dial-angle", speedAngle);
  speedBar.style.setProperty("--dial-bar", `${speed}`);
}

function startTelemetry() {
  document.getElementById("telemetry-status").innerHTML = "Telemetry started";

  // Perform the initial ping
  getTelemetry(true);

  // Ping the telemetry server every 0.5 seconds
  setInterval(() => getTelemetry(false), update_interval);
}

document.getElementById("start-telemetry").onclick = startTelemetry;
