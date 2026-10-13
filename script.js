(() => {
  const $ = (id) => document.getElementById(id);
  const isFiveM = typeof window.GetParentResourceName === "function";
  if (!isFiveM) document.body.classList.add("preview-mode");

  const state = { speed: 0, rpm: 0, fuel: 76, gear: "N", engine: false, seatbelt: false, left: false, right: false, unit: "KM/H" };
  let demoTimer = null;

  function clamp(n, min, max) { return Math.min(max, Math.max(min, Number(n) || 0)); }
  function render(data = {}) {
    Object.assign(state, data);
    const speed = Math.round(clamp(state.speed, 0, 999));
    const rpm = clamp(state.rpm, 0, 1);
    const fuel = clamp(state.fuel, 0, 100);
    $("speed").textContent = String(speed).padStart(3, "0");
    $("unit").textContent = state.unit || "KM/H";
    $("gear").textContent = state.gear === -1 ? "R" : (state.gear ?? "N");
    $("rpmFill").style.width = `${rpm * 100}%`;
    $("rpmText").textContent = `${(rpm * 8).toFixed(1)} × 1000`;
    $("fuel").textContent = Math.round(fuel);
    $("fuelFill").style.width = `${fuel}%`;
    $("fuelFill").style.background = fuel < 15 ? "#ff3038" : "#f04444";
    $("engineDot").parentElement.classList.toggle("on", !!state.engine);
    $("engineText").textContent = state.engine ? "ENGINE ON" : "ENGINE OFF";
    $("engineState").textContent = state.engine ? "POWERTRAIN ACTIVE" : "POWERTRAIN STANDBY";
    $("seatbelt").classList.toggle("fastened", !!state.seatbelt);
    $("seatbelt").textContent = state.seatbelt ? "BELT ON" : "BELT OFF";
    $("leftIndicator").classList.toggle("active", !!state.left);
    $("rightIndicator").classList.toggle("active", !!state.right);
    $("rpmFill").parentElement.setAttribute("aria-valuenow", Math.round(rpm * 100));
  }

  // Public update function for a standalone preview or custom integrations.
  window.updateSpeedometer = render;

  if (isFiveM) {
    document.body.classList.add("fivem-mode");
    window.addEventListener("message", (event) => {
      const d = event.data || {};
      if (d.action === "update") render(d);
      if (d.action === "visible") $("hud").style.display = d.show ? "block" : "none";
    });
    $("previewPanel").remove();
    render({ speed: 0, rpm: 0, fuel: 0, gear: "N", engine: false, seatbelt: false, left: false, right: false });
    return;
  }

  const speedControl = $("speedControl"), rpmControl = $("rpmControl"), fuelControl = $("fuelControl"), gearControl = $("gearControl");
  function syncControls() {
    $("speedOut").textContent = `${speedControl.value} km/h`;
    $("rpmOut").textContent = `${rpmControl.value}%`;
    $("fuelOut").textContent = `${fuelControl.value}%`;
    render({ speed: speedControl.value, rpm: Number(rpmControl.value) / 100, fuel: fuelControl.value, gear: gearControl.value });
  }
  [speedControl, rpmControl, fuelControl, gearControl].forEach(el => el.addEventListener("input", syncControls));
  $("engineButton").addEventListener("click", () => render({ engine: !state.engine }));
  $("beltButton").addEventListener("click", () => render({ seatbelt: !state.seatbelt }));
  $("leftButton").addEventListener("click", () => render({ left: !state.left }));
  $("rightButton").addEventListener("click", () => render({ right: !state.right }));
  $("resetButton").addEventListener("click", () => {
    if (demoTimer) { clearInterval(demoTimer); demoTimer = null; }
    speedControl.value = 124; rpmControl.value = 64; fuelControl.value = 76; gearControl.value = "3";
    render({ engine: false, seatbelt: false, left: false, right: false, speed: 124, rpm: .64, fuel: 76, gear: "3" });
    syncControls();
  });
  syncControls();
  render({ engine: true, seatbelt: true, left: false, right: false });
})();
