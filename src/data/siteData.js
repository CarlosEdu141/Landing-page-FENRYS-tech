export const services = [
  {
    icon: 'web',
    title: 'Sistemas Web',
    desc: 'Plataformas web completas, painéis administrativos, ERPs e CRMs sob medida para o seu negócio crescer.',
  },
  {
    icon: 'mobile',
    title: 'Apps Mobile',
    desc: 'Aplicativos nativos e híbridos para iOS e Android com experiências fluídas e design moderno.',
  },
  {
    icon: 'ai',
    title: 'Inteligência Artificial',
    desc: 'Integração de IA generativa, chatbots inteligentes, automação com LLMs e análise preditiva de dados.',
  },
  {
    icon: 'shop',
    title: 'E-commerce',
    desc: 'Lojas virtuais de alta performance com integrações de pagamento, logística e gestão de estoque.',
  },
  {
    icon: 'api',
    title: 'APIs & Integrações',
    desc: 'Conectamos sistemas, automatizamos fluxos de trabalho e integramos ferramentas do seu negócio.',
  },
  {
    icon: 'cloud',
    title: 'Cloud & DevOps',
    desc: 'Infraestrutura escalável na nuvem, CI/CD, monitoramento e deploys automatizados com zero downtime.',
  },
];

/*
  Projetos do portfólio.
  - desc: frase curta do card.
  - details / features: conteúdo do popup ao clicar no card.
    TODO(dono): os textos de details/features são um rascunho feito só com o que
    já estava no site. Revise e complete (problema do cliente, resultados reais).
  - gallery: prints do projeto. Coloque as imagens em public/projetos/<slug>/
    e liste aqui, ex.: { src: 'projetos/hydra/dashboard.webp', alt: 'Dashboard' }.
    Enquanto estiver vazia, o popup mostra quadros provisórios na cor do projeto.
    Prints de celular (em pé): adicione mobile: true para aparecerem inteiros.
  - link (opcional): URL pública do projeto → mostra o botão "Acessar projeto".
  - status (opcional): ex. 'No ar', 'Em desenvolvimento'.
*/
export const projects = [
  {
    slug: 'hydra',
    logo: 'HydraIcon.webp',
    color: '#00e676',
    tag: 'Fintech',
    title: 'Hydra Investimentos',
    desc: 'Aplicação web de gestão financeira pessoal com controle de entradas/saídas, categorização de transações e dashboard de evolução financeira.',
    details: [
      'O Hydra é uma aplicação web de gestão financeira pessoal. A ideia é dar ao usuário uma visão clara de para onde o dinheiro vai, sem planilhas.',
      'Cada entrada e saída é registrada e categorizada, e um dashboard mostra a evolução financeira ao longo do tempo.',
    ],
    features: [
      'Controle de entradas e saídas',
      'Categorização de transações',
      'Dashboard de evolução financeira',
    ],
    gallery: [
      { src: 'projetos/hydra/dashboard.webp', alt: 'Painel do Hydra com entradas, saídas fixas e variáveis, saldo livre e gráfico de composição dos gastos' },
    ],
    techs: ['React', 'Node.js', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #041a08, #082e12)',
  },
  {
    slug: 'atlanteon',
    logo: 'AtlanteonIcon.webp',
    color: '#3a8ee6',
    tag: 'Fitness & IA',
    title: 'Atlanteon',
    desc: 'Plataforma de gestão de treinos com IA integrada (Hércules), atendendo alunos e professores em perfis distintos.',
    details: [
      'O Atlanteon é uma plataforma de gestão de treinos. Nasceu como projeto acadêmico em 2024 e virou o primeiro produto de verdade da equipe.',
      'Alunos e professores usam a plataforma em perfis distintos, cada um com as telas e permissões do seu papel. O Hércules, agente de IA integrado, apoia o dia a dia dos treinos.',
    ],
    features: [
      'Perfis separados para alunos e professores',
      'Gestão de treinos',
      'Hércules: agente de IA integrado à plataforma',
    ],
    gallery: [
      { src: 'projetos/atlanteon/home.webp', alt: 'Tela inicial do app Atlanteon com a semana de treinos, nível de XP e treino do dia', mobile: true },
      { src: 'projetos/atlanteon/historico.webp', alt: 'Histórico de exercícios de musculação no Atlanteon, separados por grupo muscular', mobile: true },
    ],
    techs: ['React', 'Node.js', 'AI Agent', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #0a1f44, #14427f)',
  },
  {
    slug: 'vl-fashion',
    logo: 'V&LFashionLogo.webp',
    color: '#4a7ab5',
    tag: 'E-commerce',
    title: 'V&L Fashion',
    desc: 'E-commerce para loja de moda feminina com funcionalidades completas de vendas e gestão operacional.',
    details: [
      'Loja virtual para uma marca de moda feminina, cobrindo tanto o lado de quem compra quanto o de quem administra a loja.',
      'Além da vitrine e do fluxo de compra, a plataforma reúne a gestão operacional do negócio em um só lugar.',
    ],
    features: [
      'Vitrine e fluxo completo de vendas',
      'Gestão operacional da loja',
      'API REST própria',
    ],
    gallery: [
      { src: 'projetos/vl-fashion/home.webp', alt: 'Página inicial da loja V&L Fashion com a campanha de Dia das Mães' },
    ],
    techs: ['React', 'Node.js', 'API REST', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #1e3a6a, #2b4a7a)',
  },
  {
    slug: 'use-alps',
    logo: 'UseAlpsLogo.webp',
    color: '#b8475a',
    tag: 'E-commerce',
    title: 'use Alps',
    desc: 'E-commerce de moda feminina de luxo, com vitrine sofisticada que traduz a identidade da marca e gestão completa de vendas.',
    details: [
      'E-commerce de moda feminina de luxo. O foco foi uma vitrine sofisticada, que traduz a identidade da marca em cada tela.',
      'Por trás da vitrine, a loja conta com gestão completa de vendas.',
    ],
    features: [
      'Vitrine com a identidade visual da marca',
      'Gestão completa de vendas',
      'API REST própria',
    ],
    gallery: [
      { src: 'projetos/use-alps/home.webp', alt: 'Página inicial da use Alps com o destaque "Peças que fazem histórias" e um look da coleção' },
      { src: 'projetos/use-alps/colecao.webp', alt: 'Vitrine da coleção verão 2026 da use Alps em fotos estilo polaroid' },
    ],
    techs: ['React', 'Node.js', 'API REST', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #2a080d, #4e121c)',
  },
];

export const testimonials = [
  {
    text: 'A Fenrys transformou completamente nossa operação. O sistema desenvolvido reduziu nosso tempo de gestão em mais de 60%. Equipe comprometida e entrega impecável.',
    name: 'Marcos Ribeiro',
    role: 'CEO — Distribuidora Ribeiro',
    initials: 'MR',
  },
  {
    text: 'Precisávamos de um app do zero em 60 dias. A Fenrys entregou em 45, com qualidade excelente e sem enrolação. Parceria que pretendo manter por muito tempo.',
    name: 'Ana Carolina',
    role: 'Fundadora — Startup Healtech',
    initials: 'AC',
  },
  {
    text: 'Integraram IA no nosso atendimento e os resultados foram imediatos. 80% das dúvidas resolvidas automaticamente. Investimento que se pagou no primeiro mês.',
    name: 'Felipe Oliveira',
    role: 'Diretor Comercial — Rede Ótica Plus',
    initials: 'FO',
  },
];

export const stats = [
  { num: '4+', label: 'Projetos Executados' },
  { num: '3+', label: 'Clientes Atendidos' },
  { num: '100%', label: 'Compromisso Total' },
  { num: '✦', label: 'Novos no Mercado' },
];

export const processSteps = [
  { num: '01', title: 'Descoberta', desc: 'Entendemos profundamente seu negócio, o problema a resolver e os objetivos do projeto.' },
  { num: '02', title: 'Arquitetura', desc: 'Desenhamos a solução ideal: tecnologias, escopo, prazos e investimento necessário.' },
  { num: '03', title: 'Desenvolvimento', desc: 'Sprint por sprint, entregamos com qualidade, com revisões e acompanhamento constante.' },
  { num: '04', title: 'Lançamento', desc: 'Deploy, testes finais, treinamento e suporte pós-lançamento para garantir o sucesso.' },
];

export const techs = [
  'React & Next.js', 'Node.js', 'Python', 'Inteligência Artificial',
  'Mobile Apps', 'Cloud & DevOps', 'API & Integrações', 'E-commerce',
  'Automação', 'UX Design', 'TypeScript', 'Banco de Dados',
];
/* ══════════════════════════════════════════════
   PÁGINA "NOSSA HISTÓRIA" — /historia
   ══════════════════════════════════════════════ */
export const historia = {
  origem: {
    titulo: 'Como tudo começou',
    blocos: [
      {
        titulo: 'Como a Fenrys nasceu',
        texto: 'A Fenrys nasceu da parceria entre Carlos Eduardo Tiago e Rafael Caldas. Os dois já desenvolviam projetos como freelancers e queriam dar a esse trabalho a estrutura e a seriedade de uma empresa de verdade. A confiança de que isso era possível veio antes mesmo da fundação, de um projeto que começou na faculdade e acabou mostrando do que a dupla era capaz.',
      },
      {
        titulo: 'Primeiros passos',
        texto: 'Nosso primeiro projeto foi o Atlanteon. Ele surgiu no ambiente acadêmico como uma plataforma para acompanhar treinos e organizar a rotina de quem frequenta academias. Fomos muito além do que um trabalho de faculdade exigia: criamos funcionalidades, testamos ideias, enfrentamos problemas técnicos e aprendemos a transformar uma necessidade real em produto. Foi ali que enxergamos o potencial de construir algo nosso. Pouco depois, com a empresa oficializada, veio o primeiro cliente, uma indicação de um conhecido que se tornou a primeira demanda oficial da Fenrys.',
      },
    ],
    citacao: 'Quem não arrisca nunca sonha alto o bastante para conquistar.',
    autor: 'Carlos Eduardo e Rafael Caldas, Fundadores',
  },

  marcos: [
    { ano: '2024',  titulo: 'Primeiro projeto',   desc: 'Nasce o Atlanteon, um projeto acadêmico que virou nosso primeiro produto de verdade.' },
    { ano: '2025',  titulo: 'A ideia',            desc: 'Depois do Atlanteon, a dupla de freelancers decide transformar a parceria em algo maior.' },
    { ano: '22 de maio de 2026', titulo: 'Fundação', desc: 'A Fenrys se torna oficialmente uma empresa, já com o primeiro cliente fechado e dois projetos em desenvolvimento.' },
    { ano: '2026',  titulo: 'IA no DNA',          desc: 'A inteligência artificial chegou para transformar todas as áreas. Estamos nos aperfeiçoando para usá-la como mais uma ferramenta a favor dos nossos clientes.' },
    { ano: 'Hoje',  titulo: 'O próximo capítulo', desc: 'A Fenrys ainda é uma empresa recém-nascida, mas com espaço para crescer no mercado de tecnologia. Seguimos aprimorando nosso trabalho e nosso conhecimento para mostrar que esta alcateia tem força para ir longe.' },
  ],

  pilares: [
    {
      icone: 'target',
      titulo: 'Missão',
      desc: 'Criar soluções digitais que realmente funcionam e geram resultado para quem confia na gente.',
    },
    {
      icone: 'vision',
      titulo: 'Visão',
      desc: 'Ser uma empresa reconhecida no mercado de tecnologia, primeiro na nossa região, depois no Brasil e no mundo.',
    },
    {
      icone: 'wolf',
      titulo: 'Valores',
      desc: 'Qualidade no código, transparência com o cliente e obsessão por resolver problemas da forma mais eficaz e eficiente.',
    },
  ],
};
