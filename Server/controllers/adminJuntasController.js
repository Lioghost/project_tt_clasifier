import { unlink } from 'node:fs/promises'
import { nanoid } from "nanoid";
import { Junta, RefaccionMarca } from "../models/indexModels.js";

const generateJuntasId = async (req, res) => {
    return res.status(200).json({ junta_id: nanoid() });
}

const juntasG = async (req, res) => {
    try {
        const juntas = await Junta.findAll({
            include: {
                model: RefaccionMarca,
                as: 'refaccion_marcas'
            }
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

        return res.status(201).json({ msg: "Junta creada exitosamente", data: new_junta });
    } catch (error) {
        return res.status(500).json({ msg: "Error al crear Junta", error: error.message });
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
        //await unlink(`public/juntas/${junta.id_image}`)
        return res.status(201).json({ msg: "Imagen de Junta actualizada exitosamente", data: juntaUpdate });
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar Junta", error: error.message });
    }

}

const juntasGDelete = async (req, res) => {

    const {id} = req.params

    const junta = await Junta.findByPk(id)

    if(!junta) {
        return res.status(400).json({msg: 'Junta no encontrada'});
    }

    await unlink(`public/juntas/${junta.id_image}`)

    await junta.destroy()
    return res.status(200).json({ msj: "Junta eliminada con éxito" });
}

const juntasMCreate = async (req, res) => {
    try {
        const {id} = req.params

        const juntaM = await RefaccionMarca.create({
            id_refac: req.body.id_refac,
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

        return res.status(200).json({ msj: "Marca de Refacción recuperada con éxito", data: juntaM });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar Marca de Refacción", error: error.message });
    }
}

const juntasMUpdate = async (req, res) => {
    const {id} = req.params

    const juntaM = await RefaccionMarca.findByPk(id)

    if(!juntaM) {
        return res.status(400).json({msg: 'Marca de Refacción no encontrada'});
    }

    try {
        const juntaMUpdate = await juntaM.update({
            id_refac: req.body.id_refac,
            marca_refac: req.body.marca_refac,
            url_marca: req.body.url_marca
        })

        return res.status(201).json({ msg: "Marca de Refacción actualizada exitosamente", data: juntaMUpdate });
    } catch (error) {
        return res.status(500).json({ msg: "Error al actualizar Marca de Refacción", error: error.message });
    }
}

const juntasMDelete = async (req, res) => {
    const {id} = req.params

    const juntaM = await RefaccionMarca.findByPk(id)

    if(!juntaM) {
        return res.status(400).json({msg: 'Marca de Refacción no encontrada'});
    }

    await juntaM.destroy()
    return res.status(200).json({ msj: "Marca de Refacción eliminada con éxito" });
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