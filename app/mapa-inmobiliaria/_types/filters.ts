export type ApiFilterState = {
    tipoPropiedadIds?: number[];  // <- ids
    tipoOperacionIds?: number[];  // <- ids
    LocalidadesIds?: number[];    // <- ids
  
    precioMin?: number;
    precioMax?: number;
    superficieMin?: number;
    superficieMax?: number;
    Habitaciones?: number;
  
    Cochera?: boolean;
    Mascotas?: boolean;
    terraza?: boolean;
    Amoblado?: boolean;
  };
  