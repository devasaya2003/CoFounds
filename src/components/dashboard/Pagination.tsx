interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  if (totalPages <= 1) return null;
    
  const getPageNumbers = () => {
    const pages = [];
        
    pages.push(1);
        
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
        
    if (totalPages > 1) {
      pages.push(totalPages);
    }
        
    const result = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i - 1] > 1) {
        result.push('...');
      }
      result.push(pages[i]);
    }
    
    return result;
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center mt-8">
      <ul className="flex space-x-2">
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>
        </li>
        
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <button
                onClick={() => page !== '...' && onPageChange(page as number)}
                className={`px-3 py-2 rounded-md ${
                  page === currentPage 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}