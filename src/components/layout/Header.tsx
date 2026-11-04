"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import {
  Search,
  Menu,
  X,
  Heart,
  GitCompareArrows,
  Globe,
  User,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "@/components/auth/AuthModal";

const navLinks = [
  { labelKey: "header.nav.home", href: "/" },
  { labelKey: "header.nav.tools", href: "/tools" },
  { labelKey: "header.nav.categories", href: "/categories" },
  { labelKey: "header.nav.blog", href: "/blog" },
  { labelKey: "header.nav.daily", href: "/daily" },
  { labelKey: "header.nav.compare", href: "/compare" },
  { labelKey: "header.nav.submit_tool", href: "/submit" },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { t, locale, setLocale } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0a0a0b]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-base font-semibold uppercase tracking-[0.3em] text-white">
            AI Design Hub
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Favorites */}
          <Link
            href="/favorites"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-red-400 dark:text-gray-400 dark:hover:text-red-400 light:text-gray-600 light:hover:text-red-500"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
            aria-label="Compare tools"
          >
            <GitCompareArrows className="h-5 w-5" />
          </Link>

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }
                  }}
                  placeholder={t("header.search_placeholder") || "Search tools..."}
                  autoFocus
                  className="h-9 w-48 rounded-full border border-white/10 bg-white/[0.05] pl-9 pr-3 text-sm text-white placeholder-white/35 outline-none focus:border-white/30 transition-all sm:w-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-400 hover:text-white"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Theme Toggle removed — cinematic dark-first design (VESPER style) */}

          {/* Language Toggle */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex h-9 items-center gap-1.5 rounded-lg px-1.5 sm:px-2.5 text-xs font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900"
              title={t("header.language.switch")}
              aria-label={t("header.language.switch")}
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{t(`header.language.${locale}`) || locale.toUpperCase()}</span>
              <ChevronDown className="hidden sm:block h-3 w-3" />
            </button>
            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-fit min-w-[140px] rounded-lg border border-dark-700 bg-dark-800 shadow-xl py-1">
                  {(["zh", "en", "ja", "ko"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLocale(lang);
                        setLangMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors whitespace-nowrap",
                        locale === lang
                          ? "text-primary-400 bg-primary-500/10"
                          : "text-dark-300 hover:text-white hover:bg-dark-700"
                      )}
                    >
                      {t(`header.language.${lang}`) || lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ====== USER MENU (DESKTOP) ====== */}
          <div className="relative hidden md:block">
            {loading ? (
              <div className="flex h-9 w-9 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-dark-700 bg-dark-800 py-2 shadow-xl">
                      {/* User Info */}
                      <div className="border-b border-dark-700 px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      {/* Menu Items */}
                      <button
                        onClick={() => {
                          router.push("/profile");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {t("nav.profile") || "Profile"}
                      </button>
                      <button
                        onClick={() => {
                          router.push("/favorites");
                          setUserMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <Heart className="h-4 w-4" />
                        {t("nav.favorites") || "Favorites"}
                      </button>
                      <div className="border-t border-dark-700 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("nav.logout") || "Logout"}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white md:flex"
              >
                <User className="h-4 w-4" />
                {t("auth.login") || "Login"}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-white/10",
          mobileMenuOpen ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0 border-t-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white rounded-lg hover:bg-white/5"
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {/* Mobile Language Switcher */}
          <div className="border-t border-white/10 pt-3 mt-2">
            <p className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("header.language.switch")}
            </p>
            <div className="grid grid-cols-2 gap-1 px-2">
              {(["zh", "en", "ja", "ko"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLocale(lang);
                    setMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2 text-sm rounded-lg transition-colors text-left",
                    locale === lang
                      ? "text-primary-400 bg-primary-500/10 font-medium"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {t(`header.language.${lang}`) || lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="border-t border-white/10 pt-3 mt-2">
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-white">
                  {user.name || user.email}
                </p>
                </div>
                <button
                  onClick={() => {
                    router.push("/profile");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-300 transition-colors hover:text-white rounded-lg hover:bg-white/5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.profile") || "Profile"}
                </button>
                <button
                  onClick={() => {
                    router.push("/favorites");
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-gray-300 transition-colors hover:text-white rounded-lg hover:bg-white/5"
                >
                  <Heart className="h-4 w-4" />
                  {t("nav.favorites") || "Favorites"}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  {t("nav.logout") || "Logout"}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white rounded-lg hover:bg-white/5"
              >
                <User className="h-4 w-4" />
                {t("auth.login") || "Login / Register"}
              </button>
            )}
          </div>
        </nav>
      </div>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onSuccess={() => {
          setAuthModalOpen(false);
        }}
      />
    </header>
  );
}
