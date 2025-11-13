// Parche para correcciones de tipos y warnings de lint en OrdersAdmin.tsx

// 1. Para el warning de useEffect, agregar:
// eslint-disable-next-line react-hooks/exhaustive-deps
// antes de la línea: useEffect(() => { fetchOrders(); }, []);

// 2. Para item.name que no existe en OrderItem, cambiar línea 245:
// De: <td className="py-2 px-3 text-gray-300">{item.name || item.productId}</td>
// A: <td className="py-2 px-3 text-gray-300">{item.productId}</td>

export {};
