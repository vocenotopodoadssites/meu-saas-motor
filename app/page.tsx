
import { headers } from 'next/headers';

export default async function Page() {
  const headerList = await headers(); 
  const host = headerList.get('host'); // Pega o domínio do cliente

  // Busca o HTML no seu Bubble usando sua chave e link de API
  const response = await fetch(`https://joaovictovni99.bubbleapps.io/version-test/api/1.1/obj/site?constraints=[{"key":"dominio_completo","constraint_type":"equals","value":"${host}"}]`, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer c500991bebf070b0e4c24612afc38aff'
    },
    next: { revalidate: 1 } 
  });

  const data = await response.json();
  const siteData = data.response.results[0];

  if (!siteData) {
    return <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><h1>Site não encontrado ou ainda não ativado.</h1></div>;
  }

  // Renderiza o site dinamicamente
  return (
    <div dangerouslySetInnerHTML={{ __html: siteData.codigo_html }} />
  );
}
