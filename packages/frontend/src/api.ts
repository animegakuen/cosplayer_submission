export interface Cosplayer {
  characterName: string;
  confirmed: boolean; // Whether they have showed up to confirm their entry.
  document: string;
  email: string;
  images: string[];
  name: string; // Their identifier
  nickname: string;
  order?: number;
  origin: string; // Character's origin (i.e. Genshin Impact)
  phoneNumber: string;
}

export interface Juror {
  name: string;
  votes?: Vote[];
}

export interface Vote {
  name: string;
  score: number;
}

export class Api {
  static API_URL = "https://api.cosplay.thewizard.link";

  static fetch(endpoint: string, options?: RequestInit) {
    return fetch(`${Api.API_URL}/${endpoint}`, options);
  }

  static async getCosplayers(): Promise<Cosplayer[]>;
  static async getCosplayers(query: {
    order?: number;
    name?: string;
    fromOrder?: number;
    confirmedOnly?: boolean;
  }): Promise<Cosplayer>;
  static async getCosplayers(query?: {
    order?: number;
    name?: string;
    fromOrder?: number;
    confirmedOnly?: boolean;
  }): Promise<Cosplayer[] | Cosplayer> {
    const queryString: string[] = [];

    if (query?.order) queryString.push(`order=${query.order}`);
    if (query?.name) queryString.push(`name=${query.name}`);
    if (query?.fromOrder !== undefined) queryString.push(`fromOrder=${query.fromOrder}`);
    if (query?.confirmedOnly !== undefined) queryString.push(`confirmedOnly=${query.confirmedOnly}`);

    const result = await Api.fetch(`cosplayers?${queryString.join("&")}`);

    if (!result.ok) {
      throw new Error(`Failed fetching cosplayers: ${result.text()}`);
    }

    return await result.json();
  }

  static async confirmCosplayer(order: number): Promise<void> {
    const result = await Api.fetch(`confirm`, {
      method: "PATCH",
      body: JSON.stringify({ order }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!result.ok) {
      throw new Error(`Failed confirming cosplayer: ${result.text()}`);
    }
  }

  static async getWinners(): Promise<Vote[]> {
    const result = await Api.fetch(`winners`);

    if (!result.ok) {
      throw new Error(`Failed fetching winners: ${result.text()}`);
    }

    return await result.json();
  }

  static async sendCosplayers(cosplayer: Cosplayer): Promise<void> {
    const result = await Api.fetch("cosplayers", {
      method: "POST",
      body: JSON.stringify(cosplayer),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) return;
    else return Promise.reject(await result.text());
  }

  static async getJury(): Promise<Juror[]> {
    const result = await Api.fetch("jury");

    if (!result.ok) {
      throw new Error(`Failed fetching jury: ${result.text()}`);
    }

    return (await result.json()) as Juror[];
  }

  static async sendVote(juror: Juror, vote: Vote): Promise<void> {
    const result = await Api.fetch("vote", {
      method: "POST",
      body: JSON.stringify({ juror, vote }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.ok) return;
    else return Promise.reject(await result.text());
  }
}
