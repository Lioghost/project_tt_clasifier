import multer from 'multer' //multer soporta diferentes formas de almacenar un archivo
import path from 'path'     //Retorna la ubicacion en el disco duro, se puede leer la ubicación de un archivo
import { generarID } from '../config/tokens.js'


const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        let uploadPath
        if (/^\/juntas-g(\/.*)?$/.test(req.url))
            uploadPath = './public/juntas/';
        else {
            switch (req.url) {
                case '/identificador':
                    uploadPath = './public/identifier/';
                    break;
                case '/unknown-juntas':
                    uploadPath = './public/uploads/';
                    break;
            }
        }
        
        cb(null, uploadPath);
    },
    /*destination: function(req, file, cb) {      //Lugar donde se van a guradar los archivos
        cb(null, './public/identifier/')    
                    
    },*/
    filename: function(req, file, cb) { //Prmite nombrar el archivo a cargar con un Id único y evitar duplicados 
        let name
        if (/^\/juntas-g(\/.*)?$/.test(req.url))
            name = req.body.id_junta + path.extname(file.originalname)
        else {
            switch (req.url) {
                case '/identificador':
                    //cb(null, generarID() + path.extname(file.originalname) )
                    name = generarID() + path.extname(file.originalname)
                    break;
                case '/unknown-juntas':
                    name = generarID() + path.extname(file.originalname)
                    break;
            }
        }
        cb(null, name )
    }
})

/*
// Almacenamiento en memoria (sin guardar el archivo en disco)
const memoryStorage = multer.memoryStorage();

// Middleware dinámico que selecciona el tipo de almacenamiento según la ruta
const upload = (req, res, next) => {
    let multerInstance;

    // Si es la ruta específica que necesita almacenamiento en memoria
    if (req.url === '/unknown-juntas') {
        // Usamos almacenamiento en memoria para esta ruta
        multerInstance = multer({ storage: memoryStorage }).single('image');
    } else {
        // Usamos almacenamiento en disco para otras rutas
        multerInstance = multer({ storage: diskStorage }).single('image');
    }

    // Llamamos al middleware de multer seleccionado
    multerInstance(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        next();  // Continuar con la siguiente función middleware
    });
};

*/

const upload = multer({ storage }); //Usa multer con la configuracion que se le esta pasando

export default upload;