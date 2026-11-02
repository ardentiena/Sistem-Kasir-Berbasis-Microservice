# Sistem Kasir Berbasis Microservice

Sistem kasir (point of sale) berbasis microservice dengan backend Spring Boot dan frontend React. Terdiri dari empat layanan terpisah, autentikasi JWT, dukungan banyak cabang, serta halaman admin untuk pemilik usaha.

## Fitur

**Kasir**
- Login JWT, protected route, dan ganti password
- Halaman POS untuk memilih produk, keranjang, dan checkout
- Melihat transaksi dan pembayaran milik sendiri
- Halaman profil

**Admin (pemilik usaha)**
- Dashboard ringkasan
- Mengelola kasir, produk, dan cabang
- Melihat seluruh transaksi dan pembayaran
- Laporan penjualan
- Pengaturan

## Teknologi

- **Backend:** Java, Spring Boot, Maven (Maven Wrapper), H2
- **Frontend:** React, Vite, React Router, Axios
- **Autentikasi:** JWT
- **Komunikasi:** REST API

## Struktur Proyek

```
.
├── service-user/            # Pengguna, autentikasi, cabang  (port 8081)
├── service-daftar-produk/   # Produk dan stok                (port 8082)
├── service-transaksi-jual/  # Transaksi penjualan            (port 8083)
├── service-pembayaran/      # Pembayaran                     (port 8084)
├── frontend-sistem-kasir/   # Aplikasi React + Vite
└── run-sistem.ps1           # Menjalankan keempat layanan sekaligus
```

Setiap layanan memiliki database H2 sendiri (mode file di folder `data/`). Frontend memanggil setiap layanan secara langsung, belum memakai API Gateway.

## Alur Transaksi

1. Kasir membuat transaksi.
2. Layanan transaksi memeriksa produk ke layanan produk (batch).
3. Transaksi dan pembayaran dibuat dengan status `PENDING`.
4. Kasir mengisi form pembayaran dan mengirimkannya.
5. Layanan pembayaran memperbarui status transaksi menjadi `SELESAI`.

## Endpoint Utama

**User** (`:8081`, `/api`)
- `POST /auth/register`, `POST /auth/login`, `PUT /auth/ganti-password`
- `GET /users`, `GET|PUT|DELETE /users/{kodePegawai}`, `POST /users/assign`

**Cabang** (`:8081`, `/api/cabang`)
- `GET`, `GET /aktif`, `GET /pilihan`, `POST`
- `GET|PUT|DELETE /{kodeCabang}`

**Produk** (`:8082`, `/api/products`)
- `GET`, `GET /find`, `POST`, `PUT|DELETE /{kodeProduk}`
- `POST /batch`, `PATCH /reduce-stock`

**Transaksi** (`:8083`, `/api/transactions`)
- `POST`, `GET`, `GET /{kodeTransaksi}`, `PATCH /{kodeTransaksi}`

**Pembayaran** (`:8084`, `/api/payment`)
- `POST`, `GET`, `GET /{kodeTransaksi}`
- `POST /{kodeTransaksi}/paid`, `POST /{kodeTransaksi}/retry-callback`

## Cara Menjalankan

**Prasyarat:** JDK dan Node.js. Maven tidak perlu dipasang karena sudah ada Maven Wrapper (`mvnw`).

**Backend, opsi 1 (Windows, PowerShell):** ubah `$BasePath` di `run-sistem.ps1` ke lokasi proyek di komputermu, lalu jalankan:

```powershell
.\run-sistem.ps1
```

**Backend, opsi 2 (manual):** jalankan di tiap folder layanan, masing-masing di terminal terpisah.

```bash
cd service-user
./mvnw spring-boot:run
```

Ulangi untuk `service-daftar-produk`, `service-transaksi-jual`, dan `service-pembayaran`.

**Frontend**

```bash
cd frontend-sistem-kasir
npm install
npm run dev
```

## Lisensi

Proyek ini dibuat untuk keperluan pembelajaran.
