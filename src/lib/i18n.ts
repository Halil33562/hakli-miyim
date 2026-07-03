// lib/i18n.ts
export type Language = 'tr' | 'en'

export const defaultLang: Language = 'tr'

export const translations = {
  tr: {
    // Genel
    'app.title': 'Haklı mıyım?',
    'app.subtitle': 'Olayını anlat, karar halkın olsun.',
    'app.tagline': 'Gerçek olaylar · gerçek oylar',
    
    // Butonlar
    'button.share': '+ Paylaşım yap',
    'button.vote.up': 'Haklısın',
    'button.vote.down': 'Haksızsın',
    'button.comment': 'Yorum Yap',
    'button.search': 'Ara',
    'button.save': 'Kaydet',
    'button.change': 'Değiştir',
    'button.login': 'Giriş yap',
    'button.logout': 'Çıkış yap',
    'button.register': 'Kayıt ol',
    'button.anonymous': 'Anonim devam et',
    
    // Form
    'form.email': 'Email',
    'form.password': 'Şifre',
    'form.username': 'Kullanıcı adı',
    'form.newPassword': 'Yeni şifre',
    'form.newEmail': 'yeni@eposta.com',
    'form.placeholder.search': 'Anahtar kelime ile ara...',
    'form.placeholder.title': 'Örn: Arkadaşımın hediyesini beğenmedim...',
    'form.placeholder.content': 'Başından sonuna kadar ne oldu anlat...',
    'form.placeholder.bio': 'Kendinden kısaca bahset...',
    'form.placeholder.comment': 'Yorumunu yaz...',
    
    // Tabs & Filters
    'tab.new': 'Yeni',
    'tab.mostDiscussed': 'En çok tartışılan',
    'tab.closeVotes': 'Yakın oylar',
    'filter.category': 'Kategori',
    'filter.all': 'Tümü',
    
    // Messages
    'msg.required': 'Lütfen tüm alanları doldur.',
    'msg.minChar': 'En az {count} karakter olmalı.',
    'msg.loginRequired': 'Bu işlemi yapmak için giriş yapmalısın.',
    'msg.saved': 'Kaydedildi.',
    'msg.error': 'Bir hata oluştu: {error}',
    'msg.success': 'Başarılı!',
    'msg.limitReached': 'Günlük limitine ulaştın. Yarın tekrar dene.',
    
    // Profile
    'profile.settings': 'Hesap ayarların',
    'profile.bio': 'Biyografi',
    'profile.gender': 'Cinsiyet',
    'profile.gender.none': 'Belirtmek istemiyorum',
    'profile.gender.female': 'Kadın',
    'profile.gender.male': 'Erkek',
    'profile.gender.other': 'Diğer',
    'profile.changeAvatar': 'Fotoğraf değiştir',
    'profile.username': 'Kullanıcı adı',
    'profile.email': 'E-posta',
    'profile.verdict.right': 'Toplum: Haklı buluyor',
    'profile.verdict.wrong': 'Toplum: Haksız buluyor',
    'profile.verdict.undecided': 'Toplum kararsız',
    
    // Stats
    'stats.posts': 'Paylaşım',
    'stats.votesReceived': 'Aldığı oy',
    'stats.votesGiven': 'Verdiği oy',
    'stats.ratio': 'Haklı bulunma oranı',
    'stats.none': '—',
    
    // Others
    'others.noPosts': 'Henüz paylaşım yok, ilkini sen yap.',
    'others.noComments': 'Henüz yorum yok, ilk sen yaz.',
    'others.postNotFound': 'Gönderi bulunamadı.',
    'others.report': 'Bildir',
    'others.reportReason': 'Neden bildiriyorsun?',
    'others.reported': 'Bildirildi',
    'others.daysLeft': '{days} gün sonra tekrar dene.',
    'others.commentCount': 'yorum',
    'others.currentPage': '/ {total}',
    'others.previous': '← Önceki',
    'others.next': 'Sonraki →',
    'others.back': 'Geri',
  },
  
  en: {
    // General
    'app.title': 'Am I Right?',
    'app.subtitle': 'Tell your story, let the public decide.',
    'app.tagline': 'Real stories · real votes',
    
    // Buttons
    'button.share': '+ Share',
    'button.vote.up': 'Right',
    'button.vote.down': 'Wrong',
    'button.comment': 'Comment',
    'button.search': 'Search',
    'button.save': 'Save',
    'button.change': 'Change',
    'button.login': 'Login',
    'button.logout': 'Logout',
    'button.register': 'Register',
    'button.anonymous': 'Continue anonymously',
    
    // Form
    'form.email': 'Email',
    'form.password': 'Password',
    'form.username': 'Username',
    'form.newPassword': 'New password',
    'form.newEmail': 'new@email.com',
    'form.placeholder.search': 'Search by keyword...',
    'form.placeholder.title': 'E.g. I didn\'t like my friend\'s gift...',
    'form.placeholder.content': 'Tell us what happened from start to finish...',
    'form.placeholder.bio': 'Tell us a bit about yourself...',
    'form.placeholder.comment': 'Write your comment...',
    
    // Tabs & Filters
    'tab.new': 'New',
    'tab.mostDiscussed': 'Most discussed',
    'tab.closeVotes': 'Close votes',
    'filter.category': 'Category',
    'filter.all': 'All',
    
    // Messages
    'msg.required': 'Please fill in all fields.',
    'msg.minChar': 'Must be at least {count} characters.',
    'msg.loginRequired': 'You must be logged in to do this.',
    'msg.saved': 'Saved.',
    'msg.error': 'An error occurred: {error}',
    'msg.success': 'Success!',
    'msg.limitReached': 'You have reached your daily limit. Try again tomorrow.',
    
    // Profile
    'profile.settings': 'Account settings',
    'profile.bio': 'Bio',
    'profile.gender': 'Gender',
    'profile.gender.none': 'Prefer not to say',
    'profile.gender.female': 'Female',
    'profile.gender.male': 'Male',
    'profile.gender.other': 'Other',
    'profile.changeAvatar': 'Change photo',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.verdict.right': 'Public: Agrees',
    'profile.verdict.wrong': 'Public: Disagrees',
    'profile.verdict.undecided': 'Public is undecided',
    
    // Stats
    'stats.posts': 'Posts',
    'stats.votesReceived': 'Votes received',
    'stats.votesGiven': 'Votes given',
    'stats.ratio': 'Agreement rate',
    'stats.none': '—',
    
    // Others
    'others.noPosts': 'No posts yet, be the first.',
    'others.noComments': 'No comments yet, be the first.',
    'others.postNotFound': 'Post not found.',
    'others.report': 'Report',
    'others.reportReason': 'Why are you reporting?',
    'others.reported': 'Reported',
    'others.daysLeft': 'Try again in {days} days.',
    'others.commentCount': 'comments',
    'others.currentPage': 'of {total}',
    'others.previous': '← Previous',
    'others.next': 'Next →',
    'others.back': 'Back',
  }
} as const

export function getTranslation(lang: Language, key: keyof typeof translations.tr): string {
  const translation = translations[lang]?.[key]
  if (!translation) {
    // fallback: try Turkish
    const fallback = translations['tr'][key]
    return fallback || key
  }
  return translation
}

export function t(lang: Language, key: keyof typeof translations.tr, params?: Record<string, string | number>): string {
  let text = getTranslation(lang, key)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v))
    })
  }
  return text
}