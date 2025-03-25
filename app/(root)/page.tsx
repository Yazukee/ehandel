import ProductList from "@/components/ui/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const LatestProducts = await getLatestProducts();
  return (
    <>
      <ProductList data={LatestProducts} title="Latest trend" limit={4} />
    </>
  );
};

export default HomePage;
