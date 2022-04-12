const {Schema, model} = require('mongoose');

const DocumentoSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    lastDate: {
        type: String,
        required: [true, 'La ultima fecha de modificación es obligatoria']
    },
    protectDate: {
        type: String,
        required: [true, 'La fecha de protección es obligatoria']
    },
    lastHash: {
        type: String,
        required: [true, 'El último hash es obligatorio']
    },
    hash: {
        type: String,
        required: [true, 'El hash es obligatorio']
    },
    path: {
        type: String,
        required: [true, 'El path es obligatorio']
    },    
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

DocumentoSchema.methods.toJSON = function(){
    const {__v, estado, ...data} = this.toObject();
    return data;
}

module.exports = model('Documento', DocumentoSchema);
