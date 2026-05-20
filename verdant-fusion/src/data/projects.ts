export type ProjectCategoryKey = 'featured' | 'websites' | 'extensions' | 'mobile' | 'ia' | 'plugins' | 'personal' | 'freelancer' | 'openSource' | 'others';

export type ProjectCategory = {
  title: string;
  description: string;
}

export const projectCategories: Record<ProjectCategoryKey, ProjectCategory> = {
  featured: { title: "Projetos em Destaque", description: "Projetos onde mais trabalhei ou tem algo interessante" },
  websites: { title: "Websites", description: "Diversos tipos de sites com diferentes tecnologias" },
  extensions: { title: "Extensões para Navegadores", description: "Extensões para navegadores" },
  mobile: { title: "Aplicativos para celulares", description: "Aplicativos para celulares" },
  ia: { title: "IA", description: "Projetos de Inteligência Artificial" },
  plugins: { title: "Plugins", description: "Plugins jQuery" },
  personal: { title: "Projetos Pessoais", description: "Projetos Pessoais" },
  freelancer: { title: "Freelancer", description: "Trabalhos freelance" },
  openSource: { title: "Open Source", description: "Projetos e contribuições de código aberto" },
  others: { title: "Outros", description: "Outros" }
} as const;

export type Category = typeof projectCategories[keyof typeof projectCategories];

export type Project = {
  id: string;
  title: string;
  category: Category[];
  shortDescription: string;
  description: string;
  image?: { src: string; width: number; height: number }; // cover image
  gallery?: { src: string; width: number; height: number }[]; // other images
  link?: string;
  tags: string[];
  year: string;
}

