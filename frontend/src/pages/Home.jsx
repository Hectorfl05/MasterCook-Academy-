import React from 'react';

const Home = () => {
  const workshops = [
    {
      title: "Taller de Pasta Italiana",
      description: "Aprende a hacer pasta italiana auténtica desde cero.",
      date: "15 de junio, 2025"
    },
    {
      title: "Cocina Mexicana Tradicional",
      description: "Aprende a preparar auténticos tacos al pastor, mole poblano y guacamole con técnicas ancestrales.",
      date: "10 de julio, 2025"
    },
    {
      title: "Creación de Chocolate Artesanal",
      description: "Desde el tostado de granos de cacao hasta la creación de barras y trufas premium.",
      date: "5 de agosto, 2025"
    }
  ];

  return (
    <div className="container">
      <header className="home-header">
        <h1>Descubre nuestros</h1>
        <h2>Talleres de cocina</h2>
      </header>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Buscar talleres..." 
          className="search-input"
        />
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>
      
      <div className="workshops-container">
        {workshops.map((workshop, index) => (
          <div key={index} className="workshop-card">
            <h3>{workshop.title}</h3>
            <p>{workshop.description}</p>
            <div className="card-footer">
              <button className="details-button">Ver detalles</button>
              <span className="workshop-date">{workshop.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;