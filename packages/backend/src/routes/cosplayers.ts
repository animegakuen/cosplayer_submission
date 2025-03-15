import { AppSingleton } from "../App";
import { Cosplayer } from "../types/Cosplayer";
import { readFile, writeFile } from "fs/promises";

const app = AppSingleton.instance.app;

const fetchCosplayers: () => Promise<Cosplayer[]> = async () => {
  return JSON.parse((await readFile("./cosplayers.json")).toString()) as Cosplayer[];
};

const isCosplayer = (obj: any): obj is Cosplayer => {
  return (
    obj.characterName !== undefined &&
    obj.confirmed !== undefined &&
    obj.document !== undefined &&
    obj.email !== undefined &&
    obj.images !== undefined &&
    obj.name !== undefined &&
    obj.nickname !== undefined &&
    obj.origin !== undefined &&
    obj.phoneNumber !== undefined
  );
};

app.get<{ Querystring: { order?: string; name?: string } }>("/cosplayers", async (req, res) => {
  const cosplayers = await fetchCosplayers();

  if (!req.query.order && !req.query.name) {
    res.send(cosplayers);
    return;
  }

  const name = req.query.name;
  const order = req.query.order;

  if (name) {
    const cosplayer = cosplayers.find((c) => c.name === name);

    if (!cosplayer) {
      res.code(404).send();
      return;
    }

    res.send(cosplayer);
    return;
  }

  if (order) {
    const orderNumber = Number.parseInt(order);

    if (!orderNumber) {
      res.code(400).send();
      return;
    }

    const cosplayer = cosplayers.find((c) => {
      return c.order === orderNumber;
    });

    if (!cosplayer) {
      res.code(404).send();
      return;
    }

    res.send(cosplayer);
    return;
  }
});

app.get<{ Querystring: { order?: string } }>("/confirm", async (req, res) => {
  let cosplayerData = await fetchCosplayers();

  const order = Number.parseInt(req.query.order ?? "0");

  if (!order || order === 0) {
    res.code(400).send();
    return;
  }

  cosplayerData = cosplayerData.map((c) => {
    if (c.order === order) c.confirmed = true;

    return c;
  });

  await writeFile("./cosplayers.json", JSON.stringify(cosplayerData, null, "  "));

  res.code(200).send();
});

app.post<{ Body: Cosplayer }>("/cosplayers", async (req, res) => {
  let cosplayerData = await fetchCosplayers();

  const cosplayer = req.body;
  if (!isCosplayer(cosplayer)) {
    res.code(400).send("Wrong cosplayer object.");
    return;
  }

  if (cosplayerData.some((c) => c.phoneNumber === cosplayer.phoneNumber)) {
    cosplayerData = cosplayerData.map((c) => {
      if (c.phoneNumber === cosplayer.phoneNumber) {
        return { ...cosplayer, order: c.order };
      }

      return c;
    });
  } else {
    cosplayer.order = cosplayerData.length + 1;
    cosplayerData.push(cosplayer);
  }

  await writeFile("./cosplayers.json", JSON.stringify(cosplayerData, null, "  "));

  res.code(200).send();
});
