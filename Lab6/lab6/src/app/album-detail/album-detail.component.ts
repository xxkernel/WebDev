import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlbumsService } from '../albums.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css'],
})
export class AlbumDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumsService
  ) {}
  albums$: Observable<{ id: number; title: string }[]> | undefined;
  album: { id: number; title: string } | undefined;
  editedTitle: string = '';

  ngOnInit(): void {
    this.albums$ = this.albumService.getAlbums();
    const routeParams = this.route.snapshot.paramMap;
    const albumIdFromRoute = Number(routeParams.get('id'));
    this.albums$.subscribe({
      next: (albums) => {
        this.album = albums.find((album) => album.id === albumIdFromRoute);
        if (!this.album) {
          console.error('Album not found');
        } else {
          this.editedTitle = this.album.title;
        }
      },
      error: (error) => {
        console.error('Error fetching albums:', error);
      },
    });
  }

  saveAlbum(): void {
    if (this.album && this.editedTitle !== this.album.title) {
      this.albumService.updateAlbumInLocalStorage({
        id: this.album.id,
        title: this.editedTitle,
      });
    }
  }
}
