import { unlink } from 'node:fs/promises'
import { nanoid } from "nanoid";
import { Junta, RefaccionMarca } from "../models/indexModels.js";
import {dirname} from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const generateJuntasId = async (req, res) => {
    return res.status(200).json({ junta_id: nanoid() });
}

const juntasG = async (req, res) => {
    try {
        const juntas = await Junta.findAll({
            //include: {
            //    model: RefaccionMarca,
            //    as: 'refaccion_marcas'
            //}
        });

        if (juntas.length === 0) {
            return res.status(404).json({ msj: "No se encontraron Juntas" });
        }

        return res.status(200).json({ msj: "Juntas recuperadas con éxito", data: juntas });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las Autos", error: error.message });
    }
}

const juntasGCreate = async (req, res) => {
    try {

        const new_junta = await Junta.create({
            id_junta: req.body.id_junta,
            id_image: req.file.filename
        })

        console.log(dirname(fileURLToPath(import.meta.url)));

        return res.status(201).json({ msg: "Junta creada exitosamente", data: new_junta });
    } catch (error) {
        return res.status(500).json({ msg: "Error al crear Junta", error: error.message });
    }
}

const juntasGUpdateGet = async (req, res) => {
    try {
        const junta = await Junta.findByPk(req.params.id)

        if(!junta)
            return res.status(400).json({msg: 'Junta no encontrada'})

        return res.status(200).json({ msg: "Junta recuperada con éxito", data: junta });
    } catch (error) {
        return res.status(500).json({ msg: "Error al recuperar Junta", error: error.message });
    }
}

const juntasGUpdate = async (req, res) => {
    const junta = await Junta.findByPk(req.params.id)

    if(!junta)
        return res.status(400).json({msg: 'Junta no encontrada'})

    try {

        const juntaUpdate = await junta.update({
            id_image: junta.id_image || req.file.filename
        })

        /*
        const imageDirectory = path.join(__dirname, 'public', 'juntas');
        console.log(__dirname);

        // Extraer el nombre base del archivo actual de la Junta sin extensión
        const currentImageName = req.file.filename.split('.')[0];

        // Extensiones comunes de imágenes para verificar
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

        // Buscar archivos con el mismo nombre base pero diferentes extensiones
        for (const ext of imageExtensions) {
            const imagePath = path.join(imageDirectory, `${currentImageName}${ext}`);

            if (fs.existsSync(imagePath) && (imagePath !== req.file.filename)) {
                // Si el archivo existe, eliminarlo
                fs.unlinkSync(imagePath);
                console.log(`Archivo eliminado: ${imagePath}`);
            }
        }*/

        return res.status(201).json({ msg: "Imagen de Junta actualizada exitosamente", data: juntaUpdate });
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar Junta", error: error.message });
    }
}

const juntasGDelete = async (req, res) => {

    try {
        const junta = await Junta.findByPk(req.params.id)

        if(!junta)
            return res.status(400).json({msg: 'Junta no encontrada'});

        await unlink(`public/juntas/${junta.id_image}`)

        await junta.destroy()
        return res.status(200).json({ msj: "Junta eliminada con éxito" });
    } catch (error) {
        return res.status(500).json({ msg: "Error al eliminar Junta", error: error.message });
    }
}

const juntasMCreate = async (req, res) => {
    try {
        const {id} = req.params
        const {id_cod_marca} = req.body

        const existIdCodMarca = await RefaccionMarca.findOne({ where: { id_cod_marca } })
    
        if(existIdCodMarca)
            return res.status(400).json({msg: 'El código de la junta ya está registrado'});

        const juntaM = await RefaccionMarca.create({
            id_cod_marca: id_cod_marca,
            marca_refac: req.body.marca_refac,
            url_marca: req.body.url_marca,
            junta_id: id
        })

        return res.status(201).json({ msg: "Junta creada exitosamente", data: juntaM });
    } catch (error) {
        return res.status(500).json({ msg: "Error al crear Junta", error: error.message });
    }
}

const juntasM = async (req, res) => {
    try {
        const {id} = req.params

        const juntasM = await RefaccionMarca.findAll({
            where: {junta_id: id}
        });

        if (juntasM.length === 0) {
            return res.status(404).json({ msj: "No se encontraron Marcas de Refacción" });
        }

        return res.status(200).json({ msj: "Marcas de Refacción recuperadas con éxito", data: juntasM });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las Marcas de Refacción", error: error.message });
    }
}

const juntasMGet = async (req, res) => {
    try {
        const {id} = req.params

        const juntaM = await RefaccionMarca.findByPk(id)

        if(!juntaM) {
            return res.status(400).json({msg: 'Marca de Refacción no encontrada'});
        }

        return res.status(200).json({ msj: " de Refacción recuperada con éxito", data: juntaM });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar Marca de Refacción", error: error.message });
    }
}

const juntasMUpdate = async (req, res) => {

    try {

        const {id} = req.params
        const {id_cod_marca} = req.body
        
        const existIdCodMarca = await RefaccionMarca.findOne({ where: { id_cod_marca } });
        if (existIdCodMarca && existIdCodMarca.id != id) {
            return res.status(400).json({ msg: "El código de la Junta ya fue registrado previamente" });
        }

        // Actualizar el automóvil
        const [updated] = await RefaccionMarca.update(req.body, {
            where: { id }
        });

        if (!updated) {
            return res.status(404).json({ msg: 'Junta no encontrado' });
        }

        return res.status(201).json({ msg: "Refacción actualizada exitosamente", data: updated });
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar la Refacción", error: error.message });
    }
}

const juntasMDelete = async (req, res) => {
    try {
        const {id} = req.params

        const juntaM = await RefaccionMarca.findByPk(id)

        if(!juntaM) {
            return res.status(400).json({msg: 'Marca de Refacción no encontrada'});
        }

        await juntaM.destroy()
        return res.status(200).json({ msj: "Marca de Refacción eliminada con éxito" });
    } catch (error) {
        return res.status(500).json({ msg: "Error al eliminar Marca de Refacción", error: error.message });
    }
}

export {
    generateJuntasId,
    juntasG,
    juntasGCreate,
    juntasGUpdate,
    juntasGDelete,
    juntasMCreate,
    juntasM,
    juntasMGet,
    juntasMUpdate,
    juntasMDelete
}   