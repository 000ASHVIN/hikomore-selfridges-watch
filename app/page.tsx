"use client";

import Filter from "@/components/filter/Filter";
import FilterDialog from "@/components/filter/FilterDialog";
import Sort from "@/components/filter/Sort";
import Footer from "@/components/footer/Footer";
import NavBar from "@/components/header/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { data } from '@/resources/ImageData'
import { API_URL } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface Project {
  id: string;
  image: string;
  name: string;
  slug: string;
  selfridges_rrp: number;
  brand: Brand;
  description: HTMLCollection;
}

interface Brand {
  id: string;
  name: string;
}

interface Attributes {
  name: string;
  slug: string;
  values: string[];
}

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<Project[]>([]);
  const [attributes, setAttributes] = useState<Attributes[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentProducts, setCurrentProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [disabledShowMoreButton, setDisabledShowMoreButton] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string>('');
  const [sortFilters, setSortFilters] = useState<string>('');
  const [checkedCheckboxes, setCheckedCheckboxes] = useState<{ [key: string]: boolean }>({});
  const [currentPriceRangeValue, setCurrentPriceRangeValue] = useState<[number, number]>([1, 99500]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (pageNumber = 1, filters: string = '') => {
    try {
      setLoading(true);
      const filterQuery = filters ? filters : "";
      const response = await fetch(`${API_URL}/api/products/selfridges?page=${pageNumber}${filterQuery}`);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        if (pageNumber === 1) {
          setProducts(result.data.data);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...result.data.data]);
        }
        setAttributes(result.attributes);
        setBrands(result.brands);
        setTotalProducts(result.data.total);
        setLastPage(result.data.last_page);
        setCurrentProducts(result.data.per_page);
        setDisabledShowMoreButton(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const showMoreProducts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setDisabledShowMoreButton(true);
    fetchProducts(nextPage);
  };

  const handleFilterChange = (filter: string, checkedItems: { [key: string]: boolean }, priceRangeValue: [number, number]) => {
    const updatedFilter = filter + sortFilters;
    setSelectedFilters(filter);
    setProducts([]);
    setPage(1);
    fetchProducts(1, updatedFilter);
    setCheckedCheckboxes(checkedItems);
    setCurrentPriceRangeValue(priceRangeValue);
  };

  const handleSortChange = (sort: string) => {
    const updatedSort = `&sortby=` + sort;
    setSortFilters(updatedSort);

    const updatedFilter = selectedFilters + updatedSort;
    // setSelectedFilters(filter);
    setProducts([]);
    setPage(1);
    fetchProducts(1, updatedFilter);
  };

  return (
    <>
      <NavBar />

      <div className="container mx-auto xl:pb-[75px] max-w-[1310px] mt-6 p-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="md:max-w-[20%]">
            <h2 className="font-bold text-[32px]">Vintage Watches</h2>
            <p className="mb-4 text-[14px]">
              Explore an exclusive collection of vintage watches, meticulously
              curated to celebrate iconic craftsmanship and timeless style. From
              classic designs to rare finds, our collection offers something for
              every watch enthusiast. Speak with our in- store staff to view the
              full range and find your perfect vintage timepiece.
            </p>

            <div className="hidden md:block">
              <Filter attributes={attributes} brands={brands} checkedCheckboxes={checkedCheckboxes} currentPriceRangeValue={currentPriceRangeValue} onFilterChange={handleFilterChange} />
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="f12 sortbox filterbox">
                <div className="md:hidden">
                  <FilterDialog attributes={attributes} brands={brands} checkedCheckboxes={checkedCheckboxes} currentPriceRangeValue={currentPriceRangeValue} onFilterChange={handleFilterChange} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block">{totalProducts} results</span>
                <Sort onSortChange={handleSortChange}/>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-2">
              {products && products.map((product) => (
                <Link href={product.slug} key={product.id}>
                  <div
                    className="watch-item flex flex-col justify-between h-full"
                    key={"section-"+product.id}
                  >
                    <div>
                      <div className="image-container hero-image bg-darkgray h-[160px] sm:min-h-[200px] sm:max-h-[200px] overflow-hidden flex items-center">
                        {product.image ? (
                          <Image
                            src={API_URL + "/" + product.image}
                            alt={ product.name }
                            width={640}
                            height={427}
                            className="w-full h-auto zoom-image"
                          />
                        ) : (
                          <Image
                            src="/watch/admin-main-logo-wthouttxt.png"
                            alt={ product.name }
                            width={640}
                            height={427}
                            className="w-full h-auto zoom-image"
                          />
                        )}
                      </div>
                      <div className="details p-2 pb-0">
                        <h3 className="text-[15px] font-bold">{ product.brand?.name }</h3>
                        <p className="text-[14px] text-gray-400 mt-1">
                          { product.name }
                        </p>
                      </div>
                    </div>
                    <div className="details p-2">
                      <p className="text-[15px] font-bold mt-1">£{ product.selfridges_rrp?.toLocaleString() }</p>
                      <p className="text-[15px] font-bold text-gray-500 mt-1">
                        EXCLUSIVE TO SELFRIDGES
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {products.length == 0 && loading && data.map((product) => (
                <div className="flex flex-col space-y-3" key={product}>
                  <Skeleton className="min-h-[200px] max-h-[200px] rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}

            </div>

            {products.length == 0 && !loading && (
              <div className="">
                <p className="cls-no-result-based text-center">No result based on your filters</p>
              </div>
            )}

            {products.length > 0 && !loading && (
              <hr className="border-t-2 border-color-gray my-6" />
            )}

            <div className="text-center pt-3">
              <p className="mb-2">{ currentProducts * page <= totalProducts ? currentProducts * page : totalProducts } / { totalProducts } results</p>
              {page < lastPage && (
                <button onClick={showMoreProducts} className="bg-darkblack text-white py-2 px-6" disabled={disabledShowMoreButton}>
                  Show more results
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
