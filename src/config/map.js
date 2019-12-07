/* Se crea un grid para el mapa.
Los 0 son espacios donde se pueden poner torres y al momento de 
poner una, esta se actualiza a 1 para saber que ya está ocupado el lugar
Los -1 son el camino por el que circularán los enemigos
*/
export default [
    [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
    [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
    [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]
  ];