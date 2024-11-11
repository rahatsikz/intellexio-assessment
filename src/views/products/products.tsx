"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { ProductModal } from "@/views/products/productModal/productModal";
import { BackToHome } from "@/components/backToHome/backToHome";
import { ProductList } from "@/views/products/productList/productList";
import { PaginationControls } from "@/views/products/paginationControls/paginationControls";
import { usePagination } from "@/hooks/usePagination";
import { PRODUCTS_DATA } from "@/data/productsData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Products: React.FC = () => {
  // hooks
  const pathname = usePathname();
  const router = useRouter();
  const query = useSearchParams();

  // get product id from url
  const productId = query.get("product-id");
  // get product from data
  const initialProduct = PRODUCTS_DATA.find((p) => p.id === productId) ?? null;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialProduct
  );

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedProducts,
    handlePageChange,
  } = usePagination({ items: PRODUCTS_DATA, itemsPerPage: 5 });

  const handleOpenModal = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      // add product id to url
      router.push(`${pathname}?product-id=${product.id}`);
    },

    [pathname, router]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
    // remove product id from url
    router.replace(pathname);
  }, [pathname, router]);

  // reset selected product when initial product changes
  useEffect(() => {
    setSelectedProduct(initialProduct);
  }, [initialProduct]);

  return (
    <div>
      <BackToHome />
      <ProductList products={paginatedProducts} onOpenModal={handleOpenModal} />
      <div className='h-4' />
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleCloseModal} />
      )}
    </div>
  );
};
