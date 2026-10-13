local hudVisible = false
local seatbeltFastened = false
local speedMode = 'KM/H'

-- Optional bridge for your existing seatbelt resource:
-- TriggerEvent('jdm_redline:setSeatbelt', true/false) from a client-side script.
RegisterNetEvent('jdm_redline:setSeatbelt', function(state)
    seatbeltFastened = state == true
end)

RegisterNetEvent('jdm_redline:setSpeedMode', function(mode)
    if mode == 'MPH' then
        speedMode = 'MPH'
    else
        speedMode = 'KM/H'
    end
end)

CreateThread(function()
    while true do
        local ped = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(ped, false)
        local inVehicle = vehicle ~= 0 and GetPedInVehicleSeat(vehicle, -1) == ped

        if inVehicle then
            local speedMs = GetEntitySpeed(vehicle)
            local speed = speedMode == 'MPH' and (speedMs * 2.236936) or (speedMs * 3.6)
            local rpm = GetVehicleCurrentRpm(vehicle)
            local fuel = GetVehicleFuelLevel(vehicle)
            local gear = GetVehicleCurrentGear(vehicle)
            local engine = GetIsVehicleEngineRunning(vehicle)

            -- GTA indicator bitmask: 1=left, 2=right, 3=both.
            local indicators = GetVehicleIndicatorLights(vehicle)
            local left = indicators == 1 or indicators == 3
            local right = indicators == 2 or indicators == 3

            SendNUIMessage({
                action = 'update',
                speed = math.floor(speed + 0.5),
                unit = speedMode,
                rpm = rpm,
                fuel = fuel,
                gear = gear == 0 and (speedMs < 0.5 and 'N' or '1') or gear,
                engine = engine,
                seatbelt = seatbeltFastened,
                left = left,
                right = right
            })

            if not hudVisible then
                hudVisible = true
                SendNUIMessage({ action = 'visible', show = true })
            end
            Wait(100)
        else
            if hudVisible then
                hudVisible = false
                seatbeltFastened = false
                SendNUIMessage({ action = 'visible', show = false })
            end
            Wait(500)
        end
    end
end)
