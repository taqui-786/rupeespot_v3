// Function to format prices with comma
export function formatPriceNumber(number:number) {
  
    const numStr = number?.toString() ;
    if(!numStr) return "0";
    const lastThreeDigits = numStr.slice(-3);
    const otherDigits = numStr.slice(0, -3);
    const formattedOtherDigits = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return otherDigits.length > 0 ? formattedOtherDigits + "," + lastThreeDigits : lastThreeDigits;
  }
  // addAffiliateTag
export function addAffiliateTag(url: string): string {
  const affiliateTag = "tag=rupspt-21";
  
  // Check if the URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  
  // Add the affiliate tag
  return `${url}${separator}${affiliateTag}`;
}