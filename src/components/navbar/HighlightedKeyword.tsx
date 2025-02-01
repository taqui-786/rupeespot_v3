import { Fragment } from 'react';

interface HighlightSearchProps {
  search: string;
  title:string
}

const HighlightSearchKeyword = ({ search, title }: HighlightSearchProps) => {
    const searchWords = search.toLowerCase().split(/\s+/);
    const titleWords = title.toLowerCase().split(/\s+/);
  
    const highlightedTitle = titleWords.map((word, index) => {
      const isMatch = searchWords.some(searchWord => word.includes(searchWord));
      if (isMatch) {
        return (
          <strong className="text-base" key={index}>
            {word}{" "}
          </strong>
        );
      }
      return <Fragment key={index}>{word} </Fragment>;
    });
  
    return <Fragment>{highlightedTitle}</Fragment>;
}
    export default HighlightSearchKeyword;
    

