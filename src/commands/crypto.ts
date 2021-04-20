import Discord from "discord.js";
import rp from "request-promise";

interface cMapItemPlatform {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  token_address: string;
}

interface cMapItem {
  id?: number;
  name?: string;
  symbol?: string;
  slug?: string;
  is_active?: number;
  first_historical_data?: string;
  last_historical_data?: string;
  platform?: cMapItemPlatform | null;
}

interface cMapProp {
  data?: [cMapItem];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
}

const BASE_URL = "https://pro-api.coinmarketcap.com";

const requestOptions = {
  method: "GET",
  uri: ``,
  headers: {
    "X-CMC_PRO_API_KEY": process.env.CRYPTO_API_KEY,
  },
  json: true,
  gzip: true,
};

const listCryptos = (data: [cMapItem], n: number) => {
  let body = "```\n";
  body += "Available Cryptos\n\n";
  for (let i = 0; i < data.length; i++) {
    if (i >= n) break;
    body += ` - ${data[i].symbol}: ${data[i].name}\n`;
  }

  body += "```";

  return body;
};

let data: [cMapItem];

module.exports = (msg: Discord.Message, args: Array<string>) => {
  if (args[0]?.toUpperCase() === "LIST") {
    const n = parseInt(args[1] ?? 20);
    requestOptions.uri = `${BASE_URL}/v1/cryptocurrency/map`;
    if (!data) {
      rp(requestOptions)
        .then(async (response: cMapProp) => {
          data = response.data!;
          msg.channel.send(listCryptos(response.data!, n));
        })
        .catch((err: any) => {
          console.log(err);
          msg.reply("Gago wait may error.");
        });
    } else {
      msg.channel.send(listCryptos(data, n));
    }
  }
};
