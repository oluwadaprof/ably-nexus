import Ably from "ably/promises";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const client = new Ably.Realtime(`${process.env.ABLY_CLIENT_API_KEY}`);

  const randomName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors],
    length: 2,
  });

  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: randomName,
  });

  res.status(200).json(tokenRequestData);
}
