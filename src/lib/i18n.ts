/*
 * English / Indonesian site text.
 *
 * Pages are built ahead of time, so every page carries both languages and CSS
 * shows one: <html data-lang="id"> hides the English and shows the Indonesian
 * (see globals.css). A tiny script in <head> sets data-lang from the visitor's
 * saved choice before the page paints, so there is no flash of English.
 * Components use <T k="..."/> or <Bi en={...} id={...}/> from components/Lang.
 */

export type Lang = "en" | "id";

export const LANG_STORAGE_KEY = "lang";

export const LANG_INIT_SCRIPT = `try{if(localStorage.getItem("${LANG_STORAGE_KEY}")==="id"){var d=document.documentElement;d.dataset.lang="id";d.lang="id"}}catch(e){}`;

const en = {
  // Navigation and footer
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.projects": "Projects",
  "nav.blog": "Blog",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  "lang.switchTo": "Baca dalam Bahasa Indonesia",
  "theme.toLight": "Switch to light mode",
  "theme.toDark": "Switch to dark mode",

  // Home
  "home.hi": "Hi, I'm",
  "home.tagline": "Machine learning, fraud detection and quant. I also write about the mathematics behind them.",
  "home.at": "at",
  "home.readBlog": "Read the blog",
  "home.seeProjects": "See projects",
  "home.aboutMe": "About me",
  "home.latestWriting": "Latest writing",
  "home.allPosts": "All posts",
  "home.selectedProjects": "Selected projects",
  "home.allProjects": "All projects",

  // Blog
  "blog.title": "Blog",
  "blog.intro": "Mathematics, statistics and machine learning, explained casually.",
  "blog.noPosts": "No posts yet.",
  "blog.minRead": "min read",
  "blog.view": "view",
  "blog.views": "views",
  "blog.allPosts": "All posts",
  "blog.notTranslated": "This post isn't available in Indonesian yet, so here it is in English.",

  // Projects
  "projects.title": "Projects",
  "projects.intro": "Data science, machine learning, software engineering and quant projects.",
  "projects.all": "All projects",
  "projects.interactive": "Interactive",
  "projects.tryIt": "Try it",
  "projects.demo": "Demo",
  "projects.code": "Code",
  "projects.paper": "Paper",

  // Experience
  "experience.title": "Experience",
  "experience.intro": "Where I've worked and studied.",
  "experience.industry": "Industry",
  "experience.academia": "Academia",

  // Comments
  "comments.title": "Comments",
  "comments.commentingAs": "Commenting as",
  "comments.signOut": "Sign out",
  "comments.signIn": "Sign in with GitHub or Google",
  "comments.signInRest": "to join the discussion. Only your name and profile picture are shown.",
  "comments.none": "No comments yet.",
  "comments.reply": "Reply",
  "comments.cancel": "Cancel",
  "comments.delete": "Delete",
  "comments.hide": "Hide",
  "comments.author": "Author",
  "comments.post": "Post comment",
  "comments.postReply": "Post reply",
  "comments.posting": "Posting…",
  "comments.placeholder": "Write a comment…",
  "comments.replyPlaceholder": "Write a reply…",
  "comments.replyTo": "Reply to",
  "comments.comment": "Comment",
  "comments.confirmReply": "Delete this reply? This cannot be undone.",
  "comments.confirmComment": "Delete this comment and its replies? This cannot be undone.",

  // Sign-in page
  "login.title": "Sign in",
  "login.intro": "Sign in to comment on posts. Only your name and profile picture are shown.",
  "login.github": "Continue with GitHub",
  "login.google": "Continue with Google",
  "login.redirecting": "Redirecting…",
  "login.error": "Sign-in did not complete. Please try again.",

  // 404
  "notFound.title": "This page could not be found.",
  "notFound.body": "It may have moved, or the link may be mistyped.",
  "notFound.home": "Back to home",

  // Demos
  "demo.tryIt": "Try it",
} as const;

export type MessageKey = keyof typeof en;

