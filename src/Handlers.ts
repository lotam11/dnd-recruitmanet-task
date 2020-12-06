import { DataClient } from "./data/DataProvider";
import PersonController from "./persons/PersonController";
import FilmsHandler from "./persons/films/FilmsHandler";
import StarshipHandler from "./persons/starships/StarshipHandler";
import VehiculeHandler from "./persons/vehicule/VehiculeHandler";
import UserHandler from "./user/UserController"
import { Server } from "./Config";
import { IAuthService } from "./user/auth";

export async function create (
  data: DataClient,
  auth: IAuthService
){
  return {
    personHandler: (await PersonController.create(data)),
    filmsHandler: (await FilmsHandler.create(data)),
    starshipHandler: (await StarshipHandler.create(data)),
    vehiculeHandler: (await VehiculeHandler.create(data)),
    userHandler: (await UserHandler.create(data, auth)),
  }
};

type Await<T> = T extends PromiseLike<infer U> ? U : T

export type Handlers = Await<ReturnType<typeof create>>