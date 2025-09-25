# PostShare - Modern Social Media Platform

PostShare, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir sosyal medya platformudur. Kullanıcılar düşüncelerini paylaşabilir, başkalarının fikirlerini keşfedebilir ve toplulukla bağlantı kurabilir.

## 🚀 Özellikler

### ✨ Temel Özellikler

- **Post Paylaşımı**: Metin, resim ve etiketlerle zengin içerik paylaşımı
- **Kullanıcı Sistemi**: Kayıt, giriş ve profil yönetimi
- **Beğeni Sistemi**: Post ve yorumları beğenme/beğenmeme
- **Yorum Sistemi**: Postlara yorum yapma ve yorumları beğenme
- **Takip Sistemi**: Kullanıcıları takip etme/takipten çıkma

### 🎨 Gelişmiş Özellikler

- **Dark Mode**: Karanlık ve aydınlık tema desteği
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **Real-time Bildirimler**: Socket.io ile anlık bildirimler
- **Kategori Sistemi**: Postları kategorilere ayırma
- **Etiket Sistemi**: Hashtag benzeri etiketleme
- **Arama ve Filtreleme**: Gelişmiş arama ve kategori filtreleme
- **Infinite Scroll**: Sayfalama yerine sonsuz kaydırma
- **PWA Desteği**: Progressive Web App özellikleri

### 🔧 Teknik Özellikler

- **Resim Yükleme**: Cloudinary entegrasyonu ile resim yönetimi
- **Performans Optimizasyonu**: Caching ve lazy loading
- **Animasyonlar**: Framer Motion ile smooth animasyonlar
- **State Management**: Redux ile merkezi state yönetimi
- **API Caching**: TanStack Query ile akıllı cache yönetimi

## 🛠️ Teknoloji Stack

### Frontend

- **React 19** - Modern UI kütüphanesi
- **Redux Toolkit** - State management
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **React Hook Form** - Form management
- **React Dropzone** - File upload
- **Heroicons** - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Cloudinary** - Image management
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Kurulum

### Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB
- Cloudinary hesabı (resim yükleme için)

### 1. Repository'yi klonlayın

```bash
git clone <repository-url>
cd Mern
```

### 2. Server kurulumu

```bash
cd server
npm install
```

### 3. Client kurulumu

```bash
cd ../client
npm install
```

### 4. Environment değişkenlerini ayarlayın

Server klasöründe `.env` dosyası oluşturun:

```env
MONGODB_URI=mongodb://localhost:27017/mern-app
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=3001
```

### 5. Uygulamayı çalıştırın

Terminal 1 (Server):

```bash
cd server
npm start
```

Terminal 2 (Client):

```bash
cd client
npm start
```

Uygulama şu adreslerde çalışacak:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🎯 Kullanım

### Kullanıcı Kaydı ve Girişi

1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. Kayıt olun veya mevcut hesabınızla giriş yapın

### Post Paylaşımı

1. Giriş yaptıktan sonra "Post Oluştur" butonuna tıklayın
2. Başlık, açıklama, kategori ve etiketler ekleyin
3. İsteğe bağlı olarak resim yükleyin
4. "Paylaş" butonuna tıklayın

### Sosyal Etkileşim

- **Beğeni**: Post veya yorumların altındaki kalp ikonuna tıklayın
- **Yorum**: Post altındaki yorum ikonuna tıklayarak yorum yapın
- **Takip**: Kullanıcı profillerinde "Takip Et" butonunu kullanın

### Profil Yönetimi

1. Sağ üst köşedeki profil resminize tıklayın
2. "Profil" seçeneğini seçin
3. Profil bilgilerinizi düzenleyin ve kaydedin

## 🔧 Geliştirme

### Proje Yapısı

```
Mern/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── redux/         # State management
│   │   ├── hooks/         # Custom hooks
│   │   └── ...
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── modals/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── ...
└── README.md
```

### API Endpoints

#### Authentication

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile/:id` - Profil bilgileri
- `PUT /api/auth/profile/:id` - Profil güncelleme
- `POST /api/auth/follow/:id` - Kullanıcı takip etme

#### Posts

- `GET /api/post/getPosts` - Postları listele
- `GET /api/post/:id` - Tek post detayı
- `POST /api/post/createPost` - Yeni post oluştur
- `PATCH /api/post/updatePost/:id` - Post güncelle
- `DELETE /api/post/deletePost/:id` - Post sil
- `POST /api/post/:id/like` - Post beğen
- `POST /api/post/:id/comment` - Yorum ekle

## 🚀 Deployment

### Vercel (Frontend)

1. Vercel hesabınızla giriş yapın
2. GitHub repository'nizi bağlayın
3. Build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`

### Heroku (Backend)

1. Heroku CLI ile giriş yapın
2. Yeni app oluşturun
3. MongoDB Atlas bağlantısı ekleyin
4. Environment variables ayarlayın
5. Deploy edin

### MongoDB Atlas

1. MongoDB Atlas hesabı oluşturun
2. Cluster oluşturun
3. Database user oluşturun
4. Connection string'i alın

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👥 Ekip

- **Geliştirici**: [İsminiz]
- **Email**: [email@example.com]

## 🙏 Teşekkürler

- React ekibine
- MongoDB ekibine
- Tailwind CSS ekibine
- Tüm açık kaynak katkıda bulunanlara

---

**PostShare** - Modern sosyal medya deneyimi için tasarlandı. 🚀

