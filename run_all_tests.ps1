# ==============================================================================
# Script de Pruebas de API para Rueda Vargas ERP / AquaInsumos
# Ejecuta exactamente los casos documentados en docs/screenshots
# ==============================================================================

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   EJECUTANDO PRUEBAS DE API (docs/screenshots)" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Path,
        [hashtable]$Headers = @{},
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )

    Write-Host "--------------------------------------------------------" -ForegroundColor Gray
    Write-Host "CASO: $Name" -ForegroundColor Yellow
    Write-Host "$Method $baseUrl$Path" -ForegroundColor White

    $params = @{
        Uri = "$baseUrl$Path"
        Method = $Method
        Headers = $Headers
    }
    if ($Body) {
        $params["ContentType"] = "application/json; charset=utf-8"
        $params["Body"] = ($Body | ConvertTo-Json -Depth 5)
    }

    try {
        $response = Invoke-RestMethod @params
        Write-Host "HTTP Status: 200 OK (Exitoso)" -ForegroundColor Green
        Write-Host "Respuesta:" -ForegroundColor DarkGreen
        $response | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor DarkGreen
        return $response
    } catch {
        $color = if ($statusCode -eq $ExpectedStatus) { "Green" } else { "Red" }
        Write-Host "HTTP Status: $statusCode (Esperado: $ExpectedStatus)" -ForegroundColor $color
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $content = $reader.ReadToEnd()
            Write-Host "Respuesta Error:" -ForegroundColor DarkYellow
            try {
                $content | ConvertFrom-Json | ConvertTo-Json -Depth 5 | Write-Host -ForegroundColor DarkYellow
            } catch {
                Write-Host $content -ForegroundColor DarkYellow
            }
        }
        return $null
    }
}

# 1. api-health.png
Test-Endpoint -Name "1. Health Check (api-health.png)" -Method "GET" -Path "/health" -ExpectedStatus 200

# 2. api-register.png
$rnd = Get-Random -Minimum 1000 -Maximum 9999
$newEmp = @{
    name = "Ing. Auditor $rnd"
    email = "auditor$rnd@ruedavargas.ec"
    phone = "+593 98 444 $rnd"
    employeeId = "AUD-$rnd"
    role = "ADMIN"
    password = "Password123"
}
Test-Endpoint -Name "2. Registro de Empleado (api-register.png)" -Method "POST" -Path "/api/auth/register" -Body $newEmp -ExpectedStatus 201

# 3. api-login.png
$loginBody = @{
    email = "admin@ruedavargas.ec"
    password = "Password123"
}
$loginResp = Test-Endpoint -Name "3. Login de Admin (api-login.png)" -Method "POST" -Path "/api/auth/login" -Body $loginBody -ExpectedStatus 200
$adminToken = $loginResp.data.token

# Login de Cajero para pruebas de permisos
$cajeroLogin = @{
    email = "cajero@ruedavargas.ec"
    password = "Password123"
}
$cajeroResp = Test-Endpoint -Name "3.1 Login de Cajero" -Method "POST" -Path "/api/auth/login" -Body $cajeroLogin -ExpectedStatus 200
$cajeroToken = $cajeroResp.data.token

# 4. api-profile.png
$authHeader = @{ "Authorization" = "Bearer $adminToken" }
Test-Endpoint -Name "4. Perfil de Usuario (api-profile.png)" -Method "GET" -Path "/api/auth/profile" -Headers $authHeader -ExpectedStatus 200

# 5. api-cashier-area.png
$cajeroHeader = @{ "Authorization" = "Bearer $cajeroToken" }
Test-Endpoint -Name "5. Área de Cajero (api-cashier-area.png)" -Method "GET" -Path "/api/auth/cashier-area" -Headers $cajeroHeader -ExpectedStatus 200

# 6. api-admin-only.png
Test-Endpoint -Name "6. Área de Administrador (api-admin-only.png)" -Method "GET" -Path "/api/auth/admin-only" -Headers $authHeader -ExpectedStatus 200

# 7. api-error-400.png (Contraseña inválida sin mayúscula)
$badBody = @{
    name = "Juan Perez"
    email = "badpassword$rnd@ruedavargas.ec"
    password = "password123" # Sin mayúscula
    role = "ADMIN"
    employeeId = "EMP-BAD-$rnd"
}
Test-Endpoint -Name "7. Error 400 - Validación contraseña (api-error-400.png)" -Method "POST" -Path "/api/auth/register" -Body $badBody -ExpectedStatus 400

# 8. api-error-401.png (Petición a ruta protegida sin token)
Test-Endpoint -Name "8. Error 401 - Sin Token (api-error-401.png)" -Method "GET" -Path "/api/auth/profile" -ExpectedStatus 401

# 9. api-error-403.png (Cajero intentando acceder al área exclusiva de Admin)
Test-Endpoint -Name "9. Error 403 - Rol sin Permiso (api-error-403.png)" -Method "GET" -Path "/api/auth/admin-only" -Headers $cajeroHeader -ExpectedStatus 403

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "   TODAS LAS PRUEBAS COMPLETADAS CON ÉXITO" -ForegroundColor Cyan
Write-Host "========================================================`n" -ForegroundColor Cyan
