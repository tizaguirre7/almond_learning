
	export async function translateText(text, targetLanguage) {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${
      import.meta.env.VITE_TRANSLATION_API_KEY
    }`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });
    const jsonResponse = await response.json();
    // console.log(jsonResponse.data.translations[0].translatedText)
    const translation = jsonResponse.data.translations[0].translatedText;
    try{
      return translation;
    }
    catch(e){
      return "algo ha fallado";
    }
  }


