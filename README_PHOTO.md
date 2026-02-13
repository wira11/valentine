# 📸 Cara Menambahkan Foto "My Favorite Flower"

## Langkah Upload Foto:

### 1. **Siapkan Foto**
   - Save foto yang Anda kirim sebagai: `flower-bouquet.jpg`
   - Foto sudah dalam format JPG/JPEG

### 2. **Upload ke GitHub**

#### Cara 1: Via GitHub Web Interface
1. Buka: https://github.com/wira11/valentine
2. Klik tombol **Add file** → **Upload files**
3. Drag & drop file `flower-bouquet.jpg`
4. Scroll ke bawah, klik **Commit changes**

#### Cara 2: Via Terminal (Lokal)
```bash
cd /Users/pakpahanw/Documents/ITSec/workspace_python/PythonLearning/Valentine

# Copy foto ke folder Valentine dengan nama: flower-bouquet.jpg
# Misalnya foto ada di Downloads:
cp ~/Downloads/nama-foto-asli.jpg flower-bouquet.jpg

# Push ke GitHub
git add flower-bouquet.jpg
git commit -m "Add special flower bouquet photo"
git push
```

### 3. **Tunggu GitHub Pages Update**
   - Tunggu 1-2 menit
   - Buka: https://wira11.github.io/valentine/
   - Klik "Yes" → Foto akan muncul! 🎉

## ✨ Hasil yang Akan Muncul:
- Foto muncul dengan animasi fade-in yang smooth
- Caption: "— my favorite flower 💐"
- Border putih & shadow yang cantik
- Confetti tetap jalan di background
- Responsive di mobile & desktop

## 🎨 Customize (Opsional):
Jika ingin ganti caption, edit file `index.html` line:
```html
<p class="photo-caption">— my favorite flower 💐</p>
```

---

**Note:** Nama file HARUS `flower-bouquet.jpg` (atau edit di `index.html` jika beda nama)
