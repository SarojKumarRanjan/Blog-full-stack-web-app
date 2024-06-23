

// eslint-disable-next-line react/prop-types
const PaginationButton = ({ currentPage, totalPages, onPageChange }) => {
  const renderPages = () => {
    const pages = [];
    const visiblePages = 5; 
    const halfVisible = Math.floor(visiblePages / 2);
    let startPage = Math.max(currentPage - halfVisible, 1);
    let endPage = Math.min(startPage + visiblePages - 1, totalPages);

    // Adjust startPage and endPage if the endPage is less than visiblePages
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(endPage - visiblePages + 1, 1);
    }

    //  "Previous" button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="join-item btn"
        >
          {"<"}
        </button>
      );
    }

    // Add numbered pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`join-item btn ${currentPage === i ? "btn-primary" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Add "Next" button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="join-item btn"
        >
          {">"}
        </button>
      );
    }

    return pages;
  };

  return <div className="join">{renderPages()}</div>;
};

export default PaginationButton;
