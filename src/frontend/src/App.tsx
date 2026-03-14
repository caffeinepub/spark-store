import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import CartDrawer from "./components/CartDrawer";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";

function RootLayout() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <Outlet />
    </CartProvider>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: Shop,
  validateSearch: (search: Record<string, unknown>) => ({
    category: search.category as string | undefined,
  }),
});

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$id",
  component: ProductDetail,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  shopRoute,
  productRoute,
  checkoutRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
