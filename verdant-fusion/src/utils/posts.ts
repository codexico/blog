import { getCollection } from "astro:content";

// Primeiro tenta encontrar um post correspondente ao slug da URL,
// se encontrar, redireciona para a URL canônica do post.
// Se não encontrar, exibe a página 404 personalizada.
export async function postRedirectHandler(requestURL: string) {
    const url = new URL(requestURL);
    const pathSegments = url.pathname.split("/").filter(Boolean);

    // Proteção contra loops infinitos caso a rota falhe
    if (pathSegments.length === 0) {
        return { url: "/", status: 200 };
    }

    // Extrai o slug final da requisição (ex: de /2026/05/16/meu-post, captura "meu-post")
    const lastSegment = pathSegments[pathSegments.length - 1];

    // Busca o arquivo Markdown local correspondente
    const allPosts = await getCollection("blog");
    const matchingPost = allPosts.find((post) => {
        return post.id === lastSegment;
    });

    if (matchingPost) {
        // Constrói o novo destino canônico simplificado: /blog/id/
        const correctUrl = `/blog/${matchingPost.id}/`;

        // Executa o redirecionamento 301 de servidor seguro para o Google
        return { url: correctUrl, status: 301 };
    }

    // Retorna false para indicar que a rota 404 deve ser exibida normalmente
    return false;
}

export function shuffle(array: Array<T>) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}