import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  constructor(private http: HttpClient) {}

  private albumsUrl = '/assets/albums.json';
  private localStorageKey = 'albums';

  getAlbums(): Observable<{ id: number; title: string }[]> {
    return this.http.get<{ id: number; title: string }[]>(this.albumsUrl);
  }

  getAlbumsFromLocalStorage(): Observable<
    { id: number; title: string }[] | null
  > {
    const storedAlbums = localStorage.getItem(this.localStorageKey);
    if (storedAlbums) {
      return new Observable((observer) => {
        observer.next(JSON.parse(storedAlbums));
        observer.complete();
      });
    }
    return new Observable((observer) => {
      observer.next(null);
      observer.complete();
    });
  }

  getPhotos(): Observable<
    {
      albumId: number;
      id: number;
      title: string;
      url: string;
      thumbnailUrl: string;
    }[]
  > {
    return this.http.get<
      {
        albumId: number;
        id: number;
        title: string;
        url: string;
        thumbnailUrl: string;
      }[]
    >('/assets/photos.json');
  }

  updateAlbumInLocalStorage(updatedAlbum: { id: number; title: string }): void {
    const storedAlbums = localStorage.getItem(this.localStorageKey);
    if (storedAlbums) {
      const albums: { id: number; title: string }[] = JSON.parse(storedAlbums);
      const index = albums.findIndex((album) => album.id === updatedAlbum.id);
      if (index !== -1) {
        albums[index] = updatedAlbum;
        localStorage.setItem(this.localStorageKey, JSON.stringify(albums));
      } else {
        console.error('Album not found in local storage');
      }
    } else {
      console.error('No albums found in local storage');
    }
  }

  updateAlbum(updatedAlbum: {
    id: number;
    title: string;
  }): Observable<{ id: number; title: string }> {
    const url = `${this.albumsUrl}/${updatedAlbum.id}`;
    return this.http.put<{ id: number; title: string }>(url, updatedAlbum);
  }

  saveAlbumsToLocalStorage(albums: { id: number; title: string }[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(albums));
  }
}
