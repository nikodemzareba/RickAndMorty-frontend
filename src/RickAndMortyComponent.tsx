import React, { useEffect, useState } from "react";
import "./RickAndMortyComponent.css";

interface Character {
  name: string;
  species: string;
  origin: { name: string };
  image: string;
  episode: string[];
}

export const RickAndMortyComponent: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [origin, setOrigin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedNames, setDisplayedNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/rickandmorty?name=${search}&species=${species}&origin=${origin}&page=${currentPage}`
        );
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const data = await response.json();
        const uniqueCharacters = data.filter((character: Character) => {
          if (character.name.toLowerCase().includes(search.toLowerCase())) {
            if (!displayedNames.has(character.name)) {
              setDisplayedNames((prevDisplayedNames) =>
                new Set(prevDisplayedNames.add(character.name))
              );
              return true;
            }
          }
          return false;
        });
        setCharacters(uniqueCharacters);
      } catch (error) {
        console.error(error);
        setCharacters([]);
      }
    };

    fetchData();
  }, [search, species, origin, currentPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setDisplayedNames(new Set());
    setCharacters([]);
    setCurrentPage(1);
  };

  const handleSpeciesFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecies(event.target.value);
    setDisplayedNames(new Set());
    setCharacters([]);
    setCurrentPage(1);
  };

  const handleOriginFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrigin(event.target.value);
    setDisplayedNames(new Set());
    setCharacters([]);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
    setDisplayedNames(new Set());
    setCharacters([]);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setDisplayedNames(new Set());
    setCharacters([]);
  };

  return (
    <div className="rick-and-morty-component">
      <div className="search-bar">
        <input type="text" placeholder="Search..." onChange={handleSearch} />
        <select onChange={handleSpeciesFilter}>
          <option value="">All Species</option>
          <option value="Human">Human</option>
          <option value="Alien">Alien</option>
        </select>
        <select onChange={handleOriginFilter}>
          <option value="">All Origins</option>
          <option value="Earth">Earth</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {characters.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <div className="character-list">
          {characters.map((character) => (
            <div key={character.name} className="character-card">
              <h2>{character.name}</h2>
              <img src={character.image} alt={character.name} />
              <p>{character.species}</p>
              <p>Origin: {character.origin.name}</p>
              <p>Episodes: {character.episode.length}</p>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default RickAndMortyComponent;
