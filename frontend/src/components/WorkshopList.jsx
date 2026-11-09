import React from 'react';
import WorkshopCard from './WorkshopCard';

const WorkshopList = ({ workshops }) => {
  const defaultWorkshops = [
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

  const items = workshops || defaultWorkshops;

  return (
    <div className="workshops-container">
      {items.map((workshop, index) => (
        <WorkshopCard 
          key={workshop.id || index}
          id={workshop.id}
          title={workshop.nombre || workshop.title}
          description={workshop.descripcion || workshop.description}
          date={workshop.fecha || workshop.date}
          price={workshop.precio}
          available={workshop.cupo_disponible !== undefined ? workshop.cupo_disponible : true}
        />
      ))}
    </div>
  );
};

export default WorkshopList;
