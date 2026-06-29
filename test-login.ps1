param(
    [int]$Port = 3000
)

$ErrorActionPreference = 'Stop'

# List of ports to try (your specified port + fallback 3001)
$ports = @($Port, 3001) | Sort-Object -Unique

# Credentials – change these to match your test user
$email    = "admin@henok.dev"
$password = "changeme-admin"

# The API endpoint (adjust if your app uses a different path)
$apiPath = "/api/auth/login"

Write-Host "Testing login endpoint on ports: $($ports -join ', ')" -ForegroundColor Cyan
Write-Host ""

foreach ($p in $ports) {
    $url = "http://localhost:$p$apiPath"
    Write-Host "→ Trying $url ..." -ForegroundColor Yellow

    try {
        # Build JSON body
        $bodyJson = @{ email = $email; password = $password } | ConvertTo-Json

        # Send POST request
        $response = Invoke-WebRequest -Method POST -Uri $url `
            -ContentType 'application/json' -Body $bodyJson `
            -UseBasicParsing -TimeoutSec 10

        Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "  Body:   $($response.Content)" -ForegroundColor Gray

        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Login successful on port $p" -ForegroundColor Green
            exit 0
        } else {
            Write-Host "  ✗ Unexpected status code. Server responded but not 200." -ForegroundColor Yellow
        }
    }
    catch {
        # Catch all errors (connection refused, timeouts, non‑HTTP errors)
        $exception = $_.Exception

        # Try to extract HTTP status code if available
        if ($exception.Response) {
            $statusCode = [int]$exception.Response.StatusCode
            Write-Host "  Status: $statusCode" -ForegroundColor Red

            # Try to read the response body (if any)
            try {
                $stream = $exception.Response.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($stream)
                $body = $reader.ReadToEnd()
                if ($body) {
                    Write-Host "  Body:   $body" -ForegroundColor Gray
                }
            } catch {
                # Ignore if we can't read the body
            }
        } else {
            # No HTTP response – likely the server isn't running
            Write-Host "  Error: $($exception.Message)" -ForegroundColor Red
        }
    }

    Write-Host ""  # blank line between attempts
}

# If we get here, neither port responded successfully
Write-Host "✗ Dev server is not responding on any tested port." -ForegroundColor Red
Write-Host "Make sure 'npm run dev' is running and the API endpoint is correct." -ForegroundColor Yellow
Write-Host "Endpoint used: $apiPath" -ForegroundColor Cyan

exit 1