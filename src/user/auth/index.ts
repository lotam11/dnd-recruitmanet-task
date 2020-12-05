export interface IAuthService {
  authenticate: (hash: string, password: string) => Promise<boolean>
  getKey: (data: Object) => Promise<string | null>
}