import { useQuery } from "@tanstack/react-query";

const TITULOS = [
  { id: 1, nombre: "Título 3 - Fuentes Luminosas", code: "TITULO_3" },
  { id: 2, nombre: "Título 4 - Luminarias para Espacios Interiores", code: "TITULO_4" },
  { id: 3, nombre: "Título 5 - Productos de Iluminación para Espacios Exteriores", code: "TITULO_5" },
  { id: 4, nombre: "Título 6 - Productos de Iluminación para Alumbrado Público", code: "TITULO_6" },
  { id: 5, nombre: "Título 7 - Productos de Iluminación para Áreas Clasificadas", code: "TITULO_7" },
  { id: 6, nombre: "Título 8 - Productos de Iluminación para Túneles", code: "TITULO_8" },
  { id: 7, nombre: "Título 9 - Productos para Iluminación Decorativa", code: "TITULO_9" },
  { id: 8, nombre: "Título 10 - Accesorios Eléctricos y Electrónicos", code: "TITULO_10" },
  { id: 9, nombre: "Título 11 - Productos Usados en Telegestión", code: "TITULO_11" },
];

export function useTitulos() {
  return {
    data: TITULOS,
    isLoading: false,
  };
}

export type Titulo = typeof TITULOS[number];
