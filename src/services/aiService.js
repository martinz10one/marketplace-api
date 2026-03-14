const axios = require('axios');

const generarDescripcionConIA = async (nombreProducto) => {
    const apiKey = process.env.GEMINI_API_KEY;
    // Usamos el modelo gemini-1.5-flash que es rápido y gratuito
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `Actúa como un experto en ventas de marketplace. 
    Para el producto "${nombreProducto}", genera una descripción profesional de 2 párrafos y sugiere una categoría corta (ej: Tecnología, Hogar, Deportes). 
    Responde estrictamente en formato JSON con las llaves "descripcion" y "categoria".`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        // Extraemos el texto de la respuesta y limpiamos posibles formatos de markdown
        let textoRespuesta = response.data.candidates[0].content.parts[0].text;
        textoRespuesta = textoRespuesta.replace(/```json|```/g, '').trim();
        
        return JSON.parse(textoRespuesta);
    } catch (error) {
        console.error("Error al conectar con Gemini:", error.message);
        // Retorno de emergencia por si la IA falla
        return { 
            descripcion: "Descripción generada automáticamente al recibir el producto.", 
            categoria: "General" 
        };
    }
};

module.exports = { generarDescripcionConIA };