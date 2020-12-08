import { DataClient } from "./data/DataProvider";
import PersonController from "./app/persons/PersonController";
import PersonService from "./app/persons/PersonService";
import * as PersonData from "./app/persons/PersonData";
import FilmsHandler from "./app/persons/films/FilmsController";
import StarshipHandler from "./app/persons/starships/StarshipController";
import VehiculeHandler from "./app/persons/vehicule/VehiculeController";
import * as NodeCacheService from "./cache/NodeCacheService"
import UserController from "./app/user/UserController"
import { Server } from "./Config";
import { IAuthService } from "./auth";
import StarshipService from "./app/persons/starships/StarshipService";
import * as StarshipData from "./app/persons/starships/StarshipData";
import * as VehiculeData from "./app/persons/vehicule/VehiculeData"
import * as VehiculeService from "./app/persons/vehicule/VehiculeService"
import * as PlanetController from "./app/persons/planets/PlanetController";
import * as PlanetData from "./app/persons/planets/PlanetData";
import * as PlanetService from "./app/persons/planets/PlanetService";
import * as FilmsController from "./app/persons/films/FilmsController";
import * as FilmsData from "./app/persons/films/FilmsData";
import * as FilmsService from "./app/persons/films/FilmsService";


export async function create (
  data: DataClient,
  auth: IAuthService
){
  let personData;

  return {
    personHandler: (await PersonController.create(
      await PersonService.create(
        personData = await PersonData.create(
          data,
          NodeCacheService.create({stdTTL: 86400})
        )
      )
    )),
    filmHandler: (await FilmsController.create(
      await FilmsService.create(
        await FilmsData.create(
          data,
          personData,
          NodeCacheService.create({stdTTL: 86400})
        )
      )
    )),
    starshipHandler: (await StarshipHandler.create(
      await StarshipService.create(
        await StarshipData.create(
          data,
          personData,
          NodeCacheService.create({stdTTL: 86400}),
        )
      )
    )),

    planetHandler: (await PlanetController.create(
      await PlanetService.create(
        await PlanetData.create(
          data,
          personData,
          NodeCacheService.create({stdTTL: 86400}),
        )
      )
    )),

    vehiculeHandler: (await VehiculeHandler.create(
      await VehiculeService.create(
        await VehiculeData.create(
          data,
          personData,
          NodeCacheService.create({stdTTL: 86400}),
        )
      )
    )),

    userHandler: (await UserController.create(data, auth)),
  }
};

type Await<T> = T extends PromiseLike<infer U> ? U : T

export type Handlers = Await<ReturnType<typeof create>>