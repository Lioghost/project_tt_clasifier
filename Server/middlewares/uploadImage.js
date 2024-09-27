import multer from 'multer' //multer soporta diferentes formas de almacenar un archivo
import path from 'path'     //Retorna la ubicacion en el disco duro, se puede leer la ubicación de un archivo
import { generarID } from '../config/tokens.js'


const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        let uploadPath
        console.log(req.url)
        switch (req.url) {
            case '/identificador':
                uploadPath = './public/identifier/';
                break;
            case '/unknown-juntas':
                uploadPath = './public/uploads/';
                break;
            case '/juntas-m':
                uploadPath = './public/juntas/';
                break;
        }
        cb(null, uploadPath);
    },
    /*destination: function(req, file, cb) {      //Lugar donde se van a guradar los archivos
        cb(null, './public/identifier/')    
                    
    },*/
    filename: function(req, file, cb) { //Prmite nombrar el archivo a cargar con un Id único y evitar duplicados 
        let name
        switch (req.url) {
            case '/identificador':
                //cb(null, generarID() + path.extname(file.originalname) )
                name = generarID() + path.extname(file.originalname)
                break;
            case '/unknown-juntas':
                //cb(null, generarID() + path.extname(file.originalname) )
                name = generarID() + path.extname(file.originalname)
                break;
            case '/juntas-m':
                name = req.body.id_junta + path.extname(file.originalname)
                break;
        }
        cb(null, name )
    }
})

const upload = multer({ storage }); //Usa multer con la configuracion que se le esta pasando

export default upload;