import { unlink } from 'node:fs/promises'
import { nanoid } from "nanoid";
import Junta from "../models/Junta.js";

const generateJuntasId = async (req, res) => {
    return res.status(200).json({ junta_id: nanoid() });
}

const juntas = async (req, res) => {
    try {
        const juntas = await Junta.findAll();

        if (juntas.length === 0) {
            return res.status(404).json({ msj: "No se encontraron Juntas" });
        }

        return res.status(200).json({ msj: "Juntas recuperadas con éxito", data: juntas });

    } catch (error) {
        return res.status(500).json({ msj: "Error al recuperar las Autos", error: error.message });
    }
}

const juntaCreate = async (req, res) => {
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

const juntaUpdate = async (req, res) => {
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

const juntaDelete = async (req, res) => {

    const {id} = req.params

    const junta = await Junta.findByPk(id)

    if(!junta) {
        return res.status(400).json({msg: 'Junta no encontrada'});
    }

    await unlink(`public/juntas/${junta.id_image}`)

    await junta.destroy()
    return res.status(200).json({ msj: "Junta eliminada con éxito" });
}

export {
    generateJuntasId,
    juntas,
    juntaCreate,
    juntaUpdate,
    juntaDelete
}   