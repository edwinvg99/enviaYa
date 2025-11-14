import * as emailjs from "@emailjs/nodejs";

export class EmailService {
    static async sendOrderEmail(data: {
        email_type: "ORDER_CONFIRMED" | "ORDER_DELIVERED";
        to_email: string;
        user_name: string;
        order_number: string;
        order_total?: number;
        order_status: string;
        delivery_date?: string;
    }) {
        try {
            await emailjs.send(
                process.env.EMAILJS_SERVICE_ID!,
                process.env.EMAILJS_TEMPLATE_ID!,
                {
                    email_type: data.email_type,
                    is_order_confirmed: data.email_type === "ORDER_CONFIRMED",
                    is_order_delivered: data.email_type === "ORDER_DELIVERED",

                    to_email: data.to_email,
                    user_name: data.user_name,
                    order_number: data.order_number,
                    order_total: data.order_total ?? "",
                    order_status: data.order_status ?? "",
                    delivery_date: data.delivery_date ?? "",
                },
                {
                    publicKey: process.env.EMAILJS_PUBLIC_KEY!,
                    privateKey: process.env.EMAILJS_PRIVATE_KEY!,
                }
            );

            console.log("Email enviado correctamente:", data.email_type);

        } catch (error) {
            console.error("Error enviando email:", error);
        }
    }
}
