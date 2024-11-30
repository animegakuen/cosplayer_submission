import { AppSingleton } from "../App";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Juror, Vote } from "../types/Juror";

const app = AppSingleton.instance.app;

const fetchJury: () => Promise<Juror[]> = async () => {
  return JSON.parse(
    (await readFile(join(__dirname, "..", "..", "jury.json"))).toString(),
  ) as Juror[];
};

app.get("/jury", async (_req, res) => {
  const jury = await fetchJury();

  jury.forEach((j) => delete j.votes);

  res.send(jury);
});

app.get("/winners", async (_req, res) => {
  const jury = await fetchJury();

  if (!jury.length) {
    res.send("Not enough jurors registered.");
  }

  let votes: Vote[] = [];

  jury.flatMap((j) => j.votes).forEach((vote) => {
    if (!vote) return;

    const inArray = votes.find((v) => v.name === vote.name);

    if (inArray) {
      inArray.score += vote.score;
    } else {
      votes.push(vote);
    }
  });

  votes.forEach((v) => v.score = v.score / jury.length);
  votes = votes.sort((a, b) => b.score - a.score);

  res.send(votes);
});

app.post<{ Body: { juror: Juror; vote: Vote } }>("/vote", async (req, res) => {
  const jury = await fetchJury();

  // TODO: Validate
  const juror = req.body.juror;
  const vote = req.body.vote;

  const foundJuror = jury.find((j) => j.name === juror.name);

  if (!foundJuror) {
    res.code(400).send("Jurado não existe.");
    return;
  }

  const foundVote = foundJuror.votes?.find((v) => v.name === vote.name);

  if (foundVote) {
    res.code(403).send("Já existe um voto registrado a este nome.");
    return;
  }

  if (!foundJuror.votes) {
    res.code(500).send();
    return;
  }

  foundJuror.votes.push(vote);

  await writeFile(
    join(__dirname, "..", "..", "jury.json"),
    JSON.stringify(jury, null, "  "),
  );

  res.code(200).send();
});
