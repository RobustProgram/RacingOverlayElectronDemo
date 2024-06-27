import express from "express";

const mockServer = express();

const mockData = {
  engineSpeed: 0, // RPM
  vehicleSpeed: 0, // MPH
  throttlePosition: 17.647058486938, // Percent
  engineCoolantTemp: 195.80000305176, // F
  intakeTemp: 102.19999694824, // F
  intakeManifoldPressure: 4.6412076950073, // PSI
  ambientAirTemp: 93.199996948242, // F
  acceleratorPosition: 4.3137254714966, // Percent
};

mockServer.get("/ViewData.php", (request, response) => {
  // The following parameter is used to toggle between more descriptive data vs less descriptive data
  const getDescriptiveInfo =
    request.query["GetDescInfo"] === "1" ? true : false;

  if (getDescriptiveInfo) {
    response.setHeader("Content-Type", "application/json");
    return response.end(
      JSON.stringify({
        Status: "OK",
        UserOnline: 2,
        LocName: "Autobahn Country Club",
        VehicleDesc: "2013 Scion FR-S",
        Speed: 11.119999885559,
        Heading: 214.19999694824,
        CurLap: 5,
        BestLap: 4,
        BestLapTime: 183.1809387207,
        TopSpeed: 100.29000091553,
        LapAccuracy: 38,
        PredictLapTime: 386.6220703125,
        User: [
          {
            Lat: 41.455595693551,
            Lon: -88.12083799392,
            // This will not be accurate to the real data as they do not wrap the
            // hex number with double quotes for some reason ...
            Color: "0xFF2020",
            Tag: "",
          },
        ],
        Ext: [
          {
            Desc: "Engine Speed",
            Unit: "RPM",
            Value: mockData.engineSpeed,
          },
          {
            Desc: "Vehicle Speed",
            Unit: "mph",
            Value: mockData.vehicleSpeed,
          },
          {
            Desc: "Throttle Position",
            Unit: "%",
            Value: mockData.throttlePosition,
          },
          {
            Desc: "Engine Coolant Temp",
            Unit: "F",
            Value: mockData.engineCoolantTemp,
          },
          {
            Desc: "Intake Air Temp",
            Unit: "F",
            Value: mockData.intakeTemp,
          },
          {
            Desc: "Intake Manifold Pressure",
            Unit: "PSI",
            Value: mockData.intakeManifoldPressure,
          },
          {
            Desc: "Ambient Air Temp",
            Unit: "F",
            Value: mockData.ambientAirTemp,
          },
          {
            Desc: "Accelerator Pedal",
            Unit: "%",
            Value: mockData.acceleratorPosition,
          },
        ],
      })
    );
  }

  response.setHeader("Content-Type", "application/json");
  return response.end(
    JSON.stringify({
      Status: "OK",
      UserOnline: 2,
      Speed: 11.119999885559,
      Heading: 214.19999694824,
      CurLap: 5,
      BestLap: 4,
      BestLapTime: 183.1809387207,
      TopSpeed: 100.29000091553,
      LapAccuracy: 38,
      PredictLapTime: 386.6220703125,
      User: [
        {
          Lat: 41.455595693551,
          Lon: -88.12083799392,
          // This will not be accurate to the real data as they do not wrap the
          // hex number with double quotes for some reason ...
          Color: "0xFF2020",
          Tag: "",
        },
      ],
      Ext: [
        {
          Value: mockData.engineSpeed,
        },
        {
          Value: mockData.vehicleSpeed,
        },
        {
          Value: mockData.throttlePosition,
        },
        {
          Value: mockData.engineCoolantTemp,
        },
        {
          Value: mockData.intakeTemp,
        },
        {
          Value: mockData.intakeManifoldPressure,
        },
        {
          Value: mockData.ambientAirTemp,
        },
        {
          Value: mockData.acceleratorPosition,
        },
      ],
    })
  );
});

let timeSpan = 0;

// This has no mathematical basis for simulation. We are mapping the speed to a simple cos wave that is
// shifted up by 1 and inverted on the x axis :^)
function simulateSpeed() {
  // advance engine speed a little bit
  const engineSpeedClamp = Math.cos(1 + Math.PI * (timeSpan / 30)) * -1 + 1;
  const vehicleSpeedClamp = Math.cos(Math.PI * (timeSpan / 30)) * -1 + 1;

  mockData.engineSpeed = engineSpeedClamp * 4000;
  mockData.vehicleSpeed = vehicleSpeedClamp * 90;

  timeSpan++;
}

export function startMockServer(port: number) {
  setInterval(simulateSpeed, 400);

  mockServer.listen(port, () => {
    console.log(`[INFO] Server start on port ${port}`);
  });
}
