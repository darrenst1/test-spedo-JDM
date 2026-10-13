# JDM Redline Speedometer (FiveM NUI)

Compact bottom-right speedometer inspired by JDM performance dashboards. Includes speed, RPM bar, fuel, gear, engine state, seatbelt indicator and turn signals.

## Files
- `index.html` — dashboard markup and browser preview controls
- `styles.css` — JDM redline styling
- `script.js` — renders data from NUI messages and provides a standalone browser demo
- `fxmanifest.lua` — FiveM resource manifest
- `client.lua` — reads native vehicle data and sends updates to NUI

## 1. Test the browser preview
1. Extract this folder.
2. Open `index.html` in Chrome or Edge.
3. Use the sliders and buttons in the **PREVIEW MODE** panel.
4. For a GitHub Pages preview, upload these files to a repository root and enable **Settings → Pages → Deploy from a branch → main → /(root)**. Wait for the Pages deployment to finish, then open the published URL.

GitHub Pages is only a browser demo. It does not connect to a FiveM game session.

## 2. Install as a FiveM resource
1. Copy the `jdm_redline_speedometer` folder into your server's `resources` directory.
2. Add `ensure jdm_redline_speedometer` to `server.cfg`.
3. Restart the resource/server and enter a vehicle as the driver.

This requires permission to add resources to the FiveM server. Uploading the page to GitHub Pages alone will not install it into FiveM.

## 3. Seatbelt integration
FiveM/GTA natives do not expose a universal seatbelt state for every roleplay server. The HUD defaults to unfastened unless another client script reports its state. In the seatbelt resource, call:

```lua
TriggerEvent('jdm_redline:setSeatbelt', true)  -- fastened
TriggerEvent('jdm_redline:setSeatbelt', false) -- unfastened
```

If your server uses a framework-specific export/event, adapt that resource to emit the event above. The event name must match exactly.

## 4. Notes / limitations
- Fuel is read with `GetVehicleFuelLevel`. If the server uses a custom fuel resource, replace this with its export/state.
- Gear uses `GetVehicleCurrentGear`; reverse/neutral presentation can vary by vehicle and GTA behavior.
- Indicators use `GetVehicleIndicatorLights`. Some servers/vehicles may not expose indicator state as expected; test in your server build.
- Speed and RPM are native vehicle readings. The speedometer polls while the player is driving, every 100 ms.
- `client.lua` currently shows the HUD only while the player is the driver. Change the `inVehicle` condition if passengers should see it.
- This is a standalone resource template, not a drop-in integration with every server's existing HUD/framework. Avoid running duplicate speedometers.
- No external JavaScript libraries or fonts are required.

## 5. Optional speed unit
The default unit is KM/H. A client-side script can switch units with:

```lua
TriggerEvent('jdm_redline:setSpeedMode', 'MPH')
TriggerEvent('jdm_redline:setSpeedMode', 'KM/H')
```


## Important troubleshooting
- The browser/GitHub Pages preview is only a visual demo; it will not follow your in-game car.
- For live speed/RPM/fuel/gear data, the resource must be installed and started by the FiveM server owner/admin.
- This resource only provides the speedometer. It does not replace the server's money, needs, chat, vehicle notifications, or other HUDs.
- If another speedometer is active, disable that resource to avoid duplicate HUDs.
- The demo panel is now forcibly hidden when the page is running in FiveM NUI.
