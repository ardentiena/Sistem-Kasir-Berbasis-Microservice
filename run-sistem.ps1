# Jalankan script ini menggunakan PowerShell

# Definisikan path utama proyek
$BasePath = "C:\Users\62812\OneDrive\Desktop\UKSW\TI\Sem 12\web-service\TR\Sistem-Kasir-Berbasis-Microservice"

# Array berisi nama-nama folder service
$Services = @(
    "service-user",
    "service-daftar-produk",
    "service-transaksi-jual",
    "service-pembayaran"
)

Write-Host "[+] Menjalankan Sistem Kasir Berbasis Microservice..." -ForegroundColor Green

# Loop untuk menjalankan setiap service di background sebagai Job
foreach ($Service in $Services) {
    Write-Host "-> Menyalakan $Service..." -ForegroundColor Cyan
    
    # Menjalankan perintah di background (tidak memblokir terminal)
    Start-Job -Name $Service -ScriptBlock {
        param($path, $srv)
        Set-Location "$path\$srv"
        .\mvnw spring-boot:run
    } -ArgumentList $BasePath, $Service | Out-Null
}

Write-Host "--------------------------------------------------------" -ForegroundColor Yellow
Write-Host "[+] Semua service sedang proses startup di background."
Write-Host "[*] Tekan [Ctrl+C] untuk mematikan semua service sekaligus."
Write-Host "--------------------------------------------------------"

# block terminal agar tetap terbuka dan menunggu Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
catch [System.Management.Automation.PipelineStoppedException], [System.Reflection.TargetInvocationException] {
    # Bagian ini akan jalan saat kamu menekan Ctrl+C
    Write-Host "`n[!] Menghentikan semua microservice..." -ForegroundColor Red
    Get-Job | Stop-Job
    Get-Job | Remove-Job
    Write-Host "[+] Semua service telah dihentikan." -ForegroundColor Green
}
finally {
    # Antisipasi jika user menutup paksa dengan cara lain
    Get-Job | Stop-Job
    Get-Job | Remove-Job
}