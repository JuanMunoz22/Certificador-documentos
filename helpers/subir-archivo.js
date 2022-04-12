const path = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '', nombre='') => {

    return new Promise((resolve, reject) => {
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1 ];
    
        //Validar extension
        if(!extensionesValidas.includes(extension)){
            return reject(`La extensión ${extension} no es permitida, solo se permiten archivos: ${extensionesValidas}`);
        }
    
        if(nombre == ''){
          const nombreTemp = uuidv4() + '.' + extension;
          const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

          archivo.mv(uploadPath, (err) => {
            if (err) {
              reject(err);
            }
            
            resolve(uploadPath)
          });
        }else{
          const nombreTemp = nombre + '.' + extension;
          const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
       
          archivo.mv(uploadPath, (err) => {
            if (err) {
              reject(err);
            }
            
            resolve(uploadPath)
          });
        }

        
      
        
    })
}

module.exports = {
    subirArchivo
}