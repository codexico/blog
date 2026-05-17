---
title: "Como migrar do WordPress para o Astro e Cloudflare"
pubDate: 2026-05-16
description: "Um manual prático de como migrar seu blog para o Astro, mudar a estrutura de links para /blog/slug e replicar o redirecionamento canônico do WordPress de graça na Cloudflare."
draft: true
---

Se você está cansado do peso do WordPress e resolveu migrar seu blog para o Astro, parabéns. A velocidade de um site 100% estático (SSG) é imbatível.

Mas quem tem um blog antigo esbarra em um problema crítico: **o SEO e os links antigos**.

No WordPress, as URLs costumam carregar datas (como `ano/mes/dia/slug`) ou categorias. O mais bizarro é que o WordPress tem uma "mágica" nativa no PHP (a função `redirect_canonical`) que faz com que qualquer caminho bizarro digitado antes do slug correto sofra um redirecionamento 301 automático para o link oficial.

Se você mudar para o Astro e o usuário digitar o link antigo, ele vai dar de cara com um **Erro 404**.

Neste tutorial, vou mostrar como migrei meu blog, simplifiquei a estrutura de links para apenas `/blog/slug` (sem datas) e repliquei essa inteligência do WordPress usando as **Functions gratuitas da Cloudflare Pages**. Tudo automatizado via GitHub.

---

### 1) A Nova Estrutura no Astro

Para não passar raiva organizando pastas com anos e meses no VS Code, mudei a lógica. Agora todos os arquivos Markdown ficam direto na raiz da coleção de conteúdo, e a data fica guardada apenas dentro do arquivo (no frontmatter).

A estrutura de pastas no Astro fica assim:
📂 `src/content/blog/meu-post-antigo.md`
📂 `src/content/blog/novo-post.md`

No arquivo `src/pages/blog/[slug].astro`, o Astro gera as páginas limpas automaticamente:

```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<article>
  <h1>{entry.data.title}</h1>
  <Content />
</article>
```

---

### 2) O Truque: Página 404 Inteligente na Cloudflare

O Astro gera arquivos estáticos por padrão. Se alguém acessar uma URL antiga com data, a Cloudflare não vai achar o arquivo e vai disparar o erro 404.

A sacada aqui é desativar o modo estático **apenas para a página 404**. Ela vai rodar em tempo real na borda (Edge) da Cloudflare, ler o slug que o usuário tentou acessar, procurar nos nossos Markdowns locais e fazer o redirecionamento 301 de servidor (o que preserva 100% do seu SEO no Google).

#### Configurar o Adaptador

Primeiro, adicione o adaptador da Cloudflare no seu projeto:
`npx astro add cloudflare`

No seu `astro.config.mjs`, certifique-se de que ele está puxando o adaptador (não use mais a opção `output: "hybrid"`, que foi descontinuada nas versões recentes do Astro; o controle agora é por página):

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  adapter: cloudflare(),
});
```

#### Criar o Detector de Slugs (`src/pages/404.astro`)

Crie o arquivo `src/pages/404.astro` e coloque a instrução `export const prerender = false` no topo. Isso avisa à Cloudflare para processar essa página dinamicamente.

```astro
---
// src/pages/404.astro
export const prerender = false; // Mágica acontece aqui: roda no servidor sob demanda

import { getCollection } from 'astro:content';

const url = new URL(Astro.request.url);
const pathSegments = url.pathname.split('/').filter(Boolean);

// Evita loops caso caia na raiz
if (pathSegments.length === 0) {
  return Astro.redirect('/');
}

// Pega o último pedaço da URL (o slug antigo)
const lastSegment = pathSegments[pathSegments.length - 1];

// Busca nos Markdowns locais vindos do GitHub
const allPosts = await getCollection('blog');
const matchingPost = allPosts.find(post => post.slug === lastSegment);

if (matchingPost) {
  // Se achou o post, joga o usuário para a nova URL limpa com status 301
  const correctUrl = `/blog/${matchingPost.slug}/`;
  return Astro.redirect(correctUrl, 301);
}
---
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Página não encontrada</title>
</head>
<body>
  <h1>Erro 404</h1>
  <p>Esse conteúdo mudou de endereço.</p>
  <a href="/">Voltar para a Home</a>
</body>
</html>
```

---

### 3) Comentários Antigos do WordPress (Modo Estático)

Como o Astro não tem banco de dados, você pode exportar o XML de comentários do painel do WordPress, convertê-lo em um arquivo JSON local (ex: `src/data/comentarios.json`) mapeado pelo slug e renderizá-los diretamente como HTML estático no final do seu `[slug].astro`.

Isso deixa o carregamento instantâneo e o Google ainda consegue indexar o texto dos comentários antigos para SEO. Se no futuro você quiser um sistema de comentários dinâmico de volta, basta injetar o script do Disqus ou usar soluções modernas como o Giscus.

---

### 4) Deploy Automático no Cloudflare Pages

Agora vem a melhor parte. Vá até o painel da Cloudflare:

1. Acesse **Workers e Pages** > **Criar** > Aba **Pages** > **Conectar ao Git**.
2. Escolha seu repositório do GitHub.
3. Em _Framework preset_, escolha **Astro**. O comando de build será `npm run build` e a pasta de saída será `dist`.
4. Clique em **Salvar e Implantar**.

Pronto! Toda vez que você der um `git push origin master` com um post novo em Markdown, a Cloudflare faz o build do site estático em segundos e atualiza a lista de slugs da página 404 automaticamente. Links antigos salvos no Google ou em redes sociais continuarão funcionando para sempre.
