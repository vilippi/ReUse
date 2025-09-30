import { useMemo, useState, useCallback } from "react";
import type { Notificacao } from "@/types/notification";

export function useNotifications(initial?: Notificacao[]) {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>(
        initial ?? [
            { id: "1", titulo: "Pedido #4312 enviado", descricao: "Saiu para entrega", data: "há 2h", lida: false },
            { id: "2", titulo: "Cupom de 10% liberado", descricao: "Válido até hoje", data: "há 4h", lida: false },
            { id: "3", titulo: "Nova mensagem do vendedor", descricao: "Respondeu sua pergunta", data: "ontem", lida: false },
            { id: "4", titulo: "O seu pedido saiu para entrega!", descricao: "", data: "ontem", lida: false },
        ]
    );

    const unreadCount = useMemo(() => notificacoes.filter(n => !n.lida).length, [notificacoes]);

    const markAllAsRead = useCallback(() => {
        setNotificacoes(prev => prev.map(n => (n.lida ? n : { ...n, lida: true })));
    }, []);

    return { notificacoes, setNotificacoes, unreadCount, markAllAsRead };
}
