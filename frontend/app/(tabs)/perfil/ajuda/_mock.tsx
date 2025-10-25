import React from "react";
import { Text } from "react-native";

// Tipo compartilhado com a tela
export type FAQ = {
    id: string;
    pergunta: string;
    resposta: string | React.ReactNode;
};

export const faqs: FAQ[] = [
    {
        id: "1",
        pergunta: "Como faço login ou recupero minha senha?",
        resposta:
            "Na tela de login, toque em 'Esqueci minha senha' e siga as instruções enviadas ao seu e-mail. Se não recebeu, verifique a caixa de spam.",
    },
    {
        id: "2",
        pergunta: "Como editar meus dados do perfil?",
        resposta:
            "Acesse Perfil → Editar dados. Ao finalizar, toque em Salvar. Algumas informações podem exigir confirmação por e-mail.",
    },
    {
        id: "3",
        pergunta: "Como visualizar meus pedidos/solicitações?",
        resposta:
            "Na aba Perfil, toque no Card 'Pedidos'. Lá você acompanha status, detalhes e histórico.",
    },
    {
        id: "4",
        pergunta: "Como funciona devolução e reembolso?",
        resposta:
            "Você pode se arrepender da compra em até 7 dias corridos após o recebimento (compras à distância). Solicite em Perfil → Pedidos → Devolver/Problema com pedido. O reembolso é processado após o produto chegar ao vendedor e a conferência ser aprovada.",
    },  
    {
        id: "5",
        pergunta: "Qual o prazo de entrega?",
        resposta:
            "O prazo aparece na página do produto e no checkout após informar o CEP. Ele varia conforme a sua região, método de envio e vendedor.",
    },
    {
        id: "6",
        pergunta: "O app não abre ou está lento. O que posso fazer?",
        resposta: (
            <Text>
                Tente fechar e abrir o app, checar a conexão e atualizar para a última
                versão. Persistindo, fale com o suporte no final desta página.
            </Text>
        ),
    },
    {
        id: "7",
        pergunta: "Sou vendedor: como anunciar um produto?",
        resposta:
            "Acesse Perfil → Vender um produto e siga o passo a passo: título, categoria, fotos nítidas, descrição, preço, estoque e método de envio.",
    },
    
];
