import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type Notificacao = {
  id: string;
  titulo: string;
  descricao?: string;
  data?: string;
  lida?: boolean;
};

type Ctx = {
  notificacoes: Notificacao[];
  setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>;
  unreadCount: number;
  markAllAsRead: () => void;
  addNotification: (n: Notificacao) => void;
  clearAll: () => void;
};

const NotificationsContext = createContext<Ctx | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([
    { id: "1", titulo: "Pedido #4312 enviado", descricao: "Saiu para entrega", data: "há 2h", lida: false },
    { id: "2", titulo: "Cupom de 10% liberado", descricao: "Válido até hoje", data: "há 4h", lida: false },
    { id: "3", titulo: "Nova mensagem do vendedor", descricao: "Respondeu sua pergunta", data: "ontem", lida: false },
  ]);

  const unreadCount = useMemo(() => notificacoes.filter(n => !n.lida).length, [notificacoes]);

  const markAllAsRead = useCallback(() => {
    setNotificacoes(prev => prev.map(n => (n.lida ? n : { ...n, lida: true })));
  }, []);

  const addNotification = useCallback((n: Notificacao) => {
    setNotificacoes(prev => [{ ...n, lida: n.lida ?? false }, ...prev]);
  }, []);

  const clearAll = useCallback(() => setNotificacoes([]), []);

  const value = useMemo(
    () => ({ notificacoes, setNotificacoes, unreadCount, markAllAsRead, addNotification, clearAll }),
    [notificacoes, unreadCount, markAllAsRead, addNotification, clearAll]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotificationsStore() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsStore deve estar dentro de <NotificationsProvider>");
  return ctx;
}
