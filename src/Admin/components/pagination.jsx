import React from "react";
import '../adminStyles/table.css'

const Pagination = ({ pageNumber,currentPage, setPage }) => {
  const arr = Array.from(Array(pageNumber).keys());

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        {arr?.map(p => (
          <li key={p} className={`page-item ${currentPage === p + 1 ? 'actives' : ''}`}>
            <button className="page-link" onClick={() => setPage(p + 1)}>
             {p + 1}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
