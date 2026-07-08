package com.sistemkasir.transaksi_jual.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailTransaksiResponseDTO {
    private UUID produkId;
    private String namaProduk;
    private double harga;
    private int jumlah;
    private double subtotal;
}

/**
service-transaksi-jual:
POST /api/transactions (kasir & admin)
request body:
[
    {
        "idProduk":"082h30r98h2",
        "jumlah":2
    },
    {
        "idProduk":"hj429r7h29f",
        "jumlah":4
    }
]

response body:
{
    "id":"9485j945",
    "kasirEmail": "kasir@example.com",
    "tanggal": "2023-05-01T10:00:00Z",
    "daftarBarang":{
        {
            "idProduk":"082h30r98h2",
            "namaProduk": "aqua 1500ml",
            "jumlah":2,
            "subtotal": 12000
        },
        {
            "idProduk":"hj429r7h29f",
            "namaProduk": "ikan puri",
            "jumlah":4,
            "subtotal": 40000
        }
    },
    "grandTotal":52000,
    "idPembayaran":"h834hf38947jf3948fh",
    "status": "pending"
}

GET /api/transactions (kasir & admin. Kasir hanya bisa melihat transaksi yang dibuatnya sendiri)
response body:
[
    {
        "id": "9485j945",
        "kasirEmail": "kasir@example.com",
        "tanggal": "2023-05-01T10:00:00Z",
        "daftarBarang":{
            {
                "idProduk":"082h30r98h2",
                "namaProduk": "aqua 1500ml",
                "jumlah":2,
                "subtotal": 12000
            },
            {
                "idProduk":"hj429r7h29f",
                "namaProduk": "ikan puri",
                "jumlah":4,
                "subtotal": 40000
            }
        },
        "grandTotal":52000,
        "idPembayaran":"h834hf38947jf3948fh",
        "status": "selesai"
    },
    {
        "id": "94853gdej8",
        "kasirEmail": "kasir@example.com",
        "tanggal": "2023-05-01T10:00:00Z",
        "daftarBarang":{
            {
                "idProduk":"082h30r98h2",
                "namaProduk": "aqua 1500ml",
                "jumlah":2,
                "subtotal": 12000
            },
            {
                "idProduk":"hj429r7h29f",
                "namaProduk": "ikan puri",
                "jumlah":4,
                "subtotal": 40000
            }
        },
        "grandTotal":52000,
        "idPembayaran":"9f34ht9378h49rh349h",
        "status": "pending"
    }
]

GET /api/transactions/{id}
response body:
    {
        "id": "94853gdej8",
        "kasirEmail": "kasir@example.com",
        "tanggal": "2023-05-01T10:00:00Z",
        "daftarBarang":{
            {
                "idProduk":"082h30r98h2",
                "namaProduk": "aqua 1500ml",
                "jumlah":2,
                "subtotal": 12000
            },
            {
                "idProduk":"hj429r7h29f",
                "namaProduk": "ikan puri",
                "jumlah":4,
                "subtotal": 40000
            }
        },
        "grandTotal":52000,
        "idPembayaran":"9f34ht9378h49rh349h",
        "status": "pending"
    }

PATCH /api/transactions/{id}?status=selesai

GET /api/transactions?date=ddmmyy

GET /api/transactions?status=selesai

GET /api/transactions?status=pending

service-pembayaran:

POST /api/payment

POST /api/payment/{id}/paid

GET /api/payment

GET /api/payment/{id}
 */