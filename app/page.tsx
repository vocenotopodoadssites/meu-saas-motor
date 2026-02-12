import { headers } from 'next/headers';

export default async function Page() {
  const headerList = await headers(); 
  const host = headerList.get('host'); 

  const BUBBLE_URL = `https://joaovictorvni99.bubbleapps.io/version-test/api/1.1/obj/site`;

  const response = await fetch(`${BUBBLE_URL}?constraints=[{"key":"dominio_completo","constraint_type":"equals","value":"${host}"}]`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.BUBBLE_API_KEY}`
    },
    next: { revalidate: 1 } 
  });

  const data = await response.json();
  
  if (!data.response || !data.response.results || data.response.results.length === 0) {
     return <div style={{textAlign: 'center', marginTop: '50px'}}><h1>Site não encontrado no banco de dados para: {host}</h1></div>;
  }

  let htmlBruto = data.response.results[0].codigo_html;

  // LIMPEZA: Remove as aspas triplas (```html) que aparecem no seu Bubble
  const htmlLimpo = htmlBruto.replace(/```html|```/g, "").trim();

  return (
    <div dangerouslySetInnerHTML={{ __html: htmlLimpo }} />
  );
}
