const {Schema, model} = require('mongoose');

const VerificadosSchema = Schema({
    hash: {
        type: String,
        required: [true, 'El hash es obligatorio'],
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

VerificadosSchema.methods.toJSON = function(){
    const {__v, ...data} = this.toObject();
    return data;
}

module.exports = model('Verificados', VerificadosSchema);

