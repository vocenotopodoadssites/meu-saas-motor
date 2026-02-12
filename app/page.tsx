import { headers } from 'next/headers';

export default async function Page() {
  const headerList = await headers(); 
  const host = headerList.get('host'); // Ex: agoraquerover.vtabit.com.br

  // 1. URL CORRIGIDA (com o 'r' em joaovictor)
  const BUBBLE_URL = `https://joaovictorvni99.bubbleapps.io/version-test/api/1.1/obj/site`;

  const response = await fetch(`${BUBBLE_URL}?constraints=[{"key":"dominio_completo","constraint_type":"equals","value":"${host}"}]`, {
    method: 'GET',
    headers: {
      // 2. BUSCANDO A CHAVE QUE VOCÊ SALVOU NA VERCEL
      'Authorization': `Bearer ${process.env.BUBBLE_API_KEY}`
    },
    next: { revalidate: 1 } 
  });

  const data = await response.json();
  
  // Se o Bubble der erro, isso evita que o site quebre totalmente
  if (!data.response || !data.response.results) {
     return <div style={{textAlign: 'center', marginTop: '50px'}}><h1>Erro de conexão com o banco de dados.</h1></div>;
  }

  const siteData = data.response.results[0];

  if (!siteData) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px'}}>
        <h1>Site não encontrado</h1>
        <p>O domínio <b>{host}</b> não está cadastrado no Bubble.</p>
      </div>
    );
  }

  // Renderiza o site usando o campo do seu banco de dados
  return (
    <div dangerouslySetInnerHTML={{ __html: siteData.codigo_html }} />
  );
}