export const projects: Project[] = [
  {
    id: "eita",
    title: "App EITA Pegadas",
    category: [projectCategories.featured, projectCategories.mobile, projectCategories.openSource,],
    shortDescription: "Aplicativo React Native com geolocalização e NoSQL offline-first.",
    description: "Desenvolvimento de uma aplicação React Native com geolocalização, bancos de dados NoSQL offline assíncronos, sincronização entre celulares sem internet, Material UI e animações. https://gitlab.com/eita/pegadas/pegadas-app",
    image: { src: "/src/assets/projetos/eita/play_store.webp", width: 983, height: 908 },
    link: "https://eita.coop.br/",
    gallery: [
      { src: "/src/assets/projetos/eita/perfil.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/pesca.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/especies.webp", width: 305, height: 895 },
      { src: "/src/assets/projetos/eita/atividade.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/beliscou.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/conexões.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/diversidade.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/logo.webp", width: 480, height: 480 },
      { src: "/src/assets/projetos/eita/minha_pescaria.webp", width: 296, height: 592 },
      { src: "/src/assets/projetos/eita/pegadas.webp", width: 522, height: 1028 },
      { src: "/src/assets/projetos/eita/dados.webp", width: 296, height: 592 }
    ],
    tags: ["React Native", "Android", "Material UI", "NoSQL", "Animações", "Geolocalização", "Sincronização offline", "Offline-first"],
    year: "2023"
  },
  {
    id: "pipefy",
    title: "Pipefy",
    category: [projectCategories.featured, projectCategories.websites],
    shortDescription: "Desenvolvimento Full Stack, interface de e-mail, design system e integrações.",
    description: "Colaboração em equipes multifuncionais para entrega de projetos críticos, incluindo integração com backend, novo layout, design system e otimização. Implementação de interface de e-mail semelhante a webmail.",
    image: { src: "/src/assets/projetos/Pipefy/Pipefy_project.webp", width: 1291, height: 911 },
    gallery: [
      { src: "/src/assets/projetos/Pipefy/Pipefy_Card.webp", width: 1280, height: 960 },
      { src: "/src/assets/projetos/Pipefy/Pipes_list_emails.webp", width: 1622, height: 1165 },
      { src: "/src/assets/projetos/Pipefy/Pipefy_assignees.webp", width: 1676, height: 1438 },
      { src: "/src/assets/projetos/Pipefy/Pipefy_mail_card.webp", width: 706, height: 810 }
    ],
    tags: ["Full Stack", "React", "Ruby on Rails", "Design System", "GraphQL", "NoSQL", "Email UI", "Webmail", "Backend APIs", "Team Collaboration", "Performance", "Bug Fixes", "UX Improvements", "Testing"],
    year: "2020 - 2022"
  },
  {
    id: "magalu",
    title: "Magazine Luiza",
    category: [projectCategories.featured, projectCategories.websites],
    shortDescription: "Plataforma de Checkout, aplicativo responsivo, métodos de pagamento, segurança e unificação de sistemas.",
    description: "Atuação na equipe de checkout do e-commerce. Implementação de métodos de pagamento, CI/CD e analytics. Unificação dos aplicativos mobile e desktop em um único app responsivo. Também unifiquei os checkouts de diversas plataformas e sistemas da empresa, liberei outras equipes da responsabilidade de manter seus checkouts e fui nomeado Funcionário do Mês.",
    image: { src: "/src/assets/projetos/magalu/desk/desk.webp", width: 2000, height: 1789 },
    link: "https://www.magazineluiza.com.br",
    gallery: [
      { src: "/src/assets/projetos/magalu/mobile/mobile.webp", width: 345, height: 2000 },
      { src: "/src/assets/projetos/magalu/desk/pedido.webp", width: 1347, height: 850 },
      { src: "/src/assets/projetos/magalu/desk/entrega2.webp", width: 1011, height: 671 },
      { src: "/src/assets/projetos/magalu/desk/order_review_sameday.webp", width: 2000, height: 1537 },
      { src: "/src/assets/projetos/magalu/desk/pedido2.webp", width: 1024, height: 953 },
      { src: "/src/assets/projetos/magalu/mobile/endereco-alterado.webp", width: 360, height: 1001 }
    ],
    tags: ["E-commerce", "Checkout", "React", "CI/CD", "Analytics", "Security", "Responsivo", "Unificação de sistemas", "Mobile", "Web", "Testing"],
    year: "2016 - 2020"
  },
  {
    id: "chillibeans",
    title: "Chilli Beans",
    category: [projectCategories.featured, projectCategories.websites],
    shortDescription: "Desenvolvimento Full Stack do portal Chilli Beans.",
    description: "Desenvolvimento de portal em PHP e jQuery para a Chilli Beans.",
    image: { src: "/src/assets/projetos/chillibeans/chillibeans1.webp", width: 1257, height: 978 },
    link: "https://www.chillibeans.com.br",
    gallery: [
      { src: "/src/assets/projetos/chillibeans/chillibeans.webp", width: 1162, height: 974 },
      { src: "/src/assets/projetos/chillibeans/chillibeans2.webp", width: 1232, height: 964 },
    ],
    tags: ["JavaScript", "CSS", "CakePHP", "jQuery", "Publicidade", "PHP", "MySQL", "HTML", "JSON", "SEO"],
    year: "2012 - 2014"
  },
  {
    id: "ai-for-kids",
    title: "Local AI for Kids",
    category: [projectCategories.featured, projectCategories.ia, projectCategories.personal, projectCategories.openSource],
    shortDescription: "IA local segura pronta para crianças.",
    description: "Projeto pessoal de IA no Steam Deck usando Ollama e Open WebUI, totalmente offline, segura, focada em crianças e desenvolvimento de jogos para Roblox.",
    image: { src: "/src/assets/projetos/ai_for_kids.webp", width: 796, height: 158 },
    link: "https://github.com/codexico/ai-kids",
    tags: ["Ollama", "Open WebUI", "Steam Deck", "IA", "Roblox", "Offline"],
    year: "2026"
  },
  {
    id: "jquery-validation",
    title: "jQuery Validation",
    category: [projectCategories.featured, projectCategories.plugins, projectCategories.personal, projectCategories.openSource],
    shortDescription: "Correção de bug na validação de horário de verão da biblioteca global jQuery Validation.",
    description: "Contribuição Open Source. Correção de bug na validação de horário de verão da biblioteca global jQuery Validation.",
    link: "https://github.com/codexico/jquery-validation",
    tags: ["Open Source", "jQuery", "JavaScript", "Regex", "Testing"],
    year: "2013"
  },

  // Extensões
  {
    id: "no-posts",
    title: "No Posts No Shorts For YouTube",
    category: [projectCategories.extensions, projectCategories.personal, projectCategories.openSource],
    shortDescription: "Extensão de navegadores para ocultar Shorts e Posts.",
    description: "Extensão para navegadores para ocultar Shorts e Posts do YouTube, versões para Chrome, Firefox, Opera e Firefox para Android.",
    link: "https://github.com/codexico/no_posts_no_shorts",
    tags: ["Chrome", "Firefox", "Opera", "Android", "Browser Extension"],
    year: "2026"
  },
  {
    id: "utf8-chars",
    title: "UTF-8 Characters",
    category: [projectCategories.extensions, projectCategories.personal, projectCategories.openSource],
    shortDescription: "Extensão de navegadores com mais de 30k usuários ativos.",
    description: "Extensões para listar e usar caracteres e emojis. Versões para Chrome e Firefox com mais de 30k usuários ativos.",
    image: { src: "/src/assets/projetos/extensions/UTF-8.webp", width: 1280, height: 800 },
    link: "https://chromewebstore.google.com/detail/utf-8-and-unicode-charact/fcemphgmjnjpmmdhcedhjiegickfbiia",
    tags: ["Popular", "Browser Extension", "Unicode", "HTML", "JavaScript", "CSS"],
    year: "2013 - 2026"
  },
  {
    id: "ligeirinho",
    title: "Ligeirinho",
    category: [projectCategories.extensions, projectCategories.personal, projectCategories.openSource],
    shortDescription: "Busca e comparação de preços.",
    description: "Extensão para Google Chrome, sistema de procura de produtos e comparação de preços baseado em API do Buscapé.",
    image: { src: "/src/assets/projetos/extensions/ligeirinho.webp", width: 1209, height: 862 },
    gallery: [
      { src: "/src/assets/projetos/extensions/ligeirinho_layout.webp", width: 1189, height: 683 }
    ],
    link: "https://github.com/codexico/ligeirinho",
    tags: ["Buscapé", "Browser Extension", "API", "Chrome", "HTML", "JavaScript", "CSS"],
    year: "2014"
  },

  // Websites
  {
    id: "barking-gecko",
    title: "Barking Gecko",
    category: [projectCategories.websites, projectCategories.freelancer],
    shortDescription: "Website de companhia de teatro australiana.",
    description: "Website institucional para companhia de teatro australiana construído em Drupal.",
    image: { src: "/src/assets/projetos/BarckingGecko.webp", width: 839, height: 959 },
    gallery: [{ src: "/src/assets/projetos/BarckingGecko_Season.webp", width: 1140, height: 968 },],
    tags: ["Drupal", "PHP", "JavaScript", "HTML", "CSS", "Freelancer"],
    year: "2009"
  },
  {
    id: "santander-esfera",
    title: "Santander Esfera",
    category: [projectCategories.websites],
    shortDescription: "Website para o Santander Esfera.",
    description: "Desenvolvimento de website para o programa de pontos Santander Esfera.",
    image: { src: "/src/assets/projetos/Santander_Web_Casas.webp", width: 946, height: 2000 },
    tags: ["Website", "Publicidade", "Facebook", "JavaScript", "HTML", "CSS", "Landing Page"],
    year: "2012"
  },
  {
    id: "loreal",
    title: "L'Oréal Dermo",
    category: [projectCategories.websites],
    shortDescription: "Website da marca L'Oréal.",
    description: "Desenvolvimento web e mobile do site promocional e institucional do Clube de Vantagens L'Oréal.",
    image: { src: "/src/assets/projetos/Loreal_Dermo.webp", width: 1127, height: 2000 },

    gallery: [{ src: "/src/assets/projetos/Loreal_Dermo_mobile.webp", width: 380, height: 2000 }],
    tags: ["Website", "Publicidade", "SEO", "HTML", "CSS", "JavaScript", "Landing Page", "Responsivo", "Mobile"],
    year: "2013"
  },
  {
    id: "doritos",
    title: "Doritos",
    category: [projectCategories.websites],
    shortDescription: "Campanha promocional Doritos.",
    description: "Ação de marketing com layouts nível pixel perfect para Desktop e Mobile com formulários customizados.",
    image: { src: "/src/assets/projetos/Doritos_apostas.webp", width: 2000, height: 1275 },
    gallery: [{ src: "/src/assets/projetos/Doritos_desafio_mobile.webp", width: 320, height: 1206 },],
    tags: ["Campanha", "Mobile", "Desktop", "JavaScript", "CSS", "HTML", "Publicidade", "Landing Page"],
    year: "2013"
  },

  // Outros
  {
    id: "titans",
    title: "Titans Group White Label",
    category: [projectCategories.websites, projectCategories.featured],
    shortDescription: "Plataforma de cursos online multi idiomas, White Label para Web & Mobile e SMS",
    description: "Refatoração de plataforma internacional White Label com milhões de usuários na América Latina, com diversos idiomas, marcas e temas, web e mobile, reduzindo em 80% a base de código. Sistema em JavaScript puro para celulares de baixa performance.Como resultado a introdução de novas empresas clientes passou de semanas para dias.",
    image: { src: "/src/assets/projetos/Titans_showcase_cursos.webp", width: 1024, height: 1582 },
    tags: ["JavaScript", "Mobile", "i18n", "Multiplataforma", "White Label", "Cursos online", "SMS", "Plataforma"],
    year: "2014 - 2016"
  },
  {
    id: "rspec-visual",
    title: "Rspec::Visual",
    category: [projectCategories.personal, projectCategories.openSource],
    shortDescription: "Ruby Gem para testes visuais.",
    description: "Ruby Gem para testes através de comparação de screenshots.",
    link: "https://github.com/codexico/rspec-visual",
    tags: ["Ruby", "Testing", "Open Source"],
    year: "2015"
  },
  {
    id: "ttlocal",
    title: "ttlocal",
    category: [projectCategories.personal, projectCategories.openSource],
    shortDescription: "Agregador de Trending Topics.",
    description: "Todos os Trending Topics do Twitter, Youtube e outras fontes em uma só página.",
    image: { src: "/src/assets/projetos/ttlocal/ttlocal.webp", width: 1014, height: 952 },
    gallery: [
      { src: "/src/assets/projetos/ttlocal/ttlocal1.webp", width: 1036, height: 858 },
      { src: "/src/assets/projetos/ttlocal/ttlocal-v2.webp", width: 1218, height: 909 }
    ],
    link: "https://github.com/codexico/ttlocal",
    tags: ["API", "PHP", "jQuery", "Twitter", "Youtube"],
    year: "2012"
  }
];
