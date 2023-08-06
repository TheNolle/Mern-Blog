import React from 'react'

import './search.scss'

/**
 * @param {{
 *  disabled: boolean
 *  onSearch: (search: string) => void
 * }}
 */
export default function SearchComponent({ disabled, onSearch }) {
    function handleSearch(event) {
        event.preventDefault()
        onSearch(event.target.value)
    }

    return (
        <input
            type="search"
            className="search-component"
            placeholder="Search"
            disabled={disabled}
            onChange={handleSearch}
        />
    )
}
