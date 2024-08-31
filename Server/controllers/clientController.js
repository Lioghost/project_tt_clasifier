
const dashboard = (req, res) => {
    // La función aquí simplemente confirma que el usuario tiene acceso.
    return res.status(200).json({ msg: 'Acceso al dashboard permitido Client' });
};

const sendJuntasDesconocidas = (req, res) => {
    
    try {
        console.log(req.file);  //req.file lo registra multer y ya se tiene acceso en el req, y res
         
        //Almacenar la imagen y publicar la propiedad
        const test_image = req.file.filename
        console.log(test_image)
        //await propiedad.save()

        //res.redirect('/mis-propiedades') No se ejecuta porque se esta ejecutando codigo javascript en propiedad
            //init de dropzone, por lo que se podria decir estamos trabajando aparte
            //se tiene que enviar al usuario al siguiente middleware o regresarlo al codigo a través de next()
        next()

    } catch (error) {
        //Para debuggear
        console.error(error);
    }

}

export {
    dashboard,
    sendJuntasDesconocidas
}