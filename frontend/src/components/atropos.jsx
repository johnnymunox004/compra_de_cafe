import React, { useEffect } from 'react';
import Atropos from 'atropos';
import 'atropos/css';

const AtroposComponent = () => {
  useEffect(() => {
    const myAtropos = Atropos({
      el: '.my-atropos',
      // Agrega opciones adicionales si es necesario
    });

    return () => {
      myAtropos.destroy();
    };
  }, []);

  return (
    <div className="atropos my-atropos">
      <div className="atropos-scale">
        <div className="atropos-rotate">
          <div className="atropos-inner">
            <div className="atropos-content-container">
              <img src="vite.svg" data-atropos-offset="0" alt="Background" />
              <div className="text-inside-image" data-atropos-offset="7"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtroposComponent;
