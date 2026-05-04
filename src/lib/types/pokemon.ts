export interface Pokemon{
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
}

export interface Pokemons {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<{
        name: string;
        url: string;
    }>;
}