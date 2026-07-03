// lib/translations.ts
export type Language = 'tr' | 'en'

export const defaultLang: Language = 'en'

export const translations = {
  tr: {
    // Genel
    'app.title': 'Haklı mıyım?',
    'app.subtitle': 'Olayını anlat, karar halkın olsun.',
    'app.tagline': 'Gerçek olaylar · gerçek oylar',
    'app.description': 'Başına geleni yaz, herkes "haklısın" ya da "haksızsın" desin.',
    
    // Navbar
    'nav.home': 'Ana Sayfa',
    'nav.profile': 'Profil',
    'nav.settings': 'Ayarlar',
    'nav.logout': 'Çıkış yap',
    'nav.login': 'Giriş yap',
    'nav.register': 'Kayıt ol',
    
    // Butonlar
    'button.share': '+ Paylaşım yap',
    'button.vote.up': 'Haklısın',
    'button.vote.down': 'Haksızsın',
    'button.comment': 'Yorum Yap',
    'button.search': 'Ara',
    'button.save': 'Kaydet',
    'button.change': 'Değiştir',
    'button.back': 'Geri',
    'button.send': 'Gönder',
    'button.close': 'Kapat',
    
    // Form
    'form.email': 'E-posta',
    'form.password': 'Şifre',
    'form.username': 'Kullanıcı adı',
    'form.newPassword': 'Yeni şifre',
    'form.newEmail': 'Yeni e-posta',
    'form.search.placeholder': 'Anahtar kelime ile ara...',
    'form.title.placeholder': 'Örn: Arkadaşımın hediyesini beğenmedim...',
    'form.content.placeholder': 'Başından sonuna kadar ne oldu anlat...',
    'form.bio.placeholder': 'Kendinden kısaca bahset...',
    'form.comment.placeholder': 'Yorumunu yaz...',
    
    // Tabs
    'tab.new': 'Yeni',
    'tab.mostDiscussed': 'En çok tartışılan',
    'tab.closeVotes': 'Yakın oylar',
    
    // Category
    'category.all': 'Tümü',
    'category.family': 'Aile',
    'category.work': 'İş',
    'category.friendship': 'Arkadaşlık',
    'category.relationship': 'İlişki',
    'category.money': 'Para',
    'category.other': 'Diğer',
    
    // Profile
    'profile.title': 'Profil',
    'profile.posts': 'Paylaşım',
    'profile.votesReceived': 'Aldığı oy',
    'profile.votesGiven': 'Verdiği oy',
    'profile.ratio': 'Haklı bulunma oranı',
    'profile.noPosts': 'Henüz paylaşım yapmamış.',
    'profile.loading': 'Yükleniyor...',
    
    // Settings
    'settings.title': 'Hesap ayarların',
    'settings.language': 'Dil',
    'settings.languageDesc': 'Arayüz dilini değiştirir.',
    'settings.theme': 'Tema',
    'settings.themeDesc': 'Karanlık / Aydınlık mod.',
    'settings.avatar': 'Fotoğraf değiştir',
    'settings.bio': 'Biyografi',
    'settings.gender': 'Cinsiyet',
    'settings.gender.none': 'Belirtmek istemiyorum',
    'settings.gender.female': 'Kadın',
    'settings.gender.male': 'Erkek',
    'settings.gender.other': 'Diğer',
    'settings.username': 'Kullanıcı adı',
    'settings.usernameChange': 'Değiştirebilirsin.',
    'settings.usernameWait': '{days} gün sonra.',
    'settings.email': 'E-posta',
    'settings.password': 'Şifre',
    'settings.passwordMin': 'En az 6 karakter.',
    'settings.loginRequired': 'Ayarları görmek için giriş yapmalısın.',
    
    // Auth
    'auth.login.title': 'Giriş Yap',
    'auth.login.button': 'Giriş Yap',
    'auth.login.loading': 'Giriş yapılıyor...',
    'auth.login.noAccount': 'Hesabın yok mu?',
    'auth.register.title': 'Kayıt Ol',
    'auth.register.button': 'Kayıt Ol',
    'auth.register.loading': 'Kayıt olunuyor...',
    'auth.register.hasAccount': 'Zaten hesabın var mı?',
    'auth.error.required': 'Lütfen tüm alanları doldur.',
    'auth.error.email': 'Geçerli bir e-posta gir.',
    'auth.error.password': 'En az 6 karakter olmalı.',
    
    // Post
    'post.verdict.right': 'Toplum: Haklı buluyor',
    'post.verdict.wrong': 'Toplum: Haksız buluyor',
    'post.verdict.undecided': 'Toplum kararsız',
    'post.report': 'Bildir',
    'post.reported': 'Bildirildi',
    'post.reportReason': 'Neden bildiriyorsun?',
    'post.report.spam': 'Spam',
    'post.report.harassment': 'Hakaret / taciz',
    'post.report.inappropriate': 'Uygunsuz içerik',
    'post.report.other': 'Diğer',
    'post.noPosts': 'Henüz paylaşım yok, ilkini sen yap.',
    'post.noComments': 'Henüz yorum yok, ilk sen yaz.',
    'post.commentCount': 'yorum',
    'post.anonymous': 'Anonim',
    
    // Entry Gate
    'gate.tagline': 'Gerçek olaylar · gerçek oylar',
    'gate.title': 'Haklı mıyım?',
    'gate.description': 'Devam etmeden önce nasıl gitmek istersin? İstersen kimliğini hiç açmadan da katılabilirsin.',
    'gate.anonymous': 'Anonim devam et',
    'gate.login': 'Giriş yap',
    'gate.register': 'Kayıt ol',
    
    // Errors
    'error.general': 'Bir hata oluştu: {error}',
    'error.notFound': 'Gönderi bulunamadı.',
    'error.limitReached': 'Günlük dava açma limitine ulaştın. Yarın tekrar deneyebilirsin.',
    'error.minChar': 'En az {count} karakter olmalı (şu an {current}).',
  },
  
  en: {
    // General
    'app.title': 'Am I Right?',
    'app.subtitle': 'Tell your story, let the public decide.',
    'app.tagline': 'Real stories · real votes',
    'app.description': 'Write what happened, let everyone say "right" or "wrong".',
    
    // Navbar
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    
    // Buttons
    'button.share': '+ Share',
    'button.vote.up': 'Right',
    'button.vote.down': 'Wrong',
    'button.comment': 'Comment',
    'button.search': 'Search',
    'button.save': 'Save',
    'button.change': 'Change',
    'button.back': 'Back',
    'button.send': 'Send',
    'button.close': 'Close',
    
    // Form
    'form.email': 'Email',
    'form.password': 'Password',
    'form.username': 'Username',
    'form.newPassword': 'New password',
    'form.newEmail': 'New email',
    'form.search.placeholder': 'Search by keyword...',
    'form.title.placeholder': 'E.g. I didn\'t like my friend\'s gift...',
    'form.content.placeholder': 'Tell us what happened from start to finish...',
    'form.bio.placeholder': 'Tell us a bit about yourself...',
    'form.comment.placeholder': 'Write your comment...',
    
    // Tabs
    'tab.new': 'New',
    'tab.mostDiscussed': 'Most discussed',
    'tab.closeVotes': 'Close votes',
    
    // Category
    'category.all': 'All',
    'category.family': 'Family',
    'category.work': 'Work',
    'category.friendship': 'Friendship',
    'category.relationship': 'Relationship',
    'category.money': 'Money',
    'category.other': 'Other',
    
    // Profile
    'profile.title': 'Profile',
    'profile.posts': 'Posts',
    'profile.votesReceived': 'Votes received',
    'profile.votesGiven': 'Votes given',
    'profile.ratio': 'Agreement rate',
    'profile.noPosts': 'No posts yet.',
    'profile.loading': 'Loading...',
    
    // Settings
    'settings.title': 'Account Settings',
    'settings.language': 'Language',
    'settings.languageDesc': 'Change interface language.',
    'settings.theme': 'Theme',
    'settings.themeDesc': 'Dark / Light mode.',
    'settings.avatar': 'Change photo',
    'settings.bio': 'Bio',
    'settings.gender': 'Gender',
    'settings.gender.none': 'Prefer not to say',
    'settings.gender.female': 'Female',
    'settings.gender.male': 'Male',
    'settings.gender.other': 'Other',
    'settings.username': 'Username',
    'settings.usernameChange': 'You can change it.',
    'settings.usernameWait': '{days} days later.',
    'settings.email': 'Email',
    'settings.password': 'Password',
    'settings.passwordMin': 'At least 6 characters.',
    'settings.loginRequired': 'You must log in to view settings.',
    
    // Auth
    'auth.login.title': 'Login',
    'auth.login.button': 'Login',
    'auth.login.loading': 'Logging in...',
    'auth.login.noAccount': 'Don\'t have an account?',
    'auth.register.title': 'Register',
    'auth.register.button': 'Register',
    'auth.register.loading': 'Registering...',
    'auth.register.hasAccount': 'Already have an account?',
    'auth.error.required': 'Please fill in all fields.',
    'auth.error.email': 'Please enter a valid email.',
    'auth.error.password': 'Must be at least 6 characters.',
    
    // Post
    'post.verdict.right': 'Public: Agrees',
    'post.verdict.wrong': 'Public: Disagrees',
    'post.verdict.undecided': 'Public is undecided',
    'post.report': 'Report',
    'post.reported': 'Reported',
    'post.reportReason': 'Why are you reporting?',
    'post.report.spam': 'Spam',
    'post.report.harassment': 'Harassment / abuse',
    'post.report.inappropriate': 'Inappropriate content',
    'post.report.other': 'Other',
    'post.noPosts': 'No posts yet, be the first.',
    'post.noComments': 'No comments yet, be the first.',
    'post.commentCount': 'comments',
    'post.anonymous': 'Anonymous',
    
    // Entry Gate
    'gate.tagline': 'Real stories · real votes',
    'gate.title': 'Am I Right?',
    'gate.description': 'How would you like to continue? You can participate without revealing your identity.',
    'gate.anonymous': 'Continue anonymously',
    'gate.login': 'Login',
    'gate.register': 'Register',
    
    // Errors
    'error.general': 'An error occurred: {error}',
    'error.notFound': 'Post not found.',
    'error.limitReached': 'You have reached your daily limit. Try again tomorrow.',
    'error.minChar': 'Must be at least {count} characters (currently {current}).',
  }
} as const

export function t(lang: Language, key: keyof typeof translations.tr, params?: Record<string, string | number>): string {
  let text = translations[lang]?.[key] ?? translations['en'][key] ?? key
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}