"use client";

import BackButton from "@/components/header/BackButton";
import NavBar from "@/components/header/Navbar";
import React, { useEffect, useState, use } from "react";
import Footer from "@/components/footer/Footer";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import { API_URL } from "@/lib/constants";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { sub_images } from "@/resources/ImageData";

interface Project {
  id: string;
  image: string;
  name: string;
  slug: string;
  selfridges_rrp: number;
  brand: Brand;
  new_product_images: string[];
  description: string;
}

interface Brand {
  id: string;
  name: string;
}

interface Attributes {
  name: string;
  attribute: { name: string };
  value: string;
  is_warranty: boolean;
  warranty_date: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function Detail({ params }: PageProps) {
  const { slug } = use(params);

  const [loading, setLoading] = useState<boolean>(true);
  const [product, setProducts] = useState<Project>();
  const [attributes, setAttributes] = useState<Attributes[]>([]);

  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#hero-image, #sub-images',
      children: 'a',
      secondaryZoomLevel: 2,
      zoomAnimationDuration: 500,
      pswpModule: () => import('photoswipe'),
    });
    lightbox.init();

    fetchProducts();
    return () => {
      lightbox.destroy();
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products/selfridges/${slug}`);
      const result = await response.json();
      console.log(result);
      if (result.success) {
        result.data.new_product_images = getImagesArray(result.data.new_product_images)
        setProducts(result.data);
        setAttributes(result.attributes);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const getImagesArray = (images: string[] | Record<string, string> | null | undefined): string[] => {
    if (Array.isArray(images)) return images; // Already an array, return as is
    if (typeof images === "object" && images !== null) return Object.values(images); // Convert object to array
    return []; // Default to an empty array
  };

  return (
    <>
      <NavBar />

      <div className="container mx-auto xl:pb-[75px] max-w-[1310px] p-4">
        <BackButton />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
          <div className="hero-image pswp-gallery" id="hero-image"> 
            {product && !loading ? (
              <div className="h-full bg-darkgray flex justify-center items-center">
              <a
                href={ API_URL + "/" + product?.image }
                data-pswp-width={640}
                data-pswp-height={427}
                target="_blank"
                rel="noreferrer"
                className="image-container"
              >
                <Image
                  src={API_URL + "/" + product?.image}
                  alt={ product?.name ?? '' }
                  width={640}
                  height={427}
                  className="object-fill h-auto zoom-image"
                />
              </a>

              {product && product?.new_product_images
                && Array.isArray(product?.new_product_images)
                && product.new_product_images.map((image, index) => (
                <div
                  className="hero-image bg-darkgray h-full flex justify-center items-center hidden"
                  key={index}
                  id={index + "hiddenid"}
                >
                    <a
                      href={ API_URL + image }
                      data-pswp-width={640}
                      data-pswp-height={427}
                      target="_blank"
                      rel="noreferrer"
                      className="image-container"
                    >
                      <Image
                        src={API_URL + image}
                        alt={ product?.name ?? '' }
                        width={640}
                        height={427}
                        className="object-fill h-auto zoom-image"
                      />
                    </a>
                </div>
              ))}
            </div>
            ) : (
              <div className="w-full space-y-3">
                <Skeleton className="w-full min-h-[400px] max-h-[400px] rounded-xl" />
              </div>
            )}
          </div>
          <div className="text-[16px]">
            {product && !loading ? (
              <>
                <h3 className="font-bold">{ product?.brand?.name }</h3>
                <p className="mt-1">
                  { product?.name }
                </p>
                <p className="font-bold mt-1">£{ product?.selfridges_rrp?.toLocaleString() }</p>
              </>
            ) : (
              <div className="space-y-2">
                  <Skeleton className="h-[24px] w-full" />
                  <Skeleton className="h-[24px] w-full" />
                  <Skeleton className="h-[24px] w-full" />
              </div>
            )}
            <div className="flex flex-row gap-1 my-3">
              <button className="bg-darkblack text-white py-2 px-6 border">
                Request Now
              </button>
              <button className="bg-darkgray text-black py-2 px-6 border">
                Ask a question
              </button>
            </div>

            <hr className="border-t-1 border-color-gray mt-5" />

            {product && !loading ? (
              <div className="description py-10 text-[14px] text-gray-600 flex flex-col gap-6" dangerouslySetInnerHTML={{ __html: product?.description ?? "" }}></div>
            ) : (
              <div className="space-y-2 py-10">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
              </div>
            )}

            <hr className="border-t-1 border-color-gray" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">
              {attributes &&
                attributes.map((attribute, index) => (
                  <React.Fragment key={index}>
                    {attribute.is_warranty ? (
                      <div>
                        <p className="title font-bold text-[11px]">
                          Manufacturer Warranty
                        </p>
                        <p className="value text-gray-600 text-[14px]">
                          Valid until {attribute.warranty_date}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="title font-bold text-[11px]">
                          {attribute.attribute.name}
                        </p>
                        <p className="value text-gray-600 text-[14px]">
                          {attribute.value}
                        </p>
                      </div>
                    )}
                    {(index + 1) % 3 === 0 && (
                      <div className="hidden md:block"></div>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pswp-gallery" id="sub-images">
            {product && !loading ? (
              <React.Fragment>
                <div
                  className="hero-image bg-darkgray h-full flex justify-center items-center hidden"
                  >
                  <a
                    href={ API_URL + "/" + product?.image }
                    data-pswp-width={640}
                    data-pswp-height={427}
                    target="_blank"
                    rel="noreferrer"
                    className="image-container"
                  >
                    <Image
                      src={API_URL + "/" + product?.image}
                      alt={ product?.name ?? '' }
                      width={640}
                      height={427}
                      className="object-fill h-auto zoom-image"
                    />
                  </a>
                </div>
                {product?.new_product_images
                  && Array.isArray(product?.new_product_images)
                  && product.new_product_images.map((image, index) => (
                    <div
                      className="hero-image bg-darkgray h-full flex justify-center items-center"
                      key={index}
                      id={index + "id"}
                    >
                        <a
                          href={ API_URL + image }
                          data-pswp-width={640}
                          data-pswp-height={427}
                          target="_blank"
                          rel="noreferrer"
                          className="image-container"
                        >
                          <Image
                            src={API_URL + image}
                            alt={ product.name ?? '' }
                            width={640}
                            height={427}
                            className="object-fill h-auto zoom-image"
                          />
                        </a>
                    </div>
                  ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {sub_images && sub_images.map((image, index) => (
                  <div className="w-full space-y-3" key={index}>
                    <Skeleton className="w-full min-h-[200px] max-h-[200px] rounded-xl" />
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
