import Marca from "./Marca.js";
import Automovil from "./Automovil.js";

Automovil.belongsTo(Marca, {foreignKey: 'marcaId'});

export {
    Automovil,
    Marca
}