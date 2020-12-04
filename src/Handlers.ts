import { DataClient } from "./data/DataProvider";
import PersonHandler from "./persons/PersonHandler";
import FilmsHandler from "./persons/films/FilmsHandler";
import StarshipHandler from "./persons/starships/StarshipHandler";
import VehiculeHandler from "./persons/vehicule/VehiculeHandler";
import UserHandler from "./user/UserHandler"
import { Server } from "./Config";

export async function create (data: DataClient){
  return {
    personHandler: (await PersonHandler.create(data)),
    filmsHandler: (await FilmsHandler.create(data)),
    starshipHandler: (await StarshipHandler.create(data)),
    vehiculeHandler: (await VehiculeHandler.create(data)),
    userHandler: (await UserHandler.create(data, Server.jwtSecret as string)),
  }
};

type Await<T> = T extends PromiseLike<infer U> ? U : T

export type Handlers = Await<ReturnType<typeof create>>