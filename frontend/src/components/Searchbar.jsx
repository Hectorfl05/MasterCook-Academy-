import React from 'react';

const SearchBar = ({ searchTerm = '', onSearchChange, onSearchSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Buscar talleres..." 
        className="search-input"
        value={searchTerm}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
      />
      <button type="submit" className="search-button" aria-label="Buscar">
        <i className="fas fa-search"></i>
      </button>
    </form>
  );
};

export default SearchBar;
