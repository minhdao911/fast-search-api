"use client";

import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { debounce } from "lodash";

interface SearchProps {}

type SearchResults = {
  results: string[];
  duration: number;
};

const Search: FunctionComponent<SearchProps> = () => {
  const [inputText, setInputText] = useState<string>();
  const [searchResults, setSearchResults] = useState<SearchResults>();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setInputText(text);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!inputText) {
        setSearchResults(undefined);
        return;
      }
      const res = await fetch(
        `https://fast-search-api.minhdao.workers.dev/api/search?q=${inputText}`
      );
      if (res.status === 200) {
        const data = (await res.json()) as SearchResults;
        setSearchResults(data);
      }
    };
    fetchData();
  }, [inputText]);

  return (
    <div className="w-[480px] bg-white shadow-sm">
      <div className="flex gap-2 w-full items-center border px-4 py-3">
        <HiSearch className="text-gray-500 text-lg" />
        <input
          className="w-full focus:outline-none"
          placeholder="Search countries..."
          type="text"
          onChange={debounce(handleInputChange, 200)}
        />
      </div>
      {searchResults && searchResults.results.length > 0 && (
        <div>
          <ul className="border px-1 py-1">
            <li className="p-2">Results</li>
            {searchResults.results.map((result, index) => (
              <li key={index} className="p-2 pl-4 hover:bg-gray-100">
                {result}
              </li>
            ))}
          </ul>
          <div className="border px-3 py-2 text-gray-500 text-sm">
            Found {searchResults.results.length} results in{" "}
            {searchResults.duration.toFixed(0)} ms
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
