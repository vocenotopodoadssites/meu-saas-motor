import { headers } from 'next/headers';

export default async function Page() {
    const headerList = await headers();
    const host = headerList.get('host') || "";

    // URL configurada para o seu projeto nipsinklbpqzrfopnmrl
    const SUPABASE_URL = `https://nipsinklbpqzrfopnmrl.supabase.co/rest/v1/sites?dominio=eq.${host}&select=codigo_html`;

    try {
        const response = await fetch(SUPABASE_URL, {
            method: 'GET',
            headers: {
                'apikey': process.env.SUPABASE_KEY || '',
                'Authorization': `Bearer ${process.env.SUPABASE_KEY || ''}`
            },
            next: { revalidate: 0 } // Para você ver as mudanças na hora enquanto testa
        });

        const data = await response.json();

        // Se não encontrar o domínio no Supabase
        if (!data || data.length === 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
                    <h1>Site em Construção</h1>
                    <p>O domínio <b>{host}</b> ainda não foi ativado no sistema.</p>
                </div>
            );
        }

        // Limpa as tags de código caso o Bubble as envie
        let htmlBruto = data[0].codigo_html;
        const htmlLimpo = htmlBruto.replace(/```html|```/g, "").trim();

        return <div dangerouslySetInnerHTML={{ __html: htmlLimpo }} />;

    } catch (error) {
        return <div>Erro ao carregar o site. Verifique as configurações de API.</div>;
    }
}
