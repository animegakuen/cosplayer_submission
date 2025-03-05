# cosplayer_submission

This is a simple project to help our organization handle [Cosplay](https://en.wikipedia.org/wiki/Cosplay) competitions
that we host. It is broken down into a [`backend`](#backend) and a [`frontend`](#frontend) package.

## backend

This is a [fastify] powered project with endpoints/routes for handling cosplayer registration and
fetching; and jury fetching, voting and a list of winners.

### Configuration

[fastify] is configured to listen to port `3000` and there is no configurable way to change that, if you want a
different port, you can change [this line](packages/backend/src/index.ts#L11).

For the application to run correctly you must also at runtime have two relative files for data collection:
`cosplayers.json` and `jury.json`, both containing an empty array inside.


### Endpoints

The following sections are the routes currently available.

#### GET `/cosplayers`

_Returns a JSON array containing none, one or multiple [cosplayers](#composition-of-a-cosplayer) object(s) or a single
[cosplayer](#composition-of-a-cosplayer) object if query parameters are present._

This endpoint optionally can receive the following query parameters to search a cosplayer:
- `order`
  - _The registration number of a cosplayer._
- `name`
  - _The exact name of a cosplayer._

#### POST `/cosplayers`

_Expects a JSON of a [cosplayer](#composition-of-a-cosplayer)_

Returns the following codes:
- `400`
  - _If the body cosplayer object is incorrect/malformed._
- `403`
  - _If a cosplayer with the same name exists._
- `500`
  - _If it fails to write to the relative path `./cosplayers.json`._
- `200`
  - _If everything is correct and the cosplayer is written._

#### GET `/jury`

_Returns a JSON array containing none, one or multiple [juror](#composition-of-a-juror) object(s)._

#### GET `/winners`

_Returns a JSON array containing one or multiple [vote](#composition-of-a-vote) object(s)._

#### POST `/vote`

_Expects a JSON of an object containing a `juror` key with a value of a [juror](#composition-of-a-juror) and a `vote`
key with a value of [vote](#composition-of-a-vote)._

Returns the following codes:
- `400`
  - _If the Juror does not exists._
- `403`
  - _If juror has already cast a vote for that particular cosplayer._
- `500`
  - _If the juror has no votes or it fails to write to the relative path `./jury.json`._
- `200`
  - _If everything is correct and the juror is written._

### Types

#### Composition of a "Cosplayer"

```typescript
export interface Cosplayer {
  characterName: string;
  images: string[];      // Base64 encoded images.
  name: string;          // Their identifier.
  nickname: string;      // Optional "stage name"/nickname.
  order?: number;        // Their registration order.
  origin: string;        // Character's origin (i.e. Genshin Impact).
  phoneNumber: string;
}
```

#### Composition of a "Vote"

```typescript
export interface Vote {
  name: string;  // The cosplayer's name (their identifier).
  score: number; // The score given.
}
```

#### Composition of a "Juror"

```typescript
export interface Juror {
  name: string;
  votes?: Vote[]; // The votes cast by the juror to particular cosplayers.
}
```

## frontend

This package is powered by [Vue](https://vuejs.org/) and [Vite](https://vite.dev/) with a very simple front-end.

There are three pages:
- `/` & `/cosplayers` - which shows in a grid list all the registered cosplayers.
- `/submit` - where you can submit a cosplayer to be added.
- `/jury` - that a juror can access to cast votes.

Since it is a quite simple front-end we will not document much, but, beware that many components are in Brazilian
Portuguese, as that's our audience. The `/submit` route for example expects on it's submission a Brazilian mobile phone
number ([AA](https://en.wikipedia.org/wiki/List_of_dialling_codes_in_Brazil) 9NNNN-NNNN).

The `/jury` will only showcase contents when the relative runtime file to the backend for the jury, is filled. This has
to be done manually, there are no endpoints to submit a juror. Here's an example of a valid juror registered in the
file:
```json
[
  {
    "name": "Alexandre Cavalheiro",
    "votes": []
  }
]
```

<!-- REFERENCES -->

[fastify]: https://fastify.dev/
