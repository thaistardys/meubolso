# 🍃 Minimal Finance — Controle de Finanças Pessoais

> Um gerenciador financeiro web focado em simplicidade, usabilidade fluida e estética visual minimalista e acolhedora.



---

## ✨ Funcionalidades Principais

*   **Dashboard Inteligente:** Painel superior compacto que exibe Receitas, Despesas, Saldo Técnico, Efetivados e o Cofrinho Acumulado de Reserva.
*   **Controle "To-Do" Avançado:** Marque receitas ou despesas como liquidadas diretamente na listagem principal através de checkboxes interativos, sem a necessidade de abrir modais de edição.
*   **Gerenciador de Recorrências Triplo:** 
    *   *Não Recorrente:* Lançamentos simples e pontuais.
    *   *Parcelamentos:* Distribuição inteligente dividindo o valor total ou aplicando o valor fixo por parcela.
    *   *Fixas Mensais:* Projeção automatizada de lançamentos para os próximos 12 meses na linha do tempo.
*   **Modais Condicionais Sequenciais:** Interface de segurança que impede exclusões ou edições acidentais, oferecendo opções cirúrgicas de propagação (*Apenas este mês*, *Este e os futuros* ou *Todo o histórico*).
*   **Cofrinho de Reserva Histórico:** Filtro matemático exclusivo atrelado à categoria nativa protegida `Reserva`. Exibe a somatória histórica acumulada de todas as reservas já guardadas e liquidadas do passado até o mês vigente.
*   **Gráfico de Pizza Dinâmico:** Gráfico nativo renderizado puramente via CSS (`conic-gradient`) com paleta de cores orgânicas expandida e harmoniosa para novas categorias de usuário.
*   **Persistência Local Total:** Armazenamento seguro de dados diretamente no navegador via `localStorage`. **Zero necessidade de servidores ou bancos de dados externos.**

---

## 🛠️ Arquitetura e Engenharia de Código

O projeto foi construído seguindo estritamente as melhores práticas de desenvolvimento front-end, aplicando o princípio de **Separação de Preocupações (*Separation of Concerns*)**:

1.  **`index.html`:** Estrutura 100% semântica e limpa. **Zero CSS inline e zero JavaScript (`onclick`, `onchange`) incorporados nas tags.**
2.  **`style.css`:** Centralização absoluta da identidade visual, tipografias, layouts adaptáveis (*Flexbox* e *Grid*) e regras de responsividade mobile-first.
3.  **`script.js`:** Motor lógico modularizado, dividindo as responsabilidades de forma coesa (Estado da Aplicação, Utilitários, Diálogos de Interface, Renderização Dinâmica, CRUD de Formulários e Escutas de Eventos Nativos).

---

## 🎨 Paleta de Cores (Estética Minimalista)

O layout utiliza contrastes suaves e tons pastéis desaturados para mitigar a fadiga visual durante o controle financeiro:
*   `🟢 Sálvia Escuro (#86A789)` — Representação de Receitas e Saldos Positivos.
*   `🟤 Terracota (#C19A6B)` — Identificação de Despesas e Saídas.
*   `🔵 Azul Reserva (#5D9CEC)` — Destaque do Cofrinho Acumulado de Reserva.
*   `⚪ Antracite / Off-White` — Tons neutros de base e tipografia limpa.

---

## 🚀 Como Executar o Projeto

Como o sistema foi desenvolvido puramente em tecnologia web nativa (*Vanilla JavaScript*), executá-lo é extremamente simples:

1. Faça o download ou clone este repositório em sua máquina.
2. Certifique-se de que os três arquivos principais (`index.html`, `style.css` e `script.js`) estejam localizados **na mesma pasta (raiz)**.
3. Dê um duplo clique no arquivo `index.html` para abri-lo diretamente em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).

*Dica de desenvolvimento: Caso realize alterações no código, use o comando **`Ctrl + F5`** (ou `Cmd + Shift + R` no Mac) para atualizar a página limpando completamente o cache do navegador.*

---

## 🔮 Próximos Passos (Planejamento da Segunda Parte)

*   [ ] Criação de uma seção dedicada a **Metas de Economia** de longo prazo integradas ao saldo acumulado de reserva.
*   [ ] Injeção de componente para **Exportação de Relatórios Fechados** em formato PDF ou planilha Excel.
*   [ ] Painel comparativo de **Métricas Anuais** para analisar meses com maior índice de economia.

---
Desenvolvido com carinho por **thaistardys** 🍃
