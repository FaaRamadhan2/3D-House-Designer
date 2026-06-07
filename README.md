# House Blueprint 3D Designer

House Blueprint 3D Designer adalah editor blueprint 2D berbasis browser dengan preview rumah 3D yang dibuat otomatis. Aplikasi ini bisa dipakai untuk menggambar dinding, ruangan, lantai, atap, pintu, jendela, furnitur, dimensi, dan label, lalu melihat hasilnya dalam scene 3D berbasis Three.js.

## Fitur

- Menggambar dan mengedit blueprint rumah 2D di canvas berbasis grid.
- Membuat preview 3D secara langsung dari blueprint.
- Menambahkan dinding, ruangan, lantai, atap, pintu, jendela, furnitur, label, dan dimensi.
- Mengatur tinggi dinding, ketebalan dinding, elevasi, warna objek, gaya atap, tipe furnitur, dan detail model.
- Berpindah antara tampilan 2D, 3D, dan split view.
- Menyimpan dan memuat proyek dari localStorage browser.
- Mengekspor dan mengimpor file proyek dalam format JSON.
- Mengekspor blueprint dan screenshot preview 3D sebagai file PNG.

## Menjalankan Secara Lokal

Project ini adalah aplikasi web statis. Tidak ada proses build yang diperlukan.

1. Clone repository ini.
2. Buka `index.html` di browser modern.

Untuk perilaku browser yang lebih konsisten pada download file dan WebGL, folder project juga bisa dijalankan dengan static server, misalnya:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.

## Struktur Project

```text
.
|-- index.html   # Markup aplikasi dan kontrol UI
|-- script.js    # Logika editor 2D, data model project, dan rendering Three.js
|-- style.css    # Layout aplikasi dan styling visual
|-- LICENSE      # GNU General Public License v3.0
`-- README.md
```

## Dependensi

Aplikasi memuat library berikut dari jsDelivr CDN:

- Three.js `0.128.0`
- Three.js OrbitControls `0.128.0`

## License

Copyright (C) 2026 FaaRamadhan2

This project is free software licensed under the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [LICENSE](LICENSE) for the full license text.
