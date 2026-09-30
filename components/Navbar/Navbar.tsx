"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
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
import styles from "./Navbar.module.css";

type NavItem = {
  label: string;
  href: string;
  hasMenu?: boolean;
  Icon: typeof Home;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", Icon: Home },
  { label: "Plate Styles", href: "/plate-styles", hasMenu: true, Icon: CarFront },
  {
    label: "Delivery & Collection",
    href: "/delivery-collection",
    Icon: Truck,
  },
  { label: "Help", href: "/faqs", hasMenu: true, Icon: CircleHelp },
  { label: "About", href: "/about", Icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const itemsLabel = `${count} ${count === 1 ? "item" : "items"}`;

  const closeMenu = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  isActive(item.href) ? styles.navItemActive : ""
                }`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.label}
                {item.hasMenu ? (
                  <ChevronDown aria-hidden="true" strokeWidth={2.25} />
                ) : null}
              </Link>
            ))}
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

            <Link href="/build" className={styles.cta}>
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
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerItem} ${
                    isActive(item.href) ? styles.drawerItemActive : ""
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
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
              href="/build"
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
