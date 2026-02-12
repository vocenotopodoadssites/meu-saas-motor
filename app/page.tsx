import { headers } from 'next/headers';

export default async function Page() {
    const headerList = await headers();
    let host = headerList.get('host') || "";
    
    // Remove o "www." e deixa minúsculo para bater com o banco
    const dominioLimpo = host.replace(/^www\./, "").toLowerCase();

    // Sua URL do Supabase
    const SUPABASE_URL = `https://nipsinklbpqzrfopnmrl.supabase.co/rest/v1/sites?dominio=eq.${dominioLimpo}&select=codigo_html`;

    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'GET',
            headers: {
                'apikey': process.env.SUPABASE_KEY || '',
                'Authorization': `Bearer ${process.env.SUPABASE_KEY || ''}`
            },
            next: { revalidate: 1 } 
        });

        const data = await response.json();

        if (!data || data.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h1>Site em Construção</h1>
                    <p>O domínio <b>{dominioLimpo}</b> ainda não foi ativado.</p>
                </div>
            );
        }

        let htmlBruto = data[0].codigo_html;

        // Limpa as tags ```html e ``` que o Bubble enviou
        const htmlLimpo = htmlBruto.replace(/```html|```/g, "").trim();

        return <div dangerouslySetInnerHTML={{ __html: htmlLimpo }} />;
        
    } catch (error) {
        return <div>Erro ao conectar com o banco de dados.</div>;
    }
}
