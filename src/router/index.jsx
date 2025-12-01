import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const Home = lazy(() => import("@/components/pages/Home"));
const ProductDetail = lazy(() => import("@/components/pages/ProductDetail"));
const Category = lazy(() => import("@/components/pages/Category"));
const Search = lazy(() => import("@/components/pages/Search"));
const Cart = lazy(() => import("@/components/pages/Cart"));
const Wishlist = lazy(() => import("@/components/pages/Wishlist"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = ({ text = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="animate-spin h-12 w-12 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
      <p className="text-secondary font-body">{text}</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback text="Loading StyleHub..." />}>
        <Home />
      </Suspense>
    ),
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<LoadingFallback text="Loading product..." />}>
        <ProductDetail />
      </Suspense>
    ),
  },
  {
    path: "category/:category",
    element: (
      <Suspense fallback={<LoadingFallback text="Loading category..." />}>
        <Category />
      </Suspense>
    ),
  },
  {
    path: "search",
    element: (
      <Suspense fallback={<LoadingFallback text="Searching..." />}>
        <Search />
      </Suspense>
    ),
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<LoadingFallback text="Loading cart..." />}>
        <Cart />
      </Suspense>
    ),
  },
  {
    path: "wishlist",
    element: (
      <Suspense fallback={<LoadingFallback text="Loading wishlist..." />}>
        <Wishlist />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes],
  },
];

export const router = createBrowserRouter(routes);