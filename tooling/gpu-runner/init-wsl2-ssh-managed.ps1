$wslIp = $(wsl hostname -I).Trim().Split(' ')[0];
$sshPort = 22

function Test-SSHConnection {
  param (
    [string]$ip,
    [int]$port
  )

  try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $asyncResult = $tcpClient.BeginConnect($ip, $port, $null, $null)
    $waitResult = $asyncResult.AsyncWaitHandle.WaitOne(10000)

    if ($waitResult -and $tcpClient.Connected) {
      $tcpClient.Close()
      Write-Host "[$(Get-Date)] SSH connection successful to $($ip):$($port)" -ForegroundColor Green
      return $true
    } else {
      $tcpClient.Close()
      Write-Host "[$(Get-Date)] SSH connection failed to $($ip):$($port)" -ForegroundColor Red
      return $false
    }
  } catch {
    Write-Host "[$(Get-Date)] Exception while testing SSH connection: $_" -ForegroundColor Yellow
    return $false
  }
}

function Restart-WSL {
  Write-Host "[$(Get-Date)] Restarting WSL..." -ForegroundColor Yellow
  Stop-Process -Name "wsl" -Force -ErrorAction SilentlyContinue

  Start-Process -FilePath "wsl.exe"
  Start-Sleep -Seconds 3
  Write-Host "[$(Get-Date)] WSL started successfully." -ForegroundColor Cyan

  Write-Host "[$(Get-Date)] Configuring proxy..." -ForegroundColor Yellow
  & "C:\Users\Luke\workspace\windows\init-wsl2-ssh-network.ps1"
}

Restart-WSL

while ($true) {
  $wslProcess = Get-Process -Name "wsl" -ErrorAction SilentlyContinue

  if (-not $wslProcess) {
    Write-Host "[$(Get-Date)] WSL process is not running. Restarting..." -ForegroundColor Red
    Restart-WSL
    continue
  }

  if (-not (Test-SSHConnection -ip $wslIp -port $sshPort)) {
    Write-Host "[$(Get-Date)] SSH connection failed. Restarting WSL..." -ForegroundColor Red
    Restart-WSL
  }

  Write-Host "[$(Get-Date)] Monitoring WSL process and SSH connection..." -ForegroundColor Gray
  Start-Sleep -Seconds 5
}

