import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState, useEffect } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface Attributes {
  name: string;
  slug: string;
  values: string[];
}

interface Brand {
  id: string;
  name: string;
}

interface FilterProps {
  attributes: Attributes[];
  brands: Brand[];
  checkedCheckboxes: { [key: string]: boolean };
  currentPriceRangeValue: [number, number];
  onFilterChange: (filter: string, checkedItems: { [key: string]: boolean }, priceRangeValue:[number, number]) => void;
}
interface UpdatedFilter {
  [key: string]: string[];
}

interface CheckedItems {
  [key: string]: boolean;
}

const Filter: React.FC<FilterProps> = ({ attributes, brands, checkedCheckboxes, currentPriceRangeValue, onFilterChange }) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<UpdatedFilter>({});
  // const [filterQuery, setFilterQuery] = useState<string>('');
  const [priceRangeValue, setPriceRange] = useState<[number, number]>(currentPriceRangeValue);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(checkedCheckboxes);

  useEffect(() => {
    setCheckedItems(checkedCheckboxes);
    setPriceRange(currentPriceRangeValue);
  }, [checkedCheckboxes, currentPriceRangeValue]);

  const handleCheckboxChange = (checked: boolean, value: string, attribute: string, index: number) => {
    const currentCheckedItems = {
      ...checkedItems,
      [attribute + "-" + index]: checked, // Update specific brand's checked state
    }
    setCheckedItems((prev) => ({
      ...prev,
      [attribute + "-" + index]: checked, // Update specific brand's checked state
    }));
    const updatedFilters: UpdatedFilter = { ...selectedFilters };
    if (!updatedFilters[attribute]) {
      updatedFilters[attribute] = [];
    }
    if (checked) {
      updatedFilters[attribute].push(value);
    } else {
      updatedFilters[attribute] = updatedFilters[attribute].filter((v: string) => v !== value);
      if (updatedFilters[attribute].length === 0) {
        delete updatedFilters[attribute];
      }
    }
    setSelectedFilters(updatedFilters);
    updateFilterQuery(updatedFilters, selectedBrands, currentCheckedItems);
  };
  const handleBrandCheckboxChange = (checked: boolean, value: string) => {
    const updatedBrands = checked
      ? [...selectedBrands, value]
      : selectedBrands.filter((brand) => brand !== value);

    const currentCheckedItems = {
      ...checkedItems,
      [value]: checked, // Update specific brand's checked state
    }
    setCheckedItems((prev) => ({
      ...prev,
      [value]: checked, // Update specific brand's checked state
    }));

    setSelectedBrands(updatedBrands);
    updateFilterQuery(selectedFilters, updatedBrands, currentCheckedItems);
  };

  const updateFilterQuery = (updatedFilters: UpdatedFilter, updatedBrands: string[], currentCheckedItems: CheckedItems = checkedItems) => {
    let query = `&`;
    query += Object.keys(updatedFilters)
      .map(key => `${key}=${updatedFilters[key].join(",")}`)
      .join("&");

    if(updatedBrands.length > 0) {
      query += `&brand=${updatedBrands.join(",")}`;
    }
    query += `&start=` + priceRangeValue[0] + `&end=` + priceRangeValue[1];
    // setFilterQuery(query);
    onFilterChange(query, currentCheckedItems, priceRangeValue);
    // console.log(checkedItems)
  };

  const updateProductsBasedOnRange = () => {
    updateFilterQuery(selectedFilters, selectedBrands);
  }
  const unselectAllFilter = () => {
    setCheckedItems({});
    setPriceRange([1, 99500]);
    // setFilterQuery('');
    onFilterChange('', {}, [1, 99500]);
  }
  return (
    <>
      {/* <div className="gender-filter py-4">
        <h3 className="text-[15px] font-bold mb-3">Refine By Category</h3>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="men" id="option-men" />
            <Label htmlFor="option-men">Mens <span className="text-[10px] text-[#939599] font-gray pl-2">100</span></Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="women" id="option-women" />
            <Label htmlFor="option-women">Womens <span className="text-[10px] text-[#939599] font-gray pl-2">34</span></Label>
          </div>
        </RadioGroup>
      </div> */}


      <Accordion type="multiple" defaultValue={["item-brand"]}>

        {brands && (
          <AccordionItem value={"item-brand"} >
            <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Brands</AccordionTrigger>
            <AccordionContent>
              {brands.map((brand, key) => (
                <div className={`flex items-center space-x-2  ${key > 0 ? "mt-2" : ""}`} key={key}>
                  <Checkbox id={"brand-" + brand.id} checked={checkedItems[brand.id] || false} value={brand.id} onCheckedChange={(checked) => handleBrandCheckboxChange(Boolean(checked), brand.id)} />
                  <label
                    htmlFor={"brand-" + brand.id}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand.name}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {attributes && attributes.map((attribute, index) => (
          <AccordionItem value={"item-"+attribute.slug} key={index}>
            <AccordionTrigger className="text-[15px] font-bold hover:no-underline">{attribute.name}</AccordionTrigger>
            <AccordionContent>
              {attribute.values?.map((value, key) => (
                <div className={`flex items-center space-x-2  ${key > 0 ? "mt-2" : ""}`} key={key}>
                  <Checkbox id={attribute.slug + key} checked={checkedItems[attribute.slug + "-" + key] || false} value={value} onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked), value, attribute.slug, key)} />
                  <label
                    htmlFor={attribute.slug + key}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {value}
                  </label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-[15px] font-bold hover:no-underline">Price</AccordionTrigger>
          <AccordionContent>
            <div className="mt-2">
              {/* <Slider defaultValue={[33]} max={100} step={1} /> */}
              <RangeSlider min={1} max={99500} value={priceRangeValue} onInput={setPriceRange} rangeSlideDisabled={true} onThumbDragEnd={updateProductsBasedOnRange}/>
              <div className="grid grid-cols-2 mt-4">
                  <div className="caption">
                      <small>Min:</small> <span id="slider-range-value1" className="text-[12px]">£{priceRangeValue[0]}</span>
                  </div>
                  <div className="text-right caption">
                      <small>Max:</small> <span id="slider-range-value2" className="text-[12px]">£{priceRangeValue[1]}</span>
                  </div>
                  {/* <input type="hidden" id="min-value" name="min-value" value="1">
                  <input type="hidden" id="max-value" name="max-value" value="99500"> */}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4">
        <span className="cursor-pointer font-bold text-[15px] text-[#b2b3b7] text-gray-400 border-b border-[#b2b3b7] pb-1" onClick={unselectAllFilter}>Unselect All Filters</span>
      </div>
    </>
  );
}

export default Filter;