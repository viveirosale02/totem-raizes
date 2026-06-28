# Totem de Autoatendimento — Raízes do Nordeste

Protótipo de interface (Front-End) para o canal de totem de autoatendimento da Rede Raízes do Nordeste, desenvolvido como Atividade Prática de Projeto Multidisciplinar — Trilha Front-End (Uninter, ADS).

🔗 **Protótipo publicado:** https://viveirosale02.github.io/totem-raizes/

## Sobre o projeto

Este protótipo cobre a jornada completa de um cliente diante do totem: escolha de produtos no cardápio, ajuste de carrinho, identificação opcional com consentimento LGPD, escolha da forma de pagamento e os dois desfechos possíveis (pagamento aprovado ou recusado).

Não há backend real: o catálogo de produtos é estático e o pagamento é simulado localmente em JavaScript, replicando a mesma regra de negócio definida no estudo de caso institucional (aprova pedidos com total até R$ 1.000,00; recusa valores acima desse limite).

## Tecnologias

- HTML5
- CSS3 (sem frameworks de UI)
- JavaScript (ES6+, vanilla — sem bibliotecas externas)
- Tipografia via Google Fonts (Fraunces e Inter)

## Estrutura de arquivos

```
totem-raizes/
├── index.html   -> Estrutura HTML de todas as telas do protótipo
├── style.css    -> Tokens de design e estilos de todos os componentes
├── script.js    -> Estado da aplicação, navegação e regras de interface
└── README.md    -> Este arquivo
```

## Como executar localmente

Não é necessária nenhuma instalação ou etapa de build. Basta:

1. Clonar ou baixar este repositório
2. Abrir o arquivo `index.html` diretamente em qualquer navegador moderno

```bash
git clone https://github.com/viveirosale02/totem-raizes.git
cd totem-raizes
# abra o index.html no navegador
```

## Fluxo de telas

```
Boas-vindas
  └─> Cardápio (filtro por categoria)
       └─> Detalhe do produto (modal)
            └─> Sacola (carrinho)
                 └─> Identificação (opcional + consentimento LGPD)
                      └─> Pagamento (Pix / Crédito / Débito)
                           └─> Aguardando pagamento
                                ├─> Sucesso (total ≤ R$ 1.000)
                                └─> Recusado (total > R$ 1.000)
```

## Documentação completa

A análise de requisitos, modelagem, decisões de interface, acessibilidade/LGPD, plano de testes e conclusão estão detalhados no relatório acadêmico entregue junto a este projeto (`Projeto_Front_End_Raizes_do_Nordeste.docx`).

## Autor

Alexandre Viveiros Santos — RU 4767069
Curso de Análise e Desenvolvimento de Sistemas — Uninter

## Declaração de uso de IA

Este projeto contou com apoio do assistente de IA Claude (Anthropic) nas etapas de geração do código do protótipo e redação da documentação, a partir de decisões de produto e design definidas pelo autor. Detalhes completos na Apêndice A do relatório acadêmico.
