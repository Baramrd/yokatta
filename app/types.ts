export interface Genre {
  mal_id: number;
  name: string;
}

export interface Manga {
  mal_id: number;
  title: string;
  images: {
    webp: {
      large_image_url: string;
    };
  };
  synopsis: string;
  chapters: number | null;
  genres: Genre[];
}