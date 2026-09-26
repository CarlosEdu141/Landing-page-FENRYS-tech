export const services = [
  {
    icon: '🖥️',
    title: 'Sistemas Web',
    desc: 'Plataformas web completas, painéis administrativos, ERPs e CRMs sob medida para o seu negócio crescer.',
  },
  {
    icon: '📱',
    title: 'Apps Mobile',
    desc: 'Aplicativos nativos e híbridos para iOS e Android com experiências fluídas e design moderno.',
  },
  {
    icon: '🤖',
    title: 'Inteligência Artificial',
    desc: 'Integração de IA generativa, chatbots inteligentes, automação com LLMs e análise preditiva de dados.',
  },
  {
    icon: '🛒',
    title: 'E-commerce',
    desc: 'Lojas virtuais de alta performance com integrações de pagamento, logística e gestão de estoque.',
  },
  {
    icon: '⚡',
    title: 'APIs & Integrações',
    desc: 'Conectamos sistemas, automatizamos fluxos de trabalho e integramos ferramentas do seu negócio.',
  },
  {
    icon: '☁️',
    title: 'Cloud & DevOps',
    desc: 'Infraestrutura escalável na nuvem, CI/CD, monitoramento e deploys automatizados com zero downtime.',
  },
];

export const projects = [
  {
    logo: 'HydraIcon.webp',
    color: '#00e676',
    tag: 'Fintech',
    title: 'Hydra Investimentos',
    desc: 'Aplicação web de gestão financeira pessoal com controle de entradas/saídas, categorização de transações e dashboard de evolução financeira.',
    techs: ['React', 'Node.js', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #041a08, #082e12)',
  },
  {
    logo: 'OlympusIcon.webp',
    color: '#d4a017',
    tag: 'Fitness & IA',
    title: 'Olympus',
    desc: 'Plataforma de gestão de treinos com IA integrada (Hércules), atendendo alunos e professores em perfis distintos.',
    techs: ['React', 'Node.js', 'AI Agent', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)',
  },
  {
    logo: 'V&LFashionLogo.webp',
    color: '#4a7ab5',
    tag: 'E-commerce',
    title: 'V&L Fashion',
    desc: 'E-commerce para loja de moda feminina com funcionalidades completas de vendas e gestão operacional.',
    techs: ['React', 'Node.js', 'API REST', 'PostgreSQL'],
    gradient: 'linear-gradient(135deg, #1e3a6a, #2b4a7a)',
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
  { num: '3+', label: 'Projetos Executados' },
  { num: '2+', label: 'Clientes Atendidos' },
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
        texto: 'Nosso primeiro projeto foi o Olympus, hoje chamado Atlanteon. Ele surgiu no ambiente acadêmico como uma plataforma para acompanhar treinos e organizar a rotina de quem frequenta academias. Fomos muito além do que um trabalho de faculdade exigia: criamos funcionalidades, testamos ideias, enfrentamos problemas técnicos e aprendemos a transformar uma necessidade real em produto. Foi ali que enxergamos o potencial de construir algo nosso. Pouco depois, com a empresa oficializada, veio o primeiro cliente, uma indicação de um conhecido que se tornou a primeira demanda oficial da Fenrys.',
      },
    ],
    citacao: 'Quem não arrisca nunca sonha alto o bastante para conquistar.',
    autor: 'Carlos Eduardo e Rafael Caldas, Fundadores',
  },

  marcos: [
    { ano: '2024',  titulo: 'Primeiro projeto',   desc: 'Nasce o Olympus (hoje Atlanteon), um projeto acadêmico que virou nosso primeiro produto de verdade.' },
    { ano: '2025',  titulo: 'A ideia',            desc: 'Depois do Olympus, a dupla de freelancers decide transformar a parceria em algo maior.' },
    { ano: '22 de maio de 2026', titulo: 'Fundação', desc: 'A Fenrys se torna oficialmente uma empresa, já com o primeiro cliente fechado e dois projetos em desenvolvimento.' },
    { ano: '2026',  titulo: 'IA no DNA',          desc: 'A inteligência artificial chegou para transformar todas as áreas. Estamos nos aperfeiçoando para usá-la como mais uma ferramenta a favor dos nossos clientes.' },
    { ano: 'Hoje',  titulo: 'O próximo capítulo', desc: 'A Fenrys ainda é uma empresa recém-nascida, mas com espaço para crescer no mercado de tecnologia. Seguimos aprimorando nosso trabalho e nosso conhecimento para mostrar que esta alcateia tem força para ir longe.' },
  ],

  pilares: [
    {
      icone: '🎯',
      titulo: 'Missão',
      desc: 'Criar soluções digitais que realmente funcionam e geram resultado para quem confia na gente.',
    },
    {
      icone: '🔭',
      titulo: 'Visão',
      desc: 'Ser uma empresa reconhecida no mercado de tecnologia, primeiro na nossa região, depois no Brasil e no mundo.',
    },
    {
      icone: '🐺',
      titulo: 'Valores',
      desc: 'Qualidade no código, transparência com o cliente e obsessão por resolver problemas da forma mais eficaz e eficiente.',
    },
  ],
};
