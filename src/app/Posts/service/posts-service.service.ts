import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommentResponse, Post } from '../../Model/Models';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  constructor(private http: HttpClient) {}


getPostsByPage(pageNumber: number) {
  return this.http.get<{ data: Post[] }>(`${environment.mainurl}/Post/PostsForUser?pageNumber=${pageNumber}`);
}


addPost(content: string, images: File[]): Observable<any> {
  const formData = new FormData();
  formData.append('Content', content);

  for (const image of images) {
    formData.append('Images', image);
  }

  return this.http.post(`${environment.mainurl}/Post/AddCoachPost`, formData);
}


  getPostById(id: number): Observable<{ isSuccess: boolean, data: any }> {
  return this.http.get<{ isSuccess: boolean, data: any }>(`${environment.mainurl}/Post/GetPost/${id}`);
  }

  // جلب الإعجابات الخاصة بالبوست
getPostLikes(postId: number): Observable<any> {
  return this.http.get(`${environment.mainurl}/Post/GetPostLikes/${postId}`);
}

addLike(postId: number, reactionType: 'NORMAL' | 'CARE' | 'LOVE') {
  const body = {
    postId: postId,   // لازم الاسم ده بالظبط
    type: reactionType // نفس الاسم المتوقع
  };
  return this.http.post(`${environment.mainurl}/Post/AddLikeOnPost`, body);
}

deleteLike(postId: number) {
  console.log(`📡 Sending DELETE request to: ${environment.mainurl}/Post/DeleteLikeFromPost/${postId}`);
  return this.http.delete(`${environment.mainurl}/Post/DeleteLikeFromPost/${postId}`);
}

  addComment(model :{postId: number, content: string}): Observable<any> {
    return this.http.post<any>(`${environment.mainurl}/Post/AddCommentOnPost`, model);
  }

  getComments(postId: number): Observable<CommentResponse> {
  return this.http.get<CommentResponse>(`${environment.mainurl}/Post/GetComment/${postId}`);
}








}
