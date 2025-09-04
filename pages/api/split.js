// pages/api/split.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { amount, description } = req.body;

    // Safety check
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    // Hit API Xendit Create Invoice
    const response = await fetch("https://api.xendit.co/v2/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.XENDIT_API_KEY + ":").toString("base64"),
      },
      body: JSON.stringify({
        external_id: "order-" + Date.now(),
        amount,
        payer_email: "demo@customer.com",
        description: description || "Tes Split Payment 10%",
        fees: [
          {
            type: "PLATFORM_FEE",
            value: Math.floor(amount * 0.1), // 10% masuk platform
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json({
      success: true,
      invoice_url: data.invoice_url, // link checkout
      data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
