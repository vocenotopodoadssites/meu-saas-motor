import { headers } from 'next/headers';

export default async function Page() {
  const headerList = await headers(); 
  // Pega o domínio que o usuário digitou (ex: agoraquerover.vtabit.com.br)
  const host = headerList.get('host') || ""; 

  // URL do seu banco de dados no Bubble (com o "r" corrigido)
  const BUBBLE_URL = `https://joaovictorvni99.bubbleapps.io/version-test/api/1.1/obj/site`;

  // Faz a busca no Bubble comparando o domínio do navegador com a coluna 'dominio_completo'
  const response = await fetch(`${BUBBLE_URL}?constraints=[{"key":"dominio_completo","constraint_type":"equals","value":"${host}"}]`, {
    method: 'GET',
    headers: {
      // Usa a chave que você salvou nas variáveis de ambiente da Vercel
      'Authorization': `Bearer ${process.env.BUBBLE_API_KEY}`
    },
    next: { revalidate: 1 } // Atualiza o site quase em tempo real
  });

  const data = await response.json();
  
  // Verifica se o Bubble respondeu corretamente
  if (!data.response || !data.response.results || data.response.results.length === 0) {
     return (
       <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
         <h1>Site não encontrado</h1>
         <p>O domínio <b>{host}</b> não está vinculado a nenhum site no banco de dados.</p>
       </div>
     );
  }

  // Pega o código HTML da primeira linha encontrada no Bubble
  let htmlBruto = data.response.results[0].codigo_html;

  // LIMPEZA: Remove as aspas triplas (```html) que o Bubble insere automaticamente
  const htmlLimpo = htmlBruto.replace(/```html|```/g, "").trim();

  // Renderiza o site final
  return (
    <div dangerouslySetInnerHTML={{ __html: htmlLimpo }} />
  );
}
