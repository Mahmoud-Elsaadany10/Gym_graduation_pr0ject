import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NavbarComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  showModal: boolean = false;
  newPostContent: string = '';
  posts: any[] = [];

  ngOnInit() {
    const savedPosts = localStorage.getItem('posts');
    this.posts = savedPosts ? JSON.parse(savedPosts) : [];
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  addPost() {
    if (!this.newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      username: 'User Name',
      userImage: 'https://via.placeholder.com/50',
      time: 'Just now',
      content: this.newPostContent,
      likes: 0,
      comments: [],
      showComments: false,
      newComment: ''
    };

    this.posts.unshift(newPost);
    this.newPostContent = '';
    this.showModal = false;
    this.updateLocalStorage();
  }

  likePost(post: any) {
    post.likes++;
    this.updateLocalStorage();
  }

  toggleComments(post: any) {
    post.showComments = !post.showComments;
  }

  addComment(post: any) {
    if (!post.newComment.trim()) return;

    const newComment = {
      username: 'User Name',
      userImage: 'https://via.placeholder.com/40',
      time: 'Just now',
      text: post.newComment,
      replies: [],
      newReply: ''
    };

    post.comments.push(newComment);
    post.newComment = '';
    this.updateLocalStorage();
  }

  addReply(comment: any) {
    if (!comment.newReply.trim()) return;

    const newReply = {
      username: 'User Name',
      userImage: 'https://via.placeholder.com/40',
      time: 'Just now',
      text: comment.newReply
    };

    comment.replies.push(newReply);
    comment.newReply = '';
    this.updateLocalStorage();
  }

  updateLocalStorage() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }
}