const id: Record<MessageKey, string> = {
  "nav.about": "Tentang",
  "nav.experience": "Pengalaman",
  "nav.projects": "Proyek",
  "nav.blog": "Blog",
  "nav.openMenu": "Buka menu",
  "nav.closeMenu": "Tutup menu",
  "lang.switchTo": "Read in English",
  "theme.toLight": "Ganti ke mode terang",
  "theme.toDark": "Ganti ke mode gelap",

  "home.hi": "Halo, saya",
  "home.tagline": "Machine learning, deteksi fraud, dan kuantitatif. Saya juga menulis tentang matematika di baliknya.",
  "home.at": "di",
  "home.readBlog": "Baca blog",
  "home.seeProjects": "Lihat proyek",
  "home.aboutMe": "Tentang saya",
  "home.latestWriting": "Tulisan terbaru",
  "home.allPosts": "Semua tulisan",
  "home.selectedProjects": "Proyek pilihan",
  "home.allProjects": "Semua proyek",

  "blog.title": "Blog",
  "blog.intro": "Matematika, statistika, dan machine learning, dijelaskan dengan santai.",
  "blog.noPosts": "Belum ada tulisan.",
  "blog.minRead": "menit baca",
  "blog.view": "kali dilihat",
  "blog.views": "kali dilihat",
  "blog.allPosts": "Semua tulisan",
  "blog.notTranslated": "Tulisan ini belum tersedia dalam Bahasa Indonesia, jadi ditampilkan dalam bahasa Inggris.",

  "projects.title": "Proyek",
  "projects.intro": "Proyek data science, machine learning, rekayasa perangkat lunak, dan kuantitatif.",
  "projects.all": "Semua proyek",
  "projects.interactive": "Interaktif",
  "projects.tryIt": "Coba",
  "projects.demo": "Demo",
  "projects.code": "Kode",
  "projects.paper": "Makalah",

  "experience.title": "Pengalaman",
  "experience.intro": "Tempat saya bekerja dan belajar.",
  "experience.industry": "Industri",
  "experience.academia": "Akademik",

  "comments.title": "Komentar",
  "comments.commentingAs": "Berkomentar sebagai",
  "comments.signOut": "Keluar",
  "comments.signIn": "Masuk dengan GitHub atau Google",
  "comments.signInRest": "untuk ikut berdiskusi. Hanya nama dan foto profil Anda yang ditampilkan.",
  "comments.none": "Belum ada komentar.",
  "comments.reply": "Balas",
  "comments.cancel": "Batal",
  "comments.delete": "Hapus",
  "comments.hide": "Sembunyikan",
  "comments.author": "Penulis",
  "comments.post": "Kirim komentar",
  "comments.postReply": "Kirim balasan",
  "comments.posting": "Mengirim…",
  "comments.placeholder": "Tulis komentar…",
  "comments.replyPlaceholder": "Tulis balasan…",
  "comments.replyTo": "Balas",
  "comments.comment": "Komentar",
  "comments.confirmReply": "Hapus balasan ini? Tindakan ini tidak bisa dibatalkan.",
  "comments.confirmComment": "Hapus komentar ini beserta balasannya? Tindakan ini tidak bisa dibatalkan.",

  "login.title": "Masuk",
  "login.intro": "Masuk untuk berkomentar. Hanya nama dan foto profil Anda yang ditampilkan.",
  "login.github": "Lanjutkan dengan GitHub",
  "login.google": "Lanjutkan dengan Google",
  "login.redirecting": "Mengalihkan…",
  "login.error": "Proses masuk tidak selesai. Silakan coba lagi.",

  "notFound.title": "Halaman ini tidak ditemukan.",
  "notFound.body": "Mungkin sudah dipindahkan, atau tautannya salah ketik.",
  "notFound.home": "Kembali ke beranda",

  "demo.tryIt": "Coba",
};

export const MESSAGES: Record<Lang, Record<MessageKey, string>> = { en, id };

export function t(lang: Lang, key: MessageKey): string {
  return MESSAGES[lang][key];
}
