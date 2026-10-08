"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";
import {
  ArrowRight,
  CarFront,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Home,
  Info,
  Menu,
  RectangleHorizontal,
  Search,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { useCart } from "@/contexts/cart/CartProvider";
import { builderUrl } from "@/lib/builderLink";
import { PRODUCT_PAGE_LINKS, formatLinkOptions } from "@/lib/site";
import styles from "./Navbar.module.css";
import { StylesDrawerList, StylesPanel } from "./StylesMenu";

type NavItem = {
  label: string;
  href: string;
  hasMenu?: boolean;
  /** Opens the plate-styles menu instead of a plain link in the drawer */
  styles?: boolean;
  Icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Plate Styles", href: "/plate-styles", hasMenu: true, styles: true, Icon: CarFront },
  {
    label: "Delivery & Collection",
    href: "/delivery",
    Icon: Truck,
  },
  { label: "Help", href: "/faqs", hasMenu: true, Icon: CircleHelp },
  { label: "About", href: "/about", Icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  const stylesPanelId = useId();
  const stylesListId = useId();
  const [open, setOpen] = useState(false);
  // Desktop "Plate Styles" mega menu, and its collapsible twin in the drawer
  const [stylesOpen, setStylesOpen] = useState(false);
  const [drawerStyles, setDrawerStyles] = useState(false);
  const hoverTimer = useRef<number | undefined>(undefined);
  const stylesGroup = useRef<HTMLDivElement>(null);
  // Escape hands focus back to the trigger without reopening the menu
  const keepClosed = useRef(false);
  const { count } = useCart();
  const itemsLabel = `${count} ${count === 1 ? "item" : "items"}`;

  const closeMenu = useCallback(() => {
    setOpen(false);
    setDrawerStyles(false);
  }, []);
  const openMenu = useCallback(() => setOpen(true), []);

  // A new page closes every menu
  const [shownPath, setShownPath] = useState(pathname);
  if (pathname !== shownPath) {
    setShownPath(pathname);
    setOpen(false);
    setStylesOpen(false);
    setDrawerStyles(false);
  }

  // Hover intent: a short pause before opening (no flicker when the pointer
  // just passes over) and a grace period before closing (time to reach the panel)
  const hoverStyles = (next: boolean) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setStylesOpen(next), next ? 70 : 180);
  };
  const closeStyles = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    setStylesOpen(false);
  }, []);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const onStylesBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!stylesGroup.current?.contains(e.relatedTarget as Node | null)) closeStyles();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // On a product page (/4d-number-plates, /short-number-plates …) "Plate Styles"
  // is the current section, and "Build my plates" starts the builder on that
  // page's style or format
  const pageLink = PRODUCT_PAGE_LINKS[pathname];
  const pageStyle = !!pageLink;
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/plate-styles" && !!pageStyle);
  const buildHref = builderUrl({ style: pageLink?.style, ...formatLinkOptions(pageLink?.format) });
  // "page" for the page itself; "true" for its section (a style page under Plate Styles)
  const current = (href: string) =>
    !isActive(href) ? undefined : pageStyle && href === "/plate-styles" ? "true" : "page";

  return (
    <>
      <header className={styles.header}>
        <div className={styles.bar}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="ReplacementPlates.uk home"
          >
            <Image
              src="/logo-rp.webp"
              alt="ReplacementPlates.uk — DVLA Registered RNPS 75449"
              width={320}
              height={68}
              loading="eager"
              fetchPriority="high"
              className={styles.logoImg}
              sizes="(max-width: 900px) 250px, 320px"
            />
          </Link>

          <span className={styles.divider} aria-hidden="true" />

          <nav className={styles.nav} aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${
                    isActive(item.href) ? styles.navItemActive : ""
                  } ${item.styles && stylesOpen ? styles.navItemOpen : ""}`}
                  aria-current={current(item.href)}
                  aria-expanded={item.styles ? stylesOpen : undefined}
                  aria-controls={item.styles ? stylesPanelId : undefined}
                  onClick={item.styles ? closeStyles : undefined}
                >
                  {item.label}
                  {item.hasMenu ? (
                    <ChevronDown aria-hidden="true" strokeWidth={2.25} />
                  ) : null}
                </Link>
              );
              if (!item.styles) return link;
              return (
                <div
                  key={item.href}
                  ref={stylesGroup}
                  className={styles.navGroup}
                  onMouseEnter={() => hoverStyles(true)}
                  onMouseLeave={() => hoverStyles(false)}
                  onFocus={() => {
                    window.clearTimeout(hoverTimer.current);
                    if (keepClosed.current) {
                      keepClosed.current = false;
                      return;
                    }
                    setStylesOpen(true);
                  }}
                  onBlur={onStylesBlur}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape" || !stylesOpen) return;
                    closeStyles();
                    const trigger = stylesGroup.current?.querySelector<HTMLElement>("a");
                    if (trigger && trigger !== document.activeElement) {
                      keepClosed.current = true;
                      trigger.focus();
                    }
                  }}
                >
                  {link}
                  <StylesPanel
                    id={stylesPanelId}
                    open={stylesOpen}
                    pathname={pathname}
                    onNavigate={closeStyles}
                  />
                </div>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <div className={styles.desktopIcons}>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Search"
              >
                <Search aria-hidden="true" strokeWidth={2} />
              </button>
              <Link
                href="/cart"
                className={styles.iconBtn}
                aria-label={`Shopping cart, ${itemsLabel}`}
              >
                <ShoppingCart aria-hidden="true" strokeWidth={2} />
                <span className={styles.badge} aria-hidden="true" data-count={count}>
                  {count}
                </span>
              </Link>
            </div>

            <Link href={buildHref} className={styles.cta}>
              Build my plates →
            </Link>

            <button
              type="button"
              className={styles.menuBtn}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => (open ? closeMenu() : openMenu())}
            >
              {open ? (
                <X aria-hidden="true" strokeWidth={2} />
              ) : (
                <Menu aria-hidden="true" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.drawerRoot} ${open ? styles.drawerRootOpen : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close menu"
          tabIndex={open ? 0 : -1}
          onClick={closeMenu}
        />

        <aside
          id={menuId}
          className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className={styles.drawerHeader}>
            <Link
              href="/"
              className={styles.drawerLogo}
              aria-label="ReplacementPlates.uk home"
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
            >
              <Image
                src="/logo-rp.webp"
                alt="ReplacementPlates.uk — DVLA Registered RNPS 75449"
                width={280}
                height={59}
                loading="eager"
                className={styles.drawerLogoImg}
                sizes="220px"
              />
            </Link>
            <button
              type="button"
              className={styles.drawerClose}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
            >
              <X aria-hidden="true" strokeWidth={2.25} />
            </button>
          </div>

          <nav className={styles.drawerNav} aria-label="Mobile">
            {NAV_ITEMS.map((item) => {
              const Icon = item.Icon;
              const Chevron = item.hasMenu ? ChevronDown : ChevronRight;
              if (item.styles) {
                return (
                  <div key={item.href} className={styles.drawerGroup}>
                    <button
                      type="button"
                      className={`${styles.drawerItem} ${
                        isActive(item.href) ? styles.drawerItemActive : ""
                      }`}
                      aria-expanded={drawerStyles}
                      aria-controls={stylesListId}
                      tabIndex={open ? 0 : -1}
                      onClick={() => setDrawerStyles((v) => !v)}
                    >
                      <span className={styles.drawerItemLeft}>
                        <Icon
                          className={styles.drawerItemIcon}
                          aria-hidden="true"
                          strokeWidth={1.85}
                        />
                        <span>{item.label}</span>
                      </span>
                      <ChevronDown
                        className={`${styles.drawerChevron} ${
                          drawerStyles ? styles.drawerChevronOpen : ""
                        }`}
                        aria-hidden="true"
                        strokeWidth={2.1}
                      />
                    </button>
                    <StylesDrawerList
                      id={stylesListId}
                      open={open && drawerStyles}
                      pathname={pathname}
                      onNavigate={closeMenu}
                    />
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerItem} ${
                    isActive(item.href) ? styles.drawerItemActive : ""
                  }`}
                  aria-current={current(item.href)}
                  tabIndex={open ? 0 : -1}
                  onClick={closeMenu}
                >
                  <span className={styles.drawerItemLeft}>
                    <Icon
                      className={styles.drawerItemIcon}
                      aria-hidden="true"
                      strokeWidth={1.85}
                    />
                    <span>{item.label}</span>
                  </span>
                  <Chevron
                    className={styles.drawerChevron}
                    aria-hidden="true"
                    strokeWidth={2.1}
                  />
                </Link>
              );
            })}
          </nav>

          <div className={styles.drawerFooter}>
            <button
              type="button"
              className={styles.drawerItem}
              aria-label="Search"
              tabIndex={open ? 0 : -1}
            >
              <span className={styles.drawerItemLeft}>
                <Search
                  className={styles.drawerItemIcon}
                  aria-hidden="true"
                  strokeWidth={1.85}
                />
                <span>Search</span>
              </span>
              <ChevronRight
                className={styles.drawerChevron}
                aria-hidden="true"
                strokeWidth={2.1}
              />
            </button>

            <Link
              href="/cart"
              className={styles.drawerItem}
              aria-label={`My Basket, ${itemsLabel}`}
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
            >
              <span className={styles.drawerItemLeft}>
                <ShoppingCart
                  className={styles.drawerItemIcon}
                  aria-hidden="true"
                  strokeWidth={1.85}
                />
                <span>My Basket</span>
                <span className={styles.drawerBadge} aria-hidden="true">
                  {count}
                </span>
              </span>
              <ChevronRight
                className={styles.drawerChevron}
                aria-hidden="true"
                strokeWidth={2.1}
              />
            </Link>

            <Link
              href={buildHref}
              className={styles.drawerCta}
              tabIndex={open ? 0 : -1}
              onClick={closeMenu}
            >
              <RectangleHorizontal aria-hidden="true" strokeWidth={1.85} />
              <span>Build my plates</span>
              <ArrowRight aria-hidden="true" strokeWidth={2.1} />
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
