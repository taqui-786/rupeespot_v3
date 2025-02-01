"use client";
import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import SearchPageListing from "./Listings/SearchPageListing";

function SearchPage() {
  return (
    <MaxWidthWrapper>
      <SearchPageListing />
    </MaxWidthWrapper>
  );
}

export default SearchPage;
