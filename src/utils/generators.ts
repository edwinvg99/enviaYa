export const generateOrderNumber = (): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `ORD-${dateStr}-${random}`;
  };
  
  export const generateTrackingNumber = (): string => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `TRK-${dateStr}-${random}`;
  };
  