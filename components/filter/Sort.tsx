"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface FilterProps {
  onSortChange: (filter: string) => void;
}

const Sort: React.FC<FilterProps> = ({ onSortChange }) => {
  const [position, setPosition] = React.useState("newest-to-old")

  const handleSortChange = (value: string) => {
    setPosition(value);
    onSortChange(value);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-12">
            <span>Sort</span>
            <Image src="/sort.svg" alt="Sort" width={18} height={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={handleSortChange}>
          <DropdownMenuRadioItem value="newest-to-old">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="high-to-low">Price (High to Low)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="low-to-high">Price (Low to High)</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Sort;