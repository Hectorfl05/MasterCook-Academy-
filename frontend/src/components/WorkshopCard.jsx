import React from 'react';
import { Link } from 'react-router-dom';

const WorkshopCard = ({ id, title, description, date, price, available = true }) => {
  return (
    <div className="workshop-card">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div>
        {date && <p className="workshop-date"><strong>Fecha:</strong> {date}</p>}
        {price !== undefined && price !== null && (
          <p><strong>Precio:</strong> Q{(Number(price) || 0).toFixed(2)}</p>
        )}
        <div className="card-footer">
          {id ? (
            <Link to={`/taller/${id}`} className="details-button">
              Ver detalles
            </Link>
          ) : (
            <button className="details-button">Ver detalles</button>
          )}
          <span className="workshop-date">
            {available ? 'Disponible' : 'Lleno'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
