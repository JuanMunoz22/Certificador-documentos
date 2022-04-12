const {PDFDocument, StandardFonts, rgb, PDFPage} = require('pdf-lib')
const fs = require('fs');


const certificarPDF = async(file, nombre, lastDate, protectDate, lastHash, hash) => {

    //Crear nuevo documento PDF y pagina
    const doc = await PDFDocument.create();
    const page = doc.addPage();

    //Cargar imagen y guardarla como bufer de Nodejs
    let img = fs.readFileSync('./assets/certificacion.png');
    img = await doc.embedPng(img);

    // Incrustar la fuente Times Roman 
    const timesRomanFont = await doc.embedFont(StandardFonts.TimesRoman);
    
    const { width, height } = img.scale(1);
    //Dibujar la imagen en el centro de la página
    page.drawImage(img, {
        x: page.getWidth() / 2 - width / 2,
        y: page.getHeight() / 2 - height / 2,
        opacity: .1
    });
 
    // Dibujar una cadena de texto hacia la parte superior de la página 
    const fontSize = 12
    page.drawText(`
        Nombre: ${nombre}
        Ultima Modificación: ${lastDate}
        Fecha de protección: ${protectDate}
        Hash Anterior: ${lastHash}
        Hash: ${hash}
    `, {
        color: rgb(0, 0, 0),
        font: timesRomanFont,
        x: 50,
        y: 800,
        size: fontSize,
    })

    const cover = await PDFDocument.load(fs.readFileSync(`./uploads/documentos/${hash}.pdf`));

    const contentPages = await doc.copyPages(cover, cover.getPageIndices());
    for (const page of contentPages) {
        page.drawImage(img, {
            x: page.getWidth() / 2 - width / 2,
            y: page.getHeight() / 2 - height / 2,
            opacity: .08 
        });
        doc.addPage(page);
    }

    fs.writeFileSync(`./uploads/documentos/${hash}.pdf`, await doc.save());

    return true;
}


module.exports = {
    certificarPDF
}