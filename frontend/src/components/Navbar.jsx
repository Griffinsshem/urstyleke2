"use client";

import { useEffect, useState, useRef, useId, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAuthenticated, getUser, signOut } from "@/lib/auth";
import {
  FiUser, FiChevronDown, FiLogOut,
  FiMenu, FiX, FiGrid, FiBarChart2, FiShoppingBag,
} from "react-icons/fi";
import { getCartCount } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/men",        label: "Men"        },
  { href: "/women",      label: "Women"      },
  { href: "/collection", label: "Collection" },
];

const USER_MENU_LINKS = [
  { href: "/profile",   label: "Profile",   Icon: FiUser      },
  { href: "/dashboard", label: "Dashboard", Icon: FiBarChart2 },
];

const safeDisplay = (str, max = 24) => {
  if (typeof str !== "string") return "";
  return str.replace(/[<>"']/g, "").trim().slice(0, max);
};

const getInitial = (user) => {
  const name  = safeDisplay(user?.name  ?? "", 1).toUpperCase();
  const email = safeDisplay(user?.email ?? "", 1).toUpperCase();
  return name || email || "U";
};

export default function Navbar() {
  const pathname      = usePathname();
  const dropdownId    = useId();

  const [loggedIn,     setLoggedIn]     = useState(false);
  const [user,         setUser]         = useState(null);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [cartCount,    setCartCount]    = useState(0);

  const dropdownRef = useRef(null);
  const menuBtnRef  = useRef(null);

  const syncAuth = useCallback(() => {
    const auth = isAuthenticated();
    setLoggedIn(auth);
    setUser(auth ? getUser() : null);
  }, []);

  useEffect(() => {
    syncAuth();
    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage",      syncAuth);
    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage",      syncAuth);
    };
  }, [syncAuth]);

  useEffect(() => {
    const syncCart = () => {
      setCartCount(getCartCount());
    };
    syncCart();
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage",      syncCart);
    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage",      syncCart);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onPointer = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") { setDropdownOpen(false); }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown",     onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown",     onKey);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const handleLogout = useCallback(() => {
    signOut();
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const displayEmail = safeDisplay(user?.email ?? "", 22);
  const initial      = getInitial(user);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`
          fixed top-0 left-0 right-0 z-50
          bg-[#080808] border-b
          transition-all duration-300
          ${scrolled
            ? "border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
            : "border-white/[0.05]"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">

            <Link
              href="/"
              aria-label="UrStyleKe — home"
              className="
                text-white font-bold tracking-[0.22em] text-sm
                hover:text-white/70 transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-white/40 rounded
              "
            >
              URSTYLEKE
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`
                    px-4 py-2 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase
                    transition-all duration-150
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                    ${pathname === href
                      ? "text-white bg-white/[0.08]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                    }
                  `}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/checkout"
                arial-label={`Shopping cart with ${cartCount} items`}
                className="
                  relative flex items-center justify-center
                  w-10 h-10 rounded-lg
                  border border-white/[0.1]
                  text-white/60
                  hover:text-white hover:border-white/20 hover:bg-white/[0.04]
                  transition-all duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                  focus-visible:ring-white/30
                "
              >
                <FiShoppingBag size={18} />
                {cartCount > 0 && (
                  <span
                    className="
                      absolute -top-2 -right-2
                      min-w-[18px] h-[18px]
                      px-1 rounded-full
                      bg-white text-black
                      text-[10px] font-bold
                      flex items-center justify-center
                    "
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              {!loggedIn ? (
                <>
                  <Link
                    href="/login"
                    className="
                      px-4 py-2 rounded-lg text-xs font-semibold tracking-[0.12em] uppercase
                      text-white/60 border border-white/[0.1]
                      hover:text-white hover:border-white/25 hover:bg-white/[0.04]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                    "
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="
                      px-4 py-2 rounded-lg text-xs font-semibold tracking-[0.12em] uppercase
                      bg-white text-black
                      hover:bg-white/88 active:scale-[0.98]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-white/60 focus-visible:ring-offset-2
                      focus-visible:ring-offset-[#080808]
                    "
                  >
                    Register
                  </Link>
                </>
              ) : (
                /* ── User dropdown ────────────────────────────────── */
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    aria-controls={dropdownId}
                    className="
                      flex items-center gap-2.5
                      px-3 py-1.5 rounded-lg
                      border border-white/[0.1]
                      hover:border-white/20 hover:bg-white/[0.04]
                      transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                    "
                  >
                    <span
                      aria-hidden
                      className="
                        flex items-center justify-center
                        w-6 h-6 rounded-full
                        bg-white/10 text-white
                        text-[10px] font-bold
                      "
                    >
                      {initial}
                    </span>
                    <span className="text-xs text-white/70 max-w-[130px] truncate font-medium">
                      {displayEmail}
                    </span>
                    <FiChevronDown
                      aria-hidden
                      size={13}
                      className={`text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <div
                      id={dropdownId}
                      role="menu"
                      aria-label="Account menu"
                      className="
                        absolute right-0 mt-2 w-48
                        bg-[#151515] border border-white/[0.08]
                        rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.7)]
                        overflow-hidden
                        animate-in fade-in slide-in-from-top-1 duration-150
                      "
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-0.5">
                          Signed in as
                        </p>
                        <p className="text-xs text-white/70 truncate font-medium">
                          {displayEmail}
                        </p>
                      </div>

                      {USER_MENU_LINKS.map(({ href, label, Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className="
                            flex items-center gap-3
                            px-4 py-2.5 text-xs text-white/60
                            hover:text-white hover:bg-white/[0.05]
                            transition-colors duration-100
                            focus-visible:outline-none focus-visible:bg-white/[0.07]
                          "
                        >
                          <Icon size={14} aria-hidden />
                          {label}
                        </Link>
                      ))}

                      {/* Divider */}
                      <div className="border-t border-white/[0.06] mx-3" />

                      <Link
                        href="/checkout"
                        onclick={closeMenu}
                        className="
                          flex items-center justify-between
                          px-4 py-3 rounded-xl
                          text-xs font-semibold tracking-[0.12em] uppercase
                          text-white/60
                          hover:text-white hover:bg-white/[0.05]
                          transition-colors duration-150
                        "
                      >
                        <div className="flex items-center gap-3">
                          <FiShoppingCart size={14} aria-hidden />
                          Cart
                        </div>

                        {cartCount > 0 && (
                          <span
                            className="
                              min-w-[20px] h-[20px]
                              px-1 rounded-full
                              bg-white text-black
                              text-[10px] font-bold
                              flex items-center justify-center
                            "
                          >
                            {cartCount}
                          </span>
                        )}
                      </Link>

                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="
                          w-full flex items-center gap-3
                          px-4 py-2.5 text-xs text-red-400/80
                          hover:text-red-400 hover:bg-red-500/[0.07]
                          transition-colors duration-100
                          focus-visible:outline-none focus-visible:bg-red-500/[0.1]
                        "
                      >
                        <FiLogOut size={14} aria-hidden />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Mobile hamburger ─────────────────────────────────── */}
            <button
              ref={menuBtnRef}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="
                md:hidden flex items-center justify-center
                w-9 h-9 rounded-lg
                text-white/60 hover:text-white hover:bg-white/[0.06]
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              "
            >
              {menuOpen
                ? <FiX    size={18} aria-hidden />
                : <FiMenu size={18} aria-hidden />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu panel ──────────────────────────────────────── */}
        <div
          id="mobile-menu"
          aria-hidden={!menuOpen}
          className={`
            md:hidden border-t border-white/[0.06]
            bg-[#0d0d0d]
            transition-all duration-200 ease-in-out overflow-hidden
            ${menuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-5 py-5 flex flex-col gap-1">
            {/* Nav links */}
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                aria-current={pathname === href ? "page" : undefined}
                className={`
                  px-4 py-3 rounded-xl text-xs font-semibold tracking-[0.15em] uppercase
                  transition-colors duration-150
                  ${pathname === href
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                  }
                `}
              >
                {label}
              </Link>
            ))}

            <div className="border-t border-white/[0.06] my-2" />

            {!loggedIn ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="
                    px-4 py-3 rounded-xl text-xs font-semibold tracking-[0.12em] uppercase
                    text-center text-white/60 border border-white/[0.1]
                    hover:text-white hover:border-white/25 hover:bg-white/[0.04]
                    transition-all duration-150
                  "
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="
                    px-4 py-3 rounded-xl text-xs font-semibold tracking-[0.12em] uppercase
                    text-center bg-white text-black
                    hover:bg-white/90 active:scale-[0.99]
                    transition-all duration-150
                  "
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile user info */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.04] mb-1">
                  <span
                    aria-hidden
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white text-xs font-bold shrink-0"
                  >
                    {initial}
                  </span>
                  <span className="text-xs text-white/60 truncate">{displayEmail}</span>
                </div>

                {USER_MENU_LINKS.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className="
                      flex items-center gap-3
                      px-4 py-3 rounded-xl
                      text-xs text-white/50
                      hover:text-white hover:bg-white/[0.05]
                      transition-colors duration-150
                    "
                  >
                    <Icon size={14} aria-hidden />
                    {label}
                  </Link>
                ))}

                <button
                  onClick={handleLogout}
                  className="
                    flex items-center gap-3
                    px-4 py-3 rounded-xl
                    text-xs text-red-400/70
                    hover:text-red-400 hover:bg-red-500/[0.07]
                    transition-colors duration-150
                    text-left
                  "
                >
                  <FiLogOut size={14} aria-hidden />
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile backdrop ────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          aria-hidden
          onClick={closeMenu}
          className="
            fixed inset-0 z-40 md:hidden
            bg-black/60 backdrop-blur-sm
          "
        />
      )}
    </>
  );
}
