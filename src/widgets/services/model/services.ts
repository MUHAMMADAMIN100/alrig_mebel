export interface IService {
    id: number;
    name: string;
    description?: string;
    image: string;
    price: string;
    slug: string;
  }


export interface ICategory {
    id: number;
    name: string;
    services: IService[];
}