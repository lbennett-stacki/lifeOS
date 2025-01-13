$wsl_ip = $(wsl hostname -I).Trim().Split(' ')[0];
$wsl_port = '22';

$windows_ip = '0.0.0.0';
$windows_port = '2222';

if ( -Not $wsl_ip ) {
  Write-Host "[$(Get-Date)] WSL2 failure!" -ForegroundColor Red
  exit
}

$firewall_rule_name = "WSL2 SSH Dev Passthrough 2222 -> 22"

Write-Host "[$(Get-Date)] Configuring wsl2 network..." -ForegroundColor Cyan

Invoke-Expression "netsh int portproxy reset all"
Remove-NetFirewallRule -DisplayName $firewall_rule_name -ErrorAction SilentlyContinue

netsh interface portproxy add v4tov4 listenaddress=$windows_ip listenport=$windows_port connectaddress=$wsl_ip connectport=$wsl_port

New-NetFirewallRule -DisplayName $firewall_rule_name -Direction Inbound -LocalPort $windows_port -Protocol TCP -Action Allow


Write-Host "[$(Get-Date)] Configured wsl2 network." -ForegroundColor Green
