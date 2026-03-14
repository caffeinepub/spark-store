import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "./ui/button";

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const { identity, login, clear } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-black tracking-wider"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          <span className="text-white">SPARK</span>
          <span className="neon-text"> STORE</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/shop"
            search={{ category: undefined }}
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            data-ocid="nav.shop_link"
          >
            Shop
          </Link>
          <Link
            to="/shop"
            search={{ category: "tshirt" }}
            className="text-sm font-medium hover:text-purple-400 transition-colors"
          >
            Tees
          </Link>
          <Link
            to="/shop"
            search={{ category: "hoodie" }}
            className="text-sm font-medium hover:text-purple-400 transition-colors"
          >
            Hoodies
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="nav.cart_button"
            onClick={() => setIsOpen(true)}
            className="relative p-2 hover:text-purple-400 transition-colors"
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/admin" })}
                data-ocid="nav.admin_link"
                className="hidden md:flex"
              >
                <User size={16} className="mr-1" /> Admin
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clear}
                className="hidden md:flex text-xs border-border"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={login}
              data-ocid="nav.login_button"
              className="hidden md:flex bg-purple-600 hover:bg-purple-700 text-white"
            >
              Login
            </Button>
          )}

          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background py-4 px-4 flex flex-col gap-4">
          <Link
            to="/shop"
            search={{ category: undefined }}
            onClick={() => setMenuOpen(false)}
            className="font-medium hover:text-purple-400"
          >
            Shop All
          </Link>
          <Link
            to="/shop"
            search={{ category: "tshirt" }}
            onClick={() => setMenuOpen(false)}
            className="font-medium hover:text-purple-400"
          >
            Tees
          </Link>
          <Link
            to="/shop"
            search={{ category: "hoodie" }}
            onClick={() => setMenuOpen(false)}
            className="font-medium hover:text-purple-400"
          >
            Hoodies
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="font-medium hover:text-purple-400"
              >
                Admin
              </Link>
              <button
                type="button"
                onClick={clear}
                className="text-left text-sm text-muted-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={login}
              className="w-fit bg-purple-600 hover:bg-purple-700 text-white"
            >
              Login
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
