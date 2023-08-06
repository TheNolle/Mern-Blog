import React from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

import './pagination.scss'

/**
 * @param {{
 *  pageCount: number
 *  currentPage: number
 *  onPageChange: Function
 * }}
 */
export default function PaginationComponent({ pageCount, currentPage, onPageChange }) {
    function handlePageClick(page) {
        onPageChange(page)
    }

    return (
        <div className="pagination-component">
            <button
                type="button"
                title={currentPage === 1 ? "" : "Previous page"}
                className="button"
                onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <FaArrowLeft />
            </button>

            <button
                className={`button ${1 === currentPage ? "active" : ""}`}
                onClick={() => handlePageClick(1)}
            >
                1
            </button>

            {currentPage > 3 && <button className="button ellipsis">...</button>}

            {[currentPage - 1, currentPage, currentPage + 1].filter(page => page > 1 && page < pageCount).map(page => (
                <button
                    key={page}
                    className={`button ${page === currentPage ? "active" : ""}`}
                    onClick={() => handlePageClick(page)}
                >
                    {page}
                </button>
            ))}

            {currentPage < pageCount - 2 && <button className="button ellipsis">...</button>}

            {pageCount > 1 && (
                <button
                    className={`button ${pageCount === currentPage ? "active" : ""}`}
                    onClick={() => handlePageClick(pageCount)}
                >
                    {pageCount}
                </button>
            )}

            <button
                type="button"
                title={currentPage === pageCount ? "" : "Next page"}
                className="button"
                onClick={() => currentPage < pageCount && handlePageClick(currentPage + 1)}
                disabled={currentPage === pageCount}
            >
                <FaArrowRight />
            </button>
        </div>
    )
}
